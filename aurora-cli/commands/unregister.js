/**
 * Aurora Unregister Command
 * 
 * Remove a project from the workspace
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import AuroraWorkspace from '../lib/workspace.js';

export async function unregisterCommand(projectId, options) {
  const workspace = new AuroraWorkspace();

  try {
    const project = workspace.getProject(projectId);

    if (!project) {
      console.error(chalk.red(`\n✗ Project not found: ${projectId}\n`));
      
      // Show available projects
      const projects = workspace.listProjects();
      if (projects.length > 0) {
        console.log(chalk.yellow('Registered projects:'));
        projects.forEach(p => {
          console.log(chalk.gray(`  - ${p.name} (${p.id})`));
        });
        console.log();
      }
      
      process.exit(1);
    }

    // Confirm deletion
    if (!options.yes) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Remove "${project.name}" from workspace? (Aurora files will not be deleted)`,
          default: false
        }
      ]);

      if (!confirm) {
        console.log(chalk.gray('Unregister cancelled.\n'));
        process.exit(0);
      }
    }

    workspace.unregisterProject(project.id);

    console.log(chalk.green(`\n✓ Project unregistered: ${project.name}`));
    console.log(chalk.gray(`  Aurora files remain at: ${project.path}/aurora\n`));

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
