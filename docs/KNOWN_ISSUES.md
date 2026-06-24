# KNOWN_ISSUES

## PageSpeed

- PageSpeed-звіт від 24.06.2026 04:39:35 для mobile не мав CrUX field data.
- PageSpeed API може повертати `429 Too Many Requests`; тоді перевіряти через UI.
- Локально немає `ffmpeg`, `cwebp`, ImageMagick, тому поточний performance-фікс не залежить від перекодування media.
- Hero-відео залишається на всіх екранах, але його `src` підключається після idle, щоб не блокувати перший рендер.
- GTM/GA завантажуються відкладено після idle або першої взаємодії.
