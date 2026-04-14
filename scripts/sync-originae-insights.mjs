import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const baseUrl = "https://originae.org";
const sourceEndpoint = "https://tinhbaoai.com/api/articles?status=published&limit=200";
const curatedSlugs = JSON.parse(fs.readFileSync(path.join(projectRoot, "content", "curatedInsightSlugs.json"), "utf8"));
const snapshotPath = path.join(projectRoot, "content", "generated", "originae-insights.snapshot.json");
const sitemapPath = path.join(projectRoot, "public", "sitemap.xml");

const topicCatalog = {
  "growth-systems": { name: "Growth systems", accent: "#F26522", serviceSlug: "marketing", serviceName: "Marketing" },
  "operations-automation": { name: "Operations & automation", accent: "#18181B", serviceSlug: "operations", serviceName: "Operations" },
  "gtm-execution": { name: "GTM execution", accent: "#252525", serviceSlug: "business-development", serviceName: "Business Development" },
  "product-delivery": { name: "Product delivery", accent: "#F26522", serviceSlug: "product-technology", serviceName: "Product & Technology" },
  "case-notes": { name: "Case notes", accent: "#18181B", serviceSlug: "business-development", serviceName: "Business Development" },
};

function inferTopic(categorySlug, label) {
  const normalizedLabel = `${label ?? ""}`.toLowerCase();
  if (normalizedLabel.includes("góc nhìn") || normalizedLabel.includes("goc nhin")) {
    return "case-notes";
  }

  switch (categorySlug) {
    case "startup":
      return "gtm-execution";
    case "phan-tich":
      return "growth-systems";
    case "chinh-sach":
      return "operations-automation";
    case "cap-nhat":
    case "mo-hinh-ai":
      return "product-delivery";
    case "ai-viet-nam":
      return "case-notes";
    default:
      return "operations-automation";
  }
}

