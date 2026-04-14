# v98store — Image Generation / Editing Models

> **Nguồn**: `image model`
> **Base URL**: `https://v98store.com`
> **Auth**: `Authorization: Bearer YOUR_API_KEY`

v98store hỗ trợ **nhiều provider ảnh** qua nhiều endpoint khác nhau. Có 4 nhóm chính:

1. **OpenAI-compat** — `/v1/images/generations` và `/v1/images/edits` (đơn giản nhất, dùng được với OpenAI SDK)
2. **Replicate** — `/replicate/v1/models/.../predictions` (async — submit + poll task)
3. **Midjourney** — `/mj/submit/...` + `/mj/task/.../fetch`
4. **Ideogram** — `/ideogram/v1/ideogram-v3/...` và `/ideogram/...`

⚠️ **Giới hạn upload**: nếu upload ảnh local, file `.png` phải **< 4 MB**.

---

## 1. OpenAI-compatible (`/v1/images/generations`)

Cách đơn giản nhất — dùng được với OpenAI SDK.

### Models khả dụng trên endpoint này

| Model | Ghi chú |
|---|---|
| `dall-e-3` | OpenAI DALL-E 3 |
| `flux-kontext-pro` | Flux Kontext Pro |
| `flux-kontext-max` | Flux Kontext Max |
| `grok-3-image` | xAI Grok image |
| `qwen-image-max` | Alibaba Qwen Image |
| `z-image-turbo` | Z Image Turbo |
| `gpt-image-1` | OpenAI image v1 |

### Request fields

| Field | Type | Mô tả |
|---|---|---|
| `model` | string | Model ID |
| `prompt`* | string | Text mô tả ảnh (tối đa 1000 ký tự với dall-e-3, 32000 với gpt-image-1) |
| `n` | integer | Số lượng ảnh (1-10) |
| `size` | string | `256x256` / `512x512` / `1024x1024` / custom (ví dụ `1328x1328`) |
| `quality` | string | `hd` (chỉ dall-e-3), `high`/`medium`/`low` (gpt-image-1) |
| `response_format` | string | `url` (default) / `b64_json` |
| `style` | string | `vivid` / `natural` (dall-e-3) |
| `aspect_ratio` | string | `21:9`, `16:9`, `4:3`, `3:2`, `1:1`, `2:3`, `3:4`, `9:16`, `9:21` |
| `watermark` | boolean | (qwen, z-image) |
| `prompt_extend` | boolean | Auto-enhance prompt (qwen, z-image) |

### Example: DALL-E 3

```bash
curl -X POST "https://v98store.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "dall-e-3",
    "prompt": "A cute baby sea otter",
    "n": 1,
    "size": "1024x1024"
  }'
```

### Example: Flux Kontext Pro

```bash
curl -X POST "https://v98store.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "flux-kontext-pro",
    "prompt": "a beautiful landscape with a river and mountains",
    "n": 1,
    "aspect_ratio": "16:9"
  }'
```

### Example: Grok 3 Image

```bash
curl -X POST "https://v98store.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-3-image",
    "prompt": "a cat",
    "size": "960x960"
  }'
```

### Example: Qwen Image Max

```bash
curl -X POST "https://v98store.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-image-max",
    "prompt": "A cute orange cat on a windowsill with cityscape background",
    "size": "1328x1328",
    "n": 1,
    "watermark": false,
    "prompt_extend": true
  }'
```

### Example: Z Image Turbo

```bash
curl -X POST "https://v98store.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "z-image-turbo",
    "prompt": "An elegant couplet in a Chinese hall",
    "size": "1280x720",
    "n": 1,
    "watermark": false,
    "prompt_extend": true
  }'
```

### Response

```json
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://...",
      "revised_prompt": "..."
    }
  ]
}
```

---

## 2. Image edit (`/v1/images/edits`)

### Models khả dụng
- `gpt-image-1`, `gpt-image-1-all`
- `flux-kontext-pro`, `flux-kontext-max`
- `grok-3-image`
- `qwen-image-edit-2509`

### Fields

| Field | Mô tả |
|---|---|
| `image`* | File upload (multipart) — png/webp/jpg < 25MB (gpt-image-1) hoặc < 4MB (dall-e-2) |
| `prompt`* | Mô tả chỉnh sửa |
| `mask` | PNG mask với alpha (< 4MB, cùng size với image) |
| `model` | Model ID |
| `n` | Số lượng (1-10) |
| `quality` | `high`/`medium`/`low`/`auto` |
| `response_format` | `url` / `b64_json` |
| `aspect_ratio` | Enum như generations |
| `background` | `transparent` / `opaque` / `auto` |
| `moderation` | `low` / `auto` |

