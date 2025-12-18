#!/bin/bash
#
# Aurora Core - Checkpoint / Rollback
# Git-stash based safety net for destructive operations.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CORE_DIR="$SCRIPT_DIR"
AURORA_DIR="$(cd "$CORE_DIR/.." && pwd)"

# shellcheck disable=SC1090
source "$AURORA_DIR/agents/shared/tools/logger.sh"

aurora_repo_root() {
  if [ -d "$AURORA_DIR/../.git" ]; then
    (cd "$AURORA_DIR/.." && pwd)
    return 0
  fi

  if command -v git >/dev/null 2>&1; then
    git -C "$AURORA_DIR/.." rev-parse --show-toplevel 2>/dev/null || true
    return 0
  fi

  (cd "$AURORA_DIR/.." && pwd)
}

aurora_state_dir() {
  local root
  root="$(aurora_repo_root)"
  echo "$root/.aurora"
}

aurora_checkpoint_dir() {
  echo "$(aurora_state_dir)/checkpoints"
}

aurora_checkpoint_now_iso() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

aurora_checkpoint_id() {
  # Portable-ish unique id without requiring uuidgen.
  echo "$(date -u +"%Y%m%dT%H%M%SZ")-$$-$RANDOM"
}

aurora_git_has_changes() {
  command -v git >/dev/null 2>&1 || return 1
  local root
  root="$(aurora_repo_root)"
  [ -n "$(git -C "$root" status --porcelain 2>/dev/null)" ]
}

aurora_stash_ref_from_hash() {
  local hash="$1"
  local root
  root="$(aurora_repo_root)"

  git -C "$root" stash list --format='%H %gd' 2>/dev/null | while IFS=' ' read -r h ref; do
    if [ "$h" = "$hash" ]; then
      echo "$ref"
      return 0
    fi
  done

  return 1
}

aurora_checkpoint_create() {
  local agent_id="$1"
  local tool_id="$2"
  local reason="${3:-checkpoint}"

  if ! command -v git >/dev/null 2>&1; then
    log_warn "Checkpoint skipped (git not available)"
    echo ""
    return 0
  fi

  local root
  root="$(aurora_repo_root)"
  if [ ! -d "$root/.git" ]; then
    log_warn "Checkpoint skipped (not a git repo)"
    echo ""
    return 0
  fi

  if ! aurora_git_has_changes; then
    log_debug "Checkpoint skipped (working tree clean)"
    echo ""
    return 0
  fi

  local id
  id="$(aurora_checkpoint_id)"

  mkdir -p "$(aurora_checkpoint_dir)"

  local msg="aurora checkpoint [$agent_id/$tool_id] $reason ($id)"
  log_info "Creating checkpoint: $msg"

  git -C "$root" stash push -u -m "$msg" >/dev/null 2>&1 || true

  local hash
  hash="$(git -C "$root" stash list -n 1 --format='%H' 2>/dev/null || true)"

  cat >"$(aurora_checkpoint_dir)/$id.json" <<EOF
{
  "id": "$id",
  "agent": "$agent_id",
  "tool": "$tool_id",
  "reason": "$reason",
  "created_at": "$(aurora_checkpoint_now_iso)",
  "stash_hash": "$hash"
}
EOF

  # Keep the last 10 metadata files (best-effort, no hard dependency on ls sorting flags)
  ls -1t "$(aurora_checkpoint_dir)"/*.json 2>/dev/null | tail -n +11 | while IFS= read -r old; do
    rm -f "$old" || true
  done

  echo "$id"
}

aurora_checkpoint_rollback() {
  local checkpoint_id="$1"

  if ! command -v git >/dev/null 2>&1; then
    log_error "Rollback failed (git not available)"
    return 1
  fi

  local root
  root="$(aurora_repo_root)"

  local file
  file="$(aurora_checkpoint_dir)/$checkpoint_id.json"
  if [ ! -f "$file" ]; then
    log_error "Rollback failed (checkpoint metadata not found): $checkpoint_id"
    return 1
  fi

  if ! command -v jq >/dev/null 2>&1; then
    log_error "Rollback failed (jq required to read checkpoint metadata)"
    return 1
  fi

  local hash
  hash="$(jq -r '.stash_hash' "$file" 2>/dev/null || true)"
  if [ -z "$hash" ] || [ "$hash" = "null" ]; then
    log_error "Rollback failed (missing stash hash in checkpoint metadata)"
    return 1
  fi

  log_warn "Applying checkpoint stash: $hash"
  git -C "$root" stash apply "$hash" >/dev/null 2>&1 || {
    log_error "Rollback failed (stash apply failed)"
    return 1
  }

  # Best-effort: drop the stash if we can map hash -> stash@{n}
  local ref
  ref="$(aurora_stash_ref_from_hash "$hash" || true)"
  if [ -n "$ref" ]; then
    git -C "$root" stash drop "$ref" >/dev/null 2>&1 || true
  fi

  log_success "Rollback complete from checkpoint $checkpoint_id"
  return 0
}

export -f aurora_checkpoint_create
export -f aurora_checkpoint_rollback

