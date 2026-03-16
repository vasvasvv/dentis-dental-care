const fs = require("fs");
const path = require("path");

// Основний домен
const baseUrl = "https://dentis.kr.ua";

// Список маршрутів сайту
const pages = [
  "/",
  "/implantaciya",
  "/protezuvannya",
  "/likuvannya-kariesu",
  "/profesijne-ochischennya",
  "/estetychna-stomatolohiya",
  "/diagnostika-zubiv",
  "/contacts",
  "/blog",
];

// Поточна дата у форматі YYYY-MM-DD
const today = new Date().toISOString().split("T")[0];

// --- Генерація sitemap.xml ---
const urlset = pages
  .map((page) => {
    let priority = "0.9";
    if (page === "/") priority = "1.0";
    else if (page === "/contacts" || page === "/blog") priority = "0.8";

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