### Example: Flux Kontext Max edit

```bash
curl -X POST "https://v98store.com/v1/images/edits" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "(file upload)",
    "prompt": "Change into red clothes",
    "model": "flux-kontext-max",
    "n": "1",
    "response_format": "b64_json",
    "aspect_ratio": "16:9",
    "background": "transparent",
    "moderation": "low"
  }'
```

### Example: Qwen Image Edit (URL input)

```bash
curl -X POST "https://v98store.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-image-edit-2509",
    "prompt": "Put a duck on top of the shirt",
    "image": "https://example.com/image.webp"
  }'
```

---

## 3. Replicate format (async)

Dùng cho các model Replicate như `flux-schnell`, `flux-kontext-dev`. Cần **submit task → poll kết quả**.

### Submit task — path mode

```bash
curl -X POST "https://v98store.com/replicate/v1/models/black-forest-labs/flux-schnell/predictions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "prompt": "Japanese anime style portrait",
      "go_fast": true,
      "megapixels": "1",
      "num_outputs": 1,
      "aspect_ratio": "1:1",
      "output_format": "jpg",
      "output_quality": 80,
      "num_inference_steps": 4
    }
  }'
```

Response:
```json
{
  "id": "qpt5jq1fssrmc0cmd5hvy31mdg",
  "model": "black-forest-labs/flux-schnell",
  "status": "starting",
  "output": null,
  "urls": {
    "get": "https://api.replicate.com/v1/predictions/qpt5jq1fssrmc0cmd5hvy31mdg"
  }
}
```

### Submit task — version mode (custom LoRA)

```bash
curl -X POST "https://v98store.com/replicate/v1/predictions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "2a6b576af31790b470f0a8442e1e9791213fa13799cbb65a9fc1436e96389574",
    "input": {
      "prompt": "...",
      "hf_lora": "alvdansen/frosting_lane_flux",
      "lora_scale": 0.8,
      "num_outputs": 1,
      "aspect_ratio": "1:1",
      "output_format": "webp"
    }
  }'
```

### Poll task progress

```bash
curl -X GET "https://v98store.com/replicate/v1/predictions/{task_id}" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Response khi xong:
```json
{
  "id": "...",
  "status": "succeeded",
  "output": ["https://example.com/images/result.jpg"],
  "metrics": {"predict_time": 0.56}
}
```

⚠️ **Resource URL trả về chỉ valid trong 1 giờ**.

### Submit Flux Kontext Dev (edit)

```bash
curl -X POST "https://v98store.com/replicate/v1/models/black-forest-labs/flux-kontext-dev/predictions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "prompt": "Change the car color to red, turn the headlights on",
      "input_image": "https://example.com/car.jpg",
      "aspect_ratio": "match_input_image",
      "output_format": "jpg",
      "num_inference_steps": 30
    }
  }'
```

### Status values
- `starting` → `processing` → `succeeded` / `failed`

---

## 4. Midjourney (`/mj/...`)

Midjourney cũng là async: submit task → poll status.

### Models
- `botType: "MID_JOURNEY"` (default)
- `botType: "NIJI_JOURNEY"`

### 4.1 Submit imagine task

```bash
curl -X POST "https://v98store.com/mj/submit/imagine" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "botType": "MID_JOURNEY",
    "prompt": "cat",
    "base64Array": [],
    "notifyHook": "",
    "state": ""
  }'
```

### 4.2 Fetch task by ID

```bash
curl -X GET "https://v98store.com/mj/task/{task_id}/fetch" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 4.3 Query multiple tasks

```bash
curl -X POST "https://v98store.com/mj/task/list-by-condition" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "ids": ["1743326750223591"]
  }'
```

### 4.4 Action (upscale, variation, etc.)

```bash
curl -X POST "https://v98store.com/mj/submit/action" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "chooseSameChannel": true,
    "customId": "MJ::JOB::upsample::2::3dbbd469-36af-4a0f-8f02-df6c579e7011",
    "taskId": "14001934816969359"
  }'
```

### 4.5 Blend (mix images)

```bash
curl -X POST "https://v98store.com/mj/submit/blend" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "botType": "MID_JOURNEY",
    "base64Array": [
      "data:image/png;base64,xxx1",
      "data:image/png;base64,xxx2"
    ],
    "dimensions": "SQUARE"
  }'
```

`dimensions`: `PORTRAIT` (2:3) / `SQUARE` (1:1) / `LANDSCAPE` (3:2)

### 4.6 Describe (image → prompt)

