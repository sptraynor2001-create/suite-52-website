/**
 * Aurora Register Command
 * 
 * Register a project with the global Aurora workspace
 */

import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { resolve } from 'path';
import { existsSync } from 'fs';
import AuroraWorkspace from '../lib/workspace.js';

export async function registerCommand(projectPath, options) {
  const workspace = new AuroraWorkspace();
  const spinner = ora();

  try {
    // Resolve project path
    const absolutePath = resolve(projectPath || process.cwd());

    // Validate project exists
    if (!existsSync(absolutePath)) {
      console.error(chalk.red(`\n✗ Project path not found: ${absolutePath}\n`));
      process.exit(1);
    }

    // Check if already registered
    const existing = workspace.getProject(absolutePath);
    if (existing && !options.force) {
      console.log(chalk.yellow(`\n⚠ Project already registered: ${existing.name}`));
      console.log(chalk.gray(`   ID: ${existing.id}`));
      console.log(chalk.gray(`   Path: ${existing.path}\n`));

      if (!options.yes) {
        const { shouldUpdate } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldUpdate',
            message: 'Update existing registration?',
            default: false
          }
        ]);

        if (!shouldUpdate) {
          console.log(chalk.gray('Registration cancelled.\n'));
          process.exit(0);
        }
      }

      options.force = true;
    }

    // Prompt for project name if not provided
    let projectName = options.name;
    if (!projectName && !options.yes) {
      const defaultName = workspace.constructor.prototype.getProjectNameFromPath(absolutePath);
      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Project name:',
          default: defaultName
        }
      ]);
      projectName = name;
    }

    spinner.start('Registering project...');

    const project = workspace.registerProject(absolutePath, {
      name: projectName,
      force: options.force
    });

    spinner.succeed(chalk.green(`Project registered: ${project.name}`));
    
    console.log(chalk.gray('\nProject Details:'));
    console.log(chalk.gray(`  ID: ${project.id}`));
    console.log(chalk.gray(`  Name: ${project.name}`));
    console.log(chalk.gray(`  Path: ${project.path}`));
    console.log(chalk.gray(`  Adapter: ${project.adapter}`));
    
    if (project.metadata.features.length > 0) {
      console.log(chalk.gray(`  Features: ${project.metadata.features.join(', ')}`));
    }

    // Ask if this should be the current project
    if (!options.yes) {
      const { setCurrent } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'setCurrent',
          message: 'Set as current project?',
          default: true
        }
      ]);

      if (setCurrent) {
        workspace.setCurrentProject(project.id);
        console.log(chalk.green(`\n✓ Current project set to: ${project.name}\n`));
      }
    } else {
      workspace.setCurrentProject(project.id);
      console.log(chalk.green(`\n✓ Current project set to: ${project.name}\n`));
    }

  } catch (error) {
    spinner.fail(chalk.red('Failed to register project'));
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
