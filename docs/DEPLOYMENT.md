# DEPLOYMENT

Production build:

```powershell
npm.cmd run build
```

Очікуваний output: `dist/`. Після build виконується `postbuild`, який запускає `scripts/inline-critical.cjs`.

Для Cloudflare Pages важливі `public/_headers`, `public/manifest.json`, `src/sw.ts`.
