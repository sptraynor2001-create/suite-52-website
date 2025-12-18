#!/bin/bash
#
# Express API Adapter - Quality Check
#
# Runs quality checks for Express API projects using Aurora quality standards.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADAPTER_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CORE_DIR="$(cd "$ADAPTER_DIR/../../core" && pwd)"

# shellcheck source=../../../core/adapter-loader.sh
source "$CORE_DIR/adapter-loader.sh"

PROJECT_ROOT="$(aurora_project_root)"
ADAPTER_CONFIG="$(aurora_adapter_config_path)"

echo "🔍 Running Express API Quality Check"
echo "====================================="
echo ""

# Load adapter config
if ! aurora_require_cmd jq; then
  exit 1
fi

MAX_FILE_LINES=$(jq -r '.quality_limits.max_file_lines' "$ADAPTER_CONFIG")
MAX_ROUTE_HANDLERS=$(jq -r '.quality_limits.max_route_handlers' "$ADAPTER_CONFIG")
REQUIRE_ERROR_HANDLING=$(jq -r '.api_specific.require_error_handling' "$ADAPTER_CONFIG")

echo "Quality Limits:"
echo "  Max file lines: $MAX_FILE_LINES"
echo "  Max route handlers per file: $MAX_ROUTE_HANDLERS"
echo "  Require error handling: $REQUIRE_ERROR_HANDLING"
echo ""

# Track violations
VIOLATION_COUNT=0

# Check file line counts
echo "Checking file sizes..."
FILE_PATTERNS=$(jq -r '.file_patterns.source[]' "$ADAPTER_CONFIG")

while IFS= read -r pattern; do
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

# Check for error handling in routes
if [ "$REQUIRE_ERROR_HANDLING" = "true" ]; then
  echo "Checking error handling..."
  
  # Find route files
  route_files=$(find "$PROJECT_ROOT" -type f \( -path "*/routes/*.ts" -o -path "*/routes/*.js" -o -path "*/controllers/*.ts" -o -path "*/controllers/*.js" \) 2>/dev/null || true)
  
  for route_file in $route_files; do
    if [ -f "$route_file" ]; then
      # Check for try-catch or error middleware
      if ! grep -q -E "(try\s*\{|\.catch\(|next\(.*error)" "$route_file" 2>/dev/null; then
        echo "  ⚠ $route_file: Missing error handling"
        ((VIOLATION_COUNT++))
      fi
    fi
  done
fi

echo ""

# Check for too many route handlers in one file
echo "Checking route handler density..."

route_files=$(find "$PROJECT_ROOT" -type f \( -path "*/routes/*.ts" -o -path "*/routes/*.js" \) 2>/dev/null || true)

for route_file in $route_files; do
  if [ -f "$route_file" ]; then
    # Count route definitions (app.get, router.post, etc.)
    route_count=$(grep -cE "(router|app)\.(get|post|put|patch|delete|use)\(" "$route_file" 2>/dev/null || echo "0")
    
    if [ "$route_count" -gt "$MAX_ROUTE_HANDLERS" ]; then
      echo "  ⚠ $route_file: $route_count route handlers (max: $MAX_ROUTE_HANDLERS)"
      echo "    Consider splitting into multiple route files"
    fi
  fi
done

echo ""

# Check for API-specific patterns
echo "Checking API patterns..."

# Check for request validation
validation_files=$(grep -r "express-validator\|joi\|yup\|zod" "$PROJECT_ROOT/src" --include="*.ts" --include="*.js" -l 2>/dev/null | wc -l || echo "0")

if [ "$validation_files" -eq 0 ]; then
  echo "  ⚠ No request validation library detected"
  echo "    Consider using express-validator, joi, or zod"
fi

# Check for logging
logging_files=$(grep -r "winston\|pino\|morgan" "$PROJECT_ROOT/src" --include="*.ts" --include="*.js" -l 2>/dev/null | wc -l || echo "0")

if [ "$logging_files" -eq 0 ]; then
  echo "  ⚠ No structured logging detected"
  echo "    Consider using winston or pino"
fi

# Check for environment variable validation
if [ ! -f "$PROJECT_ROOT/.env.example" ] && [ ! -f "$PROJECT_ROOT/.env.template" ]; then
  echo "  ⚠ No .env.example file found"
  echo "    Create .env.example to document required environment variables"
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
echo "====================================="
if [ "$VIOLATION_COUNT" -eq 0 ]; then
  echo "✅ Quality check PASSED"
  exit 0
else
  echo "❌ Quality check FAILED ($VIOLATION_COUNT violations)"
  exit 1
fi
