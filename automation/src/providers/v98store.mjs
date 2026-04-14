/**
 * providers/v98store.mjs — v98store third-party AI gateway adapter.
 *
 * v98store is an OpenAI-compatible gateway that provides access to 568+ models
 * (OpenAI, Anthropic, Google, DeepSeek, Qwen, xAI, etc.) via a single API key.
 *
 * Base URL: https://v98store.com/v1
 * Auth: Bearer YOUR_V98_API_KEY
 * Format: 100% OpenAI-compatible (chat/completions)
 *
 * Key advantage: One API key for ALL providers. Supports response_format: json_object.
 */

import { BaseProvider } from "./base.mjs";

export class V98StoreProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.baseUrl = config.baseUrl || "https://v98store.com/v1";
  }

  async rewrite(article, promptTemplate) {
    // Use OpenAI SDK pointed at v98store
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseUrl,
    });

    const userMessage = this.buildUserMessage(article);

    // Build request options
    const requestOptions = {
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      messages: [
        { role: "system", content: promptTemplate },
        { role: "user", content: userMessage },
      ],
    };

    // Enable JSON mode for models that support it
    // Most models on v98store support json_object via OpenAI compatibility
    const jsonCapable = ["gpt-", "claude-", "gemini-", "deepseek-", "qwen", "grok-", "glm-", "o3", "o4"];
    if (jsonCapable.some(prefix => this.model.startsWith(prefix))) {
      requestOptions.response_format = { type: "json_object" };
    }

    const response = await client.chat.completions.create(requestOptions);

    const text = response.choices[0]?.message?.content || "";
    const tokensUsed = response.usage?.total_tokens || 0;

    return { result: this.parseResponse(text), tokensUsed };
  }
}

/**
 * Recommended models for article rewriting (cost-quality balance):
 *
 * | Model                  | Input $/1M | Output $/1M | Best for           |
 * |------------------------|-----------|------------|---------------------|
 * | gpt-5-mini             | $0.25     | $2.00      | Ultra budget         |
 * | gpt-4o-mini            | $0.15     | $0.60      | Cheapest GPT         |
 * | gpt-4o                 | $2.50     | $10.00     | Best quality/price   |
 * | claude-haiku-4-5       | $1.00     | $5.00      | Claude budget        |
 * | claude-sonnet-4-6      | $3.00     | $15.00     | Claude premium       |
 * | gemini-2.5-flash       | $0.30     | $2.50      | Cheapest quality     |
 * | deepseek-chat          | $2.00     | $3.00      | Cheapest deep model  |
 * | grok-4-fast            | $0.20     | $0.50      | xAI ultra budget     |
 */
