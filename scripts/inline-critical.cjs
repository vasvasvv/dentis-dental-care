#!/usr/bin/env node
/**
 * Post-build: inline critical CSS using Critters
 * Runs after `vite build`, before deploy
 */
const Critters = require("critters");
const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "../dist");
const indexPath = path.join(distDir, "index.html");

async function run() {
  const html = fs.readFileSync(indexPath, "utf-8");

  const critters = new Critters({
    path: distDir,
    publicPath: "/",
    // Inline critical CSS, load rest async via preload
    pruneSource: false,
    preload: "swap",
    // Keep font-face rules in the inline CSS
    fonts: true,
    // Don't compress inline styles
    compress: false,
    logLevel: "warn",
  });

  const processed = await critters.process(html);
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
