import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { build } from "esbuild";

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, "dist");
const templatePath = path.join(distDir, "index.html");
const snapshotPath = path.join(projectRoot, "content", "generated", "originae-insights.snapshot.json");
const baseUrl = "https://originae.org";
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
const require = createRequire(import.meta.url);

function escapeHtml(value) {
  return `${value ?? ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function replaceOrThrow(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`Could not replace ${label} in prerender template.`);
  pattern.lastIndex = 0;
  return html.replace(pattern, replacement);
}

async function loadRenderer() {
  const outfile = path.join(projectRoot, ".omx-prerender-runtime.cjs");
  await build({
    entryPoints: [path.join(projectRoot, "scripts", "prerender-runtime-entry.tsx")],
    outfile,
    bundle: true,
    format: "cjs",
    platform: "node",
    jsx: "automatic",
    target: "node20",
  });

  const module = require(outfile);
  fs.rmSync(outfile, { force: true });
  return module;
}

function withMetadata(template, meta, rootMarkup) {
  let html = template;
  html = replaceOrThrow(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`, "title");
  html = replaceOrThrow(html, /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${escapeHtml(meta.description)}" />`, "description");
  html = replaceOrThrow(html, /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i, `<link rel="canonical" href="${meta.canonical}" />`, "canonical");
  html = replaceOrThrow(html, /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:type" content="${meta.ogType}" />`, "og:type");
  html = replaceOrThrow(html, /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`, "og:title");
  html = replaceOrThrow(html, /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`, "og:description");
  html = replaceOrThrow(html, /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:url" content="${meta.canonical}" />`, "og:url");
  html = replaceOrThrow(html, /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:image" content="${meta.image}" />`, "og:image");
  html = replaceOrThrow(html, /<meta\s+property="og:image:alt"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:image:alt" content="${escapeHtml(meta.imageAlt)}" />`, "og:image:alt");
  html = replaceOrThrow(html, /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`, "twitter:title");
  html = replaceOrThrow(html, /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`, "twitter:description");
  html = replaceOrThrow(html, /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:image" content="${meta.image}" />`, "twitter:image");
  html = replaceOrThrow(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">${JSON.stringify(meta.schema)}</script>`, "json-ld");
  html = replaceOrThrow(html, /<div id="root"><\/div>/i, `<div id="root">${rootMarkup}</div>`, "root markup");

  // Inject article-specific meta tags (OG article:* + Twitter labels)
  if (meta.articleMeta) {
    const am = meta.articleMeta;
    const articleTags = [
      `<meta property="article:published_time" content="${am.publishedTime}" />`,
      `<meta property="article:modified_time" content="${am.modifiedTime}" />`,
      `<meta property="article:section" content="${escapeHtml(am.section)}" />`,
      ...(am.tags || []).map(t => `<meta property="article:tag" content="${escapeHtml(t)}" />`),
      `<meta name="twitter:label1" content="Reading time" />`,
      `<meta name="twitter:data1" content="${am.readTime} min read" />`,
      `<meta name="twitter:label2" content="Topic" />`,
      `<meta name="twitter:data2" content="${escapeHtml(am.section)}" />`,
    ].join("\n    ");
    // Insert after the twitter:image tag
    html = html.replace(
      /(<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>)/i,
      `$1\n    ${articleTags}`
    );
  }

  return html;
}

function writeRoute(routePath, html) {
  const filePath = path.join(distDir, routePath, "index.html");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

async function main() {
  if (!fs.existsSync(templatePath)) throw new Error("dist/index.html not found. Run the build before prerendering routes.");
  if (!Array.isArray(snapshot.articles) || snapshot.articles.length === 0) throw new Error("No snapshot articles found for prerendering.");

  const template = fs.readFileSync(templatePath, "utf8");
  const renderer = await loadRenderer();

  writeRoute("insights", withMetadata(template, {
    title: "Originae Insights | Editorial notes for operators who ship",
    description: "Browse curated Originae insights across growth systems, operations, GTM execution, product delivery, and case-based operator notes.",
    canonical: `${baseUrl}/insights`,
    ogType: "website",
    image: `${baseUrl}/og-cover.jpg`,
    imageAlt: "Originae Insights",
    schema: { "@context": "https://schema.org", "@graph": [{ "@type": "CollectionPage", "@id": `${baseUrl}/insights#collection`, name: "Originae Insights", url: `${baseUrl}/insights`, description: "Curated Originae insights published inside the main Originae site shell." }] }
  }, renderer.renderInsightsIndex()));

  for (const article of snapshot.articles) {
    const articleUrl = `${baseUrl}/insights/${article.slug}`;
    const wordCount = `${article.bodyHtml ?? ""}`.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;

    writeRoute(path.join("insights", article.slug), withMetadata(template, {
      title: article.seoTitle,
      description: article.seoDescription,
      canonical: articleUrl,
      ogType: "article",
      image: article.coverImage,
      imageAlt: article.title,
      articleMeta: {
        publishedTime: article.publishedAt,
        modifiedTime: article.dateModified || article.publishedAt,
        section: article.topicName,
        tags: article.tags || [],
        readTime: article.readTime || Math.ceil(wordCount / 200),
      },
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            "@id": `${articleUrl}#article`,
            headline: article.title,
            description: article.seoDescription,
            image: article.coverImage,
            datePublished: article.publishedAt,
            dateModified: article.dateModified || article.publishedAt,
            mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
            inLanguage: article.language || "en",
            articleSection: article.topicName,
            keywords: (article.tags || []).join(", "),
            wordCount,
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: [".insight-prose h2", ".insight-prose > p:first-of-type"]
            },
            author: {
              "@type": "Person",
              name: article.authorName || "Originae Editorial",
              url: article.authorUrl || `${baseUrl}/insights`
            },
            publisher: {
              "@type": "Organization",
              name: "Originae",
              url: baseUrl,
              logo: { "@type": "ImageObject", url: `${baseUrl}/favicon.svg`, width: 112, height: 112 }
            }
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${articleUrl}#breadcrumb`,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Originae", item: baseUrl },
              { "@type": "ListItem", position: 2, name: "Insights", item: `${baseUrl}/insights` },
              { "@type": "ListItem", position: 3, name: article.title, item: articleUrl }
            ]
          },
          {
            "@type": "Organization",
            "@id": `${baseUrl}#organization`,
            name: "Originae",
            url: baseUrl,
            logo: { "@type": "ImageObject", url: `${baseUrl}/favicon.svg` }
          }
        ]
      }
    }, renderer.renderInsightArticle(article.slug)));
  }

  console.log(`[postbuild] Prerendered ${snapshot.articles.length + 1} static editorial route(s).`);
}

main().catch((error) => {
  console.error(`[postbuild] ${error.stack || error.message}`);
  process.exit(1);
});
