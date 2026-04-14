# Claude Code + v98store — Hướng dẫn Setup

> **Nguồn**: `Claude code setup v98`
> **Mục tiêu**: Dùng Claude Code CLI (tool lập trình AI terminal của Anthropic) với API key v98store thay vì trực tiếp Anthropic → rẻ hơn nhiều và dùng được nhiều model khác.

## 1. Claude Code là gì?

Claude Code là **CLI tool** của Anthropic cho phép AI agent:
- Đọc/viết file trong codebase
- Chạy lệnh terminal
- Quản lý Git workflow tự động
- Hoạt động trong terminal như một pair programmer

## 2. System requirements

| Yêu cầu | Chi tiết |
|---|---|
| OS | macOS 10.15+, Ubuntu 20.04+, Debian 10+, hoặc Windows (WSL/PowerShell) |
| Node.js | 18.0+ (nếu cài qua npm) |
| Mạng | Stable internet |

## 3. Cài đặt Claude Code

### Cách A: One-liner (khuyến nghị — không cần quản lý Node.js)

**macOS / Linux / WSL:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell (chạy với quyền Administrator):**
```powershell
irm https://claude.ai/install.ps1 | iex
```

### Cách B: NPM (nếu đã có Node.js 18+)
```bash
npm install -g @anthropic-ai/claude-code
```

### Verify
```bash
claude --version
```

## 4. Cấu hình v98store proxy (BƯỚC QUAN TRỌNG)

Claude Code mặc định gọi thẳng Anthropic API. Để dùng qua v98store, phải set **2 biến môi trường**:

| Biến | Giá trị |
|---|---|
| `ANTHROPIC_BASE_URL` | `https://v98store.com` |
| `ANTHROPIC_AUTH_TOKEN` | `sk-your-v98-key-here` |

### 4.1 Unix (macOS / Linux / WSL)

Thêm vào `~/.zshrc` hoặc `~/.bashrc`:

```bash
export ANTHROPIC_BASE_URL="https://v98store.com"
export ANTHROPIC_AUTH_TOKEN="sk-your-v98-key-here"
```

Sau đó reload shell:
```bash
source ~/.zshrc   # hoặc ~/.bashrc
```

### 4.2 Windows PowerShell (phiên hiện tại)

```powershell
$env:ANTHROPIC_BASE_URL = "https://v98store.com"
$env:ANTHROPIC_AUTH_TOKEN = "sk-your-v98-key-here"
```

### 4.3 Windows PowerShell (persistent — giữ qua các phiên)

```powershell
[Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://v98store.com", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "sk-your-v98-key-here", "User")
```

Sau đó **đóng và mở lại PowerShell** để biến mới có hiệu lực.

### 4.4 Windows CMD (persistent)

```cmd
setx ANTHROPIC_BASE_URL "https://v98store.com"
setx ANTHROPIC_AUTH_TOKEN "sk-your-v98-key-here"
```

> ⚠️ `setx` chỉ có hiệu lực ở CMD **mới mở**, không ảnh hưởng phiên hiện tại.

## 5. Chạy Claude Code

Mở terminal mới ở folder dự án:

```bash
cd "C:/Tình Báo AI Website/tinh-bao-ai"
claude
```

Nếu cấu hình đúng, Claude Code sẽ kết nối qua v98store và sẵn sàng làm việc.

## 6. Project customization với `CLAUDE.md`

Tạo file `CLAUDE.md` ở root project để hướng dẫn Claude:

```markdown
# Project Guidelines

- Coding style: TypeScript strict mode
- UI library: Tailwind CSS, KHÔNG dùng Material UI
- Test: `npm run test`
- Build: `npm run build`
- Vietnamese first, giữ thuật ngữ kỹ thuật tiếng Anh
```

Project Tình Báo AI đã có sẵn `CLAUDE.md` ở root → Claude Code sẽ tự đọc khi khởi động.

## 7. Execution modes

| Mode | Mô tả |
|---|---|
| **Default (interactive)** | Phê duyệt từng hành động |
| **YOLO** (`--yolo`) | Claude chạy tất cả commands không cần confirm — **dùng cẩn thận** |
| **Dangerously skip permissions** (`--dangerously-skip-permissions`) | Bỏ qua permission checks (dùng trong sandbox/VM) |

## 8. Troubleshooting

### ❌ "Invalid API Key · Please run /login"

Biến môi trường không được load. Kiểm tra:

```bash
# Unix
echo $ANTHROPIC_AUTH_TOKEN
echo $ANTHROPIC_BASE_URL

# Windows PowerShell
echo $env:ANTHROPIC_AUTH_TOKEN
echo $env:ANTHROPIC_BASE_URL
```

Nếu trống → chưa export đúng phiên. Làm lại bước 4 và **mở terminal mới**.

### ❌ Không nhận model mới (Claude 4.6)

Claude Code sẽ dùng model default của Anthropic. Để dùng model cụ thể, thêm vào `CLAUDE.md` hoặc config:

```bash
# Chạy với model cụ thể
claude --model claude-sonnet-4-6
```

v98store hỗ trợ đầy đủ các Claude model mới (xem `v98-models-pricing.md`):
- `claude-opus-4-6` — flagship ($5/$25 per 1M)
- `claude-sonnet-4-6` — cân bằng ($3/$15 per 1M)
- `claude-sonnet-4-6-thinking` — reasoning
- `claude-haiku-4-5-20251001` — rẻ nhất

### ❌ Hỏi token usage có bị tính double không?

Không. Token chỉ tính 1 lần ở phía v98store. Anthropic không biết request đi qua đâu.

### ❌ Có support thinking/reasoning model không?

Có. Claude Sonnet 4.6 và Opus 4.6 đều có built-in thinking. Dùng model `claude-sonnet-4-6-thinking` hoặc `claude-opus-4-6-thinking` trong v98store để bật extended thinking.

## 9. So sánh chi phí: Anthropic trực tiếp vs v98store

| Model | Anthropic gốc (Input/Output per 1M) | v98store (per 1M) | Tiết kiệm |
|---|---|---|---|
| `claude-sonnet-4-6` | ~$3 / $15 | $3.00 / $15.00 | Gần như ngang |
| `claude-opus-4-6` | ~$15 / $75 | $5.00 / $25.00 | ~**67%** |
| `claude-haiku-4-5` | ~$1 / $5 | *rẻ hơn* | Tiết kiệm đáng kể |

> Giá chính xác xem `v98-models-pricing.md`. Lợi ích lớn nhất là **1 API key dùng được cả Claude + GPT + Gemini** trong cùng một tool.

## 10. Bonus: Fast mode

Claude Code hỗ trợ `/fast` — Claude Opus 4.6 với output nhanh hơn (cùng model, tăng throughput):

```
> /fast
```

## Tham khảo liên quan

- [`Read before using.md`](./Read%20before%20using.md) — Index tổng quan
- [`v98-anthropic.md`](./v98-anthropic.md) — Claude API reference đầy đủ
- [`v98-models-pricing.md`](./v98-models-pricing.md) — Bảng giá toàn bộ model
- [`v98-openclaw-setup.md`](./v98-openclaw-setup.md) — Setup OpenClaw/Clawdbot
