#!/bin/bash
# Web-React Adapter - Theme Enforcer - Enforce Theme Tokens
#
# Automatically replaces hardcoded design values with theme tokens
# Adapter implementation used by:
#   aurora/agents/theme-enforcer/tools/enforce-themes.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"

# Shared logger from Aurora core system
# shellcheck disable=SC1090
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

# Configuration
TARGET_FILE="${1:-}"
DRY_RUN="${DRY_RUN:-false}"
AUTO_APPROVE="${AUTO_APPROVE:-false}"

if [ -z "$TARGET_FILE" ]; then
  log_error "Usage: $0 <file-path> [DRY_RUN=true|false] [AUTO_APPROVE=true|false]"
  log_info "Example: $0 src/features/home/Home.tsx"
  log_info "Example: DRY_RUN=true $0 src/features/home/Home.tsx"
  exit 1
fi

if [ ! -f "$TARGET_FILE" ]; then
  log_error "File not found: $TARGET_FILE"
  exit 1
fi

log_section "Theme Enforcer - Token Replacement (web-react)"
log_info "Target: $TARGET_FILE"
log_info "Mode: $([ "$DRY_RUN" = "true" ] && echo "DRY RUN" || echo "LIVE")"

# Color mapping (hex -> theme token path)
declare -A COLOR_MAP=(
  # Brand colors
  ["#e63946"]="colors.brand.primary"
  ["#E63946"]="colors.brand.primary"
  ["#ff6b6b"]="colors.brand.accent"
  ["#FF6B6B"]="colors.brand.accent"
  ["#ffffff"]="colors.brand.secondary"
  ["#FFFFFF"]="colors.brand.secondary"
  ["#fff"]="colors.brand.secondary"
  ["#FFF"]="colors.brand.secondary"
  
  # Atmospheric grayscale
  ["#000000"]="colors.atmosphere.void"
  ["#000"]="colors.atmosphere.void"
  ["#0a0a0a"]="colors.atmosphere.carbon"
  ["#1a1a1a"]="colors.atmosphere.ash"
  ["#2a2a2a"]="colors.atmosphere.smoke"
  ["#3a3a3a"]="colors.atmosphere.charcoal"
  ["#4a4a4a"]="colors.atmosphere.fog"
  ["#6a6a6a"]="colors.atmosphere.slate"
  ["#8a8a8a"]="colors.atmosphere.silver"
  ["#b4b4b4"]="colors.atmosphere.cloud"
  ["#d4d4d4"]="colors.atmosphere.bone"
  ["#ebebeb"]="colors.atmosphere.snow"
  
  # Red spectrum
  ["#8b2635"]="colors.red.rust"
  ["#ff8585"]="colors.red.flame"
  ["#ffb3b3"]="colors.red.blush"
  
  # Blue spectrum
  ["#1a42d4"]="colors.blue.deep"
  ["#42a6f5"]="colors.blue.primary"
  ["#6bb8ff"]="colors.blue.light"
  ["#8fc9ff"]="colors.blue.sky"
  
  # Green spectrum
  ["#0d7a3d"]="colors.green.deep"
  ["#2ed963"]="colors.green.primary"
  ["#4fe87a"]="colors.green.light"
  ["#7ff5a3"]="colors.green.mint"
  
  # Gold spectrum
  ["#8b6914"]="colors.gold.deep"
  ["#C8A028"]="colors.gold.primary"
  ["#c8a028"]="colors.gold.primary"
  ["#D4AF37"]="colors.gold.casino"
  ["#d4af37"]="colors.gold.casino"
  ["#D4B850"]="colors.gold.light"
  ["#d4b850"]="colors.gold.light"
  ["#E0C878"]="colors.gold.shimmer"
  ["#e0c878"]="colors.gold.shimmer"
)

