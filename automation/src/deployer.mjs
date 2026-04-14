/**
 * deployer.mjs — Git commit + push to trigger Vercel rebuild.
 *
 * Uses simple-git to stage, commit, and push content changes.
 * Vercel detects the push and auto-rebuilds the site.
 */

import { simpleGit } from "simple-git";

/**
 * Deploy content changes via git push.
 * @param {string} repoPath - Absolute path to the originaepage repo
 * @param {number} articleCount - Number of articles being published
 * @param {string} branch - Git branch to push to
 * @returns {Promise<string>} Commit hash
 */
export async function deploy(repoPath, articleCount, branch = "main") {
  const git = simpleGit(repoPath);

  // Safety: ensure we're on the right branch
  const status = await git.status();
  if (status.current !== branch) {
    await git.checkout(branch);
  }

  // Pull latest to avoid conflicts
  try {
    await git.pull("origin", branch, { "--rebase": "true" });
  } catch (err) {
    console.warn(`[deployer] Pull warning: ${err.message}`);
  }

  // Stage content files only
  await git.add([
    "content/automation-articles.json",
    "content/curatedInsightSlugs.json",
  ]);

  // Check if there are actual changes to commit
  const diff = await git.diff(["--cached", "--stat"]);
  if (!diff.trim()) {
    console.log("[deployer] No changes to commit.");
    return "no-changes";
  }

  // Commit
  const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const message = `chore(insights): auto-publish ${articleCount} article(s) [${timestamp}]`;
  const commitResult = await git.commit(message);
  const hash = commitResult.commit || "unknown";

  // Push
  await git.push("origin", branch);
  console.log(`[deployer] Pushed: ${hash}`);

  return hash;
}
