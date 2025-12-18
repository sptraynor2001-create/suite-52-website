#!/bin/bash
# coverage-report.sh - Generate and analyze coverage reports
# Usage: ./aurora/agents/test-reviewer/tools/coverage-report.sh [--threshold 80]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source shared logger
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

# Parse arguments
THRESHOLD=80
while [[ $# -gt 0 ]]; do
  case $1 in
    --threshold)
      THRESHOLD="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

log_info "📊 Generating coverage report (threshold: ${THRESHOLD}%)"

# Run coverage
cd "$PROJECT_ROOT"
npm run test:coverage --silent 2>&1 | grep -v "^$" || true

# Check if coverage directory exists
if [ ! -d "coverage" ]; then
  log_error "Coverage directory not found. Run npm run test:coverage first."
  exit 1
fi

# Parse coverage summary
COVERAGE_FILE="coverage/coverage-summary.json"
if [ ! -f "$COVERAGE_FILE" ]; then
  log_error "Coverage summary not found at $COVERAGE_FILE"
  exit 1
fi

log_info "Analyzing coverage data..."

echo ""
echo "═══════════════════════════════════════"
echo "  COVERAGE GAPS ANALYSIS"
echo "═══════════════════════════════════════"
echo ""

# Find files below threshold
FILES_BELOW_THRESHOLD=0

# Use Node.js to parse JSON (more reliable than jq which may not be installed)
node -e "
const fs = require('fs');
const coverage = JSON.parse(fs.readFileSync('$COVERAGE_FILE', 'utf8'));
const threshold = $THRESHOLD;

const gaps = [];

for (const [file, data] of Object.entries(coverage)) {
  if (file === 'total') continue;
  
  const lines = data.lines.pct;
  const functions = data.functions.pct;
  const branches = data.branches.pct;
  const statements = data.statements.pct;
  
  const lowest = Math.min(lines, functions, branches, statements);
  
  if (lowest < threshold) {
    gaps.push({
      file: file.replace('${PROJECT_ROOT}/', ''),
      lines,
      functions,
      branches,
      statements,
      lowest
    });
  }
}

// Sort by lowest coverage first
gaps.sort((a, b) => a.lowest - b.lowest);

if (gaps.length === 0) {
  console.log('✅ All files meet ${THRESHOLD}% coverage threshold!');
} else {
  console.log(\`Found \${gaps.length} files below ${THRESHOLD}% threshold:\n\`);
  
  gaps.forEach((gap, i) => {
    const priority = gap.lowest < 50 ? 'CRITICAL' : gap.lowest < 70 ? 'HIGH' : 'MEDIUM';
    console.log(\`[\${priority}] \${gap.file}\`);
    console.log(\`  Lines: \${gap.lines.toFixed(1)}% | Functions: \${gap.functions.toFixed(1)}% | Branches: \${gap.branches.toFixed(1)}% | Statements: \${gap.statements.toFixed(1)}%\`);
    console.log(\`  Action: Add tests to cover missing lines/branches\n\`);
  });
  
  console.log('═══════════════════════════════════════\n');
  console.log('Next steps:');
  console.log('  1. Review files marked CRITICAL (< 50% coverage)');
  console.log('  2. Run: @test-reviewer suggest-tests [file] for recommendations');
  console.log('  3. Run: @test-generator to create tests');
  console.log('  4. View full report: open coverage/index.html\n');
  
  process.exit(gaps.length);
}
" || FILES_BELOW_THRESHOLD=$?

# Exit with number of files below threshold
exit $FILES_BELOW_THRESHOLD
