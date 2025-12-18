#!/bin/bash
#
# Next.js Adapter - Scan Hardcoded Values
#
# Finds hardcoded colors, dimensions, and other values that should use design tokens.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADAPTER_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CORE_DIR="$(cd "$ADAPTER_DIR/../../core" && pwd)"

# shellcheck source=../../../core/adapter-loader.sh
source "$CORE_DIR/adapter-loader.sh"

PROJECT_ROOT="$(aurora_project_root)"

echo "🎨 Scanning for Hardcoded Values (Next.js)"
echo "==========================================="
echo ""

VIOLATION_COUNT=0

# Patterns to detect
COLOR_PATTERN='(#[0-9a-fA-F]{3,6}|rgba?\(|hsl\()'
PX_PATTERN='[0-9]+px'

echo "Scanning for hardcoded colors..."

# Search source files
if [ -d "$PROJECT_ROOT/app" ]; then
  results=$(grep -rn -E "$COLOR_PATTERN" "$PROJECT_ROOT/app" \
    --include="*.tsx" --include="*.jsx" --include="*.css" --include="*.scss" \
    2>/dev/null || true)
  
  if [ -n "$results" ]; then
    echo "$results" | while IFS= read -r line; do
      echo "  ⚠ $line"
      ((VIOLATION_COUNT++))
    done
  fi
fi

if [ -d "$PROJECT_ROOT/components" ]; then
  results=$(grep -rn -E "$COLOR_PATTERN" "$PROJECT_ROOT/components" \
    --include="*.tsx" --include="*.jsx" --include="*.css" --include="*.scss" \
    2>/dev/null || true)
  
  if [ -n "$results" ]; then
    echo "$results" | while IFS= read -r line; do
      echo "  ⚠ $line"
      ((VIOLATION_COUNT++))
    done
  fi
fi

echo ""
echo "Scanning for hardcoded pixel values..."

if [ -d "$PROJECT_ROOT/app" ]; then
  results=$(grep -rn -E "$PX_PATTERN" "$PROJECT_ROOT/app" \
    --include="*.tsx" --include="*.jsx" \
    2>/dev/null || true)
  
  if [ -n "$results" ]; then
    echo "$results" | head -n 20 | while IFS= read -r line; do
      echo "  ⚠ $line"
    done
  fi
fi

echo ""
echo "==========================================="
echo "Found $VIOLATION_COUNT potential hardcoded values"
echo ""
echo "Recommendation: Use Tailwind classes or CSS variables"
echo "  - Colors: Use Tailwind color classes or theme.colors"
echo "  - Spacing: Use Tailwind spacing scale or rem units"
echo "==========================================="
