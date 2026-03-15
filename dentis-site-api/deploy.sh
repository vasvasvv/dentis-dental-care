#!/bin/bash
# Run from: cd dentis-dental-care/dentis-site-api && bash deploy.sh
set -e

echo "=== Dentis Worker Security Deploy ==="

# Знайти wrangler (глобальний або локальний)
if command -v wrangler &>/dev/null; then
  W="wrangler"
elif [ -f "./node_modules/.bin/wrangler" ]; then
  W="./node_modules/.bin/wrangler"
else
  echo "Wrangler not found. Installing locally..."
  npm install wrangler@3.78.12 --save-dev --legacy-peer-deps
  W="./node_modules/.bin/wrangler"
fi

echo "Wrangler: $($W --version 2>&1 | grep -v Proxy | head -1)"

# ─── Step 1: Deploy worker ────────────────────────────────────────────────────
echo ""
echo "Step 1: Deploying worker..."
$W deploy --no-bundle
echo "✓ Worker deployed"

# ─── Step 2: Set JWT_SECRET ───────────────────────────────────────────────────
echo ""
echo "Step 2: Setting JWT_SECRET..."
node << 'NODE'
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const secret = crypto.randomBytes(48).toString('base64');

// Find wrangler
const cmds = ['wrangler', './node_modules/.bin/wrangler'];
let w = null;
for (const c of cmds) {
  try { require('child_process').execSync(`which ${c} 2>/dev/null || ls ${c} 2>/dev/null`); w = c; break; } catch {}
}
if (!w) { console.error('wrangler not found'); process.exit(1); }

const result = spawnSync(w, ['secret', 'put', 'JWT_SECRET', '--name', 'dentis-site-api'], {
  input: secret + '\n',
  encoding: 'utf8',
  stdio: ['pipe', 'inherit', 'inherit'],
});

if (result.status !== 0) { process.exit(result.status); }
console.log('JWT_SECRET set successfully');
NODE

# ─── Step 3: D1 migration ─────────────────────────────────────────────────────
echo ""
echo "Step 3: Applying D1 migration..."
$W d1 execute site_news_docs_pwa \
  --file=migrations/0002_rate_limit.sql \
  --remote \
  && echo "✓ Migration applied" \
  || echo "✓ Already applied (skipped)"

echo ""
echo "=== Done! ==="
