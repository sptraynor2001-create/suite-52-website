/**
 * Aurora Run-All Command
 * 
 * Run an agent/tool across multiple projects
 */

import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { join } from 'path';
import AuroraWorkspace from '../lib/workspace.js';

export async function runAllCommand(agent, tool, options, command) {
  const workspace = new AuroraWorkspace();

  // Extract extra arguments passed after '--'
  const extraArgs = command?.args?.slice(2) || [];

  try {
    const projects = workspace.listProjects({ enabled: true });

    if (projects.length === 0) {
      console.log(chalk.yellow('\nNo enabled projects found.'));
      console.log(chalk.gray('Run "aurora register <path>" to register projects.\n'));
      process.exit(1);
    }

    const argsDisplay = extraArgs.length > 0 ? ` [${extraArgs.join(' ')}]` : '';
    console.log(chalk.bold(`\n🚀 Running ${agent}/${tool}${argsDisplay} across ${projects.length} projects\n`));

    const results = [];
    const maxParallel = options.parallel ? workspace.loadConfig().settings.maxParallelJobs : 1;
    
    // Execute in batches
    for (let i = 0; i < projects.length; i += maxParallel) {
      const batch = projects.slice(i, i + maxParallel);
      const promises = batch.map(project => 
        runInProject(workspace, project, agent, tool, extraArgs, options)
      );
      
      const batchResults = await Promise.allSettled(promises);
      results.push(...batchResults);
    }

    // Display summary
    console.log(chalk.bold('\n📊 Execution Summary\n'));
    
    let successCount = 0;
    let failCount = 0;

    results.forEach((result, index) => {
      const project = projects[index];
      
      if (result.status === 'fulfilled') {
        const { exitCode, duration } = result.value;
        if (exitCode === 0) {
          console.log(chalk.green(`✓ ${project.name}`) + chalk.gray(` (${duration}ms)`));
          successCount++;
        } else {
          console.log(chalk.red(`✗ ${project.name}`) + chalk.gray(` (exit ${exitCode})`));
          failCount++;
        }
      } else {
        console.log(chalk.red(`✗ ${project.name}`) + chalk.gray(` (error)`));
        if (options.verbose) {
          console.log(chalk.gray(`   ${result.reason}`));
        }
        failCount++;
      }
    });

    console.log(chalk.gray('\n─'.repeat(60)));
    console.log(chalk.gray(`Success: ${successCount} | Failed: ${failCount} | Total: ${projects.length}\n`));

    // Exit with error if any failures
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
 * Run agent/tool in a specific project
 */
async function runInProject(workspace, project, agent, tool, extraArgs = [], options) {
  const spinner = ora(`Running in ${project.name}...`).start();
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const auroraScript = join(project.path, 'aurora', 'core', 'agent-runtime.sh');
    
    // Build command with extra args
    const argsStr = extraArgs.length > 0 ? ` ${extraArgs.map(a => `"${a}"`).join(' ')}` : '';
    const command = `source "${auroraScript}" && aurora_runtime_run "${agent}" "${tool}"${argsStr}`;
    
    const child = spawn('bash', [
      '-c',
      command
    ], {
      cwd: project.path,
      env: {
        ...process.env,
        AURORA_ROOT: join(project.path, 'aurora'),
        PROJECT_ROOT: project.path
      }
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      if (options.verbose) {
        spinner.stop();
        console.log(chalk.gray(`[${project.name}] ${data.toString()}`));
        spinner.start();
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      if (options.verbose) {
        spinner.stop();
        console.error(chalk.gray(`[${project.name}] ${data.toString()}`));
        spinner.start();
      }
    });

    child.on('close', (exitCode) => {
      const duration = Date.now() - startTime;
      spinner.stop();

      const result = {
        exitCode,
        duration,
        stdout,
        stderr
      };

      // Log execution
      workspace.logExecution(project.id, agent, tool, result);

      if (exitCode === 0) {
        resolve(result);
      } else {
        reject(new Error(`Exit code ${exitCode}`));
      }
    });

    child.on('error', (error) => {
      spinner.fail(`Failed in ${project.name}`);
      reject(error);
    });
  });
}
