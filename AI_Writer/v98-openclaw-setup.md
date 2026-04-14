# OpenClaw / Clawdbot + v98store — Hướng dẫn Setup

> **Nguồn**: `Openclaw v98 setup`
> **Mục tiêu**: Cấu hình OpenClaw (Clawdbot) để dùng v98store proxy → chạy **nhiều provider** (OpenAI + Claude + Gemini) qua cùng 1 gateway với 1 API key.

## 1. OpenClaw là gì?

OpenClaw (Clawdbot) là tool AI agent framework hỗ trợ **custom proxy endpoints**. Khác với Claude Code (chỉ dùng Anthropic), OpenClaw có thể đồng thời truy cập:
- OpenAI GPT
- Anthropic Claude
- Google Gemini

Tất cả qua 1 API key v98store duy nhất. Interface chạy trên `http://127.0.0.1:18789/`.

## 2. Cài đặt

### Bước 1: Install OpenClaw
```bash
openclaw
```

### Bước 2: Initialize Clawdbot
```bash
clawdbot
```

Sau khi chạy 2 lệnh trên, OpenClaw sẽ tạo folder config ở:
```
C:\Users\<YourUser>\.clawdbot\
```

## 3. Cấu hình v98store proxy

### Bước 3: Sửa `clawdbot.json`

Mở file:
```
C:\Users\<YourUser>\.clawdbot\clawdbot.json
```

Thay nội dung bằng:

```json
{
  "agents": {
    "defaults": {
      "workspace": "C:\\Users\\Administrator\\clawd",
      "models": {
        "api-proxy-gpt/gpt-4o": { "alias": "GPT-4o" },
        "api-proxy-claude/claude-sonnet-4-5-20250929": { "alias": "Claude Sonnet 4.5" },
        "api-proxy-google/gemini-3-pro-preview": { "alias": "Gemini 3 Pro" }
      },
      "model": {
        "primary": "api-proxy-claude/claude-sonnet-4-5-20250929"
      }
    }
  },
  "auth": {
    "profiles": {
      "api-proxy-gpt:default": {
        "provider": "api-proxy-gpt",
        "mode": "api_key"
      },
      "api-proxy-claude:default": {
        "provider": "api-proxy-claude",
        "mode": "api_key"
      },
      "api-proxy-google:default": {
        "provider": "api-proxy-google",
        "mode": "api_key"
      }
    }
  },
  "models": {
    "mode": "merge",
    "providers": {
      "api-proxy-gpt": {
        "baseUrl": "https://v98store.com/v1",
        "api": "openai-completions",
        "models": [
          {
            "id": "gpt-4o",
            "name": "GPT-4o",
            "contextWindow": 128000,
            "maxTokens": 8192
          }
        ]
      },
      "api-proxy-claude": {
        "baseUrl": "https://v98store.com",
        "api": "anthropic-messages",
        "models": [
          {
            "id": "claude-sonnet-4-5-20250929",
            "name": "Claude Sonnet 4.5",
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      },
      "api-proxy-google": {
        "baseUrl": "https://v98store.com",
        "api": "google-generative-ai",
        "models": [
          {
            "id": "gemini-3-pro-preview",
            "name": "Gemini 3 Pro",
            "contextWindow": 2000000,
            "maxTokens": 8192
          }
        ]
      }
    }
  }
}
```

### ⚠️ Chú ý về `baseUrl` cho từng provider

| Provider | baseUrl | API type |
|---|---|---|
| OpenAI | `https://v98store.com/v1` | `openai-completions` |
| Anthropic | `https://v98store.com` | `anthropic-messages` |
| Google | `https://v98store.com` | `google-generative-ai` |

OpenAI cần có `/v1` trong base URL, 2 provider còn lại thì **không có** `/v1`.

### `workspace` path
`"workspace": "C:\\Users\\Administrator\\clawd"` — đổi thành path Long muốn làm việc. Dùng `\\` (escape) trong JSON.

### Bước 4: Cấu hình API key

Mở file:
```
C:\Users\<YourUser>\.clawdbot\agents\main\agent\auth-profiles.json
```

Dán API key v98store vào cả 3 profile:

```json
{
  "version": 1,
  "profiles": {
    "api-proxy-gpt:default": {
      "type": "api_key",
      "provider": "api-proxy-gpt",
      "key": "sk-your-v98-key-here"
    },
    "api-proxy-claude:default": {
      "type": "api_key",
      "provider": "api-proxy-claude",
      "key": "sk-your-v98-key-here"
    },
    "api-proxy-google:default": {
      "type": "api_key",
      "provider": "api-proxy-google",
      "key": "sk-your-v98-key-here"
    }
  },
  "lastGood": {
    "api-proxy-gpt": "api-proxy-gpt:default",
    "api-proxy-claude": "api-proxy-claude:default",
    "api-proxy-google": "api-proxy-google:default"
  }
}
```

