/**
 * og-scraper.mjs — OpenGraph image scraper for RSS source articles.
 *
 * Fetches the source URL of an article and extracts the og:image,
 * twitter:image, and other meta-based cover images.
 *
 * This is Layer 2 of the 3-layer image extraction waterfall:
 *   Layer 1: RSS native images (enclosure, media:content)
 *   Layer 2: OG scraping (this module)
 *   Layer 3: Content HTML <img> extraction
 */

const OG_TIMEOUT = 10_000;
const USER_AGENT = "OriginaeInsightsBot/1.0 (OpenGraph Scraper)";

// Minimum image dimensions to filter out icons/trackers
const MIN_IMAGE_WIDTH = 200;

// File extensions that indicate a real image (not tracking pixel)
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|#|$)/i;

// URL patterns that indicate tracking pixels or tiny icons
const BLOCKLIST_PATTERNS = [
  /1x1/i,
  /pixel/i,
  /tracking/i,
  /beacon/i,
  /spacer/i,
  /blank\./i,
  /favicon/i,
  /icon-\d+/i,
  /\.ico(\?|$)/i,
  /gravatar\.com/i,
  /\.gif$/i, // Animated GIFs are typically low-quality for covers
];

/**
 * Validate an image URL as a plausible cover image.
 * @param {string} url
 * @returns {boolean}
 */
function isValidCoverUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
  } catch {
    return false;
  }
  if (BLOCKLIST_PATTERNS.some((pattern) => pattern.test(url))) return false;
  return true;
}

/**
 * Extract meta content from raw HTML by property/name.
 * Supports both <meta property="..." content="..."> and <meta name="..." content="...">
 * @param {string} html
 * @param {string} attr - The property or name to search for (e.g., "og:image")
 * @returns {string|null}
 */
function extractMeta(html, attr) {
  // Match both property= and name= with either single or double quotes
  // Handle content before or after the property/name attribute
  const patterns = [
    // property="..." content="..."
    new RegExp(`<meta[^>]+(?:property|name)=["']${escapeRegex(attr)}["'][^>]+content=["']([^"']+)["']`, "i"),
    // content="..." property="..."
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapeRegex(attr)}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      // Decode HTML entities
      return match[1]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
    }
  }
  return null;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extract the best cover image URL from a page's <head> metadata.
 * Priority: og:image → twitter:image → twitter:image:src → link[rel=image_src]
 * @param {string} html
 * @returns {{ ogImage: string|null, ogTitle: string|null, ogDescription: string|null, ogWidth: number|null }}
 */
function extractOgMetadata(html) {
  // Only parse <head> section to save time
  const headEnd = html.indexOf("</head>");
  const headHtml = headEnd > -1 ? html.slice(0, headEnd + 7) : html.slice(0, 15_000);

  // Try each image meta in priority order
  const candidates = [
    extractMeta(headHtml, "og:image"),
    extractMeta(headHtml, "og:image:secure_url"),
    extractMeta(headHtml, "twitter:image"),
    extractMeta(headHtml, "twitter:image:src"),
  ].filter(Boolean);

  // Also try <link rel="image_src">
  const linkMatch = headHtml.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);
  if (linkMatch?.[1]) candidates.push(linkMatch[1].replace(/&amp;/g, "&"));

  // Find the first valid candidate
  const ogImage = candidates.find((url) => isValidCoverUrl(url)) || null;

  // Extract optional metadata
  const ogTitle = extractMeta(headHtml, "og:title");
  const ogDescription = extractMeta(headHtml, "og:description");
  const ogWidthRaw = extractMeta(headHtml, "og:image:width");
  const ogWidth = ogWidthRaw ? parseInt(ogWidthRaw, 10) : null;

  return { ogImage, ogTitle, ogDescription, ogWidth: Number.isNaN(ogWidth) ? null : ogWidth };
}

/**
 * Scrape OpenGraph image from a source URL.
 * @param {string} sourceUrl - The article's source URL
 * @returns {Promise<{ ogImage: string|null, ogTitle: string|null, ogDescription: string|null, ogWidth: number|null }>}
 */
export async function scrapeOgImage(sourceUrl) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OG_TIMEOUT);

    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`  ⚠ OG scrape: HTTP ${response.status} for ${sourceUrl}`);
      return { ogImage: null, ogTitle: null, ogDescription: null, ogWidth: null };
    }

    const html = await response.text();
    const meta = extractOgMetadata(html);

    if (meta.ogImage) {
      // Resolve relative URLs against the source
      try {
        meta.ogImage = new URL(meta.ogImage, sourceUrl).toString();
      } catch {
        // keep as-is if already absolute
      }
    }

    return meta;
  } catch (err) {
    if (err.name === "AbortError") {
      console.warn(`  ⚠ OG scrape: Timeout for ${sourceUrl}`);
    } else {
      console.warn(`  ⚠ OG scrape: ${err.message} for ${sourceUrl}`);
    }
    return { ogImage: null, ogTitle: null, ogDescription: null, ogWidth: null };
  }
}

/**
 * Batch scrape OG images for multiple URLs with concurrency limit.
 * @param {string[]} urls
 * @param {number} concurrency - Maximum parallel requests (default: 3)
 * @param {number} delayMs - Delay between batches (default: 500ms)
 * @returns {Promise<Map<string, { ogImage: string|null }>>}
 */
export async function batchScrapeOgImages(urls, concurrency = 3, delayMs = 500) {
  const results = new Map();
  const queue = [...urls];

  while (queue.length > 0) {
    const batch = queue.splice(0, concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(async (url) => {
        const meta = await scrapeOgImage(url);
        return { url, meta };
      })
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.set(result.value.url, result.value.meta);
      }
    }

    // Small delay between batches to be polite
    if (queue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

// CLI: test scrape a single URL
if (process.argv[2] && !process.argv[2].startsWith("--")) {
  const url = process.argv[2];
  console.log(`Scraping OG image from: ${url}`);
  scrapeOgImage(url).then((meta) => {
    console.log("Result:", JSON.stringify(meta, null, 2));
  });
}
