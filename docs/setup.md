# Setup checklist

## Cloudflare
Deploy the Worker from `worker/`. Deploy the dashboard separately as a static site if desired.

## Server-side secrets
Expected categories:
- Google Drive credentials
- Telegram bot token and destination ID
- Platform analytics credentials
- Video/content provider credentials, if connected
- Dashboard authentication secret

Never commit real values.

## Google Drive
Google Drive is primary storage. Create/reuse dated folders and upload every artifact before reporting it as archived.

## Telegram
Telegram is notification-only for long-form videos. Reels can also be sent as actual files when their size is within the connected Telegram Bot API upload limit. The Worker must check the file size and fall back to a Drive link when the file is too large.

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
- Failed uploads do not become `ready`.
- Secrets never appear in logs or responses.
- Dashboard works on mobile.
