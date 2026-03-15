#!/bin/bash
# Run from: cd dentis-dental-care/dentis-site-api && bash deploy.sh
set -e

echo "=== Dentis Worker Security Deploy (wrangler 3.x) ==="
echo ""

# Check wrangler version
WRANGLER="./node_modules/.bin/wrangler"
if [ ! -f "$WRANGLER" ]; then
  echo "Installing wrangler..."
  npm install --legacy-peer-deps
fi
echo "Wrangler: $($WRANGLER --version)"
echo ""

# 1. Generate JWT_SECRET if not already set
echo "Step 1: Setting JWT_SECRET..."
JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
echo "$JWT_SECRET" | $WRANGLER secret put JWT_SECRET
echo "✓ JWT_SECRET set"
echo ""

# 2. Deploy worker
echo "Step 2: Deploying worker..."
$WRANGLER deploy --no-bundle
echo "✓ Worker deployed"
echo ""

# 3. Run D1 migration for rate_limit table
echo "Step 3: Applying D1 migration..."
$WRANGLER d1 execute site_news_docs_pwa \
  --file=migrations/0002_rate_limit.sql \
  --remote 2>/dev/null || echo "(migration already applied, skipping)"
echo ""

echo "=== All done! ==="
echo ""
echo "Test endpoints:"
echo "  POST https://dentis-site-api.nesterenkovasil9.workers.dev/api/auth/login"
echo "  Body: { \"password\": \"<your ADMIN_SECRET>\" }"
