# Setup checklist

## Cloudflare
Deploy the Worker from `worker/`. Deploy the dashboard separately as a static site if desired.

## Meta Model API
The Worker uses Meta's OpenAI-compatible Model API for Muse Spark. The current default model is `muse-spark-1.3`.

Create a Model API key in the Meta Model API dashboard, then set it as a Cloudflare Worker secret:

```bash
cd worker
npx wrangler secret put META_MODEL_API_KEY
```

Set the Worker authentication secret separately:

```bash
npx wrangler secret put API_SECRET
```

The Worker calls:

```text
https://api.meta.ai/v1/chat/completions
```

Do not put either secret in GitHub, `.env` files committed to the repository, frontend JavaScript, Telegram messages, or logs.

## Provider roles
- Meta Model API / Muse Spark: research reasoning, scripts, planning, agent/tool workflows and structured content generation.
- Runway: backup/special-shot video generation.
- Connected voice provider: user's voice/reference when supported.
- Canva: thumbnails/covers when connected.
- Metricool/Windsor/direct APIs: analytics when connected.
- Google Drive API: primary storage.
- Telegram Bot API: notifications and eligible Reel file delivery.

## Worker API
Authenticated endpoints:
- `GET /api/config`
- `POST /api/muse/chat`
- `POST /api/video/generate` — submits an async Pixelle-Video generation task
- `GET /api/video/tasks/{task_id}` — checks Pixelle task status
- `GET /api/video/health` — checks the video generator

Public endpoints:
- `GET /api/health`
- `GET /api/status`

For authenticated calls send:

```http
Authorization: Bearer <API_SECRET>
Content-Type: application/json
```

Example body for `POST /api/muse/chat`:

```json
{
  "messages": [
    {
      "role": "developer",
      "content": "You are the TechMind Central content strategist. Be factual, concise and practical."
    },
    {
      "role": "user",
      "content": "Give me three current AI video topics for an Indian and international audience."
    }
  ]
}
```

## Pixelle-Video bridge
The Worker can forward generation requests to the existing `pateljiop/Video-generation` API. Set `VIDEO_GENERATOR_URL` to the deployed API base URL. The bridge uses `/api/video/generate/async` and returns a task ID; poll `/api/video/tasks/{task_id}` until the task is completed. If the generator is protected by a bearer key, store it as `VIDEO_GENERATOR_API_KEY`.

Example request:

```json
{
  "text": "Explain why AI agents are becoming useful for creators.",
  "mode": "generate",
  "n_scenes": 5,
  "aspect_ratio": "16:9"
}
```

The bridge defaults to a 1080x1920 template for vertical content, 1920x1080 for 16:9, and 1080x1080 for square content when `frame_template` is not supplied.

## Daily automation
The scheduled creator pipeline runs daily at 10:00 IST and decides the topic itself. It targets 2 YouTube videos + 2 derived Shorts/Reels, archives artifacts to Drive when connected, sends Telegram delivery/notifications when verified, records the creator log, and uses analytics to influence the next cycle.

## Publishing
YouTube and Instagram publishing remains human-controlled initially. The dashboard records readiness and can record the public URL after publishing.

## Launch checks
- Health endpoint works.
- Missing/invalid auth is rejected.
- Meta Model API key is stored as a Worker secret.
- Meta chat request returns a verified provider response.
- Drive test upload works.
- Telegram notification works.
- Small Reel file delivery works.
- Oversized Reel falls back to Drive link.
- Duplicate events are idempotent.
- Failed uploads do not become ready.
- Secrets and voice samples never appear in logs or responses.
- Dashboard works on mobile.
