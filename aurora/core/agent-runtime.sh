#!/bin/bash
#
# Aurora Core - Agent Runtime
# Common execution wrapper that provides:
# - adapter delegation
# - (optional) checkpoint/rollback hooks
# - (optional) telemetry hooks
# - (optional) permission validation hooks
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CORE_DIR="$SCRIPT_DIR"
# Aurora is vendored inside a project repo at <repo>/aurora.
# We treat:
# - AURORA_ROOT as the framework root (<repo>/aurora)
# - PROJECT_ROOT as the repository root (<repo>)
AURORA_ROOT="$(cd "$CORE_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$AURORA_ROOT/.." && pwd)"

# Shared logger (existing)
# shellcheck disable=SC1090
source "$AURORA_ROOT/agents/shared/tools/logger.sh"

# Core modules (added incrementally by the roadmap)
# shellcheck disable=SC1090
source "$CORE_DIR/adapter-loader.sh"

if [ -f "$CORE_DIR/checkpoint.sh" ]; then
  # shellcheck disable=SC1090
  source "$CORE_DIR/checkpoint.sh"
fi

if [ -f "$CORE_DIR/telemetry.sh" ]; then
  # shellcheck disable=SC1090
  source "$CORE_DIR/telemetry.sh"
fi

if [ -f "$CORE_DIR/permissions.sh" ]; then
  # shellcheck disable=SC1090
  source "$CORE_DIR/permissions.sh"
fi

if [ -f "$CORE_DIR/error-handler.sh" ]; then
  # shellcheck disable=SC1090
  source "$CORE_DIR/error-handler.sh"
fi

aurora_runtime_should_checkpoint() {
  local agent_id="$1"

  # Manual override
  if [ "${AURORA_CHECKPOINT:-}" = "0" ]; then
    return 1
  fi
  if [ "${AURORA_CHECKPOINT:-}" = "1" ]; then
    return 0
  fi

  # Heuristic: consult agents.json access.write if available
  local agents_file="$AURORA_ROOT/agents/registry/agents.json"
  if [ -f "$agents_file" ] && command -v jq >/dev/null 2>&1; then
    local write_len
    write_len="$(jq -r --arg id "$agent_id" '.agents[] | select(.id==$id) | (.access.write // []) | length' "$agents_file" 2>/dev/null || echo "0")"
    if [ "$write_len" != "0" ]; then
      return 0
    fi
  fi

  return 1
}

aurora_runtime_run() {
  local agent_id="$1"
  local tool_id="$2"
  shift 2

  local started_at
  started_at="$(date +%s)"

  if command -v aurora_telemetry_event >/dev/null 2>&1; then
    aurora_telemetry_event "tool_start" "$agent_id" "$tool_id" "$started_at"
  fi

  local checkpoint_id=""
  if command -v aurora_checkpoint_create >/dev/null 2>&1; then
    if aurora_runtime_should_checkpoint "$agent_id"; then
      checkpoint_id="$(aurora_checkpoint_create "$agent_id" "$tool_id" "pre-execution checkpoint" || true)"
    fi
  fi

  local exit_code=0
  if command -v aurora_with_error_handling >/dev/null 2>&1; then
    aurora_with_error_handling "$agent_id" "$tool_id" adapter_execute "$agent_id" "$tool_id" "$@" || exit_code=$?
  else
    adapter_execute "$agent_id" "$tool_id" "$@" || exit_code=$?
  fi

  if [ "$exit_code" -ne 0 ] && [ -n "$checkpoint_id" ]; then
    if command -v aurora_checkpoint_rollback >/dev/null 2>&1; then
      log_warn "Tool failed; attempting rollback from checkpoint $checkpoint_id"
      aurora_checkpoint_rollback "$checkpoint_id" || true
    fi
  fi

  local finished_at
  finished_at="$(date +%s)"

  if command -v aurora_telemetry_event >/dev/null 2>&1; then
    aurora_telemetry_event "tool_end" "$agent_id" "$tool_id" "$finished_at" "$exit_code"
  fi

  return "$exit_code"
}

export -f aurora_runtime_run

