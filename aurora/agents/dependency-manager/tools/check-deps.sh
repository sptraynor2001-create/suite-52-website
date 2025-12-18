#!/bin/bash
# Dependency Manager - Check Dependencies
# Simple wrapper around npm to check for outdated packages and security issues
# No compute overhead - just queries npm registry

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../shared/tools/logger.sh"

OUTPUT_FORMAT="${1:-text}"  # text | json

log_header "Dependency Check"

# Check for outdated packages
log_info "Checking for outdated packages..."
OUTDATED=$(npm outdated --json 2>/dev/null || echo "{}")

# Check for security vulnerabilities
log_info "Running security audit..."
AUDIT=$(npm audit --json 2>/dev/null || echo '{"vulnerabilities":{}}')

# Parse results
outdated_count=$(echo "$OUTDATED" | jq 'length' 2>/dev/null | tr -d '\n' || echo "0")
vuln_count=$(echo "$AUDIT" | jq '.metadata.vulnerabilities.total // 0' 2>/dev/null | tr -d '\n' || echo "0")

if [ "$OUTPUT_FORMAT" = "json" ]; then
  cat <<EOF
{
  "outdated_packages": $outdated_count,
  "vulnerabilities": $vuln_count,
  "outdated": $OUTDATED,
  "audit_summary": $(echo "$AUDIT" | jq '.metadata.vulnerabilities // {}')
}
EOF
else
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Summary:"
  echo "  Outdated packages:  $outdated_count"
  echo "  Vulnerabilities:    $vuln_count"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if [ "$outdated_count" -gt 0 ]; then
    log_warn "Outdated packages:"
    echo "$OUTDATED" | jq -r 'to_entries[] | "  \(.key): \(.value.current) → \(.value.latest)"' 2>/dev/null || true
  fi
  
  if [ "$vuln_count" -gt 0 ]; then
    log_warn "Run 'npm audit fix' to address vulnerabilities"
  else
    log_success "No security vulnerabilities found"
  fi
fi
