# ARCHITECTURE

Frontend живе в `src/`: сторінки у `src/pages`, повторні блоки у `src/components`, SEO-утиліти у `src/utils`.

Build генерується через `vite-react-ssg build`, після чого `scripts/inline-critical.cjs` інлайнить критичний CSS і прибирає зайві preload.

Статичні файли лежать у `public/`, кешування для Cloudflare Pages задається у `public/_headers`.

## Static news snapshot

Публічні блоки новин на сайті не читають D1 у браузері. Перед production build `scripts/export-public-news.cjs` читає `/api/public/news` для `uk` і `en` та генерує `src/data/publicNews.generated.ts`.

D1 лишається джерелом правди для адмінки, архіву та запланованих новин.
