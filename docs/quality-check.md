# Internal quality checklist

Before calling the bridge ready, verify each pass:

1. Requirements match the agreed Hindi + English daily workflow.
2. Google Drive remains the primary artifact store.
3. Telegram is notification-only.
4. YouTube and Instagram packages are distinct.
5. Human publishing remains supported.
6. Analytics can feed future content decisions.
7. Daily logs preserve what was actually done.
8. GitHub/portfolio sources are public and attributable.
9. Secrets never enter source control or client HTML.
10. Health/status endpoints reveal no credentials.
11. Authenticated endpoints reject missing credentials.
12. CORS does not allow an arbitrary dashboard origin when configured.
13. Failed production steps cannot be represented as completed files.
14. Duplicate events are designed to be idempotent.
15. Dashboard is mobile-friendly.
16. Worker code has an automated syntax check.
17. Configuration contains placeholders only.
18. Deployment instructions distinguish Worker from static dashboard hosting.
19. The system does not promise automatic video generation without a connected provider.
20. The system can be extended without changing the core content/storage contract.
