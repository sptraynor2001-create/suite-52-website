/**
 * Aurora Projects Command
 * 
 * List and manage registered projects
 */

import chalk from 'chalk';
import AuroraWorkspace from '../lib/workspace.js';

export async function projectsCommand(options) {
  const workspace = new AuroraWorkspace();

  try {
    const projects = workspace.listProjects({
      enabled: options.enabled !== undefined ? options.enabled : undefined,
      adapter: options.adapter
    });

    if (projects.length === 0) {
      console.log(chalk.yellow('\nNo projects registered yet.'));
      console.log(chalk.gray('Run "aurora register <path>" to register a project.\n'));
      return;
    }

    const currentProject = workspace.getCurrentProject();

    console.log(chalk.bold('\n📦 Registered Aurora Projects\n'));

    projects.forEach(project => {
      const isCurrent = currentProject && currentProject.id === project.id;
      const marker = isCurrent ? chalk.green('● ') : chalk.gray('○ ');
      const status = project.enabled ? chalk.green('enabled') : chalk.gray('disabled');
      
      console.log(`${marker}${chalk.bold(project.name)} ${status}`);
      console.log(chalk.gray(`   ID: ${project.id}`));
      console.log(chalk.gray(`   Path: ${project.path}`));
      console.log(chalk.gray(`   Adapter: ${project.adapter}`));
      
      if (project.metadata.features && project.metadata.features.length > 0) {
        console.log(chalk.gray(`   Features: ${project.metadata.features.join(', ')}`));
      }
      
      console.log();
    });

    // Show summary
    const stats = workspace.getStats();
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.gray(`Total: ${stats.totalProjects} projects | Enabled: ${stats.enabledProjects}`));
    console.log(chalk.gray(`Workspace: ${stats.workspaceDir}\n`));

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
