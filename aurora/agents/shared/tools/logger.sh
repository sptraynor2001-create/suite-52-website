#!/bin/bash
# Shared Logger Utility - Aurora Framework
# Provides color-coded logging with severity levels
# Usage: source this file, then call log_info, log_warn, log_error, log_success

# COLORS
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# SEVERITY LEVELS
# - DEBUG: Detailed diagnostic info
# - INFO: General informational messages
# - WARN: Warning messages (non-fatal)
# - ERROR: Error messages (fatal)
# - SUCCESS: Success/completion messages

log_debug() {
    echo -e "${CYAN}[DEBUG]${NC} $1"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# SECTION HEADERS
# Use for visual separation in output
log_header() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

# Backwards-compatible alias used by some tools/adapters
log_section() {
    log_header "$1"
}

log_separator() {
    echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
}

# EXAMPLE USAGE:
# source aurora/agents/shared/tools/logger.sh
# log_info "Starting quality check..."
# log_success "All checks passed!"
# log_error "Found 5 violations"
