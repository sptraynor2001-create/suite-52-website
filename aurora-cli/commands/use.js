/**
 * Aurora Use Command
 * 
 * Switch the current/active project
 */

import chalk from 'chalk';
import AuroraWorkspace from '../lib/workspace.js';

export async function useCommand(projectId, options) {
  const workspace = new AuroraWorkspace();

  try {
    const project = workspace.getProject(projectId);

    if (!project) {
      console.error(chalk.red(`\n✗ Project not found: ${projectId}\n`));
      
      // Show available projects
      const projects = workspace.listProjects();
      if (projects.length > 0) {
        console.log(chalk.yellow('Available projects:'));
        projects.forEach(p => {
          console.log(chalk.gray(`  - ${p.name} (${p.id})`));
        });
        console.log();
      }
      
      process.exit(1);
    }

    workspace.setCurrentProject(project.id);

    console.log(chalk.green(`\n✓ Switched to project: ${project.name}`));
    console.log(chalk.gray(`  Path: ${project.path}`));
    console.log(chalk.gray(`  Adapter: ${project.adapter}\n`));

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
