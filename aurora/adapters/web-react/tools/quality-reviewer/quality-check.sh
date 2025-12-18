#!/bin/bash
# Web-React Adapter - Quality Reviewer - Quality Check
#
# This script contains the project-type specific implementation.
# The universal entrypoint lives at:
#   aurora/agents/quality-reviewer/tools/quality-check.sh
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Config
README_LIMIT=200
TECH_DOC_LIMIT=200
COMMAND_LIMIT=600

# Counters
total_violations=0
check_count=0

# Options
OUTPUT_MODE="summary"  # summary | detailed | verbose
RUN_CHECKS="all"       # all | docs

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --summary) OUTPUT_MODE="summary"; shift ;;
    --detailed) OUTPUT_MODE="detailed"; shift ;;
    --verbose) OUTPUT_MODE="verbose"; shift ;;
    --all) RUN_CHECKS="all"; shift ;;
    --docs) RUN_CHECKS="docs"; shift ;;
    --help)
      echo "Code Quality Review - Web React Adapter"
      echo ""
      echo "Usage: quality-check.sh [mode]"
      echo ""
      echo "Output Modes:"
      echo "  --summary     Show pass/fail summary only (default)"
      echo "  --detailed    Show violations with file names"
      echo "  --verbose     Show violations with line numbers"
      echo ""
      echo "Checks:"
      echo "  --all             Run all checks (default)"
      echo "  --docs            Check documentation limits only"
      echo ""
      echo "Checks included:"
      echo "  - File sizes (components <300, utils <150 lines)"
      echo "  - Function sizes (<50 lines) - heuristic backup"
      echo "  - Documentation limits"
      echo ""
      echo "Note: ESLint is the primary enforcement. These bash checks"
      echo "      provide redundant safety if ESLint is bypassed."
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# Utility functions
print_header() {
  if [[ $OUTPUT_MODE != "summary" ]]; then
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  fi
}

print_check() {
  check_count=$((check_count + 1))
  if [[ $OUTPUT_MODE == "summary" ]]; then
    echo -n "[$check_count] $1: "
  else
    echo ""
    echo -e "${YELLOW}[$check_count] Checking: $1${NC}"
  fi
}

print_pass() {
  if [[ $OUTPUT_MODE == "summary" ]]; then
    echo -e "${GREEN}✓${NC}"
  else
    echo -e "${GREEN}✓ PASS${NC}"
  fi
}

print_fail() {
  local count=$1
  total_violations=$((total_violations + count))
  if [[ $OUTPUT_MODE == "summary" ]]; then
    echo -e "${RED}✗ ($count violations)${NC}"
  else
    echo -e "${RED}✗ FAIL - $count violation(s)${NC}"
  fi
}

# File size limits (redundant safety net - ESLint is primary enforcement)
FILE_SIZE_LIMIT=300
UTIL_SIZE_LIMIT=150
FUNCTION_SIZE_LIMIT=50

# Check: File sizes (backup for ESLint max-lines rule)
check_file_sizes() {
  print_check "File sizes (components <$FILE_SIZE_LIMIT, utils <$UTIL_SIZE_LIMIT lines)"
  local violations=0

  # Check component files (src/features, src/shared/components)
  while IFS= read -r file; do
    if [ -f "$file" ]; then
      lines=$(wc -l < "$file" | tr -d ' ')
      if [ "$lines" -gt "$FILE_SIZE_LIMIT" ]; then
        violations=$((violations + 1))
        if [[ $OUTPUT_MODE == "detailed" ]]; then
          echo "  ❌ $file ($lines lines, limit: $FILE_SIZE_LIMIT)"
        elif [[ $OUTPUT_MODE == "verbose" ]]; then
          echo "  ❌ $file"
          echo "     Lines: $lines (limit: $FILE_SIZE_LIMIT)"
          echo "     Action: Split into smaller components"
        fi
      fi
    fi
  done < <(find src/features src/shared/components -name "*.tsx" -o -name "*.ts" 2>/dev/null | grep -v ".test." | grep -v node_modules)

  # Check utility files (src/shared/utils, src/shared/hooks)
  while IFS= read -r file; do
    if [ -f "$file" ]; then
      lines=$(wc -l < "$file" | tr -d ' ')
      if [ "$lines" -gt "$UTIL_SIZE_LIMIT" ]; then
        violations=$((violations + 1))
        if [[ $OUTPUT_MODE == "detailed" ]]; then
          echo "  ❌ $file ($lines lines, limit: $UTIL_SIZE_LIMIT)"
        elif [[ $OUTPUT_MODE == "verbose" ]]; then
          echo "  ❌ $file"
          echo "     Lines: $lines (limit: $UTIL_SIZE_LIMIT)"
          echo "     Action: Extract functions to separate files"
        fi
      fi
    fi
  done < <(find src/shared/utils src/shared/hooks -name "*.ts" 2>/dev/null | grep -v ".test." | grep -v node_modules)

  if [ $violations -eq 0 ]; then
    print_pass
  else
    print_fail $violations
  fi
}