# Spacing mapping (px/rem -> token)
declare -A SPACING_MAP=(
  ["0px"]="tokens.spacing[0]"
  ["1px"]="tokens.spacing.px"
  ["2px"]="tokens.spacing[0.5]"
  ["4px"]="tokens.spacing[1]"
  ["6px"]="tokens.spacing[1.5]"
  ["8px"]="tokens.spacing[2]"
  ["10px"]="tokens.spacing[2.5]"
  ["12px"]="tokens.spacing[3]"
  ["14px"]="tokens.spacing[3.5]"
  ["16px"]="tokens.spacing[4]"
  ["20px"]="tokens.spacing[5]"
  ["24px"]="tokens.spacing[6]"
  ["28px"]="tokens.spacing[7]"
  ["32px"]="tokens.spacing[8]"
  ["36px"]="tokens.spacing[9]"
  ["40px"]="tokens.spacing[10]"
  ["48px"]="tokens.spacing[12]"
  ["56px"]="tokens.spacing[14]"
  ["64px"]="tokens.spacing[16]"
  ["80px"]="tokens.spacing[20]"
  ["96px"]="tokens.spacing[24]"
  ["128px"]="tokens.spacing[32]"
  
  # rem equivalents
  ["0.125rem"]="tokens.spacing[0.5]"
  ["0.25rem"]="tokens.spacing[1]"
  ["0.375rem"]="tokens.spacing[1.5]"
  ["0.5rem"]="tokens.spacing[2]"
  ["0.625rem"]="tokens.spacing[2.5]"
  ["0.75rem"]="tokens.spacing[3]"
  ["0.875rem"]="tokens.spacing[3.5]"
  ["1rem"]="tokens.spacing[4]"
  ["1.25rem"]="tokens.spacing[5]"
  ["1.5rem"]="tokens.spacing[6]"
  ["1.75rem"]="tokens.spacing[7]"
  ["2rem"]="tokens.spacing[8]"
  ["2.25rem"]="tokens.spacing[9]"
  ["2.5rem"]="tokens.spacing[10]"
  ["3rem"]="tokens.spacing[12]"
  ["3.5rem"]="tokens.spacing[14]"
  ["4rem"]="tokens.spacing[16]"
  ["5rem"]="tokens.spacing[20]"
  ["6rem"]="tokens.spacing[24]"
  ["8rem"]="tokens.spacing[32]"
)

# Z-index mapping (number -> token)
declare -A ZINDEX_MAP=(
  ["-1"]="tokens.zIndex.hide"
  ["0"]="tokens.zIndex.base"
  ["1"]="tokens.zIndex.backgroundSecondary"
  ["2"]="tokens.zIndex.particles"
  ["3"]="tokens.zIndex.vignette"
  ["4"]="tokens.zIndex.grain"
  ["10"]="tokens.zIndex.content"
  ["50"]="tokens.zIndex.navigation"
  ["1000"]="tokens.zIndex.dropdown"
  ["1020"]="tokens.zIndex.sticky"
  ["1030"]="tokens.zIndex.fixed"
  ["1040"]="tokens.zIndex.modalBackdrop"
  ["1050"]="tokens.zIndex.modal"
  ["1060"]="tokens.zIndex.popover"
  ["1070"]="tokens.zIndex.tooltip"
)

# Create backup
BACKUP_FILE="${TARGET_FILE}.bak"
cp "$TARGET_FILE" "$BACKUP_FILE"
log_info "Created backup: $BACKUP_FILE"

# Track changes
total_replacements=0
color_replacements=0
spacing_replacements=0
zindex_replacements=0

# Working file
TEMP_FILE=$(mktemp)
cp "$TARGET_FILE" "$TEMP_FILE"
trap "rm -f $TEMP_FILE" EXIT

log_separator
log_info "Analyzing file for replacements..."

# Function to replace colors
replace_colors() {
  local file="$1"
  local count=0
  
  for hex in "${!COLOR_MAP[@]}"; do
    local token="${COLOR_MAP[$hex]}"
    
    # Match patterns like: '#fff', "#ffffff", backgroundColor: '#000000'
    # Replace with token reference
    if grep -q "'$hex'" "$file" || grep -q "\"$hex\"" "$file"; then
      if [ "$DRY_RUN" = "false" ]; then
        # Replace single-quoted
        sed -i.tmp "s/'$hex'/$token/g" "$file" && rm -f "$file.tmp"
        # Replace double-quoted
        sed -i.tmp "s/\"$hex\"/$token/g" "$file" && rm -f "$file.tmp"
      fi
      
      local matches=$(grep -c "$hex" "$BACKUP_FILE" 2>/dev/null || echo "0")
      if [ "$matches" -gt 0 ]; then
        count=$((count + matches))
        log_info "  $hex → $token ($matches occurrences)"
      fi
    fi
  done
  
  echo "$count"
}

