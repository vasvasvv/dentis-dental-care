const fs = require("fs");
const path = require("path");

// Основний домен
const baseUrl = "https://dentis.kr.ua";

// Шлях до головного компонента з маршрутизатором
const appPath = path.join(__dirname, "../src/App.tsx"); // або App.tsx

// Зчитуємо файл App.jsx як текст
const appContent = fs.readFileSync(appPath, "utf-8");

// Простий RegExp для витягування всіх path з <Route path="...">
const routeRegex = /<Route\s+[^>]*path=["']([^"']+)["']/g;

const routes = [];
let match;
while ((match = routeRegex.exec(appContent)) !== null) {
  routes.push(match[1]);
}

// Видаляємо дублікати
const uniqueRoutes = [...new Set(routes)];

// Дата у форматі YYYY-MM-DD
const today = new Date().toISOString().split("T")[0];

// --- Генерація sitemap.xml ---
const urlset = uniqueRoutes
  .map((page) => {
    let priority = "0.8";
    if (page === "/") priority = "1.0";
    else if (page === "/implantaciya" || page === "/protezuvannya") priority = "0.9";
    else if (page === "/contacts") priority = "0.7";

    const changefreq = page === "/" ? "weekly" : "monthly";

    return `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("");

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

fs.writeFileSync(path.join(__dirname, "../public/sitemap.xml"), sitemapContent.trim());
console.log("✅ sitemap.xml згенеровано");

// --- Генерація robots.txt ---
const robotsContent = `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /test/
Disallow: /private/
Disallow: /login/

Sitemap: ${baseUrl}/sitemap.xml
Crawl-delay: 1
`;

fs.writeFileSync(path.join(__dirname, "../public/robots.txt"), robotsContent.trim());
console.log("✅ robots.txt згенеровано");