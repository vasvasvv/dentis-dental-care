# ARCHITECTURE

Frontend живе в `src/`: сторінки у `src/pages`, повторні блоки у `src/components`, SEO-утиліти у `src/utils`.

Build генерується через `vite-react-ssg build`, після чого `scripts/inline-critical.cjs` інлайнить критичний CSS і прибирає зайві preload.

Статичні файли лежать у `public/`, кешування для Cloudflare Pages задається у `public/_headers`.