function escapeHtml(value) {
  return `${value ?? ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeUrl(value, fallback = `${baseUrl}/og-cover.jpg`) {
  if (!value) return fallback;
  try {
    const url = new URL(value, baseUrl);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    // ignore
  }
  return fallback;
}

function slugifyHeading(text) {
  return text
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

function formatInline(value) {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  output = output.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return output;
}

function decodeHtmlEntities(value) {
  return `${value ?? ""}`
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function addHeadingIds(html) {
  const headings = [];
  const usedHeadingIds = new Map();
  const result = html.replace(/<(h2|h3)>([\s\S]*?)<\/\1>/gi, (_match, rawTagName, innerHtml) => {
    const text = innerHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const baseId = slugifyHeading(text);
    const seen = usedHeadingIds.get(baseId) ?? 0;
    usedHeadingIds.set(baseId, seen + 1);
    const id = seen === 0 ? baseId : `${baseId}-${seen + 1}`;
    const tagName = rawTagName.toLowerCase();
    headings.push({ id, level: tagName === "h3" ? 3 : 2, text });
    return `<${tagName} id="${id}">${innerHtml}</${tagName}>`;
  });
  return { html: result, headings };
}

function sanitizeArticleHtml(html) {
  const allowedTags = new Set(["p", "h2", "h3", "ul", "ol", "li", "a", "strong", "em", "b", "i", "code", "pre", "blockquote", "img", "div", "span"]);
  const stripped = `${html ?? ""}`
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<\/?(?:html|head|body|script|style|iframe|object|embed|noscript)[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(\/?)(h1)([^>]*)>/gi, "<$1h2$3>")
    .replace(/<(\/?)([a-z0-9-]+)([^>]*)>/gi, (_match, slash, rawTagName, rawAttrs) => {
      const tagName = rawTagName.toLowerCase();
      if (!allowedTags.has(tagName)) return "";
      if (slash) return `</${tagName}>`;

      if (tagName === "a") {
        const hrefMatch = rawAttrs.match(/\shref=(['"])(.*?)\1/i);
        const href = sanitizeUrl(hrefMatch?.[2], baseUrl);
        return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">`;
      }

      if (tagName === "img") {
        const srcMatch = rawAttrs.match(/\ssrc=(['"])(.*?)\1/i);
        const altMatch = rawAttrs.match(/\salt=(['"])(.*?)\1/i);
        const titleMatch = rawAttrs.match(/\stitle=(['"])(.*?)\1/i);
        const src = sanitizeUrl(srcMatch?.[2]);
        const alt = escapeHtml(altMatch?.[2] ?? "");
        const title = titleMatch?.[2] ? ` title="${escapeHtml(titleMatch[2])}"` : "";
        return `<img src="${src}" alt="${alt}"${title} />`;
      }

      return `<${tagName}>`;
    })
    .replace(/\son[a-z]+=(['"]).*?\1/gi, "")
    .replace(/\sstyle=(['"]).*?\1/gi, "");

  return addHeadingIds(stripped);
}

function renderArticleBody(source) {
  const richHtml = `${source.richContent ?? ""}`.trim();
  const markdown = source.content || source.summary || source.title;

  if (richHtml) {
    return sanitizeArticleHtml(richHtml);
  }

  if (typeof markdown === "string" && /&lt;\/?(?:p|h[1-6]|ul|ol|li|div|blockquote|img|a)\b/i.test(markdown)) {
    return sanitizeArticleHtml(decodeHtmlEntities(markdown));
  }

  if (typeof markdown === "string" && /<\/?(?:p|h[1-6]|ul|ol|li|div|blockquote|img|a)\b/i.test(markdown)) {
    return sanitizeArticleHtml(markdown);
  }

  return markdownToHtml(markdown);
}

function markdownToHtml(markdown) {
  const headings = [];
  const usedHeadingIds = new Map();
  const blocks = `${markdown ?? ""}`
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const html = blocks.map((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) return "";

    const headingMatch = lines[0].match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length >= 3 ? 3 : 2;
      const rawText = headingMatch[2].trim();
      const baseId = slugifyHeading(rawText);
      const seen = usedHeadingIds.get(baseId) ?? 0;
      usedHeadingIds.set(baseId, seen + 1);
      const id = seen === 0 ? baseId : `${baseId}-${seen + 1}`;
      headings.push({ id, level, text: rawText });
      return `<h${level} id="${id}">${formatInline(rawText)}</h${level}>`;
    }

    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      return `<ul>${lines.map((line) => `<li>${formatInline(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
    }

    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      return `<ol>${lines.map((line) => `<li>${formatInline(line.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
    }

    if (lines.every((line) => line.startsWith(">"))) {
      return `<blockquote><p>${lines.map((line) => formatInline(line.replace(/^>\s?/, ""))).join("<br />")}</p></blockquote>`;
    }

    return `<p>${lines.map((line) => formatInline(line)).join("<br />")}</p>`;
  });

  return { html: html.join("\n\n"), headings };
}

function extractKeyTakeaways(value, fallbackText) {
  if (Array.isArray(value)) {
    return value.map((item) => `${item}`.trim()).filter(Boolean).slice(0, 4);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => `${item}`.trim()).filter(Boolean).slice(0, 4);
      }
    } catch {
      // ignore
    }
  }

  return `${fallbackText ?? ""}`
    .split(/\.\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function toExcerpt(summary, content) {
  const raw = `${summary || content || ""}`.replace(/\s+/g, " ").trim();
  if (raw.length <= 190) return raw;
  return `${raw.slice(0, 187).trim()}...`;
}

function estimateReadTime(content) {
  const words = `${content ?? ""}`.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(4, Math.round(words / 180));
}

async function fetchArticles() {
  const response = await fetch(sourceEndpoint, {
    headers: {
      "user-agent": "originae-build-sync",
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Snapshot fetch failed with ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload?.data) ? payload.data : [];
}

function normalizeIsoDate(value) {
  if (!value) return new Date().toISOString();
  try {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  } catch { /* ignore */ }
  return new Date().toISOString();
}

function generateSitemap(articles) {
  const entries = [
    { url: `${baseUrl}/`, lastmod: new Date().toISOString() },
    { url: `${baseUrl}/insights`, lastmod: new Date().toISOString() },
    ...articles.map((article) => ({ url: `${baseUrl}/insights/${article.slug}`, lastmod: normalizeIsoDate(article.publishedAt) })),
  ];

  const body = entries.map((entry) => `  <url>\n    <loc>${entry.url}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function generateAtomFeed(articles) {
  const now = new Date().toISOString();
  const feedEntries = articles.slice(0, 20).map((article) => {
    const articleUrl = `${baseUrl}/insights/${article.slug}`;
    const published = normalizeIsoDate(article.publishedAt);
    const summary = escapeHtml(article.excerpt || article.seoDescription || "");
    return `  <entry>
    <title>${escapeHtml(article.title)}</title>
    <link href="${articleUrl}" rel="alternate" type="text/html" />
    <id>${articleUrl}</id>
    <published>${published}</published>
    <updated>${normalizeIsoDate(article.dateModified || article.publishedAt)}</updated>
    <author><name>Originae Editorial</name></author>
    <summary type="html">${summary}</summary>
    <content type="html">&lt;img src="${escapeHtml(article.coverImage)}" alt="" /&gt;&lt;p&gt;${summary}&lt;/p&gt;</content>
    <category term="${article.topic}" />
  </entry>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Originae Insights</title>
  <subtitle>Execution notes &amp; working signal for founders and operators.</subtitle>
  <link href="${baseUrl}/feed.xml" rel="self" type="application/atom+xml" />
  <link href="${baseUrl}/insights" rel="alternate" type="text/html" />
  <id>${baseUrl}/insights</id>
  <updated>${now}</updated>
  <author><name>Originae Editorial</name></author>
  <icon>${baseUrl}/favicon.svg</icon>
  <logo>${baseUrl}/og-cover.jpg</logo>
  <rights>© ${new Date().getFullYear()} Originae. All rights reserved.</rights>
${feedEntries.join("\n")}
</feed>
`;
}

async function main() {
  let remoteArticles;
  try {
    remoteArticles = await fetchArticles();
  } catch (error) {
    if (fs.existsSync(snapshotPath)) {
      console.warn(`[sync:insights] ${error.message}. Keeping existing snapshot.`);
      return;
    }
    // If no snapshot and no API, still allow automation-only mode
    remoteArticles = [];
  }

  // Merge automation articles (pushed by the automation daemon)
  const automationPath = path.join(projectRoot, "content", "automation-articles.json");
  if (fs.existsSync(automationPath)) {
    try {
      const autoArticles = JSON.parse(fs.readFileSync(automationPath, "utf8"));
      if (Array.isArray(autoArticles)) {
        remoteArticles.push(...autoArticles);
        console.log(`[sync:insights] Merged ${autoArticles.length} automation article(s).`);
      }
    } catch (err) {
      console.warn(`[sync:insights] Failed to read automation-articles.json: ${err.message}`);
    }
  }

  const remoteBySlug = new Map(remoteArticles.map((article) => [article.slug, article]));
  const missing = curatedSlugs.filter((slug) => !remoteBySlug.has(slug));
  if (missing.length > 0) {
    console.warn(`[sync:insights] Missing curated article(s): ${missing.join(", ")}. Skipping missing.`);
  }

  const articles = curatedSlugs.filter((slug) => remoteBySlug.has(slug)).map((slug) => {
    const source = remoteBySlug.get(slug);

    // Automation articles already have pre-computed bodyHtml, headings, tags, etc.
    // Pass them through directly instead of re-rendering.
    if (source.bodyHtml && Array.isArray(source.headings)) {
      return {
        slug: source.slug,
        title: source.title,
        excerpt: source.excerpt || "",
        coverImage: source.coverImage || sanitizeUrl(source.thumbnailUrl),
        publishedAt: source.publishedAt || new Date().toISOString(),
        dateModified: source.dateModified || new Date().toISOString(),
        readTime: Number(source.readTime) || 5,
        wordCount: source.wordCount || source.bodyHtml.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length,
        sourceName: source.sourceName || "External",
        sourceUrl: source.sourceUrl || "",
        seoTitle: source.seoTitle || `${source.title} | Originae Insights`,
        seoDescription: source.seoDescription || source.excerpt,
        bodyHtml: source.bodyHtml,
        headings: source.headings,
        tags: Array.isArray(source.tags) ? source.tags.map((item) => `${item}`) : [],
        keyTakeaways: Array.isArray(source.keyTakeaways) ? source.keyTakeaways : [],
        topic: source.topic || "case-notes",
        topicName: source.topicName || topicCatalog[source.topic || "case-notes"]?.name || "Case notes",
        topicAccent: source.topicAccent || topicCatalog[source.topic || "case-notes"]?.accent || "#18181B",
        serviceSlug: source.serviceSlug || topicCatalog[source.topic || "case-notes"]?.serviceSlug || "business-development",
        serviceName: source.serviceName || topicCatalog[source.topic || "case-notes"]?.serviceName || "Business Development",
        categorySlug: source.categorySlug ?? null,
        label: source.label ?? null,
        language: source.language || "en",
        authorName: source.authorName || "Originae Editorial",
        authorUrl: source.authorUrl || null,
        authorAvatar: source.authorAvatar || null,
      };
    }

    // Standard tinhbaoai articles — render from richContent/content/markdown
    const topicSlug = inferTopic(source.category?.slug ?? source.categorySlug ?? null, source.label ?? null);
    const topic = topicCatalog[topicSlug];
    const markdown = source.content || source.summary || source.title;
    const body = renderArticleBody(source);
    const excerpt = toExcerpt(source.summary, markdown);
    const plainText = body.html.replace(/<[^>]+>/g, " ").trim();
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;

    return {
      slug: source.slug,
      title: source.title,
      excerpt,
      coverImage: sanitizeUrl(source.thumbnailUrl),
      publishedAt: source.publishedAt || source.createdAt || new Date().toISOString(),
      dateModified: source.updatedAt || source.publishedAt || source.createdAt || new Date().toISOString(),
      readTime: Number(source.readTime) || estimateReadTime(markdown),
      wordCount,
      sourceName: source.sourceName || "Tình Báo AI",
      sourceUrl: sanitizeUrl(source.sourceUrl, "https://tinhbaoai.com"),
      seoTitle: `${source.title} | Originae Insights`,
      seoDescription: excerpt,
      bodyHtml: body.html,
      headings: body.headings,
      tags: Array.isArray(source.tags) ? source.tags.map((item) => `${item}`) : [],
      keyTakeaways: extractKeyTakeaways(source.keyTakeaways, excerpt),
      topic: topicSlug,
      topicName: topic.name,
      topicAccent: topic.accent,
      serviceSlug: topic.serviceSlug,
      serviceName: topic.serviceName,
      categorySlug: source.category?.slug ?? source.categorySlug ?? null,
      label: source.label ?? null,
      language: source.language || "en",
      // Author fields – future-proof for RSS/automation engine
      authorName: source.authorName || null,
      authorUrl: source.authorUrl || null,
      authorAvatar: source.authorAvatar || null,
    };
  });

  const snapshot = {
    generatedAt: new Date().toISOString(),
    source: {
      endpoint: sourceEndpoint,
      articleCount: remoteArticles.length,
      curatedCount: articles.length,
    },
    articles,
  };

  const feedPath = path.join(projectRoot, "public", "feed.xml");

  fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2) + "\n");
  fs.writeFileSync(sitemapPath, generateSitemap(articles));
  fs.writeFileSync(feedPath, generateAtomFeed(articles));
  console.log(`[sync:insights] Wrote ${articles.length} curated article snapshots.`);
}

main().catch((error) => {
  console.error(`[sync:insights] ${error.stack || error.message}`);
  process.exit(1);
});

