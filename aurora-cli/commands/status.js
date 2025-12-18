/**
 * Aurora Status Command
 * 
 * Show workspace status and current project
 */

import chalk from 'chalk';
import AuroraWorkspace from '../lib/workspace.js';

export async function statusCommand(options) {
  const workspace = new AuroraWorkspace();

  try {
    const stats = workspace.getStats();
    const currentProject = workspace.getCurrentProject();
    const config = workspace.loadConfig();

    console.log(chalk.bold('\n📊 Aurora Workspace Status\n'));

    // Current project
    if (currentProject) {
      console.log(chalk.green('● ') + chalk.bold('Current Project'));
      console.log(chalk.gray(`  Name: ${currentProject.name}`));
      console.log(chalk.gray(`  ID: ${currentProject.id}`));
      console.log(chalk.gray(`  Path: ${currentProject.path}`));
      console.log(chalk.gray(`  Adapter: ${currentProject.adapter}`));
      console.log();
    } else {
      console.log(chalk.yellow('○ No current project set'));
      console.log(chalk.gray('  Run "aurora use <project>" to set one\n'));
    }

    // Workspace stats
    console.log(chalk.bold('Workspace Statistics'));
    console.log(chalk.gray(`  Total Projects: ${stats.totalProjects}`));
    console.log(chalk.gray(`  Enabled: ${stats.enabledProjects}`));
    console.log(chalk.gray(`  Adapters: ${stats.adapters.join(', ') || 'none'}`));
    console.log();

    // Configuration
    console.log(chalk.bold('Configuration'));
    console.log(chalk.gray(`  Auto Sync: ${config.settings.autoSync ? 'enabled' : 'disabled'}`));
    console.log(chalk.gray(`  Log Level: ${config.settings.logLevel}`));
    console.log(chalk.gray(`  Parallel Execution: ${config.settings.parallelExecution ? 'enabled' : 'disabled'}`));
    console.log(chalk.gray(`  Max Parallel Jobs: ${config.settings.maxParallelJobs}`));
    console.log();

    // Workspace location
    console.log(chalk.bold('Workspace'));
    console.log(chalk.gray(`  Location: ${stats.workspaceDir}`));
    console.log(chalk.gray(`  Version: ${config.version}`));
    console.log();

    // Show recent activity if available
    if (currentProject && options.logs) {
      const logs = workspace.getExecutionLogs(currentProject.id, { limit: 5 });
      if (logs.length > 0) {
        console.log(chalk.bold('Recent Activity'));
        logs.forEach(log => {
          const timestamp = new Date(log.timestamp).toLocaleTimeString();
          const status = log.exitCode === 0 ? chalk.green('✓') : chalk.red('✗');
          console.log(chalk.gray(`  ${status} ${timestamp} - ${log.agentId}/${log.toolId}`));
        });
        console.log();
      }
    }

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
