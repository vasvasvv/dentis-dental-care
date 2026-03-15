#!/bin/bash
# Run from: cd dentis-dental-care/dentis-site-api && bash deploy.sh
set -e

echo "=== Dentis Worker Security Deploy ==="

# 1. Set JWT_SECRET via wrangler secret put
echo ""
echo "Step 1: Setting JWT_SECRET..."
node -e "
const crypto = require('crypto');
const secret = crypto.randomBytes(48).toString('base64');
const { execSync } = require('child_process');
execSync('npx wrangler@3.78.12 secret put JWT_SECRET --name dentis-site-api', {
  input: secret,
  stdio: ['pipe', 'inherit', 'inherit']
});
console.log('JWT_SECRET set successfully');
"

# 2. Deploy worker
echo ""
echo "Step 2: Deploying worker..."
npx wrangler@3.78.12 deploy --no-bundle

# 3. Apply D1 migration (rate_limit table)
echo ""
echo "Step 3: Applying D1 migration..."
npx wrangler@3.78.12 d1 execute site_news_docs_pwa \
  --file=migrations/0002_rate_limit.sql \
  --remote && echo "Migration applied" || echo "Migration already applied (skipped)"

echo ""
echo "=== Done ==="
