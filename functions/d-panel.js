// Cloudflare Pages Function: /functions/d-panel.js
// Intercepts GET /d-panel, fetches index.html and rewrites manifest/meta tags
// so the browser receives the admin manifest in the initial HTML response.

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Fetch the main SPA shell
  const indexUrl = new URL('/index.html', url.origin);
  const response = await fetch(indexUrl.toString(), {
    headers: { 'Accept': 'text/html' },
    cf: { cacheEverything: false },
  });

  // Use HTMLRewriter to swap manifest and PWA meta tags
  return new HTMLRewriter()
    .on('link[rel="manifest"]', {
      element(el) {
        el.setAttribute('href', '/admin-manifest.json');
      },
    })
    .on('meta[name="theme-color"]', {
      element(el) {
        el.setAttribute('content', '#0d1f3c');
      },
    })
    .on('meta[name="apple-mobile-web-app-title"]', {
      element(el) {
        el.setAttribute('content', 'Дентіс Адмін');
      },
    })
    .on('link[rel="apple-touch-icon"]', {
      element(el) {
        el.setAttribute('href', '/admin-apple-touch-icon.png');
      },
    })
    .on('title', {
      element(el) {
        el.setInnerContent('Дентіс — Адмін панель');
      },
    })
    .on('meta[name="robots"]', {
      element(el) {
        el.setAttribute('content', 'noindex, nofollow');
      },
    })
    .transform(new Response(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-cache',
        'x-frame-options': 'DENY',
      },
    }));
}
