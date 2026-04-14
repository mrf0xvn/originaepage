#!/usr/bin/env node
/**
 * indexnow-notify.mjs
 * ────────────────────
 * Pushes all article URLs to IndexNow API for instant indexing
 * on Bing, Yandex, Seznam, and Naver.
 *
 * Run after deploy: node scripts/indexnow-notify.mjs
 */

import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const snapshotPath = path.join(projectRoot, "content", "generated", "originae-insights.snapshot.json");
const baseUrl = "https://originae.org";
const host = "originae.org";

// Auto-generated IndexNow API key (hex, 32 chars)
const INDEXNOW_KEY = "e4df1560afb94e9da2088044bcfc9fcb";
const keyLocation = `${baseUrl}/${INDEXNOW_KEY}.txt`;

async function main() {
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
  const articles = snapshot.articles ?? [];

  // Ensure key verification file exists in public/
  const keyFilePath = path.join(projectRoot, "public", `${INDEXNOW_KEY}.txt`);
  if (!fs.existsSync(keyFilePath)) {
    fs.writeFileSync(keyFilePath, INDEXNOW_KEY);
    console.log(`[indexnow] Created key file: public/${INDEXNOW_KEY}.txt`);
  }

  const urlList = [
    `${baseUrl}/`,
    `${baseUrl}/insights`,
    ...articles.map((a) => `${baseUrl}/insights/${a.slug}`),
  ];

  const payload = { host, key: INDEXNOW_KEY, keyLocation, urlList };

  console.log(`[indexnow] Submitting ${urlList.length} URLs to IndexNow...`);

  try {
    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`[indexnow] ✓ Submitted successfully (HTTP ${response.status})`);
    } else {
      const text = await response.text().catch(() => "");
      console.warn(`[indexnow] ⚠ Response: HTTP ${response.status} ${text}`);
    }
  } catch (error) {
    console.error(`[indexnow] ✗ Failed: ${error.message}`);
    console.log("[indexnow] This is non-fatal. URLs will be discovered via sitemap crawling.");
  }

  console.log(`[indexnow] Done.\n`);
}

main();
