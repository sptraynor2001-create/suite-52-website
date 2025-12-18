#!/bin/bash
# Sync Docs Tool - Tech Doc Maintainer
# Full sync - scan and update all documentation
# Usage: ./sync-docs.sh

set -euo pipefail

# Load shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AURORA_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
source "$AURORA_DIR/agents/shared/tools/logger.sh"

log_header "Full Documentation Sync - Tech Doc Maintainer"

# Step 1: Scan packages
log_info "Step 1: Scanning packages..."
log_separator
"$SCRIPT_DIR/scan-packages.sh"

# Step 2: Update documentation
log_separator
log_info "Step 2: Updating documentation..."
log_separator
"$SCRIPT_DIR/update-docs.sh" --auto

log_separator
log_success "Full documentation sync complete!"
