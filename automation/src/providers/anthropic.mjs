/**
 * providers/anthropic.mjs — Anthropic Claude adapter.
 */

import { BaseProvider } from "./base.mjs";

export class AnthropicProvider extends BaseProvider {
  async rewrite(article, promptTemplate) {
    // Dynamic import so the dep is optional
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: this.apiKey });

    const userMessage = this.buildUserMessage(article);

    const response = await client.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      system: promptTemplate,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content[0]?.text || "";
    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    return { result: this.parseResponse(text), tokensUsed };
  }
}
