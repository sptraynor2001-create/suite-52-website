/**
 * Aurora Validate Command
 * 
 * Validates Aurora installation and project configuration.
 * Checks for required files, tools, dependencies, and git health.
 */

import chalk from 'chalk';
import { existsSync, readFileSync, accessSync, constants, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

const REQUIRED_TOOLS = [
  { name: 'bash', required: true },
  { name: 'git', required: true },
  { name: 'node', required: true },
  { name: 'jq', required: false, hint: 'Optional but recommended for checkpoint heuristics' }
];

const REQUIRED_FILES = [
  'aurora/core/adapter-loader.sh',
  'aurora/core/agent-runtime.sh',
  'aurora/core/checkpoint.sh',
  'aurora/agents/registry/agents.json',
  'project-config.json',
];

export async function validateCommand(options) {
  const projectRoot = options.project ? resolve(options.project) : process.cwd();
  
  console.log(chalk.bold.cyan('\n🔍 Validating Aurora Installation\n'));
  console.log(chalk.gray(`Project: ${projectRoot}\n`));

  let hasErrors = false;
  let hasWarnings = false;

  // Check Aurora directory
  const auroraPath = join(projectRoot, 'aurora');
  if (!existsSync(auroraPath)) {
    console.error(chalk.red('❌ Aurora not installed in this project'));
    console.log(chalk.yellow('   Run "aurora init" to install\n'));
    process.exit(1);
  }

  console.log(chalk.green('✓ Aurora directory found'));

  // Check required system tools
  console.log(chalk.cyan('\nChecking system tools:'));
  for (const tool of REQUIRED_TOOLS) {
    try {
      execSync(`command -v ${tool.name}`, { stdio: 'ignore' });
      console.log(chalk.green(`  ✓ ${tool.name}`));
    } catch (error) {
      if (tool.required) {
        console.log(chalk.red(`  ❌ ${tool.name} not found`));
        hasErrors = true;
      } else {
        console.log(chalk.yellow(`  ⚠ ${tool.name} not found`));
        if (tool.hint) console.log(chalk.gray(`    ${tool.hint}`));
        hasWarnings = true;
      }
    }
  }

  // Check required files
  console.log(chalk.cyan('\nChecking required files:'));
  for (const file of REQUIRED_FILES) {
    const filePath = join(projectRoot, file);
    if (existsSync(filePath)) {
      console.log(chalk.green(`  ✓ ${file}`));
    } else {
      console.log(chalk.red(`  ❌ ${file} missing`));
      hasErrors = true;
    }
  }

  // Check project-config.json
  console.log(chalk.cyan('\nChecking configuration:'));
  const configPath = join(projectRoot, 'project-config.json');
  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      
      if (config.aurora?.adapter) {
        console.log(chalk.green(`  ✓ Adapter configured: ${config.aurora.adapter}`));
        
        // Check adapter exists
        const adapterPath = join(projectRoot, config.aurora.adapter);
        if (existsSync(adapterPath)) {
          console.log(chalk.green(`  ✓ Adapter found at ${config.aurora.adapter}`));
        } else {
          console.log(chalk.red(`  ❌ Adapter not found: ${config.aurora.adapter}`));
          hasErrors = true;
        }
      } else {
        console.log(chalk.yellow('  ⚠ No adapter configured in project-config.json'));
        hasWarnings = true;
      }
    } catch (error) {
      console.log(chalk.red(`  ❌ Invalid JSON in project-config.json`));
      hasErrors = true;
    }
  }

  // Check agent registry
  console.log(chalk.cyan('\nChecking agents:'));
  const registryPath = join(auroraPath, 'agents/registry/agents.json');
  if (existsSync(registryPath)) {
    try {
      const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
      const agentCount = Object.keys(registry.agents || {}).length;
      console.log(chalk.green(`  ✓ ${agentCount} agents registered`));
    } catch (error) {
      console.log(chalk.red(`  ❌ Invalid agents.json`));
      hasErrors = true;
    }
  }

  // Check git repository status
  console.log(chalk.cyan('\nChecking git status:'));
  try {
    const gitDir = join(projectRoot, '.git');
    if (existsSync(gitDir)) {
      console.log(chalk.green('  ✓ Git repository detected'));
      
      // Check for remote
      try {
        const remote = execSync('git remote get-url origin', { cwd: projectRoot, encoding: 'utf-8' }).trim();
        console.log(chalk.green(`  ✓ Remote: ${remote.slice(0, 50)}...`));
      } catch {
        console.log(chalk.yellow('  ⚠ No git remote configured'));
        hasWarnings = true;
      }

      // Check for uncommitted changes
      try {
        const status = execSync('git status --porcelain', { cwd: projectRoot, encoding: 'utf-8' }).trim();
        if (status) {
          const changes = status.split('\n').length;
          console.log(chalk.yellow(`  ⚠ ${changes} uncommitted changes`));
        } else {
          console.log(chalk.green('  ✓ Working tree clean'));
        }
      } catch {
        // Ignore
      }
    } else {
      console.log(chalk.yellow('  ⚠ Not a git repository'));
      hasWarnings = true;
    }
  } catch (error) {
    console.log(chalk.yellow('  ⚠ Could not check git status'));
    hasWarnings = true;
  }

  // Check tool executability
  console.log(chalk.cyan('\nChecking tool permissions:'));
  const toolDirs = [
    'aurora/agents/quality-reviewer/tools',
    'aurora/agents/theme-enforcer/tools',
    'aurora/agents/shared/tools'
  ];
  
  let executableTools = 0;
  let nonExecutableTools = 0;
  
  for (const toolDir of toolDirs) {
    const dirPath = join(projectRoot, toolDir);
    if (existsSync(dirPath)) {
      try {
        const files = readdirSync(dirPath).filter(f => f.endsWith('.sh'));
        for (const file of files) {
          const filePath = join(dirPath, file);
          try {
            accessSync(filePath, constants.X_OK);
            executableTools++;
          } catch {
            nonExecutableTools++;
            if (options.verbose) {
              console.log(chalk.yellow(`  ⚠ Not executable: ${toolDir}/${file}`));
            }
          }
        }
      } catch {
        // Directory read error
      }
    }
  }
  
  if (nonExecutableTools > 0) {
    console.log(chalk.yellow(`  ⚠ ${nonExecutableTools} tools not executable`));
    console.log(chalk.gray('    Run: chmod +x aurora/agents/*/tools/*.sh'));
    hasWarnings = true;
  } else if (executableTools > 0) {
    console.log(chalk.green(`  ✓ ${executableTools} tools executable`));
  }

  // Summary
  console.log(chalk.cyan('\n' + '='.repeat(50)));
  if (hasErrors) {
    console.log(chalk.red.bold('\n❌ Validation FAILED\n'));
    if (options.fix) {
      console.log(chalk.yellow('Attempting to fix issues...\n'));
      
      // Auto-fix: Make tools executable
      if (nonExecutableTools > 0) {
        console.log(chalk.gray('Making tools executable...'));
        try {
          execSync('find aurora/agents -name "*.sh" -exec chmod +x {} \\;', { cwd: projectRoot, stdio: 'ignore' });
          console.log(chalk.green('  ✓ Fixed tool permissions'));
        } catch {
          console.log(chalk.red('  ✗ Could not fix permissions'));
        }
      }
      
      console.log(chalk.yellow('\nFor other issues, please reinstall:\n'));
      console.log(chalk.gray('  aurora init --force\n'));
    }
    process.exit(1);
  } else if (hasWarnings) {
    console.log(chalk.yellow.bold('\n⚠ Validation PASSED with warnings\n'));
  } else {
    console.log(chalk.green.bold('\n✓ Validation PASSED\n'));
    console.log(chalk.white('Aurora is properly installed and configured.\n'));
  }
}
