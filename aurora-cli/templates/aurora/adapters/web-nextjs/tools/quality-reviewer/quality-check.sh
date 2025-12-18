#!/bin/bash
#
# Next.js Adapter - Quality Check
#
# Runs quality checks for Next.js projects using Aurora quality standards.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADAPTER_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CORE_DIR="$(cd "$ADAPTER_DIR/../../core" && pwd)"

# shellcheck source=../../../core/adapter-loader.sh
source "$CORE_DIR/adapter-loader.sh"

PROJECT_ROOT="$(aurora_project_root)"
ADAPTER_CONFIG="$(aurora_adapter_config_path)"

echo "🔍 Running Next.js Quality Check"
echo "=================================="
echo ""

# Load adapter config
if ! aurora_require_cmd jq; then
  exit 1
fi

MAX_FILE_LINES=$(jq -r '.quality_limits.max_file_lines' "$ADAPTER_CONFIG")
MAX_COMPLEXITY=$(jq -r '.quality_limits.max_complexity' "$ADAPTER_CONFIG")

echo "Quality Limits:"
echo "  Max file lines: $MAX_FILE_LINES"
echo "  Max complexity: $MAX_COMPLEXITY"
echo ""

# Track violations
VIOLATION_COUNT=0

# Check file line counts
echo "Checking file sizes..."
FILE_PATTERNS=$(jq -r '.file_patterns.source[]' "$ADAPTER_CONFIG")

while IFS= read -r pattern; do
  # Find files matching pattern
  files=$(find "$PROJECT_ROOT" -type f -path "$PROJECT_ROOT/$pattern" 2>/dev/null || true)
  
  for file in $files; do
    if [ -f "$file" ]; then
      line_count=$(wc -l < "$file" | tr -d ' ')
      if [ "$line_count" -gt "$MAX_FILE_LINES" ]; then
        echo "  ❌ $file: $line_count lines (max: $MAX_FILE_LINES)"
        ((VIOLATION_COUNT++))
      fi
    fi
  done
done <<< "$FILE_PATTERNS"

echo ""

# Check for common Next.js anti-patterns
echo "Checking Next.js patterns..."

# Check for use-client in server components directory
if [ -d "$PROJECT_ROOT/app" ]; then
  server_components_with_client=$(grep -r "use client" "$PROJECT_ROOT/app" --include="*.tsx" --include="*.jsx" 2>/dev/null | wc -l || echo "0")
  if [ "$server_components_with_client" -gt 0 ]; then
    echo "  ⚠ Found $server_components_with_client 'use client' directives in app directory"
    echo "    Consider moving client components to a separate directory"
  fi
fi

# Check for missing metadata in pages
if [ -d "$PROJECT_ROOT/app" ]; then
  pages_without_metadata=$(find "$PROJECT_ROOT/app" -name "page.tsx" -o -name "page.jsx" | while read -r page; do
    if ! grep -q "metadata" "$page" 2>/dev/null; then
      echo "$page"
    fi
  done | wc -l)
  
  if [ "$pages_without_metadata" -gt 0 ]; then
    echo "  ⚠ Found $pages_without_metadata pages without metadata export"
  fi
fi

echo ""

# Run ESLint if available
if [ -x "$(command -v npm)" ] && [ -f "$PROJECT_ROOT/package.json" ]; then
  echo "Running ESLint..."
  cd "$PROJECT_ROOT"
  if npm run lint --silent 2>&1; then
    echo "  ✓ ESLint passed"
  else
    echo "  ❌ ESLint failed"
    ((VIOLATION_COUNT++))
  fi
fi

echo ""
echo "=================================="
if [ "$VIOLATION_COUNT" -eq 0 ]; then
  echo "✅ Quality check PASSED"
  exit 0
else
  echo "❌ Quality check FAILED ($VIOLATION_COUNT violations)"
  exit 1
fi
