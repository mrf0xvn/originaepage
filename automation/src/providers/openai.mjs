/**
 * providers/openai.mjs — OpenAI GPT adapter.
 */

import { BaseProvider } from "./base.mjs";

export class OpenAIProvider extends BaseProvider {
  async rewrite(article, promptTemplate) {
    // Dynamic import so the dep is optional
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: this.apiKey });

    const userMessage = this.buildUserMessage(article);

    const response = await client.chat.completions.create({
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: promptTemplate },
        { role: "user", content: userMessage },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    const tokensUsed = response.usage?.total_tokens || 0;

    return { result: this.parseResponse(text), tokensUsed };
  }
}
