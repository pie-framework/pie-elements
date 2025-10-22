#!/bin/bash

# Upgrade all @pie-lib dependencies to 'esmbeta' dist-tag versions
# Non-interactive

set -e

echo "════════════════════════════════════════════════════════════"
echo "⬆️  Upgrading @pie-lib packages to 'esmbeta' dist-tag"
echo "════════════════════════════════════════════════════════════"
echo ""

# Ensure we're in the right directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."

echo "🔍 Finding @pie-lib dependencies..."
echo ""

# Get all unique @pie-lib packages used across all packages
PIE_LIB_DEPS=$(find packages -name "package.json" -type f \
  -exec grep -o '"@pie-lib/[^"]*"' {} \; \
  | sort -u \
  | tr -d '"')

if [[ -z "$PIE_LIB_DEPS" ]]; then
  echo "No @pie-lib dependencies found"
  exit 0
fi

echo "Found dependencies:"
echo "$PIE_LIB_DEPS" | sed 's/^/  - /'
echo ""

# Get esmbeta versions for each package
echo "📦 Fetching esmbeta dist-tag versions from npm..."
echo "   (Using --prefer-online to bypass cache)"
echo ""

UPGRADE_LIST=()
FAILED=()

for pkg in $PIE_LIB_DEPS; do
  echo -n "  $pkg... "
  
  # Get version for esmbeta dist-tag
  # Use --prefer-online to bypass npm cache and get fresh data from registry
  ESM_VERSION=$(npm view "$pkg@esmbeta" version --prefer-online 2>/dev/null || echo "")
  
  if [[ -n "$ESM_VERSION" ]]; then
    echo "✅ $ESM_VERSION"
    UPGRADE_LIST+=("$pkg@$ESM_VERSION")
  else
    echo "❌ No esmbeta tag found"
    FAILED+=("$pkg")
  fi
done

echo ""

if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo "⚠️  WARNING: Some packages don't have esmbeta tag:"
  for pkg in "${FAILED[@]}"; do
    echo "  - $pkg"
  done
  echo ""
fi

if [[ ${#UPGRADE_LIST[@]} -eq 0 ]]; then
  echo "No packages to upgrade"
  exit 0
fi

echo "════════════════════════════════════════════════════════════"
echo "📋 Upgrade Plan"
echo "════════════════════════════════════════════════════════════"
for pkg_version in "${UPGRADE_LIST[@]}"; do
  echo "  $pkg_version"
done
echo ""

read -p "Proceed with upgrade? (type 'yes'): " CONFIRM
if [[ "$CONFIRM" != "yes" ]]; then
  echo "❌ Aborted"
  exit 1
fi

echo ""
echo "⬆️  Updating package.json files..."
echo ""

# Update package.json files directly
# yarn upgrade doesn't work well in Lerna monorepos for cross-package dependencies
for pkg_version in "${UPGRADE_LIST[@]}"; do
  PKG_NAME=$(echo "$pkg_version" | cut -d'@' -f1-2)  # @pie-lib/categorize
  PKG_VERSION=$(echo "$pkg_version" | cut -d'@' -f3)  # 0.25.6-esmbeta.0
  
  echo "  $PKG_NAME → $PKG_VERSION"
  
  # Update all package.json files that reference this package
  find packages -name "package.json" -type f -exec sed -i '' \
    -e "s|\"$PKG_NAME\": \"[^\"]*\"|\"$PKG_NAME\": \"^$PKG_VERSION\"|g" \
    {} \;
done

echo ""
echo "🔄 Running lerna bootstrap..."
lerna bootstrap

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Upgrade Complete"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Upgraded ${#UPGRADE_LIST[@]} packages to esmbeta dist-tag"
echo ""
echo "Next steps:"
echo "  1. Test: yarn build && yarn test:esm"
echo "  2. Review: git diff packages/*/package.json"
echo "  3. Commit: git commit -am 'Upgrade @pie-lib to esmbeta versions'"
echo ""

