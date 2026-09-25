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
Create/reuse dated folders and upload artifacts before sending the Telegram notification.

## Telegram
Send only non-sensitive status, timestamps and Drive links.

## Publishing
YouTube and Instagram publishing remains human-controlled initially. The dashboard records readiness and the public URL after publishing.

## Launch checks
- Health endpoint works.
- Missing/invalid auth is rejected.
- Drive test upload works.
- Telegram test notification works.
- Duplicate events are idempotent.
- Failed uploads cannot become `ready`.
- Secrets never appear in logs or responses.
- Dashboard works on mobile.
