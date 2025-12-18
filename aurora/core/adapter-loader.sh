#!/bin/bash
#
# Aurora Core - Adapter Loader
# Loads the active project adapter and provides adapter_execute for tool delegation.
#
# This file is intentionally framework-agnostic. Tech-stack specifics live under:
#   aurora/adapters/<adapter-name>/
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

# Project config can be overridden, but defaults to repo root.
PROJECT_CONFIG_FILE="${AURORA_PROJECT_CONFIG:-"$PROJECT_ROOT/project-config.json"}"

aurora_has_cmd() {
  command -v "$1" >/dev/null 2>&1
}

aurora_require_cmd() {
  local cmd="$1"
  if ! aurora_has_cmd "$cmd"; then
    echo "Aurora error: required command not found: $cmd" >&2
    return 1
  fi
}

aurora_project_root() {
  echo "$PROJECT_ROOT"
}

aurora_project_config_path() {
  echo "$PROJECT_CONFIG_FILE"
}

aurora_read_project_field() {
  local field="$1"
  aurora_require_cmd jq
  jq -r "$field" "$(aurora_project_config_path)"
}

aurora_adapter_relpath() {
  # Support both legacy and current schemas:
  # - Legacy: { "adapter": "aurora/adapters/web-react" }
  # - Current: { "aurora": { "adapter": "aurora/adapters/web-react" } }
  local rel=""

  rel="$(aurora_read_project_field '.aurora.adapter // empty' 2>/dev/null || true)"
  if [ -z "$rel" ] || [ "$rel" = "null" ]; then
    rel="$(aurora_read_project_field '.adapter // empty' 2>/dev/null || true)"
  fi

  # Final fallback (keeps system usable even with a minimal config)
  if [ -z "$rel" ] || [ "$rel" = "null" ]; then
    rel="aurora/adapters/web-react"
  fi

  echo "$rel"
}

aurora_adapter_dir() {
  local rel
  rel="$(aurora_adapter_relpath)"

  # If adapter is already an absolute path, keep it.
  if [[ "$rel" = /* ]]; then
    echo "$rel"
    return 0
  fi

  # If the relpath starts with "aurora/", it is relative to PROJECT_ROOT.
  if [[ "$rel" = aurora/* ]]; then
    echo "$(aurora_project_root)/$rel"
    return 0
  fi

  # If the relpath starts with "adapters/", it is relative to AURORA_ROOT.
  if [[ "$rel" = adapters/* ]]; then
    echo "$AURORA_ROOT/$rel"
    return 0
  fi

  # Otherwise treat it as an adapter name under aurora/adapters/<name>
  echo "$AURORA_ROOT/adapters/$rel"
}

aurora_adapter_config_path() {
  echo "$(aurora_adapter_dir)/config.json"
}

aurora_load_adapter_env() {
  # Load adapter "entrypoint" if present.
  # Adapter can define:
  # - adapter_preflight
  # - adapter_execute
  local entrypoint
  entrypoint="$(aurora_adapter_dir)/adapter.sh"
  if [ -f "$entrypoint" ]; then
    # shellcheck disable=SC1090
    source "$entrypoint"
  fi
}

aurora_adapter_tool_path() {
  local agent="$1"
  local tool="$2"

  # Preferred layout
  local preferred
  preferred="$(aurora_adapter_dir)/tools/$agent/$tool.sh"
  if [ -f "$preferred" ]; then
    echo "$preferred"
    return 0
  fi

  # Legacy layout support (in case an adapter uses agent/tool folders)
  local legacy
  legacy="$(aurora_adapter_dir)/$agent/$tool.sh"
  if [ -f "$legacy" ]; then
    echo "$legacy"
    return 0
  fi

  echo ""
  return 1
}

adapter_execute() {
  local agent="$1"
  local tool="$2"
  shift 2

  aurora_load_adapter_env
  if aurora_has_cmd adapter_preflight; then
    adapter_preflight "$agent" "$tool" "$@"
  fi

  # Allow adapter override of execution behavior.
  if aurora_has_cmd adapter_execute_impl; then
    adapter_execute_impl "$agent" "$tool" "$@"
    return $?
  fi

  local tool_path
  tool_path="$(aurora_adapter_tool_path "$agent" "$tool")" || true
  if [ -z "$tool_path" ]; then
    echo "Aurora error: adapter tool not found for $agent/$tool" >&2
    echo "Adapter: $(aurora_adapter_dir)" >&2
    return 1
  fi

  bash "$tool_path" "$@"
}

export -f aurora_project_root
export -f aurora_project_config_path
export -f aurora_read_project_field
export -f aurora_adapter_dir
export -f aurora_adapter_config_path
export -f aurora_adapter_tool_path
export -f adapter_execute

