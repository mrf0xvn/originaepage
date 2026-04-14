# 📖 Read Before Using — v98store API Documentation Index

> **Đây là file đầu tiên AI phải đọc trước khi làm bất cứ việc gì liên quan đến v98store API.**
>
> File này là **bản đồ tài liệu** — nói cho AI biết cần mở file nào cho từng loại công việc. KHÔNG chứa API reference chi tiết, chỉ routing.

---

## 🎯 v98store là gì?

**v98store** là **third-party API gateway** tương thích OpenAI format, cho phép truy cập nhiều provider AI (OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Alibaba Qwen, xAI Grok, Flux, Midjourney, Ideogram, v.v.) **qua 1 API key duy nhất**.

- **Base URL**: `https://v98store.com` (hoặc `https://v98store.com/v1` cho hầu hết endpoint OpenAI-compat)
- **Auth**: `Authorization: Bearer sk-your-v98-key-here`
- **Key insight**: Dùng được **OpenAI SDK bình thường**, chỉ cần đổi `base_url`

---

## 🗺️ Bản đồ tài liệu — Khi nào đọc file nào?

### 1. `v98-models-pricing.md` — **Bảng giá & danh sách 568 model**
> Toàn bộ model v98store hỗ trợ, phân loại theo chat/image/audio/video/embedding, kèm giá input/output hoặc per-request.

**Đọc khi**:
- Cần **chọn model phù hợp** cho task cụ thể (cân bằng giá/chất lượng)
- So sánh giá giữa các model
- Tìm model rẻ nhất cho 1 tác vụ cụ thể
- Cần model ID chính xác để viết code

**Có sẵn**:
- Bảng **Top 20 rẻ nhất** (chat)
- Bảng **Top 20 đắt nhất** (chat)
- Phân nhóm: 360 chat · 106 image · 70 video · 27 audio · 5 rerank

---

### 2. `v98-chatgpt.md` — **OpenAI-compat API reference**
> Endpoint `/v1/chat/completions`, `/v1/completions`, `/v1/embeddings`, `/v1/models`. Hỗ trợ GPT-*, DeepSeek, Qwen, và bất kỳ model nào gọi qua format OpenAI.

**Đọc khi**:
- Viết code gọi chat completion (GPT, DeepSeek, Qwen, hoặc dùng model khác qua format OpenAI)
- Cần syntax cho function calling, structured output, streaming
- Cần fields request body đầy đủ (`temperature`, `max_tokens`, `response_format`, `tools`, v.v.)
- Dùng reasoning models (`reasoning_effort`)
- Cần code example Python với OpenAI SDK

---

### 3. `v98-anthropic.md` — **Claude API reference (2 cách)**
> Claude dùng được qua **native** `/v1/messages` hoặc **OpenAI-compat** `/v1/chat/completions`. File chỉ rõ khi nào dùng cách nào.

**Đọc khi**:
- Gọi Claude (Sonnet, Opus, Haiku — các version 3.7, 4, 4.5, 4.6)
- Cần tool use / function calling format của Anthropic
- Dùng vision với base64 image
- Cần `system` prompt đúng format (Anthropic để ở field riêng, KHÔNG trong `messages`)
- Dùng web search tool, extended thinking, prompt caching
- Viết code dùng Anthropic SDK hoặc OpenAI SDK với Claude

---

### 4. `v98-gemini.md` — **Google Gemini reference**
> Gemini qua OpenAI-compat format. Hỗ trợ text, vision, reasoning effort, extended thinking config, image generation.

**Đọc khi**:
- Gọi `gemini-2.5-pro`, `gemini-2.5-flash-all`, `gemini-1.5-pro`, hoặc Gemini image gen
- Cần `extra_body.google.thinking_config` cho extended thinking
- Dùng vision với URL hoặc base64 image
- Cần `reasoning_effort` cho Gemini 2.5 Pro

---

### 5. `v98-image-models.md` — **Tất cả model sinh ảnh**
> Chia 4 nhóm endpoint: OpenAI-compat, Replicate async, Midjourney, Ideogram. Kèm curl examples và SDK usage.

**Đọc khi**:
- Cần generate hoặc edit ảnh
- Cần chọn giữa DALL-E 3, Flux, Grok, Qwen, Midjourney, Ideogram
- Dùng Replicate format (submit task → poll result)
- Dùng Midjourney actions (imagine, blend, describe, upscale)
- Dùng Ideogram v3 (generate, edit, remix, reframe)
- Cần biết URL ảnh trả về valid bao lâu (1h vs 24h)

**Có bảng quick reference**: "Use case → model nào → endpoint nào"

---

### 6. `v98-claude-code-setup.md` — **Setup Claude Code CLI**
> Hướng dẫn cài & cấu hình Claude Code (CLI của Anthropic) để chạy qua v98store thay vì Anthropic gốc.

**Đọc khi**:
- Cài Claude Code lần đầu trên máy mới
- Gặp lỗi "Invalid API Key · Please run /login" trong Claude Code
- Cần set `ANTHROPIC_BASE_URL` và `ANTHROPIC_AUTH_TOKEN` (Windows/Linux/macOS)
- Muốn dùng Claude Code rẻ hơn qua v98store

---

### 7. `v98-openclaw-setup.md` — **Setup OpenClaw/Clawdbot**
> Cấu hình OpenClaw để dùng **cả 3 provider** (OpenAI + Claude + Gemini) qua v98store với **1 API key**.

