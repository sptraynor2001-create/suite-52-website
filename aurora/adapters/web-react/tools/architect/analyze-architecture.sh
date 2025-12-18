#!/bin/bash
# Web-React Adapter - Architect - Analyze Architecture
#
# Comprehensive architecture analysis for React projects
# Adapter implementation used by:
#   aurora/agents/architect/tools/analyze-architecture.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"

# Shared logger from Aurora core system
# shellcheck disable=SC1090
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

# Configuration
TARGET_PATH="${1:-src/}"
OUTPUT_FORMAT="${2:-text}"  # text | xml | json
FULL_PATH="$PROJECT_ROOT/$TARGET_PATH"

if [ ! -d "$FULL_PATH" ]; then
  log_error "Path not found: $FULL_PATH"
  exit 1
fi

log_section "Architect - Architecture Analysis (web-react)"
log_info "Target: $TARGET_PATH"
log_info "Output: $OUTPUT_FORMAT"

# Analysis counters
total_files=0
total_lines=0
large_files=0
complex_files=0
circular_risk=0

# 1. DIRECTORY STRUCTURE ANALYSIS
log_separator
log_info "Analyzing directory structure..."

features_count=0
if [ -d "$FULL_PATH/features" ]; then
  features_count=$(find "$FULL_PATH/features" -maxdepth 1 -type d 2>/dev/null | tail -n +2 | wc -l | tr -d ' ')
fi

