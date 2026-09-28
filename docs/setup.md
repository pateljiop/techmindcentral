# Setup checklist

## Cloudflare
Deploy the Worker from `worker/`. Deploy the dashboard separately as a static site if desired.

## Provider roles
- Muse/Meta: preferred video creation when the connected runtime supports generation/export.
- Runway: backup/special-shot video generation.
- Connected voice provider: user's voice/reference when supported.
- Canva: thumbnails/covers when connected.
- Metricool/Windsor/direct APIs: analytics when connected.
- Google Drive API: primary storage.
- Telegram Bot API: notifications and eligible Reel file delivery.

## Server-side secrets
Expected categories:
- Google Drive credentials
- Telegram bot token and destination ID
- Platform analytics credentials
- Video/content provider credentials
- Voice provider credentials
- Dashboard authentication secret

Never commit real values or voice samples.

## Daily automation
The scheduled creator pipeline runs daily at 10:00 IST and decides the topic itself. It targets 2 YouTube videos + 4 Reels, archives artifacts to Drive when connected, sends Telegram delivery/notifications when verified, records the creator log, and uses analytics to influence the next cycle.

## Publishing
YouTube and Instagram publishing remains human-controlled initially. The dashboard records readiness and can record the public URL after publishing.

## Launch checks
- Health endpoint works.
- Missing/invalid auth is rejected.
- Drive test upload works.
- Telegram notification works.
- Small Reel file delivery works.
- Oversized Reel falls back to Drive link.
- Duplicate events are idempotent.
- Failed uploads do not become ready.
- Secrets and voice samples never appear in logs or responses.
- Dashboard works on mobile.
