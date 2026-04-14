/**
 * db.mjs — SQLite database layer for the automation engine.
 *
 * Uses sql.js (pure JavaScript SQLite — zero native deps, no Python/node-gyp needed).
 * Database file lives in automation/data/originae.db (gitignored).
 *
 * Exports a better-sqlite3–compatible interface so callers don't need changes.
 */

import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "originae.db");

fs.mkdirSync(DATA_DIR, { recursive: true });

// ─── Initialize sql.js ─────────────────────────────────

const SQL = await initSqlJs();

let db;
if (fs.existsSync(DB_PATH)) {
  const buffer = fs.readFileSync(DB_PATH);
  db = new SQL.Database(buffer);
} else {
  db = new SQL.Database();
}

// Auto-save to disk after mutations
function save() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// ─── Schema ────────────────────────────────────────────

db.run(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Source data
    source_url TEXT UNIQUE NOT NULL,
    source_feed TEXT,
    source_title TEXT,
    source_content TEXT,
    source_language TEXT DEFAULT 'en',
    source_published_at TEXT,
    source_images TEXT,

    -- Rewritten content
    title TEXT,
    slug TEXT UNIQUE,
    excerpt TEXT,
    body_html TEXT,
    seo_title TEXT,
    seo_description TEXT,
    key_takeaways TEXT,
    tags TEXT,
    topic_slug TEXT,
    cover_image TEXT,
    og_image TEXT,
    og_scraped_at TEXT,
    language TEXT DEFAULT 'en',

    -- State
    status TEXT DEFAULT 'pending',
    error_message TEXT,

    -- AI tracking
    ai_model TEXT,
    ai_tokens_used INTEGER,

    -- Timestamps
    created_at TEXT DEFAULT (datetime('now')),
    published_at TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS feeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    name TEXT,
    category TEXT,
    language TEXT DEFAULT 'en',
    active INTEGER DEFAULT 1,
    last_fetched_at TEXT,
    last_article_count INTEGER DEFAULT 0
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS publish_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    articles_count INTEGER,
    commit_hash TEXT,
    published_at TEXT DEFAULT (datetime('now'))
  )
`);

save();

// ─── Migrations (safe for existing DBs) ────────────────
try { db.run(`ALTER TABLE articles ADD COLUMN og_image TEXT`); } catch { /* already exists */ }
try { db.run(`ALTER TABLE articles ADD COLUMN og_scraped_at TEXT`); } catch { /* already exists */ }
save();

// ─── Helpers to wrap sql.js in better-sqlite3–like API ──

/**
 * Create a wrapper that mimics better-sqlite3 prepared statement.
 * - .run(params) → execute, return { changes }
 * - .all(params) → return array of row objects
 * - .get(params) → return single row or undefined
 */
function prepareStatement(sql) {
  return {
    run(params) {
      const stmt = db.prepare(sql);
      if (params !== undefined && params !== null) {
        if (typeof params === "object" && !Array.isArray(params)) {
          // Named params: { @key: value } — sql.js uses $key or :key or @key
          // Convert camelCase keys to @key format
          const bound = {};
          for (const [k, v] of Object.entries(params)) {
            bound[`@${k}`] = v ?? null;
          }
          stmt.bind(bound);
        } else if (Array.isArray(params)) {
          stmt.bind(params);
        } else {
          // Single positional value
          stmt.bind([params]);
        }
      }
      stmt.step();
      stmt.free();
      save();
      return { changes: db.getRowsModified() };
    },

    all(params) {
      const stmt = db.prepare(sql);
      if (params !== undefined && params !== null) {
        if (typeof params === "object" && !Array.isArray(params)) {
          const bound = {};
          for (const [k, v] of Object.entries(params)) {
            bound[`@${k}`] = v ?? null;
          }
          stmt.bind(bound);
        } else if (Array.isArray(params)) {
          stmt.bind(params);
        } else {
          stmt.bind([params]);
        }
      }
      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      return rows;
    },

    get(params) {
      const results = this.all(params);
      return results[0] || undefined;
    },
  };
}

// ─── Prepared statements ───────────────────────────────

const insertArticle = prepareStatement(`
  INSERT OR IGNORE INTO articles (source_url, source_feed, source_title, source_content, source_language, source_published_at, source_images)
  VALUES (@source_url, @source_feed, @source_title, @source_content, @source_language, @source_published_at, @source_images)
`);

const getPending = prepareStatement(`
  SELECT * FROM articles WHERE status = 'pending' ORDER BY created_at ASC LIMIT ?
`);

const getRewritten = prepareStatement(`
  SELECT * FROM articles WHERE status = 'rewritten' ORDER BY created_at ASC LIMIT ?
`);

const updateRewritten = prepareStatement(`
  UPDATE articles SET
    title = @title, slug = @slug, excerpt = @excerpt,
    body_html = @body_html, seo_title = @seo_title, seo_description = @seo_description,
    key_takeaways = @key_takeaways, tags = @tags, topic_slug = @topic_slug,
    language = @language, ai_model = @ai_model, ai_tokens_used = @ai_tokens_used,
    status = 'rewritten', error_message = NULL
  WHERE id = @id
`);

const markFailed = prepareStatement(`
  UPDATE articles SET status = 'failed', error_message = @error WHERE id = @id
`);

const markPublished = prepareStatement(`
  UPDATE articles SET status = 'published', published_at = datetime('now') WHERE id = @id
`);

const markRewriting = prepareStatement(`
  UPDATE articles SET status = 'rewriting' WHERE id = @id
`);

const upsertFeed = prepareStatement(`
  INSERT INTO feeds (url, name, category, language, active)
  VALUES (@url, @name, @category, @language, @active)
  ON CONFLICT(url) DO UPDATE SET name = @name, category = @category, language = @language, active = @active
`);

const updateFeedFetched = prepareStatement(`
  UPDATE feeds SET last_fetched_at = datetime('now'), last_article_count = @count WHERE url = @url
`);

const getActiveFeeds = prepareStatement(`SELECT * FROM feeds WHERE active = 1`);

const logPublish = prepareStatement(`
  INSERT INTO publish_log (articles_count, commit_hash) VALUES (@count, @hash)
`);

const getStats = prepareStatement(`
  SELECT status, COUNT(*) as count FROM articles GROUP BY status
`);

const updateOgImage = prepareStatement(`
  UPDATE articles SET og_image = @og_image, og_scraped_at = datetime('now') WHERE id = @id
`);

const getArticlesForOgScrape = prepareStatement(`
  SELECT id, source_url, source_images FROM articles
  WHERE og_scraped_at IS NULL AND status IN ('pending', 'rewriting', 'rewritten', 'published')
  ORDER BY created_at ASC LIMIT ?
`);

// ─── Exports ───────────────────────────────────────────

export {
  db,
  insertArticle,
  getPending,
  getRewritten,
  updateRewritten,
  markFailed,
  markPublished,
  markRewriting,
  upsertFeed,
  updateFeedFetched,
  getActiveFeeds,
  logPublish,
  getStats,
  updateOgImage,
  getArticlesForOgScrape,
};

// CLI: reset database
if (process.argv.includes("--reset")) {
  db.run("DROP TABLE IF EXISTS articles");
  db.run("DROP TABLE IF EXISTS feeds");
  db.run("DROP TABLE IF EXISTS publish_log");
  save();
  console.log("[db] Database reset. Run the daemon to recreate tables.");
  process.exit(0);
}
