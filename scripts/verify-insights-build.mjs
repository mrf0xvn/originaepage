import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, "dist");
const snapshotPath = path.join(projectRoot, "content", "generated", "originae-insights.snapshot.json");
const shellContractPath = path.join(projectRoot, "site", "shellContract.json");
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
const articles = snapshot.articles || [];
const shellContractRaw = fs.readFileSync(shellContractPath, "utf8");
const mojibakePattern = /Ã¢â€ |ÃƒÂ¢|\? Back to insights/;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

assert.ok(articles.length > 0, "Expected at least one curated article in the generated snapshot.");
assert.doesNotMatch(shellContractRaw, mojibakePattern, "Shell contract source should not contain mojibake arrows or stale article back-label text.");
assert.doesNotMatch(articles[0].title, /Ãƒ.|Ã¢â‚¬|Ã¢â€ |ï¿½/, "Snapshot titles should not contain mojibake artifacts.");
assert.doesNotMatch(articles[0].excerpt, /Ãƒ.|Ã¢â‚¬|Ã¢â€ |ï¿½/, "Snapshot excerpts should not contain mojibake artifacts.");

const firstArticle = articles[0];
const secondArticle = articles[Math.min(1, articles.length - 1)];
const insightsHtmlPath = path.join(distDir, "insights", "index.html");
const articleHtmlPath = path.join(distDir, "insights", firstArticle.slug, "index.html");
const secondArticleHtmlPath = path.join(distDir, "insights", secondArticle.slug, "index.html");
const sitemapPath = path.join(distDir, "sitemap.xml");

assert.ok(fs.existsSync(insightsHtmlPath), "Expected dist/insights/index.html to exist.");
assert.ok(fs.existsSync(articleHtmlPath), "Expected a prerendered article route artifact.");
assert.ok(fs.existsSync(secondArticleHtmlPath), "Expected a second prerendered article route artifact.");
assert.ok(fs.existsSync(sitemapPath), "Expected dist/sitemap.xml to exist.");

const insightsHtml = fs.readFileSync(insightsHtmlPath, "utf8");
const articleHtml = fs.readFileSync(articleHtmlPath, "utf8");
const secondArticleHtml = fs.readFileSync(secondArticleHtmlPath, "utf8");
const sitemapXml = fs.readFileSync(sitemapPath, "utf8");

assert.match(insightsHtml, /https:\/\/originae\.org\/insights/, "Insights index should declare the /insights canonical URL.");
assert.match(articleHtml, new RegExp(`https://originae\\.org/insights/${escapeRegex(firstArticle.slug)}`), "Article route should declare the article canonical URL.");
assert.match(sitemapXml, /https:\/\/originae\.org\/insights/, "Sitemap should include the insights index.");
assert.match(sitemapXml, new RegExp(escapeRegex(firstArticle.slug)), "Sitemap should include article detail routes.");
assert.doesNotMatch(insightsHtml, /Ã¢â€ |ÃƒÂ¢/, "Insights index should not contain mojibake artifacts.");
assert.doesNotMatch(articleHtml, /Ã¢â€ |ÃƒÂ¢|\? Back to insights|<!DOCTYPE html>|&lt;p&gt;|&lt;h2&gt;/, "Article route should not contain UX copy artifacts or escaped-body artifacts.");
assert.doesNotMatch(secondArticleHtml, /Ã¢â€ |ÃƒÂ¢|\? Back to insights|<!DOCTYPE html>|&lt;p&gt;|&lt;h2&gt;/, "Second article route should not contain UX copy artifacts or escaped-body artifacts.");
assert.match(insightsHtml, /Execution journal/, "Insights index should expose the editorial shell label.");
assert.match(insightsHtml, /One lead dispatch, followed by a calmer supporting stack\./, "Insights index should lock the approved lead/support section heading.");
assert.match(insightsHtml, /A quieter browse mode for the rest of the thread\./, "Insights index should lock the archive reset heading.");
assert.match(articleHtml, /Back to insights/, "Article page should expose the polished back-link label.");
assert.match(articleHtml, /Browse insights/, "Article page should expose the article-end editorial CTA.");

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html": return "text/html; charset=utf-8";
    case ".js": return "text/javascript; charset=utf-8";
    case ".css": return "text/css; charset=utf-8";
    case ".svg": return "image/svg+xml";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".png": return "image/png";
    case ".webp": return "image/webp";
    case ".xml": return "application/xml; charset=utf-8";
    case ".txt": return "text/plain; charset=utf-8";
    default: return "application/octet-stream";
  }
}

function resolveFilePath(requestPath) {
  const normalized = decodeURIComponent(requestPath.split("?")[0]);
  const candidate = normalized === "/"
    ? path.join(distDir, "index.html")
    : path.extname(normalized)
      ? path.join(distDir, normalized)
      : path.join(distDir, normalized, "index.html");

  if (fs.existsSync(candidate)) return candidate;
  return null;
}

async function main() {
  const server = http.createServer((req, res) => {
    const targetPath = resolveFilePath(req.url || "/");
    if (!targetPath) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }

    res.setHeader("Content-Type", contentTypeFor(targetPath));
    fs.createReadStream(targetPath).pipe(res);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const responses = await Promise.all([
    fetch(`${baseUrl}/`),
    fetch(`${baseUrl}/insights`),
    fetch(`${baseUrl}/insights/${encodeURIComponent(firstArticle.slug)}`),
  ]);

  const bodies = await Promise.all(responses.map((response) => response.text()));
  server.close();

  assert.equal(responses[0].status, 200, "Homepage should resolve successfully from generated artifacts.");
  assert.equal(responses[1].status, 200, "Insights index should resolve successfully from generated artifacts.");
  assert.equal(responses[2].status, 200, "Article detail page should resolve successfully from generated artifacts.");
  assert.match(bodies[1], /A calmer editorial front page for execution notes and working signal\./, "Insights index response should include the approved masthead headline.");
  assert.match(bodies[1], /One lead dispatch, followed by a calmer supporting stack\./, "Insights index response should include the lead/support section heading.");
  assert.match(bodies[1], /A quieter browse mode for the rest of the thread\./, "Insights index response should include the archive reset heading.");
  assert.match(bodies[2], /Back to insights/, "Article response should include the polished back-link text.");
  assert.match(bodies[2], /Continue the operator thread/, "Article response should include the redesigned article-end transition.");

  console.log("verify:insights-build: ok");
}

main().catch((error) => {
  console.error(`verify:insights-build failed: ${error.stack || error.message}`);
  process.exit(1);
});
