# Aurora

**Multi‑project AI orchestration for lead developers (Cursor-first).**

Aurora is a lightweight framework + CLI that helps you run specialized “agents” (quality, testing, architecture, refactoring, docs) **across multiple projects**, compare results, and sync improvements.

---

## Table of contents
- [What it is](#what-it-is)
- [Key features](#key-features)
- [Requirements](#requirements)
- [Install](#install)
- [Quickstart](#quickstart)
- [CLI commands](#cli-commands)
- [Project tech docs](#project-tech-docs)
- [How to work with AI (low-token, no-file-spam)](#how-to-work-with-ai-low-token-no-file-spam)
- [Contributing / local dev](#contributing--local-dev)

---

## What it is

Aurora gives you:
- A **project-local runtime** in `aurora/` (core runtime + agents + tools)
- A **multi-project CLI** (in `aurora-cli/`) that manages a global workspace and runs agents across registered projects

If you’re moving fast across several repos, Aurora is designed to keep quality/testing/architecture checks consistent.

---

## Key features

- **Multi-project workspace**: register projects once; run commands across all.
- **Cross-project execution**: `run-all` supports parallel execution.
- **Compare metrics**: compare quality/coverage/complexity across projects.
- **Sync improvements**: propagate agent/tool upgrades to other projects.
- **Tooling-first**: agents are backed by executable scripts in `aurora/agents/**/tools/`.

---

## Requirements

- **Node.js + npm** (for `aurora-cli/`)
- **bash** (agent tooling)

---

## Install

### 1) Install the CLI

```bash
cd aurora-cli
npm install
npm link
```

### 2) Ensure agent tools are executable (project-local)

```bash
chmod +x aurora/agents/*/tools/*.sh
chmod +x aurora/agents/shared/tools/*.sh
```

---

## Quickstart

### Single project

Run tools directly (fastest way to validate the install):

```bash
./aurora/agents/quality-reviewer/tools/scan-violations.sh src --format text
./aurora/agents/theme-enforcer/tools/scan-hardcoded.sh src
```

### Multi project

```bash
# Register projects
aurora register /path/to/project-a --name "Project A"
aurora register /path/to/project-b --name "Project B"

# Run quality checks everywhere
aurora run-all quality-reviewer scan --parallel

# Compare
aurora compare quality

# Sync improvements
aurora sync agents --agent quality-reviewer -y
```

---

## CLI commands

### Workspace
- `aurora register [path] [--name ...]` — add a project
- `aurora unregister <project>` — remove a project
- `aurora projects` — list projects
- `aurora use <project>` — set current project
- `aurora status` — workspace overview
- `aurora config list|get|set|reset` — manage workspace config

### Multi-project operations
- `aurora run-all <agent> <tool> [--parallel]` — run across all projects
- `aurora compare <quality|coverage|complexity>` — compare metrics
- `aurora sync <agents|adapters|core|config> [...]` — sync files across projects

---

## Project tech docs

Aurora keeps **project-specific tech references** here:
- `aurora/project-docs/tech-stack/`

These are short, purpose-built docs intended for fast lookup (and to reduce “AI guessing”).

---

## How to work with AI (low-token, no-file-spam)

Aurora is designed to be **Cursor-friendly**.

### Output defaults
- **Default**: respond in chat with **structured bullets** (no auto-generated markdown files).
- **Edit existing files first**; don’t create new ones unless explicitly requested.

### File creation policy (hard rule)
- **DO NOT create new files** (especially `*.md`) unless:
  - the user explicitly asks (“create a doc…”, “write a README…”, “make a new file…”), or
  - the task is clearly best handled as documentation and the user intent implies it.

### Markdown budgets (token control)
- `README.md`: **≤ 200 lines**
- Other markdown: **≤ 150 lines**
- If you need more detail: keep it in chat and reference locations, or split into explicitly requested docs.

This policy is enforced in `.cursor/rules/core-standards.mdc`.

---

## Contributing / local dev

- **Run quality checks** before pushing:

```bash
npm run quality
```

- **Actionable violations list**:

```bash
./aurora/agents/quality-reviewer/tools/scan-violations.sh src --format text
```
