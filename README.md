# TechMind Central — Creator Bridge

A Cloudflare-based creator operations bridge for TechMind Central.

## Goal

- 1 Hindi YouTube video/day
- 1 English YouTube video/day
- Instagram-ready 9:16 versions
- Google Drive as primary storage
- Telegram as notification-only
- Creator analytics and growth tracking
- Daily activity / production logs
- GitHub and portfolio projects as legitimate content sources

## Architecture

Research & content planning → video production → Google Drive → YouTube/Instagram upload package → analytics → next-content insights.

Cloudflare Workers will act as the secure API/orchestration layer. Credentials must stay in server-side secrets and never be committed to Git.

## Planned modules

- `worker/` — Cloudflare Worker API
- `dashboard/` — creator dashboard
- `docs/` — architecture and setup notes
- `logs/` — daily production logs
- `config/` — non-secret configuration/examples

## Security

Never commit API keys, OAuth refresh tokens, bot tokens, cookies, `.env` files, or private project data.
