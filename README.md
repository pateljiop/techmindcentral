# TechMind Central — Creator Bridge

A Cloudflare-based creator operations bridge for TechMind Central.

## Goal

- 1 Hindi YouTube video/day
- 1 English YouTube video/day
- 4 Instagram-ready Reel concepts/assets per daily cycle
- Google Drive as primary storage
- Telegram for notifications and eligible Reel delivery
- Creator analytics and growth tracking
- Daily activity / production logs
- GitHub and portfolio projects as legitimate content sources

## Architecture

Research & content planning → Meta Model API / Muse Spark → video production → Google Drive → YouTube/Instagram upload package → analytics → next-content insights.

Cloudflare Workers act as the secure API/orchestration layer. Credentials must stay in server-side secrets and never be committed to Git.

## Current AI integration

The Worker has an authenticated `POST /api/muse/chat` endpoint backed by Meta Model API.

- Base URL: `https://api.meta.ai/v1`
- Default model: `muse-spark-1.3`
- API key secret: `META_MODEL_API_KEY`
- Worker auth secret: `API_SECRET`
- Provider credentials never reach the browser.

Meta documents Model API as OpenAI-compatible and supports Muse Spark through Chat Completions. For more advanced agentic workflows, the Responses API is the recommended path.

## Planned modules

- `worker/` — Cloudflare Worker API
- `dashboard/` — creator dashboard
- `docs/` — architecture and setup notes
- `logs/` — daily production logs
- `config/` — non-secret configuration/examples

## Security

Never commit API keys, OAuth refresh tokens, bot tokens, cookies, `.env` files, voice samples, or private project data.

## First deployment

From `worker/`:

```bash
npm install
npm run check
npx wrangler secret put API_SECRET
npx wrangler secret put META_MODEL_API_KEY
npx wrangler deploy
```

After deployment, use the authenticated `/api/muse/chat` endpoint to verify the Meta integration.
