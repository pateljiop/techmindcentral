# TechMind Central Creator Bridge — Architecture

## Product goal
Run an autonomous daily creator workflow for TechMind Central: two long-form YouTube videos (Hindi + English) and four 9:16 Reels (two YouTube-related + two discovery/viral-test), with Google Drive as primary artifact storage, Telegram for delivery/notifications, analytics feeding the next content decision, and publishing remaining human-controlled unless a verified publisher is configured.

## Daily output
1. Hindi YouTube — 16:9
2. English YouTube — 16:9
3. Hindi YouTube-related Reel — 9:16
4. English YouTube-related Reel — 9:16
5. Hindi discovery/viral-test Reel — 9:16
6. English discovery/viral-test Reel — 9:16
7. Thumbnails/covers and metadata

Discovery/viral-test content is an experiment, not a virality guarantee. No artificial engagement or deceptive claims.

## Automated workflow
Research + analytics → topic/angle selection → independent Hindi/English scripts → voice plan → Muse/Meta video generation when available → Runway/other provider fallback → music/SFX + voice ducking → quality checks → Drive archive → Telegram delivery → publish-ready package → performance collection → learning log → next-cycle strategy.

The system must never claim an MP4, Drive archive or Telegram delivery exists unless the connected action actually verified it.

## Voice and music
Use the user's supplied voice/reference only through a connected provider that supports it and with appropriate consent. Never commit voice samples or credentials to GitHub. Background music must be licensed, royalty-free, or otherwise permitted; keep speech intelligible and duck music under voice.

## Storage and delivery
Google Drive is the source of truth. Telegram receives long-form notifications with Drive links. Reels are sent as files only when the connected Telegram upload path supports their current size; otherwise send the Drive link.

## Analytics
Track Hindi/English and YouTube/Instagram separately. Track views, watch time, subscribers/followers gained, retention, impressions, CTR where available, likes, comments, shares and saves. Keep related Reels separate from discovery Reels.

Use measured results to adapt hooks, topics, pacing, packaging and publishing windows. Never claim a guaranteed viral result.

## Publishing
Human-controlled by default. Automatic publishing is allowed only after a verified publisher integration is explicitly configured.

## Security
Credentials live in Cloudflare Secrets. Never commit API keys, OAuth refresh tokens, cookies, voice samples, .env files or private data. Mutating endpoints require authentication and webhooks must be authenticated and idempotent.
