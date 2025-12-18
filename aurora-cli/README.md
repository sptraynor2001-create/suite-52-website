# Aurora CLI

Command-line interface for the Aurora multi-agent framework.

## Install

```bash
npm install
npm link
```

## Commands

### Project Management
```bash
aurora init --adapter web-react     # Initialize Aurora in project
aurora validate                     # Check installation
aurora list --agents                # List available agents
aurora list --tools <agent>         # List agent tools
```

### Running Tools
```bash
aurora run <agent> <tool> [args]    # Run tool in current project
aurora run quality-reviewer scan-violations src --format json
```

### Multi-Project Workspace
```bash
aurora register /path --name "Project"  # Add project to workspace
aurora unregister <project>             # Remove project
aurora projects                         # List registered projects
aurora use <project>                    # Switch active project
aurora status                           # Workspace overview
```

### Cross-Project Operations
```bash
aurora run-all <agent> <tool> [--parallel]  # Run across all projects
aurora compare <quality|coverage|complexity> # Compare metrics
aurora sync <agents|adapters|core|config>    # Sync improvements
```

### Git Management
```bash
aurora git-status [--all]           # Git status
aurora git-health [--all]           # Health check
aurora git-sync [--all]             # Fetch from remotes
aurora feature-start <name>         # Start feature branch
aurora feature-finish [--pr]        # Finish feature
aurora release-cut <version>        # Create release branch
aurora hotfix-start <name>          # Start hotfix
aurora git-gate pre-push            # Run pre-push checks
```

### Workflow Orchestration
```bash
aurora workflow-start "description" --template new-feature
aurora workflow-resume [id]
aurora workflow-status [--all]
aurora workflow-cancel <id>
```

### Configuration
```bash
aurora config list                  # Show all config
aurora config get <key>             # Get value
aurora config set <key> <value>     # Set value
```

## Options

Most commands support:
- `--verbose` / `-v` - Detailed output
- `--parallel` / `-p` - Parallel execution
- `--yes` / `-y` - Skip confirmations
- `--format <text|json|xml>` - Output format

## Workspace Location

Aurora stores workspace data in `~/.aurora/`:
- `config.json` - Global settings
- `projects.json` - Registered projects
- `workflows/` - Workflow state
- `logs/` - Execution logs
