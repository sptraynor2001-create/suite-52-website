#!/bin/bash
# analyze-coverage.sh - Deep coverage analysis with gap identification
# Usage: ./aurora/agents/coverage-analyzer/tools/analyze-coverage.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source shared logger
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

log_info "📊 Analyzing test coverage..."

cd "$PROJECT_ROOT"

# Run coverage
npm run test:coverage --silent 2>&1 | tail -20

echo ""
echo "═══════════════════════════════════════"
echo "  DEEP COVERAGE ANALYSIS"
echo "═══════════════════════════════════════"
echo ""

# Check if coverage exists
if [ ! -d "coverage" ]; then
  log_error "Coverage data not found. Run npm run test:coverage first."
  exit 1
fi

COVERAGE_JSON="coverage/coverage-summary.json"

if [ ! -f "$COVERAGE_JSON" ]; then
  log_error "Coverage summary not found at $COVERAGE_JSON"
  exit 1
fi

# Parse coverage data with Node.js
node -e "
const fs = require('fs');
const coverage = JSON.parse(fs.readFileSync('$COVERAGE_JSON', 'utf8'));

console.log('📈 OVERALL METRICS\n');

const total = coverage.total;
console.log(\`  Lines:      \${total.lines.pct.toFixed(1)}% (\${total.lines.covered}/ \${total.lines.total})\`);
console.log(\`  Statements: \${total.statements.pct.toFixed(1)}% (\${total.statements.covered}/\${total.statements.total})\`);
console.log(\`  Functions:  \${total.functions.pct.toFixed(1)}% (\${total.functions.covered}/\${total.functions.total})\`);
console.log(\`  Branches:   \${total.branches.pct.toFixed(1)}% (\${total.branches.covered}/\${total.branches.total})\`);
console.log();

// Target check
const target = 80;
const metrics = ['lines', 'statements', 'functions', 'branches'];
const failed = metrics.filter(m => total[m].pct < target);

if (failed.length > 0) {
  console.log('⚠️  Below 80% threshold: ' + failed.join(', '));
  console.log();
}

// Categorize files by coverage
const critical = [];  // 0-30%
const high = [];      // 30-60%
const medium = [];    // 60-80%
const good = [];      // 80-100%

for (const [file, data] of Object.entries(coverage)) {
  if (file === 'total') continue;
  
  const relPath = file.replace('${PROJECT_ROOT}/', '');
  
  // Skip test files
  if (relPath.includes('.test.')) continue;
  
  const avgCoverage = (
    data.lines.pct + 
    data.statements.pct + 
    data.functions.pct + 
    data.branches.pct
  ) / 4;
  
  const fileInfo = {
    path: relPath,
    lines: data.lines.pct,
    statements: data.statements.pct,
    functions: data.functions.pct,
    branches: data.branches.pct,
    avg: avgCoverage
  };
  
  if (avgCoverage < 30) critical.push(fileInfo);
  else if (avgCoverage < 60) high.push(fileInfo);
  else if (avgCoverage < 80) medium.push(fileInfo);
  else good.push(fileInfo);
}

// Sort by coverage (lowest first)
critical.sort((a, b) => a.avg - b.avg);
high.sort((a, b) => a.avg - b.avg);
medium.sort((a, b) => a.avg - b.avg);

console.log('═══════════════════════════════════════');
console.log('  COVERAGE GAPS BY PRIORITY');
console.log('═══════════════════════════════════════\n');

if (critical.length > 0) {
  console.log(\`🔴 CRITICAL (0-30% coverage): \${critical.length} files\n\`);
  critical.forEach(f => {
    console.log(\`   \${f.path}\`);
    console.log(\`   Overall: \${f.avg.toFixed(1)}% | Lines: \${f.lines.toFixed(1)}% | Branches: \${f.branches.toFixed(1)}%\n\`);
  });
}

if (high.length > 0) {
  console.log(\`🟡 HIGH (30-60% coverage): \${high.length} files\n\`);
  high.slice(0, 5).forEach(f => {
    console.log(\`   \${f.path}\`);
    console.log(\`   Overall: \${f.avg.toFixed(1)}% | Lines: \${f.lines.toFixed(1)}% | Branches: \${f.branches.toFixed(1)}%\n\`);
  });
  if (high.length > 5) console.log(\`   ... and \${high.length - 5} more\n\`);
}

if (medium.length > 0) {
  console.log(\`🟠 MEDIUM (60-80% coverage): \${medium.length} files\n\`);
  medium.slice(0, 3).forEach(f => {
    console.log(\`   \${f.path}\`);
    console.log(\`   Overall: \${f.avg.toFixed(1)}% | Lines: \${f.lines.toFixed(1)}% | Branches: \${f.branches.toFixed(1)}%\n\`);
  });
  if (medium.length > 3) console.log(\`   ... and \${medium.length - 3} more\n\`);
}

console.log('═══════════════════════════════════════\n');

// Recommendations
console.log('💡 RECOMMENDATIONS\n');

if (critical.length > 0) {
  console.log('1. [CRITICAL] Add tests for ' + critical.length + ' files with <30% coverage');
  console.log('   Start with: ' + critical[0].path);
  console.log('   Run: @test-generator ' + critical[0].path + '\n');
}

if (high.length > 0) {
  console.log('2. [HIGH] Improve coverage for ' + high.length + ' files (30-60%)');
  console.log('   Focus on branch coverage (if/else paths)\n');
}

if (medium.length > 0) {
  console.log('3. [MEDIUM] Close gaps in ' + medium.length + ' files (60-80%)');
  console.log('   Add edge case and error scenario tests\n');
}

console.log('Next steps:');
console.log('  • Run: @coverage-analyzer find-gaps [file] for specific gaps');
console.log('  • Run: @test-generator to write missing tests');
console.log('  • View: open coverage/index.html for visual analysis\n');
"

log_info "Analysis complete. Review recommendations above."
echo ""

exit 0
