#!/bin/bash
# Web-React Adapter - Refactorer - Split File
#
# Intelligently splits large files into smaller, maintainable modules
# Adapter implementation used by:
#   aurora/agents/refactorer/tools/split-file.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"

# Shared logger from Aurora core system
# shellcheck disable=SC1090
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

# Configuration
TARGET_FILE="${1:-}"
STRATEGY="${STRATEGY:-auto}"  # auto | component | utility | type
DRY_RUN="${DRY_RUN:-false}"
MAX_LINES_PER_FILE="${MAX_LINES_PER_FILE:-200}"

if [ -z "$TARGET_FILE" ]; then
  log_error "Usage: $0 <file-path> [STRATEGY=auto|component|utility|type] [DRY_RUN=true|false]"
  log_info "Example: $0 src/features/home/Home.tsx"
  log_info "Example: STRATEGY=component $0 src/features/home/Home.tsx"
  exit 1
fi

if [ ! -f "$TARGET_FILE" ]; then
  log_error "File not found: $TARGET_FILE"
  exit 1
fi

log_section "Refactorer - Split File (web-react)"
log_info "Target: $TARGET_FILE"
log_info "Strategy: $STRATEGY"
log_info "Max lines per file: $MAX_LINES_PER_FILE"
log_info "Mode: $([ "$DRY_RUN" = "true" ] && echo "DRY RUN" || echo "LIVE")"

# Analyze file
FILE_DIR="$(dirname "$TARGET_FILE")"
FILE_NAME="$(basename "$TARGET_FILE")"
FILE_BASE="${FILE_NAME%.*}"
FILE_EXT="${FILE_NAME##*.}"

TOTAL_LINES=$(wc -l < "$TARGET_FILE" | tr -d ' ')

log_separator
log_info "File analysis:"
log_info "  Total lines: $TOTAL_LINES"

if [ "$TOTAL_LINES" -lt "$MAX_LINES_PER_FILE" ]; then
  log_success "File is within size limit ($TOTAL_LINES < $MAX_LINES_PER_FILE lines)"
  log_info "No splitting needed"
  exit 0
fi

log_warn "File exceeds limit ($TOTAL_LINES > $MAX_LINES_PER_FILE lines)"
log_info "Analyzing structure for splitting..."

# Detect file type and content
HAS_REACT=$(grep -c "React\|JSX\|tsx" "$TARGET_FILE" || echo "0")
HAS_TYPES=$(grep -c "^export type\|^export interface" "$TARGET_FILE" || echo "0")
HAS_FUNCTIONS=$(grep -c "^export function\|^export const.*=" "$TARGET_FILE" || echo "0")
HAS_COMPONENTS=$(grep -c "^export.*function.*{" "$TARGET_FILE" || echo "0")

log_info "  React/JSX:     $HAS_REACT occurrences"
log_info "  Types:         $HAS_TYPES exports"
log_info "  Functions:     $HAS_FUNCTIONS exports"
log_info "  Components:    $HAS_COMPONENTS exports"

# Determine strategy
if [ "$STRATEGY" = "auto" ]; then
  if [ "$HAS_TYPES" -gt 3 ]; then
    STRATEGY="type"
    log_info "Auto-detected strategy: type (extract types)"
  elif [ "$HAS_COMPONENTS" -gt 1 ]; then
    STRATEGY="component"
    log_info "Auto-detected strategy: component (extract sub-components)"
  elif [ "$HAS_FUNCTIONS" -gt 3 ]; then
    STRATEGY="utility"
    log_info "Auto-detected strategy: utility (split utilities)"
  else
    STRATEGY="component"
    log_info "Auto-detected strategy: component (default)"
  fi
fi

log_separator
log_section "Split Strategy: $STRATEGY"

# Create output directory
OUTPUT_DIR="$FILE_DIR/components"
if [ "$STRATEGY" = "utility" ]; then
  OUTPUT_DIR="$FILE_DIR/utils"
elif [ "$STRATEGY" = "type" ]; then
  OUTPUT_DIR="$FILE_DIR/types"
fi

# Analyze what to extract
declare -a EXTRACTIONS=()

