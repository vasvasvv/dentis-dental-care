#!/usr/bin/env node
/**
 * Post-build: inline critical CSS using Beasties
 * Runs after `vite build`, before deploy
 */
const Beasties = require("beasties");
const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "../dist");
const indexPath = path.join(distDir, "index.html");

async function run() {
  const html = fs.readFileSync(indexPath, "utf-8");

  const critters = new Beasties({
    path: distDir,
    publicPath: "/",
    pruneSource: false,
    preload: "swap",
    fonts: false, // ми самі керуємо preload шрифтів
    compress: false,
    logLevel: "warn",
  });

  let processed = await critters.process(html);

  // Виправити: Critters залишає rel="stylesheet" з onload, але може дублювати.
  // Замінюємо на правильний non-blocking патерн: preload + noscript fallback
  const cssFile = processed.match(/href="(\/assets\/[^"]+\.css)"/)?.[1];
  if (cssFile) {
    const escapedCssFile = cssFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const cssLinkPattern = new RegExp(`<link[^>]*href="${escapedCssFile}"[^>]*>`, "g");
    const cssNoscriptPattern = new RegExp(`<noscript><link[^>]*href="${escapedCssFile}"[^>]*><\\/noscript>`, "g");
    processed = processed.replace(cssNoscriptPattern, "");
    processed = processed.replace(cssLinkPattern, "");
    // Вставляємо правильний async CSS + noscript fallback перед </head>
    const asyncCss = `<link rel="preload" crossorigin href="${cssFile}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" crossorigin href="${cssFile}"></noscript>`;
    processed = processed.replace("</head>", `${asyncCss}\n</head>`);
  }

  processed = processed.replace(/<link\b(?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*>/g, (tag) => {
    return tag.includes("/hero-poster.webp") ? tag : "";
  });

  fs.writeFileSync(indexPath, processed, "utf-8");

  const before = html.length;
  const after = processed.length;
  console.log(`✅ Critical CSS inlined: ${before} → ${after} bytes`);
  console.log(`   Render-blocking CSS removed from critical path`);
}

run().catch((err) => {
  console.error("❌ Critical CSS failed:", err);
  process.exit(1);
});
