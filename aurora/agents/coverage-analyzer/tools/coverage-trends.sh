#!/bin/bash
# coverage-trends.sh - Track coverage trends over time
# Usage: ./aurora/agents/coverage-analyzer/tools/coverage-trends.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source shared logger
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

log_info "📈 Analyzing coverage trends..."

cd "$PROJECT_ROOT"

COVERAGE_HISTORY="$PROJECT_ROOT/.coverage-history.json"

# Check if current coverage exists
if [ ! -f "coverage/coverage-summary.json" ]; then
  log_error "No current coverage data. Run npm run test:coverage first."
  exit 1
fi

# Read current coverage
CURRENT_COVERAGE=$(node -e "
const coverage = require('./coverage/coverage-summary.json');
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  lines: coverage.total.lines.pct,
  statements: coverage.total.statements.pct,
  functions: coverage.total.functions.pct,
  branches: coverage.total.branches.pct
}));
")

echo ""
echo "═══════════════════════════════════════"
echo "  COVERAGE TRENDS"
echo "═══════════════════════════════════════"
echo ""

# Check if history exists
if [ ! -f "$COVERAGE_HISTORY" ]; then
  log_info "No coverage history found. Creating baseline..."
  
  echo "[$CURRENT_COVERAGE]" > "$COVERAGE_HISTORY"
  
  echo "📊 CURRENT COVERAGE (Baseline)"
  echo "$CURRENT_COVERAGE" | node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
    console.log();
    console.log(\`  Lines:      \${data.lines.toFixed(1)}%\`);
    console.log(\`  Statements: \${data.statements.toFixed(1)}%\`);
    console.log(\`  Functions:  \${data.functions.toFixed(1)}%\`);
    console.log(\`  Branches:   \${data.branches.toFixed(1)}%\`);
    console.log();
  "
  
  log_success "Baseline created. Run again after changes to see trends."
  exit 0
fi

# Add current to history
node -e "
const fs = require('fs');
const history = JSON.parse(fs.readFileSync('$COVERAGE_HISTORY', 'utf-8'));
const current = $CURRENT_COVERAGE;

history.push(current);

// Keep last 30 entries
if (history.length > 30) {
  history.shift();
}

fs.writeFileSync('$COVERAGE_HISTORY', JSON.stringify(history, null, 2));

console.log('📊 COVERAGE HISTORY\n');

const previous = history[history.length - 2];

console.log('Current vs. Previous:\n');

const metrics = ['lines', 'statements', 'functions', 'branches'];
metrics.forEach(metric => {
  const curr = current[metric];
  const prev = previous[metric];
  const diff = curr - prev;
  const arrow = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️';
  const sign = diff > 0 ? '+' : '';
  
  console.log(\`  \${metric.padEnd(12)}: \${curr.toFixed(1)}% \${arrow} \${sign}\${diff.toFixed(1)}%\`);
});

console.log();

// Trend analysis
const recent = history.slice(-5);
const avgLines = recent.reduce((sum, h) => sum + h.lines, 0) / recent.length;

if (current.lines > avgLines) {
  console.log('✅ Coverage trending upward');
} else if (current.lines < avgLines) {
  console.log('⚠️  Coverage trending downward');
} else {
  console.log('➡️  Coverage stable');
}

console.log();
console.log('═══════════════════════════════════════\n');

// Recommendations
if (current.lines < 80) {
  console.log('💡 Target: 80% coverage');
  console.log(\`   Need: +\${(80 - current.lines).toFixed(1)}% improvement\n\`);
}

console.log('Next steps:');
console.log('  • Run: @coverage-analyzer analyze-coverage for gaps');
console.log('  • Run: @test-generator to improve coverage');
console.log('  • View: open coverage/index.html\n');
"

exit 0
