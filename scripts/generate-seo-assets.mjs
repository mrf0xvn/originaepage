#!/usr/bin/env node
/**
 * generate-seo-assets.mjs
 * ────────────────────────
 * Auto-generates all SEO & AI-discovery assets at build time:
 *   1. sitemap.xml       – dynamic, accurate lastmod
 *   2. feed.xml          – Atom 1.0 RSS feed
 *   3. llms.txt          – AI agent discovery (curated nav)
 *   4. llms-full.txt     – Full content for AI ingestion
 *
 * Run: node scripts/generate-seo-assets.mjs
 */

import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const snapshotPath = path.join(projectRoot, "content", "generated", "originae-insights.snapshot.json");
const baseUrl = "https://originae.org";

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
const articles = snapshot.articles ?? [];
const now = new Date().toISOString();

function stripHtml(html) {
  return `${html ?? ""}`
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeXml(str) {
  return `${str ?? ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ─────────────────────────────────────────────
// 1. SITEMAP.XML
// ─────────────────────────────────────────────
function generateSitemap() {
  const urls = [
    { loc: `${baseUrl}/`, lastmod: now, changefreq: "daily", priority: "1.0" },
    { loc: `${baseUrl}/insights`, lastmod: now, changefreq: "daily", priority: "0.9" },
    ...articles.map((a) => ({
      loc: `${baseUrl}/insights/${a.slug}`,
      lastmod: a.dateModified || a.publishedAt || now,
      changefreq: "weekly",
      priority: "0.8",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml);
  console.log(`  ✓ sitemap.xml (${urls.length} URLs)`);
}

// ─────────────────────────────────────────────
// 2. ATOM RSS FEED
// ─────────────────────────────────────────────
function generateFeed() {
  const feedUpdated = articles.length > 0
    ? articles.reduce((latest, a) => {
        const d = a.dateModified || a.publishedAt;
        return d > latest ? d : latest;
      }, "")
    : now;

  const entries = articles
    .map(
      (a) => `  <entry>
    <title>${escapeXml(a.title)}</title>
    <link href="${baseUrl}/insights/${a.slug}" rel="alternate" type="text/html"/>
    <id>${baseUrl}/insights/${a.slug}</id>
    <published>${a.publishedAt}</published>
    <updated>${a.dateModified || a.publishedAt}</updated>
    <author><name>${escapeXml(a.authorName || "Originae Editorial")}</name></author>
    <category term="${escapeXml(a.topicName)}" label="${escapeXml(a.topicName)}"/>
    <summary type="text">${escapeXml(a.excerpt)}</summary>
    <content type="html">${escapeXml(a.bodyHtml)}</content>
  </entry>`
    )
    .join("\n");

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Originae Insights</title>
  <subtitle>Execution notes and working signal for founders and operators.</subtitle>
  <link href="${baseUrl}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${baseUrl}/insights" rel="alternate" type="text/html"/>
  <id>${baseUrl}/insights</id>
  <updated>${feedUpdated}</updated>
  <author><name>Originae Editorial</name></author>
  <icon>${baseUrl}/favicon.svg</icon>
  <rights>© ${new Date().getFullYear()} Originae. All rights reserved.</rights>
${entries}
</feed>
`;

  fs.writeFileSync(path.join(publicDir, "feed.xml"), atom);
  console.log(`  ✓ feed.xml (${articles.length} entries, Atom 1.0)`);
}

// ─────────────────────────────────────────────
// 3. LLMS.TXT — AI Agent Discovery
// ─────────────────────────────────────────────
function generateLlmsTxt() {
  const articleLinks = articles
    .map((a) => `- [${a.title}](${baseUrl}/insights/${a.slug}): ${a.excerpt.slice(0, 160)}`)
    .join("\n");

  const content = `# Originae

> Originae is a Swiss-led execution partner for startups and growth-stage companies. We bridge the gap between strategy and delivery across marketing, operations, business development, and product work.

## About

Originae provides managed execution services. We operate as an embedded team, not an agency. Our work spans growth systems, GTM execution, operations automation, and product delivery.

- [Homepage](${baseUrl}/)
- [Insights (Blog)](${baseUrl}/insights)
- [RSS Feed](${baseUrl}/feed.xml)

## Services

- Marketing — Messaging, demand systems, and repeatable growth mechanics
- Operations — Execution systems, process design, and workflow automation
- Business Development — Outbound motion, pipeline building, and GTM operating notes
- Product & Technology — Applied AI, systems integration, and delivery decisions

## Insights

Editorial notes for operators who ship. Curated observations across systems, GTM, delivery, and strategic execution.

${articleLinks}

## Contact

- Email: hello@originae.org
- Website: ${baseUrl}
`;

  fs.writeFileSync(path.join(publicDir, "llms.txt"), content);
  console.log(`  ✓ llms.txt (${articles.length} article links)`);
}

// ─────────────────────────────────────────────
// 4. LLMS-FULL.TXT — Full Content for AI
// ─────────────────────────────────────────────
function generateLlmsFullTxt() {
  const sections = articles.map((a) => {
    const plainBody = stripHtml(a.bodyHtml);
    const tags = (a.tags || []).join(", ");
    return `---

## ${a.title}

- **URL**: ${baseUrl}/insights/${a.slug}
- **Published**: ${a.publishedAt}
- **Topic**: ${a.topicName}
- **Author**: ${a.authorName || "Originae Editorial"}
- **Read time**: ${a.readTime} min
${tags ? `- **Tags**: ${tags}` : ""}

### Summary

${a.excerpt}

### Key Takeaways

${(a.keyTakeaways || []).map((t) => `- ${t}`).join("\n")}

### Full Content

${plainBody}`;
  });

  const content = `# Originae Insights — Full Content

> This file contains the complete text of all Originae Insights articles. It is intended for AI systems and language models to ingest the full knowledge base.

**Total articles**: ${articles.length}
**Last updated**: ${now}

${sections.join("\n\n")}
`;

  fs.writeFileSync(path.join(publicDir, "llms-full.txt"), content);
  const totalWords = articles.reduce((sum, a) => {
    const wc = a.wordCount || stripHtml(a.bodyHtml).split(/\s+/).filter(Boolean).length;
    return sum + wc;
  }, 0);
  console.log(`  ✓ llms-full.txt (${articles.length} articles, ~${totalWords.toLocaleString()} words)`);
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
console.log("[seo] Generating SEO & AI-discovery assets...");
generateSitemap();
generateFeed();
generateLlmsTxt();
generateLlmsFullTxt();
console.log("[seo] Done.\n");