shared_components=0
if [ -d "$FULL_PATH/shared/components" ]; then
  shared_components=$(find "$FULL_PATH/shared/components" -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
fi

shared_hooks=0
if [ -d "$FULL_PATH/shared/hooks" ]; then
  shared_hooks=$(find "$FULL_PATH/shared/hooks" -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
fi

shared_utils=0
if [ -d "$FULL_PATH/shared/utils" ]; then
  shared_utils=$(find "$FULL_PATH/shared/utils" -name "*.ts" 2>/dev/null | wc -l | tr -d ' ')
fi

log_info "  Features: $features_count"
log_info "  Shared Components: $shared_components"
log_info "  Shared Hooks: $shared_hooks"
log_info "  Shared Utils: $shared_utils"

# 2. FILE SIZE ANALYSIS
log_separator
log_info "Analyzing file sizes..."

declare -a large_file_list=()
total_files=$(find "$FULL_PATH" -name "*.tsx" -o -name "*.ts" | grep -v node_modules | wc -l | tr -d ' ')

while IFS= read -r file; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file" | tr -d ' ')
    total_lines=$((total_lines + lines))
    
    if [ "$lines" -gt 300 ]; then
      ((large_files++)) || true
      relative_path="${file#$PROJECT_ROOT/}"
      large_file_list+=("$relative_path:$lines")
      if [ "$OUTPUT_FORMAT" = "text" ]; then
        log_warn "  $relative_path: $lines lines"
      fi
    fi
  fi
done < <(find "$FULL_PATH" -name "*.tsx" -o -name "*.ts" | grep -v node_modules)

avg_file_size=$((total_files > 0 ? total_lines / total_files : 0))

if [ "$large_files" -eq 0 ]; then
  log_success "  All files under 300 lines"
else
  log_warn "  Found $large_files large files (>300 lines)"
fi

# 3. CYCLOMATIC COMPLEXITY ANALYSIS
log_separator
log_info "Analyzing complexity..."

complex_count=0
while IFS= read -r file; do
  if [ -f "$file" ]; then
    # Count complexity indicators
    if_count=$(grep -c "if\s*(" "$file" || echo "0")
    loop_count=$(grep -c "for\s*(\|while\s*(\|forEach\|map\|filter" "$file" || echo "0")
    ternary_count=$(grep -c "?" "$file" || echo "0")
    
    complexity=$((if_count + loop_count + ternary_count))
    
    if [ "$complexity" -gt 20 ]; then
      ((complex_count++)) || true
      ((complex_files++)) || true
      relative_path="${file#$PROJECT_ROOT/}"
      if [ "$OUTPUT_FORMAT" = "text" ]; then
        log_warn "  $relative_path: complexity=$complexity"
      fi
    fi
  fi
done < <(find "$FULL_PATH" -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v ".test.")

if [ "$complex_count" -eq 0 ]; then
  log_success "  All files have reasonable complexity"
else
  log_warn "  Found $complex_count high-complexity files"
fi

# 4. DEPENDENCY ANALYSIS
log_separator
log_info "Analyzing dependencies..."

cross_feature_imports=0
feature_coupling=0

if [ -d "$FULL_PATH/features" ]; then
  while IFS= read -r file; do
    if [ -f "$file" ]; then
      file_dir=$(dirname "$file")
      feature_name=$(echo "$file_dir" | grep -o "features/[^/]*" || echo "")
      
      if [ -n "$feature_name" ]; then
        # Check for imports from other features
        other_imports=$(grep "from.*features/" "$file" | grep -v "$feature_name" | wc -l | tr -d ' ')
        
        if [ "$other_imports" -gt 0 ]; then
          ((cross_feature_imports++)) || true
          ((feature_coupling++)) || true
          relative_path="${file#$PROJECT_ROOT/}"
          if [ "$OUTPUT_FORMAT" = "text" ]; then
            log_warn "  $relative_path: $other_imports cross-feature imports"
          fi
        fi
      fi
    fi
  done < <(find "$FULL_PATH/features" -name "*.tsx" -o -name "*.ts" | grep -v node_modules)
fi

if [ "$cross_feature_imports" -eq 0 ]; then
  log_success "  No cross-feature dependencies"
else
  log_warn "  Found $cross_feature_imports files with cross-feature imports"
  ((circular_risk++)) || true
fi

# 5. COMPONENT HOOK COMPLEXITY
log_separator
log_info "Analyzing component complexity..."

hook_heavy_components=0
declare -a complex_component_list=()

while IFS= read -r file; do
  if [ -f "$file" ]; then
    hooks_count=$(grep -c "useState\|useEffect\|useCallback\|useMemo\|useRef\|useContext" "$file" || echo "0")
    
    if [ "$hooks_count" -gt 5 ]; then
      ((hook_heavy_components++)) || true
      relative_path="${file#$PROJECT_ROOT/}"
      complex_component_list+=("$relative_path:$hooks_count")
      if [ "$OUTPUT_FORMAT" = "text" ]; then
        log_warn "  $relative_path: $hooks_count hooks"
      fi
    fi
  fi
done < <(find "$FULL_PATH" -name "*.tsx" | grep -v node_modules | grep -v ".test.")

if [ "$hook_heavy_components" -eq 0 ]; then
  log_success "  All components have reasonable hook usage"
else
  log_warn "  Found $hook_heavy_components hook-heavy components (>5 hooks)"
fi

# 6. CODE DISTRIBUTION ANALYSIS
log_separator
log_info "Analyzing code distribution..."

feature_lines=0
shared_lines=0

if [ -d "$FULL_PATH/features" ]; then
  feature_lines=$(find "$FULL_PATH/features" -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
fi

if [ -d "$FULL_PATH/shared" ]; then
  shared_lines=$(find "$FULL_PATH/shared" -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
fi

distribution_total=$((feature_lines + shared_lines))
shared_percentage=0

if [ "$distribution_total" -gt 0 ]; then
  shared_percentage=$((shared_lines * 100 / distribution_total))
fi

log_info "  Feature code: $feature_lines lines"
log_info "  Shared code: $shared_lines lines ($shared_percentage%)"

distribution_health="good"
if [ "$shared_percentage" -gt 40 ]; then
  log_warn "  Shared code >40% - may indicate over-abstraction"
  distribution_health="high_shared"
elif [ "$shared_percentage" -lt 10 ]; then
  log_info "  Shared code <10% - opportunity for extraction"
  distribution_health="low_shared"
else
  log_success "  Healthy feature/shared balance"
fi

# 7. PATTERN DETECTION
log_separator
log_info "Detecting patterns..."

# Check for common patterns
god_components=0
prop_drilling=0
inline_styles=0

while IFS= read -r file; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file" | tr -d ' ')
    
    # God component (>400 lines)
    if [ "$lines" -gt 400 ]; then
      ((god_components++)) || true
    fi
    
    # Prop drilling (>5 levels)
    nested_divs=$(grep -c "<div" "$file" || echo "0")
    if [ "$nested_divs" -gt 10 ]; then
      ((prop_drilling++)) || true
    fi
    
    # Inline styles
    inline_style_count=$(grep -c "style={{" "$file" || echo "0")
    if [ "$inline_style_count" -gt 3 ]; then
      ((inline_styles++)) || true
    fi
  fi
done < <(find "$FULL_PATH" -name "*.tsx" | grep -v node_modules | grep -v ".test.")

log_info "  God components (>400 lines): $god_components"
log_info "  Deeply nested components: $prop_drilling"
log_info "  Files with inline styles: $inline_styles"

# CALCULATE SCORES
log_separator
log_section "Architecture Health Score"

# Scoring system (0-100)
size_score=$((large_files > 10 ? 50 : 100 - (large_files * 5)))
complexity_score=$((complex_files > 5 ? 50 : 100 - (complex_files * 10)))
coupling_score=$((feature_coupling > 5 ? 50 : 100 - (feature_coupling * 10)))
distribution_score=$((shared_percentage > 40 || shared_percentage < 10 ? 60 : 100))
pattern_score=$((god_components > 3 ? 50 : 100 - (god_components * 15)))

total_score=$(( (size_score + complexity_score + coupling_score + distribution_score + pattern_score) / 5 ))

log_info "  File Size:         $size_score/100"
log_info "  Complexity:        $complexity_score/100"
log_info "  Coupling:          $coupling_score/100"
log_info "  Distribution:      $distribution_score/100"
log_info "  Patterns:          $pattern_score/100"
log_separator
log_info "  OVERALL SCORE:     $total_score/100"

if [ "$total_score" -ge 80 ]; then
  log_success "  Architecture is healthy! ✓"
elif [ "$total_score" -ge 60 ]; then
  log_warn "  Architecture needs minor improvements"
else
  log_error "  Architecture needs significant refactoring"
fi

# OUTPUT RESULTS
log_separator
log_section "Summary & Recommendations"

issue_count=0

if [ "$large_files" -gt 0 ]; then
  ((issue_count++)) || true
  log_info "$issue_count. Split $large_files large files"
  log_info "   Action: @refactorer split-file <file>"
fi

if [ "$complex_files" -gt 0 ]; then
  ((issue_count++)) || true
  log_info "$issue_count. Reduce complexity in $complex_files files"
  log_info "   Action: Extract functions, simplify logic"
fi

if [ "$feature_coupling" -gt 0 ]; then
  ((issue_count++)) || true
  log_info "$issue_count. Reduce cross-feature dependencies ($feature_coupling files)"
  log_info "   Action: Extract shared code to shared/"
fi

if [ "$hook_heavy_components" -gt 0 ]; then
  ((issue_count++)) || true
  log_info "$issue_count. Extract custom hooks from $hook_heavy_components components"
  log_info "   Action: Move hook logic to shared/hooks/"
fi

if [ "$god_components" -gt 0 ]; then
  ((issue_count++)) || true
  log_info "$issue_count. Split $god_components god components"
  log_info "   Action: Extract sub-components"
fi

if [ "$issue_count" -eq 0 ]; then
  log_success "No architectural issues found!"
else
  log_warn "Found $issue_count architectural concerns"
fi

# XML/JSON output
if [ "$OUTPUT_FORMAT" = "xml" ]; then
  cat <<EOF

<architecture_analysis>
  <summary>
    <total_files>$total_files</total_files>
    <total_lines>$total_lines</total_lines>
    <avg_file_size>$avg_file_size</avg_file_size>
    <large_files>$large_files</large_files>
    <complex_files>$complex_files</complex_files>
    <feature_coupling>$feature_coupling</feature_coupling>
  </summary>
  <scores>
    <size>$size_score</size>
    <complexity>$complexity_score</complexity>
    <coupling>$coupling_score</coupling>
    <distribution>$distribution_score</distribution>
    <patterns>$pattern_score</patterns>
    <overall>$total_score</overall>
  </scores>
  <structure>
    <features>$features_count</features>
    <shared_components>$shared_components</shared_components>
    <shared_hooks>$shared_hooks</shared_hooks>
    <shared_utils>$shared_utils</shared_utils>
  </structure>
  <distribution>
    <feature_lines>$feature_lines</feature_lines>
    <shared_lines>$shared_lines</shared_lines>
    <shared_percentage>$shared_percentage</shared_percentage>
  </distribution>
  <issues>
    <large_files>$large_files</large_files>
    <complex_files>$complex_files</complex_files>
    <cross_feature_imports>$cross_feature_imports</cross_feature_imports>
    <hook_heavy_components>$hook_heavy_components</hook_heavy_components>
    <god_components>$god_components</god_components>
  </issues>
</architecture_analysis>
EOF
elif [ "$OUTPUT_FORMAT" = "json" ]; then
  cat <<EOF
{
  "summary": {
    "total_files": $total_files,
    "total_lines": $total_lines,
    "avg_file_size": $avg_file_size,
    "large_files": $large_files,
    "complex_files": $complex_files,
    "feature_coupling": $feature_coupling
  },
  "scores": {
    "size": $size_score,
    "complexity": $complexity_score,
    "coupling": $coupling_score,
    "distribution": $distribution_score,
    "patterns": $pattern_score,
    "overall": $total_score
  },
  "structure": {
    "features": $features_count,
    "shared_components": $shared_components,
    "shared_hooks": $shared_hooks,
    "shared_utils": $shared_utils
  },
  "distribution": {
    "feature_lines": $feature_lines,
    "shared_lines": $shared_lines,
    "shared_percentage": $shared_percentage
  },
  "issues": {
    "large_files": $large_files,
    "complex_files": $complex_files,
    "cross_feature_imports": $cross_feature_imports,
    "hook_heavy_components": $hook_heavy_components,
    "god_components": $god_components
  }
}
EOF
fi

log_separator
exit $([ "$total_score" -ge 60 ] && echo 0 || echo 1)