```bash
curl -X POST "https://v98store.com/mj/submit/describe" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "botType": "MID_JOURNEY",
    "base64": "data:image/png;base64,..."
  }'
```

### 4.7 Get image seed

```bash
curl -X GET "https://v98store.com/mj/task/{task_id}/image-seed" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 4.8 Submit modal (inpaint/outpaint)

```bash
curl -X POST "https://v98store.com/mj/submit/modal" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "maskBase64": "base64...",
    "prompt": "new content",
    "taskId": "14001934816969359"
  }'
```

---

## 5. Ideogram (`/ideogram/...`)

Dùng Ideogram 3.0 cho text-in-image tốt. URL trả về valid **24 giờ**.

### 5.1 Generate 3.0 (sync)

```bash
curl -X POST "https://v98store.com/ideogram/v1/ideogram-v3/generate" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "a voluptate reprehenderit",
    "seed": 511526458,
    "rendering_speed": "DEFAULT",
    "aspect_ratio": "1x1",
    "magic_prompt": "AUTO"
  }'
```

### Fields

| Field | Mô tả |
|---|---|
| `prompt`* | Text mô tả |
| `seed` | Random seed (lặp lại kết quả) |
| `resolution` | Resolution enum (không dùng chung với `aspect_ratio`) |
| `aspect_ratio` | Default `1x1` |
| `rendering_speed` | `DEFAULT` / `TURBO` / `QUALITY` |
| `magic_prompt` | `AUTO` / `ON` / `OFF` |
| `negative_prompt` | Mô tả exclude |

### 5.2 Edit 3.0

```bash
POST https://v98store.com/ideogram/v1/ideogram-v3/edit
```

### 5.3 Remix 3.0

```bash
POST https://v98store.com/ideogram/v1/ideogram-v3/remix
```

### 5.4 Reframe

```bash
POST https://v98store.com/ideogram/v1/ideogram-v3/reframe
```

### 5.5 Replace background

```bash
POST https://v98store.com/ideogram/v1/ideogram-v3/replace-background
```

### 5.6 Ideogram v1/v2 (multipart/form-data)

```bash
curl -X POST "https://v98store.com/ideogram/generate" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "image_request": {
      "aspect_ratio": "ASPECT_10_16",
      "magic_prompt_option": "AUTO",
      "model": "V_1",
      "prompt": "..."
    }
  }'
```

Các endpoint v1/v2: `/ideogram/generate`, `/ideogram/remix`, `/ideogram/upscale`, `/ideogram/describe` — đều dùng `multipart/form-data` khi upload file.

---

## Python SDK usage (OpenAI-compat)

Cách đơn giản nhất — dùng OpenAI SDK cho 2 endpoint `/v1/images/generations` và `/v1/images/edits`:

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_V98_API_KEY",
    base_url="https://v98store.com/v1"
)

# DALL-E 3
response = client.images.generate(
    model="dall-e-3",
    prompt="A cute sea otter",
    n=1,
    size="1024x1024"
)
print(response.data[0].url)

# Flux Kontext Pro
response = client.images.generate(
    model="flux-kontext-pro",
    prompt="beautiful landscape",
    n=1,
    extra_body={"aspect_ratio": "16:9"}
)
```

Với Replicate / Midjourney / Ideogram → phải dùng `requests` trực tiếp (SDK không hỗ trợ format async của Replicate).

## Quick reference: chọn model nào?

| Use case | Model khuyến nghị | Endpoint |
|---|---|---|
| Ảnh chất lượng cao tổng quát | `dall-e-3`, `flux-kontext-max` | `/v1/images/generations` |
| Ảnh giá rẻ, nhanh | `flux-schnell`, `z-image-turbo` | Replicate / OpenAI-compat |
| Text in image tốt nhất | Ideogram 3.0 | `/ideogram/v1/ideogram-v3/generate` |
| Edit ảnh có sẵn | `flux-kontext-max`, `qwen-image-edit-2509` | `/v1/images/edits` |
| Phong cách nghệ thuật | Midjourney | `/mj/submit/imagine` |
| Custom LoRA | Replicate version mode | `/replicate/v1/predictions` |
| Thumbnail bài viết (thay DALL-E 3 hiện tại) | `flux-kontext-pro`, `qwen-image-max` | `/v1/images/generations` |

## Headers (chung)

| Header | Required | Example |
|---|---|---|
| `Content-Type` | ✅ | `application/json` (hoặc `multipart/form-data` khi upload file) |
| `Accept` | ✅ | `application/json` |
| `Authorization` | ✅ | `Bearer YOUR_API_KEY` |
