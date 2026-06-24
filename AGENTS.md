# AGENTS.md

## Правила кодування

- Читати й записувати файли як UTF-8.
- Не додавати BOM і не конвертувати кодування.
- Зберігати кириличний текст точно.
- Робити мінімальні точкові зміни без непотрібного рефакторингу.
- Не чіпати secrets, tokens, passwords, API keys, private keys.

## Проєкт

- `dentis-dental-care` — сайт клініки Dentis на Vite, React, Tailwind і `vite-react-ssg`.
- Основний production build: `npm.cmd run build`.
- Postbuild-оптимізація HTML/CSS: `scripts/inline-critical.cjs`.
- Заголовки для Cloudflare Pages: `public/_headers`.

## Перевірка

- Після performance-змін запускати `npm.cmd run build`, `npm.cmd run test`, `npm.cmd run lint`.
- Для PageSpeed-фіксів перевіряти згенерований `dist/index.html` на ранні зовнішні скрипти, дублікати CSS preload і зайві image preload.
