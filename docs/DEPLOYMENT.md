# DEPLOYMENT

Production build:

```powershell
npm.cmd run build
```

Очікуваний output: `dist/`. Після build виконується `postbuild`, який запускає `scripts/inline-critical.cjs`.

Для Cloudflare Pages важливі `public/_headers`, `public/manifest.json`, `src/sw.ts`.

## dentis-site-api

Worker має один cron `*/30 * * * *`; він запускає нагадування і автопублікацію scheduled articles.

Telegram webhook має бути налаштований із секретом:

```powershell
wrangler secret put TELEGRAM_WEBHOOK_SECRET
```

Після цього треба оновити Telegram `setWebhook` з тим самим `secret_token`. Без цього production webhook без правильного `X-Telegram-Bot-Api-Secret-Token` буде відхилено.
