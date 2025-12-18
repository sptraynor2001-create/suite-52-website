#!/bin/bash
# route-task.sh - Analyze task and suggest appropriate agent(s)
# Usage: ./aurora/agents/coordinator/tools/route-task.sh "[task description]"

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source shared logger
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

TASK="${1:-}"

if [ -z "$TASK" ]; then
  log_error "Usage: $0 \"[task description]\""
  log_info "Example: $0 \"Fix linting violations in src/features/\""
  exit 1
fi

log_section "Aurora Coordinator - Task Routing"
log_info "Analyzing task: $TASK"
echo ""

# Convert to lowercase for matching
TASK_LOWER=$(echo "$TASK" | tr '[:upper:]' '[:lower:]')

# Simple keyword-based routing
AGENT=""
CONFIDENCE="low"
REASONING=""

# Quality & Standards
if echo "$TASK_LOWER" | grep -q -E "lint|violation|quality|review.*code|fix.*error"; then
  AGENT="quality-reviewer"
  CONFIDENCE="high"
  REASONING="Task involves code quality checks or fixing violations"
elif echo "$TASK_LOWER" | grep -q -E "hardcoded|theme|color|spacing|z-index"; then
  AGENT="theme-enforcer"
  CONFIDENCE="high"
  REASONING="Task involves theme tokens or hardcoded values"
elif echo "$TASK_LOWER" | grep -q -E "refactor|split|extract|reduce.*complexity"; then
  AGENT="refactorer"
  CONFIDENCE="high"
  REASONING="Task involves code refactoring or restructuring"

# Testing
elif echo "$TASK_LOWER" | grep -q -E "write.*test|generate.*test|create.*test"; then
  AGENT="test-generator"
  CONFIDENCE="high"
  REASONING="Task involves creating new tests"
elif echo "$TASK_LOWER" | grep -q -E "review.*test|test.*quality"; then
  AGENT="test-reviewer"
  CONFIDENCE="high"
  REASONING="Task involves reviewing test quality"
elif echo "$TASK_LOWER" | grep -q -E "coverage|untested|test.*gap"; then
  AGENT="coverage-analyzer"
  CONFIDENCE="high"
  REASONING="Task involves test coverage analysis"

# Architecture
elif echo "$TASK_LOWER" | grep -q -E "architecture|design.*pattern|structure|dependency"; then
  AGENT="architect"
  CONFIDENCE="high"
  REASONING="Task involves architectural analysis or design"

# Deployment
elif echo "$TASK_LOWER" | grep -q -E "deploy|production|staging|release"; then
  AGENT="deployment-manager"
  CONFIDENCE="medium"
  REASONING="Task involves deployment operations"

# Performance
elif echo "$TASK_LOWER" | grep -q -E "performance|optimize|slow|bundle.*size"; then
  AGENT="performance-optimizer"
  CONFIDENCE="medium"
  REASONING="Task involves performance optimization"

# Debug
elif echo "$TASK_LOWER" | grep -q -E "debug|error|bug|crash|issue"; then
  AGENT="debugger"
  CONFIDENCE="medium"
  REASONING="Task involves debugging or error investigation"

# Documentation
elif echo "$TASK_LOWER" | grep -q -E "document|doc|readme|tech.*stack"; then
  AGENT="tech-doc-maintainer"
  CONFIDENCE="medium"
  REASONING="Task involves documentation maintenance"

# Complex/Multiple domains
elif echo "$TASK_LOWER" | grep -q -E "and|also|multiple|feature|complete"; then
  AGENT="coordinator"
  CONFIDENCE="medium"
  REASONING="Task spans multiple domains - needs workflow orchestration"

# Default to quality reviewer for unclear tasks
else
  AGENT="quality-reviewer"
  CONFIDENCE="low"
  REASONING="Task unclear - quality-reviewer can assess and recommend next steps"
fi

# Output routing decision
log_section "Routing Decision"
echo ""
echo "  Task: \"$TASK\""
echo "  Recommended Agent: @$AGENT"
echo "  Confidence: $CONFIDENCE"
echo "  Reasoning: $REASONING"
echo ""

# Alternative suggestions
log_separator
log_info "Alternative agents to consider:"

case "$AGENT" in
  "quality-reviewer")
    echo "  • @refactorer - If large files or complex code"
    echo "  • @theme-enforcer - If hardcoded values found"
    ;;
  "test-generator")
    echo "  • @test-reviewer - To review generated tests"
    echo "  • @coverage-analyzer - To identify gaps first"
    ;;
  "architect")
    echo "  • @refactorer - To implement architectural changes"
    echo "  • @quality-reviewer - To verify improvements"
    ;;
  "coordinator")
    echo "  • Break task into smaller pieces and route individually"
    ;;
esac

echo ""
log_info "Next step: Invoke @$AGENT to begin"
echo ""

exit 0
