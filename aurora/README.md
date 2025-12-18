# Aurora

**Multi-project AI orchestration for lead developers (Cursor-first).**

Aurora provides specialized agents backed by shell scripts that give AI and developers structured, queryable information about code quality, testing, architecture, and more.

---

## Quick Start

```bash
# Install CLI
cd aurora-cli && npm install && npm link

# Make tools executable
chmod +x aurora/agents/*/tools/*.sh aurora/agents/shared/tools/*.sh

# Run a tool directly
./aurora/agents/quality-reviewer/tools/scan-violations.sh src --format text
```

---

## Agent Tools Reference

All tools support `--format text|json|xml` for structured output.

### Quality & Standards
| Agent | Tool | Description |
|-------|------|-------------|
| `quality-reviewer` | `scan-violations.sh [path]` | ESLint violations with file:line anchors |
| `quality-reviewer` | `quality-check.sh [path]` | Full quality check (lint + complexity) |
| `theme-enforcer` | `scan-hardcoded.sh [path]` | Find hardcoded colors/spacing |
| `theme-enforcer` | `enforce-themes.sh [path]` | Replace hardcoded values with tokens |
| `code-analyzer` | `analyze-complexity.sh [path]` | Cyclomatic complexity + file sizes |

### Testing
| Agent | Tool | Description |
|-------|------|-------------|
| `coverage-analyzer` | `analyze-coverage.sh` | Run vitest coverage analysis |
| `coverage-analyzer` | `find-gaps.sh` | Find uncovered code paths |
| `coverage-analyzer` | `coverage-trends.sh` | Track coverage over time |
| `test-reviewer` | `analyze-tests.sh [path]` | Review test quality |
| `test-reviewer` | `coverage-report.sh` | Generate coverage report |
| `test-generator` | `generate-tests.sh [file]` | Generate test skeletons |

### Architecture
| Agent | Tool | Description |
|-------|------|-------------|
| `architect` | `analyze-architecture.sh [path]` | Analyze component structure |
| `architect` | `dependency-graph.sh [path]` | Generate import graph |
| `architect` | `suggest-patterns.sh [path]` | Suggest design patterns |
| `refactorer` | `split-file.sh [file]` | Guide file splitting |
| `refactorer` | `extract-hook.sh [file]` | Extract custom hooks |

### Dependencies & Performance
| Agent | Tool | Description |
|-------|------|-------------|
| `dependency-manager` | `check-deps.sh` | Outdated packages + security audit |
| `performance-optimizer` | `check-bundle.sh` | Bundle size analysis |
| `debugger` | `check-errors.sh [path]` | Find error-prone patterns |

### Documentation
| Agent | Tool | Description |
|-------|------|-------------|
| `tech-doc-maintainer` | `scan-packages.sh` | Find undocumented packages |
| `tech-doc-maintainer` | `sync-docs.sh` | Sync docs with package.json |
| `coordinator` | `route-task.sh "[task]"` | Route task to appropriate agent |

---

## CLI Commands

### Single Project
```bash
aurora run <agent> <tool> [args]     # Run tool in current project
aurora validate                       # Check Aurora installation
aurora list --agents                  # List available agents
aurora list --tools quality-reviewer  # List agent tools
```

### Multi-Project
```bash
aurora register /path/to/project --name "My Project"
aurora run-all quality-reviewer scan-violations --parallel
aurora compare quality
aurora sync agents --agent quality-reviewer
```

### Git Management
```bash
aurora git-status --all              # Status across projects
aurora git-health --all              # Health check (uncommitted, ahead/behind)
aurora feature-start my-feature      # Start feature branch
aurora feature-finish --pr           # Finish + create PR
```

---

## Output Formats

All tools support structured output:

```bash
# Human-readable
./aurora/agents/code-analyzer/tools/analyze-complexity.sh src

# JSON (for scripts/CI)
./aurora/agents/code-analyzer/tools/analyze-complexity.sh src json

# XML (for reports)
./aurora/agents/code-analyzer/tools/analyze-complexity.sh src xml
```

---

## Project Config

Aurora reads `project-config.json`:

```json
{
  "aurora": {
    "adapter": "aurora/adapters/web-react"
  },
  "agents": {
    "enabled": ["quality-reviewer", "test-generator", "coordinator"]
  },
  "standards": {
    "max_file_lines": 300,
    "max_complexity": 10,
    "coverage_threshold": 85
  }
}
```

---

## AI Interaction Rules

- **Default output**: Structured bullets in chat (not files)
- **Edit existing files** first; don't create new ones
- **Markdown budgets**: README ≤200 lines, other docs ≤150 lines
- See `.cursor/rules/core-standards.mdc` for enforcement
