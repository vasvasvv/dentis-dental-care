#!/bin/bash
# Run from: cd dentis-dental-care/dentis-site-api && bash deploy.sh
set -e

# ── Перевірка токена ──────────────────────────────────────────────────────────
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║  Потрібен CLOUDFLARE_API_TOKEN                              ║"
  echo "╠══════════════════════════════════════════════════════════════╣"
  echo "║  1. Відкрий: https://dash.cloudflare.com/profile/api-tokens ║"
  echo "║  2. Create Token → Edit Cloudflare Workers (template)        ║"
  echo "║  3. Скопіюй токен і виконай:                                ║"
  echo "║                                                               ║"
  echo "║  export CLOUDFLARE_API_TOKEN=<твій_токен>                   ║"
  echo "║  bash deploy.sh                                              ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
  exit 1
fi

echo "=== Dentis Worker Deploy ==="

# ── Знайти wrangler ───────────────────────────────────────────────────────────
if command -v wrangler &>/dev/null; then
  W="wrangler"
else
  echo "Installing wrangler 3.78.12..."
  npm install wrangler@3.78.12 --save-dev --legacy-peer-deps --silent
  W="./node_modules/.bin/wrangler"
fi
echo "Using: $($W --version 2>&1 | grep -v Proxy | grep -v '^$' | head -1)"

# ── Deploy ────────────────────────────────────────────────────────────────────
echo ""
echo "Deploying worker..."
$W deploy --no-bundle
echo "✓ Worker deployed"

# ── JWT_SECRET ────────────────────────────────────────────────────────────────
echo ""
echo "Setting JWT_SECRET..."
JWT_SECRET=$(node -e "process.stdout.write(require('crypto').randomBytes(48).toString('base64'))")
printf '%s' "$JWT_SECRET" | $W secret put JWT_SECRET
echo "✓ JWT_SECRET set"

# ── D1 migration ──────────────────────────────────────────────────────────────
echo ""
echo "Applying D1 migration..."
$W d1 execute site_news_docs_pwa \
  --file=migrations/0002_rate_limit.sql \
  --remote \
  && echo "✓ Migration applied" \
  || echo "✓ Already applied"

echo ""
echo "=== Done! ==="
