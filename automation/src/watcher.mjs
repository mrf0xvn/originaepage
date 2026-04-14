/**
 * watcher.mjs — RSS feed poller.
 *
 * Fetches configured RSS feeds, deduplicates by source URL,
 * and inserts new articles into SQLite with status "pending".
 *
 * Image extraction uses a 3-layer waterfall:
 *   Layer 1: RSS native images (enclosure, media:content, media:thumbnail)
 *   Layer 2: OG scraping (fetch source URL → extract og:image)
 *   Layer 3: Content HTML <img> extraction
 */

import Parser from "rss-parser";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { insertArticle, upsertFeed, updateFeedFetched, getActiveFeeds, getArticlesForOgScrape, updateOgImage } from "./db.mjs";
import { scrapeOgImage } from "./og-scraper.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEEDS_PATH = path.join(__dirname, "..", "config", "feeds.json");

const parser = new Parser({
  timeout: 15_000,
  headers: { "User-Agent": "OriginaeInsightsBot/1.0" },
  maxRedirects: 3,
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail"],
      ["media:group", "mediaGroup"],
    ],
  },
});

/** Load feed config and sync to DB */
function syncFeedConfig() {
  const config = JSON.parse(fs.readFileSync(FEEDS_PATH, "utf8"));
  for (const feed of config.feeds) {
    upsertFeed.run({
      url: feed.url,
      name: feed.name || feed.url,
      category: feed.category || "case-notes",
      language: feed.language || "en",
      active: feed.active !== false ? 1 : 0,
    });
  }
  return config.feeds.filter((f) => f.active !== false);
}

/** Strip HTML tags from content */
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

/** Extract image URLs from HTML content (Layer 3) */
function extractImages(html) {
  const images = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html || "")) !== null) {
    const src = match[1];
    // Only keep absolute URLs and skip tiny icons/trackers
    if (src.startsWith("http") && !src.includes("1x1") && !src.includes("pixel") && !src.includes("tracking")) {
      images.push(src);
    }
  }

  // Also check for media:content or enclosure URLs in raw HTML
  const mediaRegex = /url=["']([^"']+\.(jpg|jpeg|png|webp|gif|avif))["']/gi;
  while ((match = mediaRegex.exec(html || "")) !== null) {
    if (match[1].startsWith("http") && !images.includes(match[1])) {
      images.push(match[1]);
    }
  }

  return images;
}

/**
 * Extract RSS-native images from an item (Layer 1).
 * Handles enclosure, media:content, media:thumbnail, itunes:image.
 */
function extractRssNativeImages(item) {
  const images = [];

  // 1. Enclosure (most common for featured images)
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image/")) {
    images.push(item.enclosure.url);
  }

  // 2. media:content (VentureBeat, Ars Technica, etc.)
  if (Array.isArray(item.mediaContent)) {
    for (const media of item.mediaContent) {
      const attrs = media.$ || media;
      if (attrs?.url && (attrs.medium === "image" || /\.(jpg|jpeg|png|webp|gif|avif)/i.test(attrs.url))) {
        images.push(attrs.url);
      }
    }
  } else if (item.mediaContent?.$?.url) {
    images.push(item.mediaContent.$.url);
  }

  // 3. media:thumbnail
  if (item.mediaThumbnail?.$?.url) {
    images.push(item.mediaThumbnail.$.url);
  } else if (typeof item.mediaThumbnail === "string" && item.mediaThumbnail.startsWith("http")) {
    images.push(item.mediaThumbnail);
  }

  // 4. media:group → media:content (fallback nesting)
  if (item.mediaGroup?.["media:content"]) {
    const groupContent = item.mediaGroup["media:content"];
    const contents = Array.isArray(groupContent) ? groupContent : [groupContent];
    for (const media of contents) {
      if (media?.$?.url) images.push(media.$.url);
    }
  }

  // 5. itunes:image (podcasts, some feeds)
  const itunesImage = item.itunes?.image || item["itunes:image"]?.href;
  if (itunesImage && !images.includes(itunesImage)) {
    images.push(itunesImage);
  }

  return images.filter((url) => url.startsWith("http"));
}

