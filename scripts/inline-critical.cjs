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
  const cssFile = processed.match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1];
  if (cssFile) {
    // Видаляємо всі stylesheet лінки та noscript блоки для CSS
    processed = processed.replace(/<link[^>]*stylesheet[^>]*>/g, "");
    processed = processed.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");
    // Вставляємо правильний async CSS + noscript fallback перед </head>
    const asyncCss = `<link rel="preload" as="style" href="${cssFile}" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${cssFile}"></noscript>`;
    processed = processed.replace("</head>", `${asyncCss}\n</head>`);
  }

  fs.writeFileSync(indexPath, processed);

  const before = html.length;
  const after = processed.length;
  console.log(`✅ Critical CSS inlined: ${before} → ${after} bytes`);
  console.log(`   Render-blocking CSS removed from critical path`);
}

run().catch((err) => {
  console.error("❌ Critical CSS failed:", err);
  process.exit(1);
});
