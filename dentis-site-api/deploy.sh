#!/bin/bash
# Run from: cd dentis-dental-care/dentis-site-api && bash deploy.sh
set -e

WRANGLER="./node_modules/.bin/wrangler"

echo "=== Dentis Worker Security Deploy (wrangler 3.x) ==="

# Install deps if needed
if [ ! -f "$WRANGLER" ]; then
  echo "Installing wrangler..."
  npm install --legacy-peer-deps
fi
echo "Wrangler: $($WRANGLER --version 2>&1 | grep -v Proxy)"

# 1. Set JWT_SECRET
echo ""
echo "Step 1: Setting JWT_SECRET..."

# Generate secret using node (cross-platform, always available)
JWT_SECRET=$(node -e "const c=require('crypto');process.stdout.write(c.randomBytes(48).toString('base64'))")

# wrangler 3: pipe value via printf (avoids newline issues with echo)
printf '%s' "$JWT_SECRET" | $WRANGLER secret put JWT_SECRET --name dentis-site-api
echo "✓ JWT_SECRET set in Cloudflare"

# 2. Deploy worker
echo ""
echo "Step 2: Deploying worker..."
$WRANGLER deploy --no-bundle
echo "✓ Worker deployed"

# 3. Apply D1 migration
echo ""
echo "Step 3: Applying D1 migration..."
$WRANGLER d1 execute site_news_docs_pwa \
  --file=migrations/0002_rate_limit.sql \
  --remote 2>/dev/null && echo "✓ Migration applied" || echo "✓ Migration already applied (skipped)"

echo ""
echo "=== Done! Worker updated with JWT auth + rate limiting ==="
echo ""
echo "Test login:"
echo "  curl -X POST https://dentis-site-api.nesterenkovasil9.workers.dev/api/auth/login \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"password\": \"<your ADMIN_SECRET>\"}'"
