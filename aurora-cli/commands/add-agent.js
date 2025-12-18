/**
 * Aurora Add Agent Command
 * 
 * Adds a specific agent to the current project.
 */

import chalk from 'chalk';
import ora from 'ora';
import { existsSync, copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { copyDir, ensureDir } from '../lib/fs-utils.js';

export async function addAgentCommand(agentName, options) {
  const projectRoot = process.cwd();
  const auroraPath = join(projectRoot, 'aurora');

  // Validate Aurora installation
  if (!existsSync(auroraPath)) {
    console.error(chalk.red('❌ Aurora not found in this project.'));
    console.log(chalk.yellow('   Run "aurora init" to install.\n'));
    process.exit(1);
  }

  console.log(chalk.cyan(`\n📦 Adding agent: ${agentName}\n`));

  const targetPath = join(auroraPath, 'agents', agentName);

  // Check if agent already exists
  if (existsSync(targetPath)) {
    console.error(chalk.red(`❌ Agent "${agentName}" already exists.`));
    console.log(chalk.yellow('   Use --force to overwrite.\n'));
    process.exit(1);
  }

  const spinner = ora('Adding agent...').start();

  try {
    // Determine source path
    let sourcePath = options.source;
    if (!sourcePath) {
      // Use built-in agent templates
      sourcePath = join(__dirname, '../templates/aurora/agents', agentName);
    } else {
      sourcePath = resolve(sourcePath);
    }

    if (!existsSync(sourcePath)) {
      spinner.fail('Agent source not found');
      console.error(chalk.red(`❌ Source path not found: ${sourcePath}\n`));
      process.exit(1);
    }

    // Copy agent
    await copyDir(sourcePath, targetPath);

    spinner.succeed(`Agent "${agentName}" added successfully`);
    console.log(chalk.green(`\n✓ Agent available at: aurora/agents/${agentName}\n`));
  } catch (error) {
    spinner.fail('Failed to add agent');
    console.error(chalk.red(`\n${error.message}\n`));
    process.exit(1);
  }
}
