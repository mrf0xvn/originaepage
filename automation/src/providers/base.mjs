/**
 * providers/base.mjs — Abstract AI provider interface.
 *
 * All AI providers must extend this class and implement rewrite().
 */

export class BaseProvider {
  constructor(config) {
    this.model = config.model;
    this.apiKey = config.apiKey;
    this.maxTokens = config.maxTokens || 4000;
    this.temperature = config.temperature || 0.7;
  }

  /**
   * Rewrite an article using the AI model.
   * @param {object} article - Source article from DB
   * @param {string} promptTemplate - System prompt markdown
   * @returns {Promise<{result: object, tokensUsed: number}>}
   */
  async rewrite(article, promptTemplate) {
    throw new Error(`${this.constructor.name}.rewrite() not implemented`);
  }

  /** Build the user message from a source article */
  buildUserMessage(article) {
    return [
      `# Source Article`,
      ``,
      `**Title:** ${article.source_title}`,
      `**Source:** ${article.source_feed}`,
      `**Published:** ${article.source_published_at}`,
      `**Language:** ${article.source_language}`,
      ``,
      `## Content`,
      ``,
      article.source_content,
    ].join("\n");
  }

  /** Parse the JSON response from the AI model */
  parseResponse(text) {
    // Try to extract JSON from markdown code blocks or raw JSON
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) throw new Error("No JSON found in AI response");

    const parsed = JSON.parse(jsonMatch[1].trim());

    // Validate required fields
    const required = ["title", "slug", "excerpt", "bodyHtml", "keyTakeaways", "tags", "topicSlug"];
    const missing = required.filter((f) => !parsed[f]);
    if (missing.length > 0) {
      throw new Error(`AI response missing fields: ${missing.join(", ")}`);
    }

    // Normalize slug
    parsed.slug = parsed.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Ensure seoTitle/seoDescription
    parsed.seoTitle = parsed.seoTitle || `${parsed.title} | Originae Insights`;
    parsed.seoDescription = parsed.seoDescription || parsed.excerpt;

    return parsed;
  }
}
