#!/bin/bash
# find-gaps.sh - Find specific coverage gaps in files
# Usage: ./aurora/agents/coverage-analyzer/tools/find-gaps.sh src/features/home/

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source shared logger
source "$PROJECT_ROOT/aurora/agents/shared/tools/logger.sh"

TARGET_PATH="${1:-src/}"

log_info "🔍 Finding coverage gaps in: $TARGET_PATH"

cd "$PROJECT_ROOT"

# Check coverage exists
if [ ! -d "coverage" ]; then
  log_error "Coverage data not found. Run npm run test:coverage first."
  exit 1
fi

# Check if coverage-final.json exists (detailed coverage)
COVERAGE_DETAILED="coverage/coverage-final.json"

if [ ! -f "$COVERAGE_DETAILED" ]; then
  log_warning "Detailed coverage not found. Showing summary only."
  
  # Use summary
  ./aurora/agents/coverage-analyzer/tools/analyze-coverage.sh
  exit 0
fi

echo ""
echo "═══════════════════════════════════════"
echo "  COVERAGE GAP DETAILS"
echo "═══════════════════════════════════════"
echo ""

# Parse detailed coverage
node -e "
const fs = require('fs');
const path = require('path');
const coverage = JSON.parse(fs.readFileSync('$COVERAGE_DETAILED', 'utf8'));

const targetPath = '$TARGET_PATH';

console.log('📍 UNTESTED CODE PATHS\n');

for (const [file, data] of Object.entries(coverage)) {
  const relPath = file.replace('${PROJECT_ROOT}/', '');
  
  // Filter by target path
  if (!relPath.includes(targetPath)) continue;
  
  // Skip test files
  if (relPath.includes('.test.')) continue;
  
  // Find untested lines
  const untestedLines = [];
  for (const [line, count] of Object.entries(data.statementMap || {})) {
    if (data.s[line] === 0) {
      untestedLines.push(count.start.line);
    }
  }
  
  // Find untested branches
  const untestedBranches = [];
  for (const [branchId, branch] of Object.entries(data.branchMap || {})) {
    const branchCounts = data.b[branchId] || [];
    branchCounts.forEach((count, idx) => {
      if (count === 0) {
        untestedBranches.push({
          line: branch.locations[idx].start.line,
          type: branch.type
        });
      }
    });
  }
  
  // Find untested functions
  const untestedFunctions = [];
  for (const [fnId, fn] of Object.entries(data.fnMap || {})) {
    if (data.f[fnId] === 0) {
      untestedFunctions.push({
        line: fn.decl.start.line,
        name: fn.name
      });
    }
  }
  
  // Report if gaps found
  if (untestedLines.length > 0 || untestedBranches.length > 0 || untestedFunctions.length > 0) {
    console.log(\`📄 \${relPath}\n\`);
    
    if (untestedFunctions.length > 0) {
      console.log('   ❌ Untested Functions:');
      untestedFunctions.forEach(fn => {
        console.log(\`      Line \${fn.line}: \${fn.name || 'anonymous'}()\`);
      });
      console.log();
    }
    
    if (untestedBranches.length > 0) {
      console.log('   ⚠️  Untested Branches:');
      const uniqueLines = [...new Set(untestedBranches.map(b => b.line))];
      uniqueLines.slice(0, 10).forEach(line => {
        console.log(\`      Line \${line}: branch not covered\`);
      });
      if (uniqueLines.length > 10) {
        console.log(\`      ... and \${uniqueLines.length - 10} more branches\`);
      }
      console.log();
    }
    
    if (untestedLines.length > 0 && untestedFunctions.length === 0) {
      console.log('   📝 Untested Lines:');
      const sortedLines = [...new Set(untestedLines)].sort((a, b) => a - b);
      const ranges = [];
      let start = sortedLines[0];
      let end = sortedLines[0];
      
      for (let i = 1; i < sortedLines.length; i++) {
        if (sortedLines[i] === end + 1) {
          end = sortedLines[i];
        } else {
          ranges.push(start === end ? \`\${start}\` : \`\${start}-\${end}\`);
          start = sortedLines[i];
          end = sortedLines[i];
        }
      }
      ranges.push(start === end ? \`\${start}\` : \`\${start}-\${end}\`);
      
      console.log(\`      Lines: \${ranges.join(', ')}\`);
      console.log();
    }
    
    console.log();
  }
}

console.log('═══════════════════════════════════════\n');
console.log('Next steps:');
console.log('  • Review untested code above');
console.log('  • Run: @test-reviewer suggest-tests [file]');
console.log('  • Run: @test-generator to create tests');
console.log('  • Focus on untested branches (if/else paths)\n');
"

exit 0
