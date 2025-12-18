#!/bin/bash
# approval-prompt.sh - Interactive approval prompts for agents
# Usage: source approval-prompt.sh && get_approval "message"

# Get yes/no approval
get_approval() {
  local message="$1"
  local default="${2:-no}"  # Default to 'no' for safety
  
  cat <<EOF

════════════════════════════════════════════════════════════════
APPROVAL REQUIRED
════════════════════════════════════════════════════════════════

$message

────────────────────────────────────────────────────────────────
EOF

  # Check if running in interactive mode
  if [ -t 0 ]; then
    # Interactive mode
    while true; do
      if [ "$default" = "yes" ]; then
        read -p "Proceed? [Y/n]: " response
        response=${response:-y}
      else
        read -p "Proceed? [y/N]: " response
        response=${response:-n}
      fi
      
      case "$response" in
        [Yy]|[Yy][Ee][Ss])
          echo "✅ Approved"
          return 0
          ;;
        [Nn]|[Nn][Oo])
          echo "❌ Declined"
          return 1
          ;;
        *)
          echo "Please answer yes or no."
          ;;
      esac
    done
  else
    # Non-interactive mode - use default
    echo "Non-interactive mode: Using default ($default)"
    if [ "$default" = "yes" ]; then
      return 0
    else
      return 1
    fi
  fi
}

# Get approval with multiple options
get_multi_approval() {
  local message="$1"
  shift
  local options=("$@")
  
  cat <<EOF

════════════════════════════════════════════════════════════════
SELECT ACTION
════════════════════════════════════════════════════════════════

$message

OPTIONS:

EOF

  local i=1
  for option in "${options[@]}"; do
    echo "  [$i] $option"
    ((i++))
  done
  echo "  [0] Cancel"
  
  cat <<EOF

────────────────────────────────────────────────────────────────
EOF

  if [ -t 0 ]; then
    # Interactive mode
    while true; do
      read -p "Enter your choice (0-${#options[@]}): " choice
      
      if [[ "$choice" =~ ^[0-9]+$ ]]; then
        if [ "$choice" -eq 0 ]; then
          echo "❌ Cancelled"
          return 255
        elif [ "$choice" -ge 1 ] && [ "$choice" -le ${#options[@]} ]; then
          echo "✅ Selected: ${options[$((choice-1))]}"
          return $((choice-1))
        fi
      fi
      
      echo "Invalid choice. Please enter a number between 0 and ${#options[@]}."
    done
  else
    # Non-interactive - return first option
    echo "Non-interactive mode: Auto-selecting first option"
    return 0
  fi
}

# Batch approval for multiple items
get_batch_approval() {
  local message="$1"
  shift
  local items=("$@")
  
  cat <<EOF

════════════════════════════════════════════════════════════════
BATCH APPROVAL
════════════════════════════════════════════════════════════════

$message

ITEMS ($${#items[@]} total):

EOF

  local i=1
  for item in "${items[@]}"; do
    echo "  [$i] $item"
    ((i++))
  done
  
  cat <<EOF

────────────────────────────────────────────────────────────────
ACTIONS:
  [a] Approve all
  [n] Approve none
  [s] Select specific items (comma-separated: 1,3,5)
  [c] Cancel

EOF

  if [ -t 0 ]; then
    while true; do
      read -p "Enter action [a/n/s/c]: " action
      
      case "$action" in
        [Aa])
          echo "✅ Approved all ${#items[@]} items"
          echo "all"
          return 0
          ;;
        [Nn])
          echo "❌ Approved none"
          echo "none"
          return 1
          ;;
        [Ss])
          read -p "Enter item numbers (comma-separated, e.g., 1,3,5): " selection
          # Validate and return selection
          echo "$selection"
          return 0
          ;;
        [Cc])
          echo "❌ Cancelled"
          return 255
          ;;
        *)
          echo "Invalid action. Please enter a, n, s, or c."
          ;;
      esac
    done
  else
    # Non-interactive - approve none for safety
    echo "Non-interactive mode: Approving none"
    echo "none"
    return 1
  fi
}

# Confirm dangerous action
get_dangerous_approval() {
  local message="$1"
  local confirmation_phrase="${2:-DELETE}"
  
  cat <<EOF

════════════════════════════════════════════════════════════════
⚠️  DANGEROUS ACTION - CONFIRMATION REQUIRED
════════════════════════════════════════════════════════════════

$message

This action cannot be undone!

────────────────────────────────────────────────────────────────
EOF

  if [ -t 0 ]; then
    read -p "Type '$confirmation_phrase' to confirm: " confirmation
    
    if [ "$confirmation" = "$confirmation_phrase" ]; then
      echo "✅ Confirmed"
      return 0
    else
      echo "❌ Confirmation failed"
      return 1
    fi
  else
    echo "❌ Dangerous actions require interactive confirmation"
    return 1
  fi
}

# Get text input with validation
get_input() {
  local prompt="$1"
  local default="$2"
  local validator="$3"  # Optional: regex pattern for validation
  
  if [ -t 0 ]; then
    while true; do
      if [ -n "$default" ]; then
        read -p "$prompt [$default]: " input
        input=${input:-$default}
      else
        read -p "$prompt: " input
      fi
      
      # Validate if regex provided
      if [ -n "$validator" ]; then
        if [[ "$input" =~ $validator ]]; then
          echo "$input"
          return 0
        else
          echo "Invalid input. Please try again."
        fi
      else
        echo "$input"
        return 0
      fi
    done
  else
    # Non-interactive - return default
    echo "$default"
    return 0
  fi
}

# Export functions
export -f get_approval
export -f get_multi_approval
export -f get_batch_approval
export -f get_dangerous_approval
export -f get_input