> **Lưu ý**: Cùng 1 key v98store dùng được cho cả 3 provider vì v98store là gateway unified.

## 4. Chạy OpenClaw

### Bước 5: Start
```bash
clawdbot
```

Mở trình duyệt truy cập:
```
http://127.0.0.1:18789/
```

Hoặc chạy onboarding wizard:
```bash
clawdbot onboarding
```

## 5. Thêm model khác vào config

Có thể thêm nhiều model vào mảng `models` của từng provider. Ví dụ thêm Claude Opus 4.6 và GPT-5.4:

```json
"api-proxy-gpt": {
  "baseUrl": "https://v98store.com/v1",
  "api": "openai-completions",
  "models": [
    { "id": "gpt-4o", "name": "GPT-4o", "contextWindow": 128000, "maxTokens": 8192 },
    { "id": "gpt-5.4", "name": "GPT-5.4", "contextWindow": 128000, "maxTokens": 8192 },
    { "id": "gpt-5.4-mini", "name": "GPT-5.4 Mini", "contextWindow": 128000, "maxTokens": 8192 },
    { "id": "o4-mini", "name": "O4 Mini", "contextWindow": 128000, "maxTokens": 16384 }
  ]
},
"api-proxy-claude": {
  "baseUrl": "https://v98store.com",
  "api": "anthropic-messages",
  "models": [
    { "id": "claude-sonnet-4-6", "name": "Claude Sonnet 4.6", "contextWindow": 200000, "maxTokens": 8192 },
    { "id": "claude-opus-4-6", "name": "Claude Opus 4.6", "contextWindow": 200000, "maxTokens": 8192 },
    { "id": "claude-haiku-4-5-20251001", "name": "Claude Haiku 4.5", "contextWindow": 200000, "maxTokens": 8192 }
  ]
},
"api-proxy-google": {
  "baseUrl": "https://v98store.com",
  "api": "google-generative-ai",
  "models": [
    { "id": "gemini-2.5-pro", "name": "Gemini 2.5 Pro", "contextWindow": 2000000, "maxTokens": 8192 },
    { "id": "gemini-2.5-flash-all", "name": "Gemini 2.5 Flash", "contextWindow": 1000000, "maxTokens": 8192 }
  ]
}
```

Xem đầy đủ model ID trong `v98-models-pricing.md`.

## 6. Đặt model primary

`"primary"` là model mặc định Clawdbot dùng khi Long không chọn cụ thể. Đổi trong `clawdbot.json`:

```json
"model": {
  "primary": "api-proxy-claude/claude-sonnet-4-6"
}
```

Format: `<provider-name>/<model-id>`

## 7. Troubleshooting

### ❌ "Unauthorized" khi gọi API

- Check `auth-profiles.json` key có đúng format `sk-...` không
- Check key đã activate chưa ở dashboard v98store
- Check JSON syntax valid (không thiếu dấu phẩy, ngoặc)

### ❌ "Model not found"

- Model ID phải đúng chính xác như trong `v98-models-pricing.md`
- Model phải được khai báo trong mảng `models` của đúng provider
- Format dùng trong `primary`: `api-proxy-claude/claude-sonnet-4-6` (không phải `claude-sonnet-4-6` một mình)

### ❌ "Connection refused" tới 127.0.0.1:18789

- Port đang bị process khác chiếm
- Check với `netstat -ano | findstr 18789` trên Windows
- Kill process cũ hoặc dùng port khác trong config

### ❌ JSON parse error

- Dùng JSON validator online (jsonlint.com) để check syntax
- Chú ý escape backslash trong path: `"C:\\Users\\..."` chứ không phải `"C:\Users\..."`
- Dùng dấu phẩy đúng chỗ — JSON không cho phép trailing comma

## 8. So sánh với Claude Code

| Feature | Claude Code | OpenClaw |
|---|---|---|
| Provider hỗ trợ | Chỉ Claude | **Claude + OpenAI + Gemini** |
| Interface | Terminal CLI | Web UI `localhost:18789` |
| Config | Environment vars | JSON files |
| Phù hợp với | Coding daily, git workflow | Multi-model experimentation, agent framework |
| Setup đơn giản hơn | ✅ | ❌ (nhiều file config) |

**Khuyến nghị**:
- **Long muốn 1 tool đơn giản để code hàng ngày** → Claude Code
- **Long muốn thử nhiều model + cần UI** → OpenClaw
- **Cả 2 đều dùng cùng 1 v98store API key** → có thể dùng song song

## Tham khảo liên quan

- [`Read before using.md`](./Read%20before%20using.md) — Index tổng quan
- [`v98-models-pricing.md`](./v98-models-pricing.md) — Bảng giá toàn bộ model
- [`v98-claude-code-setup.md`](./v98-claude-code-setup.md) — Setup Claude Code
