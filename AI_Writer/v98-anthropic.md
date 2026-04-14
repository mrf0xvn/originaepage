# v98store — Anthropic / Claude API

> **Nguồn**: `v98 API document Anthoropic`
> **Base URL**: `https://v98store.com`
> **Auth**: `Authorization: Bearer YOUR_API_KEY`

v98store hỗ trợ Claude qua **2 cách**:
1. **Native Anthropic format** — endpoint `/v1/messages`
2. **OpenAI-compat format** — endpoint `/v1/chat/completions` (cùng model ID)

Cả 2 đều dùng cùng API key.

## Models Claude khả dụng

| Model ID | Tên gọi |
|---|---|
| `claude-sonnet-4-6` | Claude Sonnet 4.6 |
| `claude-sonnet-4-5-20250929` | Claude Sonnet 4.5 (snapshot) |
| `claude-haiku-4-5-20251001` | Claude Haiku 4.5 |
| `claude-sonnet-4-20250514` | Claude Sonnet 4 |
| `claude-3-7-sonnet-20250219` | Claude 3.7 Sonnet |

## Cách 1: Native Anthropic `/v1/messages`

### Basic message

```bash
curl -X POST "https://v98store.com/v1/messages" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

### Với system prompt + streaming

```bash
curl -X POST "https://v98store.com/v1/messages" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1024,
    "system": "You are an intelligent AI assistant called Xiao Wang",
    "messages": [
      {"role": "user", "content": "Who are you?"}
    ],
    "stream": true
  }'
```

> Lưu ý: Trong Anthropic native format, `system` là **field riêng** ở top level, KHÔNG nằm trong `messages`.

### Tool use (function calling)

```bash
curl -X POST "https://v98store.com/v1/messages" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1024,
    "tools": [
      {
        "name": "get_weather",
        "description": "Get weather for a location",
        "input_schema": {
          "type": "object",
          "properties": {
            "location": {"type": "string"}
          },
          "required": ["location"]
        }
      }
    ],
    "messages": [
      {"role": "user", "content": "Weather in Hanoi?"}
    ]
  }'
```

### Web search tool (structured outputs beta)

```bash
curl -X POST "https://v98store.com/v1/messages" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "anthropic-beta: structured-outputs-2025-11-13" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "What is the weather in NYC?"}
    ],
    "tools": [
      {
        "type": "web_search_20260209",
        "name": "web_search"
      }
    ]
  }'
```

### Vision (image input)

```bash
curl -X POST "https://v98store.com/v1/messages" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-haiku-4-5-20251001",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "image",
            "source": {
              "type": "base64",
              "media_type": "image/jpeg",
              "data": "BASE64_STRING"
            }
          },
          {"type": "text", "text": "What is in this image?"}
        ]
      }
    ]
  }'
```

## Cách 2: OpenAI-compat `/v1/chat/completions`

Dùng cùng model Claude nhưng format OpenAI:

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "messages": [
      {"role": "system", "content": "You are helpful."},
      {"role": "user", "content": "Hello"}
    ],
    "max_tokens": 1000
  }'
```

> Ưu điểm: dùng được với OpenAI SDK không cần thay đổi format.

## Anthropic Native response format

```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5-20250929",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I help you today?"
    }
  ],
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 10,
    "output_tokens": 25
  }
}
```

## Request body (Native `/v1/messages`)

| Field | Type | Mô tả |
|---|---|---|
| `model`* | string | Claude model ID |
| `messages`* | array | `[{role, content}]`, content có thể là string hoặc array blocks |
| `max_tokens`* | integer | Giới hạn output token (BẮT BUỘC, khác OpenAI) |
| `system` | string | System prompt (field riêng, KHÔNG trong messages) |
| `temperature` | number | 0-1 |
| `top_p` | number | Nucleus sampling |
| `top_k` | integer | Top-K sampling |
| `stream` | boolean | SSE streaming |
| `stop_sequences` | array | Danh sách stop strings |
| `tools` | array | Tool definitions |
| `tool_choice` | object | `{"type": "auto"}` / `{"type": "any"}` / `{"type": "tool", "name": "..."}` |
| `metadata` | object | `{"user_id": "..."}` |

## Headers

| Header | Required | Example |
|---|---|---|
| `Content-Type` | ✅ | `application/json` |
| `Accept` | ✅ | `application/json` |
| `Authorization` | ✅ | `Bearer YOUR_API_KEY` |
| `anthropic-beta` | optional | `structured-outputs-2025-11-13` (beta features) |

## Python SDK usage

### Dùng Anthropic SDK native
```python
from anthropic import Anthropic

client = Anthropic(
    api_key="YOUR_V98_API_KEY",
    base_url="https://v98store.com"
)

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    system="You are helpful.",
    messages=[{"role": "user", "content": "Hello"}]
)
print(message.content[0].text)
```

### Hoặc dùng OpenAI SDK với Claude model
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_V98_API_KEY",
    base_url="https://v98store.com/v1"
)

response = client.chat.completions.create(
    model="claude-sonnet-4-5-20250929",
    messages=[{"role": "user", "content": "Hello"}],
    max_tokens=1024
)
print(response.choices[0].message.content)
```

## Khi nào dùng cách nào?

| Use case | Khuyến nghị |
|---|---|
| Migrate từ code OpenAI có sẵn | **OpenAI-compat** `/v1/chat/completions` |
| Tool use / function calling nâng cao | **Native** `/v1/messages` (tool format khác) |
| Vision với base64 image | **Native** (format chặt chẽ hơn) |
| Streaming đơn giản | Cả 2 đều OK |
| Extended thinking / prompt caching | **Native** (hỗ trợ đầy đủ feature Anthropic) |
