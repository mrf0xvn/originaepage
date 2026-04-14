# v98store — Google Gemini API

> **Nguồn**: `v98 API document Gemini`
> **Base URL**: `https://v98store.com/v1`
> **Auth**: `Authorization: Bearer YOUR_API_KEY`

v98store cung cấp Gemini qua **OpenAI-compatible format** (không dùng Google SDK gốc), nên dùng được với OpenAI SDK bình thường.

## Endpoints

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/v1/chat/completions` | Chat completion (text, vision, streaming) |
| POST | `/v1/embeddings` | Text embeddings |

## Models Gemini khả dụng

| Model ID | Đặc điểm |
|---|---|
| `gemini-2.5-pro` | Flagship, hỗ trợ reasoning (`reasoning_effort`) |
| `gemini-2.5-flash-all` | Flash — nhanh, rẻ, hỗ trợ vision |
| `gemini-1.5-pro-latest` | Gemini 1.5 Pro latest |
| `gemini-2.0-flash-exp-image-generation` | Flash 2.0 — có thể sinh ảnh trong response |

## 1. Text chat — basic

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [
      {"role": "user", "content": "hello?"}
    ],
    "temperature": 0.1,
    "top_p": 1,
    "stream": true
  }'
```

## 2. Reasoning effort (Gemini 2.5 Pro)

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [
      {"role": "user", "content": "Solve: what is 123*456?"}
    ],
    "temperature": 0.1,
    "stream": true,
    "reasoning_effort": "low"
  }'
```

`reasoning_effort`: `low` / `medium` / `high`.

## 3. Extended thinking với thinking config

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [
      {"role": "user", "content": "Complex question..."}
    ],
    "temperature": 0.1,
    "stream": true,
    "extra_body": {
      "google": {
        "thinking_config": {
          "include_thoughts": true,
          "thinkingBudget": 1024
        }
      }
    }
  }'
```

`extra_body.google.thinking_config`:
- `include_thoughts` — có trả về thinking trace không
- `thinkingBudget` — giới hạn token cho thinking

## 4. Vision — image input qua URL

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash-all",
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "What is in this picture? Describe in detail."},
          {
            "type": "image_url",
            "image_url": {"url": "https://example.com/image.png"}
          }
        ]
      }
    ],
    "temperature": 0.5,
    "top_p": 1,
    "stream": true
  }'
```

## 5. Vision — image base64

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-1.5-pro-latest",
    "stream": false,
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "Describe this image"},
          {
            "type": "image_url",
            "image_url": {"url": "data:image/jpeg;base64,BASE64_STRING"}
          }
        ]
      }
    ]
  }'
```

## 6. Image generation (Gemini 2.0 Flash Exp)

Gemini 2.0 Flash Image Generation có thể sinh ảnh như một phần của response chat:

```bash
curl -X POST "https://v98store.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "max_tokens": 4096,
    "model": "gemini-2.0-flash-exp-image-generation",
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "Generate an image of a cat astronaut"}
        ]
      }
    ]
  }'
```

Response sẽ chứa ảnh trong format inline (base64 hoặc URL).

## 7. Embeddings

```bash
curl -X POST "https://v98store.com/v1/embeddings" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-large",
    "input": "Hello world"
  }'
```

> Lưu ý: embeddings endpoint là OpenAI-compatible, có thể không native Gemini embedding model — dùng model OpenAI qua cùng endpoint.

## Request body

Tương thích OpenAI format, cộng thêm:

| Field | Mô tả |
|---|---|
| `extra_body.google.thinking_config` | Config extended thinking của Gemini |
| `reasoning_effort` | `low`/`medium`/`high` cho Gemini 2.5 Pro |

## Response format

Giống OpenAI:

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gemini-2.5-pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help?"
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

## Python SDK usage

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_V98_API_KEY",
    base_url="https://v98store.com/v1"
)

# Text
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[{"role": "user", "content": "Hello"}],
    temperature=0.1
)

# Vision
response = client.chat.completions.create(
    model="gemini-2.5-flash-all",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is this?"},
                {"type": "image_url", "image_url": {"url": "https://example.com/img.jpg"}}
            ]
        }
    ]
)

# Extended thinking
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[{"role": "user", "content": "Solve..."}],
    extra_body={
        "google": {
            "thinking_config": {
                "include_thoughts": True,
                "thinkingBudget": 1024
            }
        }
    }
)
```

## Headers

| Header | Required | Example |
|---|---|---|
| `Content-Type` | ✅ | `application/json` |
| `Accept` | ✅ | `application/json` |
| `Authorization` | ✅ | `Bearer YOUR_API_KEY` |
