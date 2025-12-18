/**
 * Aurora Sync Command
 * 
 * Sync agents, adapters, or configuration across projects
 */

import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { copyFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import AuroraWorkspace from '../lib/workspace.js';

export async function syncCommand(what, options) {
  const workspace = new AuroraWorkspace();

  try {
    const projects = workspace.listProjects({ enabled: true });

    if (projects.length < 2) {
      console.log(chalk.yellow('\nNeed at least 2 projects to sync.'));
      console.log(chalk.gray('Run "aurora register <path>" to register more projects.\n'));
      process.exit(1);
    }

    // Select source project
    let sourceProject;
    if (options.from) {
      sourceProject = workspace.getProject(options.from);
      if (!sourceProject) {
        console.error(chalk.red(`\n✗ Source project not found: ${options.from}\n`));
        process.exit(1);
      }
    } else {
      const currentProject = workspace.getCurrentProject();
      if (currentProject) {
        sourceProject = currentProject;
      } else {
        const { source } = await inquirer.prompt([
          {
            type: 'list',
            name: 'source',
            message: 'Select source project:',
            choices: projects.map(p => ({ name: p.name, value: p.id }))
          }
        ]);
        sourceProject = workspace.getProject(source);
      }
    }

    // Select target projects
    const targetProjects = projects.filter(p => p.id !== sourceProject.id);

    if (!options.yes) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Sync ${what} from "${sourceProject.name}" to ${targetProjects.length} other projects?`,
          default: false
        }
      ]);

      if (!confirm) {
        console.log(chalk.gray('Sync cancelled.\n'));
        process.exit(0);
      }
    }

    console.log(chalk.bold(`\n🔄 Syncing ${what} from ${sourceProject.name}\n`));

    const results = [];

    for (const target of targetProjects) {
      const spinner = ora(`Syncing to ${target.name}...`).start();
      
      try {
        if (what === 'agents') {
          await syncAgents(sourceProject, target, options);
        } else if (what === 'adapters') {
          await syncAdapters(sourceProject, target, options);
        } else if (what === 'config') {
          await syncConfig(sourceProject, target, options);
        } else if (what === 'core') {
          await syncCore(sourceProject, target, options);
        } else {
          throw new Error(`Unknown sync target: ${what}`);
        }

        spinner.succeed(chalk.green(`Synced to ${target.name}`));
        results.push({ project: target, success: true });
      } catch (error) {
        spinner.fail(chalk.red(`Failed to sync to ${target.name}`));
        if (options.verbose) {
          console.error(chalk.gray(`   ${error.message}`));
        }
        results.push({ project: target, success: false, error: error.message });
      }
    }

    // Summary
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    console.log(chalk.gray('\n─'.repeat(60)));
    console.log(chalk.gray(`Success: ${successCount} | Failed: ${failCount} | Total: ${results.length}\n`));

    if (failCount > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Sync agents from source to target
 */
async function syncAgents(source, target, options) {
  const sourceAgentsDir = join(source.path, 'aurora', 'agents');
  const targetAgentsDir = join(target.path, 'aurora', 'agents');

  if (!existsSync(sourceAgentsDir)) {
    throw new Error('Source agents directory not found');
  }

  if (!existsSync(targetAgentsDir)) {
    mkdirSync(targetAgentsDir, { recursive: true });
  }

  // Get list of agents to sync
  const agents = readdirSync(sourceAgentsDir).filter(name => {
    const stat = statSync(join(sourceAgentsDir, name));
    return stat.isDirectory() && name !== 'registry' && name !== 'shared';
  });

  if (options.agent) {
    // Sync specific agent
    if (!agents.includes(options.agent)) {
      throw new Error(`Agent not found: ${options.agent}`);
    }
    copyRecursive(
      join(sourceAgentsDir, options.agent),
      join(targetAgentsDir, options.agent)
    );
  } else {
    // Sync all agents
    for (const agent of agents) {
      copyRecursive(
        join(sourceAgentsDir, agent),
        join(targetAgentsDir, agent)
      );
    }
  }
}

/**
 * Sync adapters from source to target
 */
async function syncAdapters(source, target, options) {
  const sourceAdaptersDir = join(source.path, 'aurora', 'adapters');
  const targetAdaptersDir = join(target.path, 'aurora', 'adapters');

  if (!existsSync(sourceAdaptersDir)) {
    throw new Error('Source adapters directory not found');
  }

  if (!existsSync(targetAdaptersDir)) {
    mkdirSync(targetAdaptersDir, { recursive: true });
  }

  // Sync adapter (only if same adapter type)
  if (source.adapter !== target.adapter && !options.force) {
    throw new Error(`Adapter mismatch: ${source.adapter} vs ${target.adapter}. Use --force to override.`);
  }

  copyRecursive(
    join(sourceAdaptersDir, source.adapter),
    join(targetAdaptersDir, target.adapter)
  );
}

/**
 * Sync configuration from source to target
 */
async function syncConfig(source, target, options) {
  const sourceConfig = join(source.path, 'project-config.json');
  const targetConfig = join(target.path, 'project-config.json');

  if (!existsSync(sourceConfig)) {
    throw new Error('Source project-config.json not found');
  }

  copyFileSync(sourceConfig, targetConfig);
}

/**
 * Sync Aurora core from source to target
 */
async function syncCore(source, target, options) {
  const sourceCoreDir = join(source.path, 'aurora', 'core');
  const targetCoreDir = join(target.path, 'aurora', 'core');

  if (!existsSync(sourceCoreDir)) {
    throw new Error('Source core directory not found');
  }

  if (!existsSync(targetCoreDir)) {
    mkdirSync(targetCoreDir, { recursive: true });
  }

  copyRecursive(sourceCoreDir, targetCoreDir);
}

/**
 * Helper: Recursively copy directory
 */
function copyRecursive(src, dest) {
  if (!existsSync(src)) {
    throw new Error(`Source not found: ${src}`);
  }

  const stat = statSync(src);

  if (stat.isDirectory()) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }

    const entries = readdirSync(src);
    for (const entry of entries) {
      copyRecursive(join(src, entry), join(dest, entry));
    }
  } else {
    copyFileSync(src, dest);
  }
}
