# TechMind Central Creator Bridge — Architecture

## Product goal
Run a creator workflow for two daily long-form videos (Hindi + English), with two Instagram Reel tracks, Google Drive as the primary artifact store, Telegram as notification-only for long-form assets and a delivery channel for small Reel files, and analytics feeding the next content decision.

## Daily content system
Each daily cycle produces:

1. **Hindi YouTube video** — 16:9
2. **English YouTube video** — 16:9
3. **Hindi YouTube-related Reel** — 9:16, derived from or extending the day's Hindi YouTube topic
4. **English YouTube-related Reel** — 9:16, derived from or extending the day's English YouTube topic
5. **Hindi discovery/viral-test Reel** — 9:16, independently selected for shareability/discovery
6. **English discovery/viral-test Reel** — 9:16, independently selected for shareability/discovery
7. Thumbnail/cover assets
8. Titles, descriptions, tags/hashtags and recommended publishing times

The discovery/viral-test track is an experiment, not a guarantee of virality. It should use current audience signals, trends, hooks and platform-native formats without deceptive claims or artificial engagement.

Hindi and English packages should be independently optimized rather than blindly translated.

## Storage and delivery
Google Drive is the source of truth for all generated artifacts.

Telegram has two roles:
- Long-form YouTube files: notification only, with Drive links.
- Instagram Reels: if a Reel file is within the Telegram Bot API's currently supported upload size, send the actual Reel file plus its Drive link. If it is larger, send the Drive link instead of pretending delivery succeeded.

The bridge must verify file size before attempting a Telegram upload and record the delivery result.

## Pipeline
Research → topic selection → script/package → video production → Drive archive → Reel generation → Telegram delivery where eligible → human publish step → analytics → next-content insights.

The bridge is an orchestration layer. It must never claim an MP4 exists unless a connected production provider actually produced it.

## Analytics
Track each content track separately: Hindi/English, YouTube/Instagram, and related/discovery Reel. Store timestamped views, watch time, subscribers/followers gained, likes, comments, shares, saves, impressions and CTR when exposed by connected APIs.

Discovery Reels should be evaluated separately from YouTube-related Reels so their performance does not distort the strategy for long-form content.

## Security
- Credentials live in Cloudflare Secrets.
- Never commit tokens, OAuth refresh tokens, cookies, `.env` files or private data.
- Mutating endpoints require authentication.
- Public health/status responses expose no secrets or private IDs.
- Webhooks must verify authentication and be idempotent.
