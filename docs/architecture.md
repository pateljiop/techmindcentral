# TechMind Central Creator Bridge — Architecture

## Product goal
Run a creator workflow for two daily long-form videos (Hindi + English), with Instagram-ready vertical derivatives, Google Drive as the primary artifact store, Telegram as notification-only, and analytics feeding the next content decision.

## Pipeline
Research → topic selection → script/package → video production → Drive archive → human publish step → analytics → next-content insights.

The bridge is an orchestration layer. It must never claim an MP4 exists unless a connected production provider actually produced it.

## Content variants
- Hindi YouTube: 16:9
- English YouTube: 16:9
- Hindi Instagram: 9:16
- English Instagram: 9:16
- Thumbnail/cover assets
- Title, description, tags/hashtags and recommended publishing time

Hindi and English packages should be independently optimized rather than blindly translated.

## Storage
Google Drive is the source of truth. Telegram receives status notifications and Drive links; it is not video storage.

## Analytics
Store timestamped metrics such as views, watch time, subscribers/followers gained, likes, comments, shares, saves, impressions and CTR when the platform API exposes them. Treat metrics as signals rather than guarantees.

## Security
- Credentials live in Cloudflare Secrets.
- Never commit tokens, OAuth refresh tokens, cookies, `.env` files or private data.
- Mutating endpoints require authentication.
- Public health/status responses expose no secrets or private IDs.
- Webhooks must verify authentication and be idempotent.
