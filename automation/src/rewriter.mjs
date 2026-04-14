/**
 * rewriter.mjs — AI rewrite orchestrator.
 *
 * Picks pending articles from DB, sends them to the configured AI provider
 * for rewriting, and saves the structured output back to DB.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPending, updateRewritten, markFailed, markRewriting } from "./db.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = path.join(__dirname, "..", "config", "settings.json");
const PROMPT_DIR = path.join(__dirname, "..", "config", "prompts");

function loadSettings() {
  return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
}

function loadPrompt(language = "en") {
  const promptPath = path.join(PROMPT_DIR, `rewriter-${language}.md`);
  if (fs.existsSync(promptPath)) {
    return fs.readFileSync(promptPath, "utf8");
  }
  // Fallback to English
  return fs.readFileSync(path.join(PROMPT_DIR, "rewriter-en.md"), "utf8");
}

/** Create the correct AI provider based on settings */
async function createProvider(config) {
  const { provider, ...rest } = config;

  if (!rest.apiKey) {
    throw new Error(`AI API key not configured. Set ai.apiKey in config/settings.json`);
  }

  switch (provider) {
    case "v98store": {
      const { V98StoreProvider } = await import("./providers/v98store.mjs");
      return new V98StoreProvider(rest);
    }
    case "openai": {
      const { OpenAIProvider } = await import("./providers/openai.mjs");
      return new OpenAIProvider(rest);
    }
    case "anthropic": {
      const { AnthropicProvider } = await import("./providers/anthropic.mjs");
      return new AnthropicProvider(rest);
    }
    default:
      throw new Error(`Unknown AI provider: ${provider}. Supported: v98store, openai, anthropic`);
  }
}

/** Rewrite a single article */
async function rewriteArticle(provider, article, prompt) {
  markRewriting.run({ id: article.id });

  try {
    const { result, tokensUsed } = await provider.rewrite(article, prompt);

    updateRewritten.run({
      id: article.id,
      title: result.title,
      slug: result.slug,
      excerpt: result.excerpt,
      body_html: result.bodyHtml,
      seo_title: result.seoTitle,
      seo_description: result.seoDescription,
      key_takeaways: JSON.stringify(result.keyTakeaways),
      tags: JSON.stringify(result.tags),
      topic_slug: result.topicSlug,
      language: article.source_language || "en",
      ai_model: provider.model,
      ai_tokens_used: tokensUsed,
    });

    console.log(`  ✓ Rewritten: "${result.title}" (${tokensUsed} tokens)`);
    return true;
  } catch (err) {
    markFailed.run({ id: article.id, error: err.message });
    console.error(`  ✗ Failed [${article.id}]: ${err.message}`);
    return false;
  }
}

/** Main rewriter cycle */
export async function runRewriter() {
  const settings = loadSettings();
  const batchSize = settings.rewriter?.batchSize || 3;

  const pending = getPending.all(batchSize);
  if (pending.length === 0) {
    console.log("[rewriter] No pending articles.");
    return 0;
  }

  console.log(`[rewriter] Processing ${pending.length} article(s)...`);

  let provider;
  try {
    provider = await createProvider(settings.ai);
  } catch (err) {
    console.error(`[rewriter] ${err.message}`);
    return 0;
  }

  const prompt = loadPrompt(settings.site?.defaultLanguage || "en");
  let rewritten = 0;

  for (const article of pending) {
    const success = await rewriteArticle(provider, article, prompt);
    if (success) rewritten++;

    // Small delay between API calls to avoid rate limits
    if (pending.indexOf(article) < pending.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  console.log(`[rewriter] Done: ${rewritten}/${pending.length} rewritten.`);
  return rewritten;
}

// CLI: run once
if (process.argv.includes("--once")) {
  runRewriter().catch(console.error);
}