# Function to replace spacing
replace_spacing() {
  local file="$1"
  local count=0
  
  for spacing in "${!SPACING_MAP[@]}"; do
    local token="${SPACING_MAP[$spacing]}"
    
    # Match patterns like: padding: '16px', margin: '2rem'
    if grep -q "'$spacing'" "$file" || grep -q "\"$spacing\"" "$file"; then
      if [ "$DRY_RUN" = "false" ]; then
        sed -i.tmp "s/'$spacing'/$token/g" "$file" && rm -f "$file.tmp"
        sed -i.tmp "s/\"$spacing\"/$token/g" "$file" && rm -f "$file.tmp"
      fi
      
      local matches=$(grep -c "$spacing" "$BACKUP_FILE" 2>/dev/null || echo "0")
      if [ "$matches" -gt 0 ]; then
        count=$((count + matches))
        log_info "  $spacing → $token ($matches occurrences)"
      fi
    fi
  done
  
  echo "$count"
}

# Function to replace z-index
replace_zindex() {
  local file="$1"
  local count=0
  
  for zindex in "${!ZINDEX_MAP[@]}"; do
    local token="${ZINDEX_MAP[$zindex]}"
    
    # Match patterns like: zIndex: 1000
    if grep -q "zIndex: $zindex" "$file"; then
      if [ "$DRY_RUN" = "false" ]; then
        sed -i.tmp "s/zIndex: $zindex/zIndex: $token/g" "$file" && rm -f "$file.tmp"
      fi
      
      local matches=$(grep -c "zIndex: $zindex" "$BACKUP_FILE" 2>/dev/null || echo "0")
      if [ "$matches" -gt 0 ]; then
        count=$((count + matches))
        log_info "  zIndex: $zindex → $token ($matches occurrences)"
      fi
    fi
  done
  
  echo "$count"
}

# Perform replacements
log_info "Replacing colors..."
color_replacements=$(replace_colors "$TEMP_FILE")

log_info "Replacing spacing..."
spacing_replacements=$(replace_spacing "$TEMP_FILE")

log_info "Replacing z-index..."
zindex_replacements=$(replace_zindex "$TEMP_FILE")

total_replacements=$((color_replacements + spacing_replacements + zindex_replacements))

log_separator
log_section "Replacement Summary"
echo "  Color replacements:   $color_replacements"
echo "  Spacing replacements: $spacing_replacements"
echo "  Z-index replacements: $zindex_replacements"
echo "  ─────────────────────────────"
echo "  Total replacements:   $total_replacements"

if [ "$total_replacements" -eq 0 ]; then
  log_success "No replacements needed - file already uses theme tokens!"
  rm "$BACKUP_FILE"
  exit 0
fi

# Check if imports are needed
needs_colors_import=false
needs_tokens_import=false

if [ "$color_replacements" -gt 0 ]; then
  needs_colors_import=true
fi

if [ "$spacing_replacements" -gt 0 ] || [ "$zindex_replacements" -gt 0 ]; then
  needs_tokens_import=true
fi

# Show import requirements
log_separator
log_info "Required imports:"

if [ "$needs_colors_import" = true ]; then
  if ! grep -q "import.*colors.*from.*themes/colors" "$BACKUP_FILE" && \
     ! grep -q "import.*from.*themes" "$BACKUP_FILE"; then
    log_warn "  Add: import { colors } from '@/themes/colors'"
  else
    log_success "  ✓ colors already imported"
  fi
fi

if [ "$needs_tokens_import" = true ]; then
  if ! grep -q "import.*tokens.*from.*design/tokens" "$BACKUP_FILE" && \
     ! grep -q "import.*from.*design" "$BACKUP_FILE"; then
    log_warn "  Add: import { tokens } from '@/design/tokens'"
  else
    log_success "  ✓ tokens already imported"
  fi
fi

# Apply or show diff
if [ "$DRY_RUN" = "false" ]; then
  if [ "$AUTO_APPROVE" = "false" ]; then
    log_separator
    log_warn "Ready to apply $total_replacements replacements"
    read -p "Apply changes? (y/n): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      log_info "Cancelled - backup preserved at $BACKUP_FILE"
      exit 0
    fi
  fi
  
  # Apply changes
  cp "$TEMP_FILE" "$TARGET_FILE"
  log_success "Applied $total_replacements replacements to $TARGET_FILE"
  log_info "Backup available at $BACKUP_FILE"
  log_info "Run 'npm run lint' to verify changes"
  
  exit 0
else
  log_info "DRY RUN - No changes applied"
  log_info "Set DRY_RUN=false to apply changes"
  log_info "Backup will be cleaned up"
  rm "$BACKUP_FILE"
  exit 0
fi