# Check: Function sizes (backup for ESLint max-lines-per-function rule)
# Uses simple heuristic: count lines between function declarations
check_function_sizes() {
  print_check "Function sizes (<$FUNCTION_SIZE_LIMIT lines) - heuristic check"
  local violations=0

  # Simple heuristic: look for very large function blocks
  # This is a backup check - ESLint provides accurate enforcement
  while IFS= read -r file; do
    if [ -f "$file" ]; then
      # Count consecutive non-empty lines in function bodies (rough estimate)
      # Look for patterns that suggest large functions
      large_blocks=$(awk '
        /^[[:space:]]*(export )?(async )?(function|const.*=>)/ { in_func=1; count=0 }
        in_func && /^[[:space:]]*}/ { if (count > 50) print FILENAME ":" NR; in_func=0 }
        in_func { count++ }
      ' "$file" 2>/dev/null | wc -l | tr -d ' ')

      if [ "$large_blocks" -gt 0 ]; then
        violations=$((violations + large_blocks))
        if [[ $OUTPUT_MODE != "summary" ]]; then
          echo "  ⚠️  $file may have large functions (run ESLint for accurate check)"
        fi
      fi
    fi
  done < <(find src -name "*.tsx" -o -name "*.ts" 2>/dev/null | grep -v ".test." | grep -v node_modules | head -20)

  if [ $violations -eq 0 ]; then
    print_pass
  else
    # Warn but don't fail - this is a heuristic, ESLint is authoritative
    echo -e "${YELLOW}⚠️  ($violations potential issues - verify with ESLint)${NC}"
  fi
}

# Check: Documentation limits
check_docs() {
  print_check "Documentation limits (README <$README_LIMIT, commands <$COMMAND_LIMIT)"
  local violations=0

  # Check README.md files
  while IFS= read -r file; do
    lines=$(wc -l < "$file" | tr -d ' ')
    if [ "$lines" -gt "$README_LIMIT" ]; then
      violations=$((violations + 1))
      if [[ $OUTPUT_MODE == "detailed" ]]; then
        echo "  ❌ $file ($lines lines, limit: $README_LIMIT)"
      elif [[ $OUTPUT_MODE == "verbose" ]]; then
        echo "  ❌ $file"
        echo "     Lines: $lines (limit: $README_LIMIT)"
        echo "     Action: Trim or split content"
      fi
    fi
  done < <(find . -name "README.md" -not -path "*/node_modules/*" 2>/dev/null)

  # Check Aurora tech-stack docs (allow, but keep them bounded)
  if [ -d "aurora/project-docs/tech-stack" ]; then
    while IFS= read -r file; do
      lines=$(wc -l < "$file" | tr -d ' ')
      if [ "$lines" -gt "$TECH_DOC_LIMIT" ]; then
        violations=$((violations + 1))
        if [[ $OUTPUT_MODE == "detailed" ]]; then
          echo "  ❌ $file ($lines lines, limit: $TECH_DOC_LIMIT)"
        elif [[ $OUTPUT_MODE == "verbose" ]]; then
          echo "  ❌ $file"
          echo "     Lines: $lines (limit: $TECH_DOC_LIMIT)"
          echo "     Action: Trim to reduce token bloat"
        fi
      fi
    done < <(find aurora/project-docs/tech-stack -name "*.md" 2>/dev/null)
  fi

  # Check bot/commands/*.md files
  if [ -d "bot/commands" ]; then
    while IFS= read -r file; do
      lines=$(wc -l < "$file" | tr -d ' ')
      if [ "$lines" -gt "$COMMAND_LIMIT" ]; then
        violations=$((violations + 1))
        if [[ $OUTPUT_MODE == "detailed" ]]; then
          echo "  ❌ $file ($lines lines, limit: $COMMAND_LIMIT)"
        elif [[ $OUTPUT_MODE == "verbose" ]]; then
          echo "  ❌ $file"
          echo "     Lines: $lines (limit: $COMMAND_LIMIT)"
          echo "     Action: Condense instructions"
        fi
      fi
    done < <(find bot/commands -name "*.md" 2>/dev/null)
  fi

  # Check for unauthorized .md files
  # Policy: keep markdown sprawl under control.
  # Allowed:
  # - README.md (anywhere)
  # - aurora/project-docs/tech-stack/**/*.md (bounded by TECH_DOC_LIMIT)
  # - ./bot/** (project automation docs)
  # - ./agents/** (project-level agent specs)
  # - ./aurora-cli/** (CLI docs/templates)
  # - .cursor/** (workspace tooling)
  while IFS= read -r file; do
    violations=$((violations + 1))
    if [[ $OUTPUT_MODE == "detailed" ]]; then
      echo "  ❌ $file (unauthorized markdown file)"
    elif [[ $OUTPUT_MODE == "verbose" ]]; then
      echo "  ❌ $file"
      echo "     Unauthorized markdown file"
      echo "     Allowed: README.md (anywhere), aurora/project-docs/tech-stack/**/*.md, ./bot/**, ./agents/**, ./aurora-cli/**, .cursor/**"
    fi
  done < <(
    find . -name "*.md" \
      -not -path "*/node_modules/*" \
      -not -name "README.md" \
      -not -path "./bot/*" \
      -not -path "./agents/*" \
      -not -path "./aurora-cli/*" \
      -not -path "*/aurora/project-docs/tech-stack/*" \
      -not -path "*/.cursor/*" \
      2>/dev/null
  )

  if [ $violations -eq 0 ]; then
    print_pass
  else
    print_fail $violations
  fi
}

