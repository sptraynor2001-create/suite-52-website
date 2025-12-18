#!/bin/bash
# Web-React Adapter - Quality Reviewer - Scan Violations
#
# Focus: actionable, file/line anchored violations for TS/TSX code.
# This complements ESLint by outputting a human-friendly view and optionally JSON/XML.
#
# Usage:
#   ./aurora/agents/quality-reviewer/tools/scan-violations.sh [path] [--format text|json|xml] [--max N]
#

set -euo pipefail

# Ensure we run from the repo root (so paths like src/ resolve consistently)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"
cd "$REPO_ROOT"

SEARCH_PATH="src"
OUTPUT_FORMAT="text" # text | json | xml
MAX_RESULTS=200

if [ $# -ge 1 ] && [[ "${1:-}" != --* ]]; then
  SEARCH_PATH="$1"
  shift
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --format)
      OUTPUT_FORMAT="${2:-text}"
      shift 2
      ;;
    --max)
      MAX_RESULTS="${2:-200}"
      shift 2
      ;;
    --help)
      cat <<'EOF'
Scan Violations - Web React Adapter

Usage:
  scan-violations.sh [path] [--format text|json|xml] [--max N]

Examples:
  scan-violations.sh src/features
  scan-violations.sh src --format json --max 500
EOF
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

if ! command -v npm >/dev/null 2>&1; then
  echo "Aurora error: npm is required" >&2
  exit 2
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Aurora error: jq is required to parse eslint output" >&2
  echo "Install jq (macOS): brew install jq" >&2
  exit 2
fi

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

# Run ESLint and capture JSON output. Non-zero exit is expected when violations exist.
npx --no-install eslint "$SEARCH_PATH" --format json >"$TMP" 2>/dev/null || true

if [ ! -s "$TMP" ]; then
  # If ESLint produced no JSON (e.g., config error), surface stderr by re-running once without suppression.
  echo "Aurora error: eslint did not produce JSON output. Re-running eslint for diagnostics..." >&2
  npx --no-install eslint "$SEARCH_PATH" --format json >"$TMP"
fi

total_messages="$(jq '[.[]?.messages[]?] | length' "$TMP" 2>/dev/null || echo "0")"

if [ "$OUTPUT_FORMAT" = "json" ]; then
  jq --argjson max "$MAX_RESULTS" '
    {
      summary: {
        total_messages: ([.[]?.messages[]?] | length),
        files_with_messages: ([.[]? | select((.messages | length) > 0)] | length)
      },
      violations: (
        [ .[]? | .filePath as $file | .messages[]? | . + { filePath: $file } ]
        | .[0:$max]
        | map({
            file: (.filePath | gsub("^.*/"; "")),
            filePath: .filePath,
            line: .line,
            column: .column,
            severity: (if .severity == 2 then "error" else "warning" end),
            ruleId: (.ruleId // "unknown"),
            message: .message
        })
      )
    }
  ' "$TMP"
  exit $([ "$total_messages" -gt 0 ] && echo 1 || echo 0)
fi

if [ "$OUTPUT_FORMAT" = "xml" ]; then
  echo "<violation_report>"
  echo "  <summary>"
  echo "    <total_messages>$total_messages</total_messages>"
  echo "  </summary>"
  echo "  <violations>"
  jq -r --argjson max "$MAX_RESULTS" '
    [ .[]? | .filePath as $file | .messages[]? | . + { filePath: $file } ]
    | .[0:$max]
    | .[]
    | "    <violation>\n      <filePath>\(.filePath)</filePath>\n      <line>\(.line)</line>\n      <column>\(.column)</column>\n      <severity>\(if .severity==2 then "error" else "warning" end)</severity>\n      <ruleId>\(.ruleId // "unknown")</ruleId>\n      <message>\(.message | gsub(\"&\";\"&amp;\") | gsub(\"<\";\"&lt;\") | gsub(\">\";\"&gt;\"))</message>\n    </violation>"
  ' "$TMP"
  echo "  </violations>"
  echo "</violation_report>"
  exit $([ "$total_messages" -gt 0 ] && echo 1 || echo 0)
fi

echo "Violation scan (web-react)"
echo "Path: $SEARCH_PATH"
echo "Total messages: $total_messages"
echo "──────────────────────────────────────────────────────────────"

if [ "$total_messages" -eq 0 ]; then
  echo "✓ No ESLint messages found"
  exit 0
fi

# Print top N messages in a concise, grep-friendly format
jq -r --argjson max "$MAX_RESULTS" '
  [ .[]? | .filePath as $file | .messages[]? | . + { filePath: $file } ]
  | .[0:$max]
  | .[]
  | "\(.filePath):\(.line):\(.column) [\(if .severity==2 then "error" else "warn" end)] (\(.ruleId // "unknown")) \(.message)"
' "$TMP"

if [ "$total_messages" -gt "$MAX_RESULTS" ]; then
  echo "──────────────────────────────────────────────────────────────"
  echo "… truncated: showing $MAX_RESULTS of $total_messages messages (use --max to increase)"
fi

exit 1

