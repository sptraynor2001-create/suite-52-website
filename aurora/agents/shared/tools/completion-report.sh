#!/bin/bash
# completion-report.sh - Generate agent completion reports in XML format
# Usage: source completion-report.sh && generate_completion_report [status] [agent] [message]

# Generate XML completion report
generate_completion_report() {
  local status="$1"      # completed, partial, blocked
  local agent="$2"       # Agent name (e.g., quality-reviewer)
  local message="$3"     # Summary message
  shift 3
  local recommendations=("$@")  # Recommended next agents
  
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  
  cat <<EOF

════════════════════════════════════════════════════════════════
AGENT COMPLETION REPORT
════════════════════════════════════════════════════════════════

<agent_completion>
  <status>$status</status>
  <agent>@$agent</agent>
  <timestamp>$timestamp</timestamp>
  <summary>
    $message
  </summary>
EOF

  if [ ${#recommendations[@]} -gt 0 ]; then
    cat <<EOF
  <next_steps>
EOF
    for rec in "${recommendations[@]}"; do
      echo "    <recommend>@$rec</recommend>"
    done
    cat <<EOF
  </next_steps>
EOF
  fi

  cat <<EOF
</agent_completion>

════════════════════════════════════════════════════════════════

EOF
}

# Generate detailed task report
generate_task_report() {
  local agent="$1"
  local task_name="$2"
  local files_processed="$3"
  local issues_found="$4"
  local issues_fixed="$5"
  shift 5
  local details=("$@")
  
  cat <<EOF

╔════════════════════════════════════════════════════════════════╗
║                      TASK COMPLETION REPORT                     ║
╚════════════════════════════════════════════════════════════════╝

Agent:             @$agent
Task:              $task_name
Files Processed:   $files_processed
Issues Found:      $issues_found
Issues Fixed:      $issues_fixed

EOF

  if [ ${#details[@]} -gt 0 ]; then
    echo "Details:"
    echo "─────────────────────────────────────────────────────────────"
    for detail in "${details[@]}"; do
      echo "  • $detail"
    done
    echo ""
  fi
}

# Generate metrics report
generate_metrics_report() {
  local agent="$1"
  shift
  local -A metrics
  
  # Parse key=value pairs
  while [ $# -gt 0 ]; do
    if [[ "$1" =~ ^([^=]+)=(.+)$ ]]; then
      metrics["${BASH_REMATCH[1]}"]="${BASH_REMATCH[2]}"
    fi
    shift
  done
  
  cat <<EOF

📊 METRICS REPORT - @$agent
────────────────────────────────────────────────────────────────

EOF

  for key in "${!metrics[@]}"; do
    printf "  %-20s : %s\n" "$key" "${metrics[$key]}"
  done
  
  echo ""
}

# Display decision prompt
generate_decision_prompt() {
  local message="$1"
  shift
  local options=("$@")
  
  cat <<EOF

════════════════════════════════════════════════════════════════
DECISION REQUIRED
════════════════════════════════════════════════════════════════

$message

OPTIONS:

EOF

  local i=1
  for option in "${options[@]}"; do
    echo "  [$i] $option"
    ((i++))
  done
  
  cat <<EOF

────────────────────────────────────────────────────────────────
Enter your choice (1-${#options[@]}), or 'cancel' to abort:
EOF
}

# Success completion
complete_success() {
  local agent="$1"
  local message="$2"
  shift 2
  local next_agents=("$@")
  
  generate_completion_report "completed" "$agent" "$message" "${next_agents[@]}"
}

# Partial completion (waiting for approval)
complete_partial() {
  local agent="$1"
  local message="$2"
  shift 2
  local next_agents=("$@")
  
  generate_completion_report "partial" "$agent" "$message" "${next_agents[@]}"
}

# Blocked completion
complete_blocked() {
  local agent="$1"
  local reason="$2"
  
  generate_completion_report "blocked" "$agent" "Cannot proceed: $reason"
}

# Export functions
export -f generate_completion_report
export -f generate_task_report
export -f generate_metrics_report
export -f generate_decision_prompt
export -f complete_success
export -f complete_partial
export -f complete_blocked
