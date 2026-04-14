/**
 * publisher.mjs — Content Manager.
 *
 * Takes rewritten articles from DB, converts them to the originaepage
 * snapshot format, writes content files, and triggers deploy.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getRewritten, markPublished, logPublish } from "./db.mjs";
import { deploy } from "./deployer.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = path.join(__dirname, "..", "config", "settings.json");

function loadSettings() {
  return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
}

const TOPIC_CATALOG = {
  "growth-systems": { name: "Growth systems", accent: "#F26522", serviceSlug: "marketing", serviceName: "Marketing" },
  "operations-automation": { name: "Operations & automation", accent: "#18181B", serviceSlug: "operations", serviceName: "Operations" },
  "gtm-execution": { name: "GTM execution", accent: "#252525", serviceSlug: "business-development", serviceName: "Business Development" },
  "product-delivery": { name: "Product delivery", accent: "#F26522", serviceSlug: "product-technology", serviceName: "Product & Technology" },
  "case-notes": { name: "Case notes", accent: "#18181B", serviceSlug: "business-development", serviceName: "Business Development" },
};

/** Convert DB article to originaepage snapshot format */
function toSnapshotArticle(row, baseUrl) {
  const topicSlug = row.topic_slug || "case-notes";
  const topic = TOPIC_CATALOG[topicSlug] || TOPIC_CATALOG["case-notes"];
  const bodyHtml = row.body_html || "";
  const plainText = bodyHtml.replace(/<[^>]+>/g, " ").trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  // Extract headings from HTML
  const headings = [];
  const headingRegex = /<(h2|h3)\s+id="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = headingRegex.exec(bodyHtml)) !== null) {
    const text = match[3].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    headings.push({ id: match[2], level: match[1] === "h3" ? 3 : 2, text });
  }

  // Add heading IDs if missing
  let processedHtml = bodyHtml;
  if (headings.length === 0) {
    let idCounter = 0;
    processedHtml = bodyHtml.replace(/<(h2|h3)>([\s\S]*?)<\/\1>/gi, (_match, tag, inner) => {
      const text = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `section-${++idCounter}`;
      headings.push({ id, level: tag === "h3" ? 3 : 2, text });
      return `<${tag} id="${id}">${inner}</${tag}>`;
    });
  }

  let keyTakeaways = [];
  try { keyTakeaways = JSON.parse(row.key_takeaways || "[]"); } catch { /* ignore */ }

  let tags = [];
  try { tags = JSON.parse(row.tags || "[]"); } catch { /* ignore */ }

  // Cover image waterfall: og_image → cover_image → source_images[0] → default
  let coverImage = `${baseUrl}/og-cover.jpg`;
  if (row.source_images) {
    try {
      const sourceImages = JSON.parse(row.source_images);
      if (sourceImages.length > 0) coverImage = sourceImages[0];
    } catch { /* fallback */ }
  }
  if (row.og_image) coverImage = row.og_image;
  if (row.cover_image) coverImage = row.cover_image;

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    coverImage,
    publishedAt: row.source_published_at || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    readTime: Math.max(3, Math.ceil(wordCount / 200)),
    wordCount,
    sourceName: row.source_feed || "External",
    sourceUrl: row.source_url,
    seoTitle: row.seo_title || `${row.title} | Originae Insights`,
    seoDescription: row.seo_description || row.excerpt,
    bodyHtml: processedHtml,
    headings,
    tags,
    keyTakeaways,
    topic: topicSlug,
    topicName: topic.name,
    topicAccent: topic.accent,
    serviceSlug: topic.serviceSlug,
    serviceName: topic.serviceName,
    categorySlug: null,
    label: null,
    language: row.language || "en",
    authorName: "Originae Editorial",
    authorUrl: null,
    authorAvatar: null,
  };
}

/** Main publish cycle */
export async function runPublisher() {
  const settings = loadSettings();
  const maxPerBatch = settings.publisher?.maxPerBatch || 5;
  const baseUrl = settings.site?.baseUrl || "https://originae.org";
  const repoPath = path.resolve(__dirname, "..", settings.git?.repoPath || "../");

  const articles = getRewritten.all(maxPerBatch);
  if (articles.length === 0) {
    console.log("[publisher] No rewritten articles to publish.");
    return 0;
  }

  console.log(`[publisher] Publishing ${articles.length} article(s)...`);

  // Paths within the originaepage repo
  const automationJsonPath = path.join(repoPath, "content", "automation-articles.json");
  const curatedSlugsPath = path.join(repoPath, "content", "curatedInsightSlugs.json");

  // Read existing curated slugs
  let curatedSlugs = [];
  try {
    curatedSlugs = JSON.parse(fs.readFileSync(curatedSlugsPath, "utf8"));
  } catch { /* start fresh */ }

  // Read existing automation articles (may have articles from previous batches)
  let existingAutoArticles = [];
  try {
    existingAutoArticles = JSON.parse(fs.readFileSync(automationJsonPath, "utf8"));
  } catch { /* start fresh */ }

  // Convert and accumulate
  const newArticles = articles.map((row) => toSnapshotArticle(row, baseUrl));
  const allAutoArticles = [...existingAutoArticles, ...newArticles];
  const newSlugs = newArticles.map((a) => a.slug).filter((s) => !curatedSlugs.includes(s));
  const allSlugs = [...curatedSlugs, ...newSlugs];

  // Write files
  fs.writeFileSync(automationJsonPath, JSON.stringify(allAutoArticles, null, 2) + "\n");
  fs.writeFileSync(curatedSlugsPath, JSON.stringify(allSlugs, null, 2) + "\n");
  console.log(`[publisher] Wrote ${newArticles.length} articles → automation-articles.json`);
  console.log(`[publisher] Curated slugs: ${allSlugs.length} total`);

  // Mark as published in DB
  for (const row of articles) {
    markPublished.run({ id: row.id });
  }

  // Deploy via git
  try {
    const commitHash = await deploy(repoPath, articles.length, settings.git?.branch || "main");
    logPublish.run({ count: articles.length, hash: commitHash });
    console.log(`[publisher] Deployed: ${commitHash}`);
  } catch (err) {
    console.error(`[publisher] Deploy failed: ${err.message}`);
  }

  return articles.length;
}

// CLI: run once
if (process.argv.includes("--once")) {
  runPublisher().catch(console.error);
}
