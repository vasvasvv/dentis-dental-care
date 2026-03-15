#!/bin/bash
# Run this from your Codespaces terminal to finish the security setup

set -e
echo "=== Dentis Worker Security Deploy ==="

# 1. Generate JWT secret if not set
JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 48)}"
echo "JWT_SECRET generated: ${JWT_SECRET:0:10}..."

# 2. Set secrets in Cloudflare
echo "$JWT_SECRET" | npx wrangler secret put JWT_SECRET
echo "✓ JWT_SECRET set in Cloudflare"

# 3. Deploy the worker
npx wrangler deploy
echo "✓ Worker deployed"

echo ""
echo "=== Done! ==="
echo "JWT_SECRET (save this somewhere safe):"
echo "$JWT_SECRET"
