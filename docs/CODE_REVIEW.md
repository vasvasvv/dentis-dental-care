# CODE_REVIEW

## 2026-06-24 PageSpeed mobile

Зміни мають зберегти контент і hero-відео, але прибрати ранні блокери:

- GTM/GA не повинні виконувати зовнішні запити в `<head>`.
- Першим критичним image preload має бути `/hero-poster.webp`, не логотип.
- `dist/index.html` не повинен містити дублікати CSS preload.
- Below-fold images не повинні отримувати ранній `rel="preload"`.