case "$STRATEGY" in
  "type")
    log_info "Extracting types and interfaces..."
    
    # Find all type/interface exports
    while IFS= read -r line; do
      if [ -n "$line" ]; then
        name=$(echo "$line" | sed -E 's/export (type|interface) ([a-zA-Z0-9_]+).*/\2/')
        EXTRACTIONS+=("type:$name")
        log_info "  - $name (type)"
      fi
    done < <(grep -E "^export (type|interface)" "$TARGET_FILE" || true)
    
    if [ ${#EXTRACTIONS[@]} -eq 0 ]; then
      log_warn "No exportable types found"
      exit 0
    fi
    
    # Propose: types.ts
    log_separator
    log_info "Proposed structure:"
    log_info "  $OUTPUT_DIR/types.ts       (all types and interfaces)"
    log_info "  $TARGET_FILE               (updated with type imports)"
    ;;
    
  "component")
    log_info "Extracting sub-components..."
    
    # Find component functions (simplified detection)
    while IFS= read -r line; do
      if [ -n "$line" ]; then
        name=$(echo "$line" | sed -E 's/.*function ([a-zA-Z0-9_]+).*/\1/')
        if [ "$name" != "$FILE_BASE" ]; then
          EXTRACTIONS+=("component:$name")
          log_info "  - $name (component)"
        fi
      fi
    done < <(grep -E "^(export )?(function|const) [A-Z]" "$TARGET_FILE" || true)
    
    if [ ${#EXTRACTIONS[@]} -eq 0 ]; then
      log_warn "No extractable sub-components found"
      log_info "Consider manual refactoring or utility split strategy"
      exit 0
    fi
    
    # Propose: components/ComponentName.tsx
    log_separator
    log_info "Proposed structure:"
    for extraction in "${EXTRACTIONS[@]}"; do
      comp_name=$(echo "$extraction" | cut -d: -f2)
      log_info "  $OUTPUT_DIR/$comp_name.tsx    (extracted component)"
    done
    log_info "  $OUTPUT_DIR/index.ts           (barrel export)"
    log_info "  $TARGET_FILE                   (updated main component)"
    ;;
    
  "utility")
    log_info "Extracting utility functions..."
    
    # Find all function exports
    while IFS= read -r line; do
      if [ -n "$line" ]; then
        name=$(echo "$line" | sed -E 's/export (function|const) ([a-zA-Z0-9_]+).*/\2/')
        EXTRACTIONS+=("function:$name")
        log_info "  - $name (function)"
      fi
    done < <(grep -E "^export (function|const)" "$TARGET_FILE" || true)
    
    if [ ${#EXTRACTIONS[@]} -eq 0 ]; then
      log_warn "No extractable functions found"
      exit 0
    fi
    
    # Propose: utils/functionName.ts or utils/utilities.ts
    log_separator
    log_info "Proposed structure:"
    if [ ${#EXTRACTIONS[@]} -gt 5 ]; then
      log_info "  $OUTPUT_DIR/utilities.ts   (all utility functions)"
    else
      for extraction in "${EXTRACTIONS[@]}"; do
        func_name=$(echo "$extraction" | cut -d: -f2)
        log_info "  $OUTPUT_DIR/$func_name.ts  (extracted function)"
      done
    fi
    log_info "  $OUTPUT_DIR/index.ts       (barrel export)"
    log_info "  $TARGET_FILE               (updated with imports)"
    ;;
esac

# Calculate estimated new file sizes
num_extractions=${#EXTRACTIONS[@]}
lines_per_extraction=$((TOTAL_LINES / (num_extractions + 1)))

log_separator
log_section "Estimated Impact"
echo "  Current file size:     $TOTAL_LINES lines"
echo "  Number of extractions: $num_extractions"
echo "  Avg lines per file:    ~$lines_per_extraction lines"
echo ""
echo "  Complexity reduction:  $(( (TOTAL_LINES - MAX_LINES_PER_FILE) * 100 / TOTAL_LINES ))%"
echo "  Maintainability:       Improved"
echo "  Testability:           Improved (isolated tests)"
echo "  Reusability:           Improved (smaller modules)"

# Implementation guidance
log_separator
log_section "Implementation Steps"

case "$STRATEGY" in
  "type")
    cat <<EOF

1. Create types file:
   mkdir -p "$OUTPUT_DIR"
   touch "$OUTPUT_DIR/types.ts"

2. Move type definitions:
   - Cut all 'export type' and 'export interface' from $TARGET_FILE
   - Paste into $OUTPUT_DIR/types.ts

3. Update imports in $TARGET_FILE:
   import type { TypeName1, TypeName2 } from './types/types'

4. Update other imports across project:
   - Find files importing types from $TARGET_FILE
   - Update to import from './types/types'

5. Verify:
   npm run lint
   npm run type-check
   npm test

EOF
    ;;
    
  "component")
    cat <<EOF

1. Create components directory:
   mkdir -p "$OUTPUT_DIR"

2. For each sub-component:
   - Create $OUTPUT_DIR/ComponentName.tsx
   - Move component function and related code
   - Add necessary imports (React, types, hooks)
   - Export component

3. Create barrel export:
   # $OUTPUT_DIR/index.ts
   export { Component1 } from './Component1'
   export { Component2 } from './Component2'

4. Update $TARGET_FILE:
   import { Component1, Component2 } from './components'

5. Verify:
   npm run lint
   npm test
   npm run dev (visual check)

EOF
    ;;
    
  "utility")
    cat <<EOF

1. Create utils directory:
   mkdir -p "$OUTPUT_DIR"

2. Move utility functions:
   - Create separate files or combined utilities.ts
   - Move function implementations
   - Add necessary imports

3. Create barrel export:
   # $OUTPUT_DIR/index.ts
   export { func1, func2 } from './utilities'

4. Update $TARGET_FILE:
   import { func1, func2 } from './utils'

5. Update tests:
   - Update test imports
   - Consider splitting tests too

6. Verify:
   npm run lint
   npm test

EOF
    ;;
esac

log_separator

if [ "$DRY_RUN" = "false" ]; then
  log_warn "LIVE MODE: This tool provides guidance only"
  log_info "Automatic splitting requires AI-assisted code analysis"
  log_info "Recommended: Use this guidance to manually refactor"
  log_info ""
  log_info "Or request @refactorer agent for interactive refactoring"
  exit 0
else
  log_info "DRY RUN - Analysis complete"
  log_info "Set DRY_RUN=false for implementation guidance"
  exit 0
fi
