/**
 * Aurora Run Command
 * 
 * Executes an Aurora agent tool in a project.
 * Wraps the bash-based agent-runtime.sh with Node.js interface.
 */

import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join, resolve } from 'path';

export async function runCommand(agent, tool, options) {
  const projectRoot = options.project ? resolve(options.project) : process.cwd();
  const auroraPath = join(projectRoot, 'aurora');

  // Validate Aurora installation
  if (!existsSync(auroraPath)) {
    console.error(chalk.red('❌ Aurora not found in this project.'));
    console.log(chalk.yellow('   Run "aurora init" to install.\n'));
    process.exit(1);
  }

  const agentRuntimePath = join(auroraPath, 'core/agent-runtime.sh');
  if (!existsSync(agentRuntimePath)) {
    console.error(chalk.red('❌ Aurora installation is corrupt (missing agent-runtime.sh).'));
    console.log(chalk.yellow('   Run "aurora init --force" to reinstall.\n'));
    process.exit(1);
  }

  console.log(chalk.cyan(`\n🤖 Running: ${agent}/${tool}\n`));

  // Build command
  const args = [agentRuntimePath, agent, tool];
  
  // Add any additional arguments passed after --
  const extraArgs = process.argv.slice(process.argv.indexOf(tool) + 1);
  if (extraArgs.length > 0) {
    args.push(...extraArgs);
  }

  // Execute agent
  const spinner = options.verbose ? null : ora('Executing...').start();

  try {
    await executeAgent(args, projectRoot, options.verbose, spinner);
    
    if (spinner) {
      spinner.succeed('Complete');
    }
    console.log(chalk.green('\n✓ Agent execution finished\n'));
  } catch (error) {
    if (spinner) {
      spinner.fail('Failed');
    }
    console.error(chalk.red(`\n❌ ${error.message}\n`));
    process.exit(1);
  }
}

function executeAgent(args, cwd, verbose, spinner) {
  return new Promise((resolve, reject) => {
    const child = spawn('bash', args, {
      cwd,
      stdio: verbose ? 'inherit' : 'pipe',
      env: {
        ...process.env,
        AURORA_CLI: '1',
      },
    });

    let output = '';

    if (!verbose) {
      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        output += data.toString();
      });
    }

    child.on('close', (code) => {
      if (code === 0) {
        if (!verbose && output) {
          console.log(output);
        }
        resolve();
      } else {
        if (!verbose && output) {
          console.log(output);
        }
        reject(new Error(`Agent exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to execute agent: ${error.message}`));
    });
  });
}
