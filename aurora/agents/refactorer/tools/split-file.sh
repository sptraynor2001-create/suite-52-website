#!/bin/bash
# Aurora - Universal Agent Tool Wrapper (Adapter-Aware)
#
# Delegates to the active adapter implementation:
#   adapter: aurora/adapters/<project-type>/tools/refactorer/split-file.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CORE_DIR="$(cd "$SCRIPT_DIR/../../../core" && pwd)"

# shellcheck disable=SC1090
source "$CORE_DIR/agent-runtime.sh"

aurora_runtime_run "refactorer" "split-file" "$@"
