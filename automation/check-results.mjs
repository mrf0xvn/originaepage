import { db, getStats } from "./src/db.mjs";

console.log("=== DB Stats ===");
const stats = getStats.all();
stats.forEach(s => console.log(`  ${s.status}: ${s.count}`));

console.log("\n=== Published/Rewritten Articles ===");
const rows = db.exec("SELECT id, title, slug, status, ai_model, ai_tokens_used FROM articles WHERE status IN ('published','rewritten') ORDER BY id");
if (rows.length) {
  rows[0].values.forEach(r => {
    console.log(`  [${r[3]}] #${r[0]} "${r[1]}"`);
    console.log(`           slug: ${r[2]}`);
    console.log(`           model: ${r[4]}, tokens: ${r[5]}`);
  });
}

console.log("\n=== Pending Articles (first 5) ===");
const pending = db.exec("SELECT id, source_title, source_feed FROM articles WHERE status = 'pending' ORDER BY id LIMIT 5");
if (pending.length) {
  pending[0].values.forEach(r => {
    console.log(`  #${r[0]} "${r[1]}" (${r[2]})`);
  });
}
