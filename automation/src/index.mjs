/**
 * index.mjs — Automation daemon entry point.
 *
 * Starts all cron jobs:
 *   - RSS Watcher: every 30 minutes
 *   - AI Rewriter: every 20 minutes
 *   - Publisher:   every 6 hours
 *
 * Usage:
 *   node src/index.mjs            → Start daemon with all crons
 *   node src/index.mjs --dry-run  → Run all components once, then exit
 */

import cron from "node-cron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runWatcher } from "./watcher.mjs";
import { runRewriter } from "./rewriter.mjs";
import { runPublisher } from "./publisher.mjs";
import { getStats } from "./db.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = path.join(__dirname, "..", "config", "settings.json");

function loadSettings() {
  return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
}

function printStats() {
  const stats = getStats.all();
  const counts = Object.fromEntries(stats.map((r) => [r.status, r.count]));
  console.log("[stats]", JSON.stringify(counts));
}

// ─── Wrap handlers with error boundaries ───────────────

async function safeWatcher() {
  try {
    await runWatcher();
    printStats();
  } catch (err) {
    console.error("[watcher:error]", err.message);
  }
}

async function safeRewriter() {
  try {
    await runRewriter();
    printStats();
  } catch (err) {
    console.error("[rewriter:error]", err.message);
  }
}

async function safePublisher() {
  try {
    await runPublisher();
    printStats();
  } catch (err) {
    console.error("[publisher:error]", err.message);
  }
}

// ─── Main ──────────────────────────────────────────────

const isDryRun = process.argv.includes("--dry-run");

if (isDryRun) {
  console.log("═══════════════════════════════════════════");
  console.log("  Originae Automation — DRY RUN");
  console.log("═══════════════════════════════════════════\n");

  await safeWatcher();
  console.log("");
  await safeRewriter();
  console.log("");
  await safePublisher();

  console.log("\n[dry-run] Complete. Exiting.");
  process.exit(0);
}

// ─── Start Daemon ──────────────────────────────────────

const settings = loadSettings();
const watcherInterval = settings.watcher?.intervalMinutes || 30;
const rewriterInterval = settings.rewriter?.intervalMinutes || 20;
const publisherInterval = settings.publisher?.intervalHours || 6;

console.log("═══════════════════════════════════════════");
console.log("  Originae Automation Daemon");
console.log("═══════════════════════════════════════════");
console.log(`  Watcher:   every ${watcherInterval} min`);
console.log(`  Rewriter:  every ${rewriterInterval} min`);
console.log(`  Publisher: every ${publisherInterval} hours`);
console.log(`  AI:        ${settings.ai?.provider || "not configured"} / ${settings.ai?.model || "n/a"}`);
console.log(`  API Key:   ${settings.ai?.apiKey ? "✓ configured" : "✗ NOT SET"}`);
console.log("═══════════════════════════════════════════\n");

// Run watcher immediately on startup
await safeWatcher();

// Schedule crons
cron.schedule(`*/${watcherInterval} * * * *`, safeWatcher, { name: "watcher" });
cron.schedule(`*/${rewriterInterval} * * * *`, safeRewriter, { name: "rewriter" });
cron.schedule(`0 */${publisherInterval} * * *`, safePublisher, { name: "publisher" });

console.log("[daemon] All crons scheduled. Running...\n");

// Keep process alive
process.on("SIGINT", () => {
  console.log("\n[daemon] Shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n[daemon] Terminated.");
  process.exit(0);
});
