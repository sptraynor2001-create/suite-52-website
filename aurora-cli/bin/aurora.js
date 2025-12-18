#!/usr/bin/env node

/**
 * Aurora CLI - Multi-agent AI orchestration framework
 * 
 * Entry point for the Aurora command-line interface.
 * Provides commands for installing, managing, and running Aurora agents.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Commands
import { initCommand } from '../commands/init.js';
import { runCommand } from '../commands/run.js';
import { validateCommand } from '../commands/validate.js';
import { addAgentCommand } from '../commands/add-agent.js';
import { listCommand } from '../commands/list.js';
import { registerCommand } from '../commands/register.js';
import { unregisterCommand } from '../commands/unregister.js';
import { projectsCommand } from '../commands/projects.js';
import { useCommand } from '../commands/use.js';
import { runAllCommand } from '../commands/run-all.js';
import { compareCommand } from '../commands/compare.js';
import { syncCommand } from '../commands/sync.js';
import { statusCommand } from '../commands/status.js';
import { configCommand } from '../commands/config.js';
import {
  gitStatusCommand,
  gitHealthCommand,
  gitFeatureStartCommand,
  gitFeatureFinishCommand,
  gitReleaseCutCommand,
  gitHotfixStartCommand,
  gitGateCommand,
  gitSyncCommand
} from '../commands/git.js';
import {
  workflowStartCommand,
  workflowResumeCommand,
  workflowStatusCommand,
  workflowCancelCommand
} from '../commands/workflow.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

program
  .name('aurora')
  .description('Multi-agent AI orchestration framework for lead developers')
  .version(packageJson.version);

// aurora init
program
  .command('init')
  .description('Initialize Aurora in the current project')
  .option('-a, --adapter <name>', 'Adapter to use (web-react, web-nextjs, api-express)')
  .option('-f, --force', 'Overwrite existing Aurora installation')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(initCommand);

// aurora run
program
  .command('run <agent> <tool>')
  .description('Run an Aurora agent tool')
  .option('-p, --project <path>', 'Project path (defaults to current directory)')
  .option('-v, --verbose', 'Verbose output')
  .option('--', 'Pass additional arguments to the tool')
  .action(runCommand);

// aurora validate
program
  .command('validate')
  .description('Validate Aurora installation and configuration')
  .option('-p, --project <path>', 'Project path (defaults to current directory)')
  .option('--fix', 'Attempt to fix common issues')
  .action(validateCommand);

// aurora add-agent
program
  .command('add-agent <name>')
  .description('Add a specific agent to the current project')
  .option('-s, --source <path>', 'Source path for agent definition')
  .action(addAgentCommand);

// aurora list
program
  .command('list')
  .description('List available agents and adapters')
  .option('-a, --agents', 'List available agents')
  .option('-d, --adapters', 'List available adapters')
  .option('-t, --tools [agent]', 'List tools (optionally for specific agent)')
  .action(listCommand);

// aurora register
program
  .command('register [path]')
  .description('Register a project with the Aurora workspace')
  .option('-n, --name <name>', 'Project name')
  .option('-f, --force', 'Force update if already registered')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-v, --verbose', 'Verbose output')
  .action(registerCommand);

// aurora unregister
program
  .command('unregister <project>')
  .description('Remove a project from the Aurora workspace')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-v, --verbose', 'Verbose output')
  .action(unregisterCommand);

// aurora projects
program
  .command('projects')
  .description('List all registered projects')
  .option('--enabled', 'Show only enabled projects')
  .option('--adapter <name>', 'Filter by adapter type')
  .option('-v, --verbose', 'Verbose output')
  .action(projectsCommand);

// aurora use
program
  .command('use <project>')
  .description('Switch to a different project context')
  .option('-v, --verbose', 'Verbose output')
  .action(useCommand);

// aurora run-all
program
  .command('run-all <agent> <tool>')
  .description('Run an agent/tool across all registered projects (use -- to pass extra args)')
  .option('-p, --parallel', 'Run in parallel (respects max jobs setting)')
  .option('-v, --verbose', 'Verbose output')
  .allowUnknownOption(true)
  .action((agent, tool, options, command) => runAllCommand(agent, tool, options, command));

// aurora compare
program
  .command('compare <metric>')
  .description('Compare metrics across projects (quality, coverage, complexity)')
  .option('-v, --verbose', 'Verbose output')
  .action(compareCommand);

// aurora sync
program
  .command('sync <what>')
  .description('Sync agents, adapters, config, or core across projects')
  .option('--from <project>', 'Source project (defaults to current)')
  .option('--agent <name>', 'Sync specific agent (for "agents" sync)')
  .option('-f, --force', 'Force sync even with mismatches')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-v, --verbose', 'Verbose output')
  .action(syncCommand);

// aurora status
program
  .command('status')
  .description('Show workspace status and current project')
  .option('--logs', 'Show recent execution logs')
  .option('-v, --verbose', 'Verbose output')
  .action(statusCommand);

// aurora config
program
  .command('config <action> [key] [value]')
  .description('Manage workspace configuration (actions: get, set, list, reset)')
  .option('--json', 'Output in JSON format')
  .option('-f, --force', 'Force set custom keys')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-v, --verbose', 'Verbose output')
  .action(configCommand);

// ─────────────────────────────────────────────────────────────────────────────
// GIT COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

// aurora git status
program
  .command('git-status')
  .description('Show git status for Aurora projects')
  .option('-a, --all', 'Show status for all registered projects')
  .option('-v, --verbose', 'Show detailed information')
  .action(gitStatusCommand);

// aurora git health
program
  .command('git-health')
  .description('Check git health across Aurora projects')
  .option('-a, --all', 'Check all registered projects')
  .option('-v, --verbose', 'Show detailed information')
  .action(gitHealthCommand);

// aurora git sync
program
  .command('git-sync')
  .description('Fetch latest from remotes for all projects')
  .option('-a, --all', 'Sync all registered projects')
  .option('-v, --verbose', 'Show detailed information')
  .action(gitSyncCommand);

// aurora git feature start
program
  .command('feature-start <name>')
  .description('Start a new feature branch (gitFlow)')
  .option('-p, --project <id>', 'Project to use (defaults to current)')
  .option('--no-push', 'Do not push to remote')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-v, --verbose', 'Verbose output')
  .action(gitFeatureStartCommand);

// aurora git feature finish
program
  .command('feature-finish')
  .description('Finish current feature branch (run checks, optionally create PR)')
  .option('-p, --project <id>', 'Project to use (defaults to current)')
  .option('--pr', 'Create pull request via gh CLI')
  .option('-v, --verbose', 'Verbose output')
  .action(gitFeatureFinishCommand);

// aurora git release cut
program
  .command('release-cut <version>')
  .description('Create a release branch from develop')
  .option('-p, --project <id>', 'Project to use (defaults to current)')
  .option('--pr', 'Create pull request to main')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-v, --verbose', 'Verbose output')
  .action(gitReleaseCutCommand);

// aurora git hotfix start
program
  .command('hotfix-start <name>')
  .description('Start a hotfix branch from main')
  .option('-p, --project <id>', 'Project to use (defaults to current)')
  .option('--no-push', 'Do not push to remote')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-v, --verbose', 'Verbose output')
  .action(gitHotfixStartCommand);

// aurora git gate
program
  .command('git-gate <gate>')
  .description('Run git guardrail checks (gates: pre-push)')
  .option('-a, --all', 'Run on all registered projects')
  .option('-v, --verbose', 'Show detailed fix instructions')
  .action(gitGateCommand);

// ─────────────────────────────────────────────────────────────────────────────
// WORKFLOW COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

// aurora workflow-start
program
  .command('workflow-start <description>')
  .description('Start a new multi-agent workflow')
  .option('-p, --project <id>', 'Project to use (defaults to current)')
  .option('-t, --template <name>', 'Use workflow template (new-feature, fix-violations, pre-deploy, refactor)')
  .option('-a, --agents <list>', 'Comma-separated list of agents')
  .option('-r, --run', 'Start execution immediately')
  .option('-f, --force', 'Force start even if active workflow exists')
  .option('-v, --verbose', 'Verbose output')
  .action(workflowStartCommand);

// aurora workflow-resume
program
  .command('workflow-resume [workflowId]')
  .description('Resume a paused or pending workflow')
  .option('-f, --force', 'Force resume cancelled/failed workflow')
  .option('-v, --verbose', 'Verbose output')
  .action(workflowResumeCommand);

// aurora workflow-status
program
  .command('workflow-status')
  .description('Show workflow status')
  .option('-a, --all', 'Show workflows for all projects')
  .option('-l, --limit <n>', 'Limit number of workflows shown', parseInt)
  .option('-v, --verbose', 'Show detailed information')
  .action(workflowStatusCommand);

// aurora workflow-cancel
program
  .command('workflow-cancel <workflowId>')
  .description('Cancel an active workflow')
  .option('-y, --yes', 'Skip confirmation')
  .action(workflowCancelCommand);

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`\nError: Unknown command '${program.args.join(' ')}'`));
  console.log(chalk.yellow('\nRun "aurora --help" for available commands.\n'));
  process.exit(1);
});

// Parse and execute
program.parse();