/** Fetch a single RSS feed and insert new articles */
async function fetchFeed(feed) {
  let items;
  try {
    const result = await parser.parseURL(feed.url);
    items = result.items || [];
  } catch (err) {
    console.error(`  ✗ ${feed.name}: ${err.message}`);
    return { inserted: 0, newSourceUrls: [] };
  }

  let inserted = 0;
  const newSourceUrls = [];

  for (const item of items) {
    const sourceUrl = item.link || item.guid;
    if (!sourceUrl) continue;

    const rawHtml = item["content:encoded"] || item.content || "";
    const content = rawHtml || item.contentSnippet || item.summary || "";
    const plainContent = stripHtml(content);

    // Skip very short articles (likely not full content)
    if (plainContent.length < 200) continue;

    // Layer 1: RSS native images
    const rssImages = extractRssNativeImages(item);

    // Layer 3: Content HTML images
    const htmlImages = extractImages(rawHtml);

    // Merge: RSS native first (higher priority), then HTML images
    const allImages = [...rssImages];
    for (const img of htmlImages) {
      if (!allImages.includes(img)) allImages.push(img);
    }

    try {
      const result = insertArticle.run({
        source_url: sourceUrl,
        source_feed: feed.name,
        source_title: item.title || "Untitled",
        source_content: plainContent.slice(0, 50_000),
        source_language: feed.language || "en",
        source_published_at: item.pubDate || item.isoDate || new Date().toISOString(),
        source_images: allImages.length > 0 ? JSON.stringify(allImages) : null,
      });
      if (result.changes > 0) {
        inserted++;
        newSourceUrls.push(sourceUrl);
      }
    } catch {
      // Duplicate — source_url UNIQUE constraint, skip silently
    }
  }

  updateFeedFetched.run({ url: feed.url, count: items.length });
  return { inserted, newSourceUrls };
}

/**
 * Layer 2: OG scrape for articles that don't have images yet.
 * Runs after all feeds are polled, only for articles missing images.
 */
async function runOgScraping(batchSize = 10) {
  const articles = getArticlesForOgScrape.all(batchSize);
  if (articles.length === 0) return 0;

  console.log(`[watcher] OG scraping ${articles.length} article(s) for cover images...`);
  let scraped = 0;

  for (const article of articles) {
    // Small delay between requests to be polite
    if (scraped > 0) {
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    const meta = await scrapeOgImage(article.source_url);

    if (meta.ogImage) {
      updateOgImage.run({ id: article.id, og_image: meta.ogImage });
      console.log(`  ✓ OG image: ${meta.ogImage.substring(0, 80)}...`);
      scraped++;
    } else {
      // Mark as scraped (even if no image found) so we don't retry
      updateOgImage.run({ id: article.id, og_image: null });
    }
  }

  console.log(`[watcher] OG scraping done: ${scraped}/${articles.length} images found.`);
  return scraped;
}

/** Main watcher cycle */
export async function runWatcher() {
  console.log("[watcher] Polling RSS feeds...");
  const feeds = syncFeedConfig();
  let totalInserted = 0;

  for (const feed of feeds) {
    const { inserted } = await fetchFeed(feed);
    if (inserted > 0) {
      console.log(`  ✓ ${feed.name}: ${inserted} new article(s)`);
      totalInserted += inserted;
    }
  }

  if (totalInserted === 0) {
    console.log("[watcher] No new articles found.");
  } else {
    console.log(`[watcher] Total: ${totalInserted} new article(s) queued for rewriting.`);
  }

  // Layer 2: OG scrape for articles missing cover images
  await runOgScraping(20);

  return totalInserted;
}

// CLI: run once
if (process.argv.includes("--once")) {
  runWatcher().catch(console.error);
}

