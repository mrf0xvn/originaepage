# v98store — ChatGPT / OpenAI-compatible API

> **Nguồn**: `v98 API document ChatGPT` (third-party gateway tương thích OpenAI format)
> **Base URL**: `https://v98store.com/v1`
> **Auth**: `Authorization: Bearer YOUR_API_KEY`

v98store là gateway third-party cho phép gọi nhiều model AI (OpenAI, Anthropic, Gemini, DeepSeek, Qwen, Grok…) qua cùng 1 API key và endpoint tương thích OpenAI.

## Endpoints chính

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/v1/chat/completions` | Chat completion (streaming & non-streaming) |
| POST | `/v1/completions` | Legacy completions (text) |
| POST | `/v1/embeddings` | Text embeddings |
| GET | `/v1/models` | List tất cả model khả dụng |

## Models OpenAI sẵn có

| Model ID | Ghi chú |
|---|---|
| `gpt-5-mini` | GPT-5 mini |
| `gpt-4o` | GPT-4o chính |
| `gpt-4o-search-preview` | GPT-4o với web search |
| `gpt-4.1-2025-04-14` | GPT-4.1 snapshot |
| `o4-mini` | Reasoning model (hỗ trợ `reasoning_effort`) |
| `gpt-3.5-turbo` | Legacy |
| `gpt-3.5-turbo-instruct` | Legacy completion |
| `text-embedding-3-large` | Embeddings |

### Model từ các provider khác (qua cùng chat/completions)
- `qwen-mt-turbo` — Alibaba Qwen
- `deepseek-v3-1-250821` — DeepSeek V3

## 1. Chat completion — non-streaming

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "nihao"}
    ],
    "max_tokens": 1000
  }'
```

### Response
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello there, how may I assist you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
```

## 2. Chat completion — streaming

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-mini",
    "max_tokens": 1000,
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello"}
    ],
    "temperature": 1,
    "stream": true,
    "stream_options": {
      "include_usage": true
    }
  }'
```

Response là SSE stream kết thúc bằng `data: [DONE]`.

## 3. Function calling

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "stream": false,
    "messages": [
      {"role": "user", "content": "What is the weather in Beijing?"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_current_weather",
          "description": "Get the current weather in a given location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {"type": "string"},
              "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location"]
          }
        }
      }
    ]
  }'
```

## 4. Structured output (JSON schema)

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4.1-2025-04-14",
    "messages": [
      {"role": "system", "content": "Check guidelines compliance."},
      {"role": "user", "content": "How to prepare for interview?"}
    ],
    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "content_compliance",
        "schema": {
          "type": "object",
          "properties": {
            "is_violating": {"type": "boolean"},
            "category": {"type": "string"}
          }
        }
      }
    }
  }'
```

## 5. Reasoning model (o4-mini)

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "o4-mini",
    "max_tokens": 500,
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "temperature": 1,
    "stream": true,
    "reasoning_effort": "medium"
  }'
```

`reasoning_effort`: `low` / `medium` / `high`.

## 6. Embeddings

```bash
curl -X POST "https://v98store.com/v1/embeddings" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-large",
    "input": "Hello world"
  }'
```

## 7. List models

```bash
curl -X GET "https://v98store.com/v1/models" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## Request body fields (chat/completions)

| Field | Type | Mô tả |
|---|---|---|
| `model`* | string | Model ID (bắt buộc) |
| `messages`* | array | Danh sách messages `[{role, content}]` |
| `temperature` | number | 0-2, mặc định 1 |
| `top_p` | number | Nucleus sampling, không dùng chung với temperature |
| `n` | integer | Số lượng completion (mặc định 1) |
| `stream` | boolean | SSE streaming, mặc định false |
| `stop` | string/array | Tối đa 4 stop sequences |
| `max_tokens` | integer | Giới hạn token output |
| `presence_penalty` | number | -2 đến 2 |
| `frequency_penalty` | number | -2 đến 2 |
| `logit_bias` | object | Bias cho token cụ thể |
| `user` | string | End-user ID |
| `response_format` | object | `{"type": "json_object"}` hoặc `{"type": "json_schema", ...}` |
| `seed` | integer | Deterministic sampling (beta) |
| `tools` | array | Function calling definitions |
| `tool_choice` | string/object | `auto` / `none` / `{"type":"function","function":{"name":"..."}}` |
| `reasoning_effort` | string | `low`/`medium`/`high` (cho reasoning models) |
| `stream_options` | object | `{"include_usage": true}` |

## Python SDK usage

Dùng OpenAI SDK bình thường, chỉ cần đổi `base_url`:

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_V98_API_KEY",
    base_url="https://v98store.com/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
    max_tokens=500
)
print(response.choices[0].message.content)
```

## Headers

| Header | Required | Example |
|---|---|---|
| `Content-Type` | ✅ | `application/json` |
| `Accept` | ✅ | `application/json` |
| `Authorization` | ✅ | `Bearer YOUR_API_KEY` |
| `X-Forwarded-Host` | optional | `localhost:5173` |