**Đọc khi**:
- Cài OpenClaw lần đầu
- Cần sửa `clawdbot.json` hoặc `auth-profiles.json`
- Muốn thêm model mới vào OpenClaw config
- Gặp lỗi "Unauthorized" hoặc "Model not found"
- So sánh Claude Code vs OpenClaw để chọn tool phù hợp

---

## ⚡ Quick Decision Tree

```
Cần làm gì?
│
├─ Mới bắt đầu / cần tổng quan
│   → Đọc hết chính file này là đủ
│
├─ Chọn model (cân bằng giá / chất lượng)
│   → v98-models-pricing.md
│
├─ Viết code chat completion
│   ├─ GPT / DeepSeek / Qwen     → v98-chatgpt.md
│   ├─ Claude (Sonnet/Opus/Haiku) → v98-anthropic.md
│   └─ Gemini                     → v98-gemini.md
│
├─ Viết code sinh / chỉnh ảnh
│   → v98-image-models.md
│
├─ Setup CLI tool cho bản thân
│   ├─ Claude Code (chỉ Claude, terminal)    → v98-claude-code-setup.md
│   └─ OpenClaw (3 provider, web UI)         → v98-openclaw-setup.md
│
└─ Migrate code cũ (OpenAI/DeepSeek) sang v98store
    → Phần "Context cho Tình Báo AI project" bên dưới
    + v98-models-pricing.md (để chọn model thay thế)
```

---

## 🔑 Điều AI cần NHỚ trước khi code

1. **OpenAI SDK dùng được cho hầu hết model** — chỉ cần đổi `base_url="https://v98store.com/v1"`
2. **Model ID phải chính xác** — check trong `v98-models-pricing.md` trước khi viết
3. **Claude có 2 format** — native `/v1/messages` hoặc compat `/v1/chat/completions`, quyết định dựa trên use case (xem `v98-anthropic.md`)
4. **Image endpoints có 4 nhóm** — không phải tất cả image model đều dùng `/v1/images/generations`
5. **URL ảnh trả về có expiry**:
   - Replicate/Flux → **1 giờ**
   - Ideogram → **24 giờ**
   - DALL-E 3 → vài giờ
   → **Luôn download về Supabase Storage ngay sau khi tạo**
6. **Upload file local phải < 4 MB** (`.png`)
7. **1 API key v98store duy nhất** dùng được cho tất cả provider — không cần quản lý nhiều key
8. **Streaming** kết thúc bằng `data: [DONE]` (giống OpenAI SSE format)

---

## 🛠️ Quick Start — Python OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-v98-key-here",
    base_url="https://v98store.com/v1"
)

# Chat — dùng bất kỳ model nào
response = client.chat.completions.create(
    model="gpt-4o",                      # hoặc claude-sonnet-4-6, gemini-2.5-pro, deepseek-v3-1-250821
    messages=[{"role": "user", "content": "Hello"}],
    max_tokens=1000
)

# Image generation
image = client.images.generate(
    model="flux-kontext-pro",            # hoặc dall-e-3, qwen-image-max, grok-3-image
    prompt="A cute cat",
    n=1,
    size="1024x1024"
)
```

---

## 📋 Context cho Tình Báo AI project

Project hiện đang dùng **DeepSeek API** (format content) và **OpenAI DALL-E 3** (thumbnails). Khi migrate sang v98store:

| Component cũ | Migrate sang v98store |
|---|---|
| `DEEPSEEK_API_KEY` + `deepseek-chat` | `V98_API_KEY` + model `deepseek-v3-1-250821` hoặc `claude-haiku-4-5` (rẻ hơn & chất lượng tốt hơn) |
| `OPENAI_API_KEY` + `dall-e-3` | `V98_API_KEY` + `dall-e-3` (cùng endpoint) hoặc `flux-kontext-pro` (rẻ hơn ~70%) |
| Base URL OpenAI gốc | `https://v98store.com/v1` |

Code Python trong `scripts/ingest.py`, `scripts/collect_tools_ph.py`, `scripts/guide_pipeline.py` chỉ cần:
1. Đổi 1 biến `base_url` trong `OpenAI()` client
2. Đổi tên model trong các chỗ `model="..."`
3. Các phần `client.chat.completions.create(...)` và `client.images.generate(...)` **không đổi**

---

## 📁 Danh sách file đầy đủ trong folder này

| File | Loại | Ghi chú |
|---|---|---|
| `Read before using.md` | Index | **File này** — đọc đầu tiên |
| `v98-models-pricing.md` | Reference | **568 model + giá** |
| `v98-chatgpt.md` | Reference | OpenAI-compat API |
| `v98-anthropic.md` | Reference | Claude API |
| `v98-gemini.md` | Reference | Gemini API |
| `v98-image-models.md` | Reference | Image models (4 nhóm) |
| `v98-claude-code-setup.md` | Setup | Claude Code CLI |
| `v98-openclaw-setup.md` | Setup | OpenClaw/Clawdbot |
| `full model` | Source (raw) | File gốc — giữ làm nguồn tham chiếu |
| `Claude code setup v98` | Source (raw) | File gốc setup Claude Code |
| `Openclaw v98 setup` | Source (raw) | File gốc setup OpenClaw |

**Quy tắc**: Các file **MD** (`v98-*.md`) là tài liệu AI dùng. Các file không có extension là **source gốc** từ v98store, chỉ tham chiếu khi cần verify lại.