# Check: Bot documentation self-check
check_bot_docs() {
  print_check "Bot documentation self-check"
  local violations=0

  # Check bot/README.md
  if [ -f "bot/README.md" ]; then
    lines=$(wc -l < "bot/README.md" | tr -d ' ')
    if [ "$lines" -gt "$README_LIMIT" ]; then
      violations=$((violations + 1))
      if [[ $OUTPUT_MODE == "detailed" ]]; then
        echo "  ❌ bot/README.md ($lines lines, limit: $README_LIMIT)"
      elif [[ $OUTPUT_MODE == "verbose" ]]; then
        echo "  ❌ bot/README.md"
        echo "     Lines: $lines (limit: $README_LIMIT)"
        echo "     Action: Bot docs need trimming"
      fi
    fi
  fi

  # Check bot/commands/code-quality-review.md
  if [ -f "bot/commands/code-quality-review.md" ]; then
    lines=$(wc -l < "bot/commands/code-quality-review.md" | tr -d ' ')
    if [ "$lines" -gt "$COMMAND_LIMIT" ]; then
      violations=$((violations + 1))
      if [[ $OUTPUT_MODE == "detailed" ]]; then
        echo "  ❌ bot/commands/code-quality-review.md ($lines lines, limit: $COMMAND_LIMIT)"
      elif [[ $OUTPUT_MODE == "verbose" ]]; then
        echo "  ❌ bot/commands/code-quality-review.md"
        echo "     Lines: $lines (limit: $COMMAND_LIMIT)"
        echo "     Action: Command file near limit - monitor growth"
      fi
    fi
  fi

  if [ $violations -eq 0 ]; then
    print_pass
  else
    print_fail $violations
  fi
}

# Main execution
main() {
  if [[ $OUTPUT_MODE == "summary" ]]; then
    echo -e "${BLUE}Code Quality Review - Web React Adapter${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  else
    print_header "Code Quality Review - Web React Adapter"
  fi

  # Run selected checks
  if [[ $RUN_CHECKS == "all" ]]; then
    check_file_sizes
    check_function_sizes
    check_docs
    check_bot_docs
  elif [[ $RUN_CHECKS == "docs" ]]; then
    check_docs
  fi

  # Summary
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if [ $total_violations -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed ($check_count/$check_count)${NC}"
    exit 0
  else
    echo -e "${RED}✗ $total_violations violation(s) found across $check_count check(s)${NC}"
    if [[ $OUTPUT_MODE == "summary" ]]; then
      echo ""
      echo "Run with --detailed or --verbose for more information"
    fi
    exit 1
  fi
}

main

