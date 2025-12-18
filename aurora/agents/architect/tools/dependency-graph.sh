#!/bin/bash
# dependency-graph.sh - Analyze dependencies and detect circular dependencies
# Usage: ./aurora/agents/architect/tools/dependency-graph.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source shared logger
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

log_info "🕸️  Analyzing dependency graph..."

echo ""
echo "═══════════════════════════════════════"
echo "  DEPENDENCY ANALYSIS"
echo "═══════════════════════════════════════"
echo ""

# 1. Feature Dependencies
echo "📊 FEATURE DEPENDENCIES"
echo ""

cd "$PROJECT_ROOT/src/features" 2>/dev/null || {
  log_warning "No features directory found"
  exit 0
}

FEATURES=$(find . -maxdepth 1 -type d | tail -n +2 | sed 's|./||')

for feature in $FEATURES; do
  echo "  $feature:"
  
  # Find imports from other features
  OTHER_IMPORTS=$(find "$feature" -name "*.tsx" -o -name "*.ts" | xargs grep -h "from.*features/" 2>/dev/null | grep -v "from.*features/$feature" || true)
  
  if [ -z "$OTHER_IMPORTS" ]; then
    echo "    ✅ Self-contained (no external feature dependencies)"
  else
    echo "    ⚠️  Imports from other features:"
    echo "$OTHER_IMPORTS" | sed 's/.*features\/\([^/]*\).*/      - \1/' | sort -u
  fi
  echo ""
done

# 2. Circular Dependency Detection
echo "🔄 CIRCULAR DEPENDENCY CHECK"
echo ""

CIRCULAR_FOUND=false

cd "$PROJECT_ROOT/src"

# Simple circular dependency check using import graph
declare -A import_map

# Build import map
while IFS= read -r file; do
  RELATIVE_FILE="${file#$PROJECT_ROOT/src/}"
  
  # Get all imports from this file
  IMPORTS=$(grep -E "^import.*from ['\"]" "$file" | sed -E "s/.*from ['\"](.*)['\"].*/\1/" || true)
  
  while IFS= read -r import; do
    # Convert relative imports to absolute
    if [[ "$import" == ./* ]] || [[ "$import" == ../* ]]; then
      # Skip relative path resolution for now (complex)
      continue
    fi
    
    # Store dependency
    import_map["$RELATIVE_FILE"]+="$import "
  done <<< "$IMPORTS"
done < <(find . -name "*.tsx" -o -name "*.ts")

# Simple check: A imports B, B imports A
for file in "${!import_map[@]}"; do
  for dep in ${import_map[$file]}; do
    # Check if dep imports file back
    if [[ "${import_map[$dep]}" == *"$file"* ]]; then
      echo "  ⚠️  Circular dependency detected:"
      echo "     $file ←→ $dep"
      echo ""
      CIRCULAR_FOUND=true
    fi
  done
done

if [ "$CIRCULAR_FOUND" = false ]; then
  echo "  ✅ No obvious circular dependencies found"
  echo ""
fi

# 3. Dependency Depth
echo "📏 DEPENDENCY DEPTH"
echo ""

cd "$PROJECT_ROOT"

# Count total imports per file
HIGH_COUPLING=$(find src -name "*.tsx" -o -name "*.ts" | while read -r file; do
  IMPORT_COUNT=$(grep -c "^import" "$file" || echo 0)
  
  if [ "$IMPORT_COUNT" -gt 10 ]; then
    RELATIVE_FILE="${file#$PROJECT_ROOT/}"
    echo "$RELATIVE_FILE: $IMPORT_COUNT imports"
  fi
done)

if [ -z "$HIGH_COUPLING" ]; then
  echo "  ✅ All files have reasonable dependency count"
else
  echo "  ⚠️  High coupling (>10 imports):"
  echo "$HIGH_COUPLING" | while read -r line; do
    echo "     $line"
  done
  echo ""
  echo "  Consider: Split into smaller modules or use facade pattern"
fi
echo ""

# 4. External Dependencies
echo "📦 EXTERNAL DEPENDENCIES"
echo ""

if [ -f "$PROJECT_ROOT/package.json" ]; then
  DEPS_COUNT=$(grep -c '"' "$PROJECT_ROOT/package.json" | grep dependencies -A 50 || echo 0)
  
  # Check for unused dependencies (rough heuristic)
  echo "  Total dependencies in package.json:"
  
  PROD_DEPS=$(node -e "console.log(Object.keys(require('./package.json').dependencies || {}).length)")
  DEV_DEPS=$(node -e "console.log(Object.keys(require('./package.json').devDependencies || {}).length)")
  
  echo "    Production: $PROD_DEPS"
  echo "    Development: $DEV_DEPS"
  echo ""
  
  if [ "$PROD_DEPS" -gt 20 ]; then
    echo "  💡 Large number of production dependencies"
    echo "     Consider: Bundle analysis to check tree-shaking"
  fi
fi
echo ""

# Summary
echo "═══════════════════════════════════════"
echo "  RECOMMENDATIONS"
echo "═══════════════════════════════════════"
echo ""

if [ "$CIRCULAR_FOUND" = true ]; then
  echo "1. [CRITICAL] Fix circular dependencies"
  echo "   These can cause build issues and runtime bugs"
  echo ""
fi

if [ -n "$HIGH_COUPLING" ]; then
  echo "2. Reduce high coupling"
  echo "   Split large files or use dependency injection"
  echo ""
fi

echo "Next steps:"
echo "  1. Review dependency warnings above"
echo "  2. Run: @refactorer to restructure high-coupling files"
echo "  3. Run: @architect analyze-architecture for full analysis"
echo ""

exit 0
