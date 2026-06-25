# DEPLOYMENT

Production build:

```powershell
npm.cmd run build
```

Очікуваний output: `dist/`. Після build виконується `postbuild`, який запускає `scripts/inline-critical.cjs`.

Перед build виконується `prebuild`, який запускає `scripts/export-public-news.cjs` і оновлює статичний snapshot новин. Якщо API недоступний, build використовує останній наявний snapshot; якщо snapshot відсутній, build падає.

Для Cloudflare Pages важливі `public/_headers`, `public/manifest.json`, `src/sw.ts`.

## dentis-site-api

Worker має один cron `*/30 * * * *`; він запускає нагадування і автопублікацію scheduled articles.

Telegram webhook має бути налаштований із секретом:

```powershell
wrangler secret put TELEGRAM_WEBHOOK_SECRET
wrangler secret put PAGES_DEPLOY_HOOK_URL
```

Після цього треба оновити Telegram `setWebhook` з тим самим `secret_token`. Без цього production webhook без правильного `X-Telegram-Bot-Api-Secret-Token` буде відхилено.

`PAGES_DEPLOY_HOOK_URL` потрібен, щоб Worker запускав Cloudflare Pages redeploy після успішної cron-публікації запланованих новин.
