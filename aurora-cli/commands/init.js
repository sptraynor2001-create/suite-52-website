/**
 * Aurora Init Command
 * 
 * Installs Aurora framework in a project with selected adapter.
 * Creates aurora/ directory structure with agents, adapters, and core.
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { existsSync, mkdirSync, copyFileSync, writeFileSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { copyDir, ensureDir } from '../lib/fs-utils.js';
import { detectProjectType } from '../lib/project-detector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const AVAILABLE_ADAPTERS = [
  {
    name: 'web-react',
    display: 'Web - React + Vite',
    description: 'React 19, Vite, TypeScript, Tailwind CSS, Vitest',
    features: ['eslint', 'vitest', 'vite', 'react-router', 'r3f'],
  },
  {
    name: 'web-nextjs',
    display: 'Web - Next.js',
    description: 'Next.js 15, React 19, TypeScript, App Router',
    features: ['eslint', 'jest', 'nextjs-app-router', 'typescript'],
  },
  {
    name: 'api-express',
    display: 'API - Express',
    description: 'Express, Node.js, TypeScript, Jest',
    features: ['eslint', 'jest', 'express', 'typescript'],
  },
];

export async function initCommand(options) {
  console.log(chalk.bold.cyan('\n🌟 Aurora Framework Installer\n'));

  const projectRoot = process.cwd();
  const auroraPath = join(projectRoot, 'aurora');

  // Check if Aurora already exists
  if (existsSync(auroraPath) && !options.force) {
    console.error(chalk.red('❌ Aurora already exists in this project.'));
    console.log(chalk.yellow('   Use --force to reinstall.\n'));
    process.exit(1);
  }

  // Detect project type
  const spinner = ora('Detecting project type...').start();
  const detectedType = await detectProjectType(projectRoot);
  spinner.succeed(`Detected: ${detectedType || 'unknown'}`);

  // Select adapter
  let selectedAdapter = options.adapter;

  if (!selectedAdapter && !options.yes) {
    const suggestedAdapter = suggestAdapter(detectedType);
    const { adapter } = await inquirer.prompt([
      {
        type: 'list',
        name: 'adapter',
        message: 'Select an adapter:',
        choices: AVAILABLE_ADAPTERS.map(a => ({
          name: `${a.display} - ${a.description}`,
          value: a.name,
          short: a.name,
        })),
        default: suggestedAdapter,
      },
    ]);
    selectedAdapter = adapter;
  } else if (!selectedAdapter) {
    // Auto-select in yes mode
    selectedAdapter = suggestAdapter(detectedType) || 'web-react';
  }

  const adapterConfig = AVAILABLE_ADAPTERS.find(a => a.name === selectedAdapter);
  if (!adapterConfig) {
    console.error(chalk.red(`❌ Unknown adapter: ${selectedAdapter}`));
    console.log(chalk.yellow('Available adapters: web-react, web-nextjs, api-express\n'));
    process.exit(1);
  }

  console.log(chalk.green(`\n✓ Installing Aurora with ${adapterConfig.display} adapter\n`));

  // Confirm installation
  if (!options.yes) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Install Aurora in this project?',
        default: true,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('\nInstallation cancelled.\n'));
      process.exit(0);
    }
  }

  // Install Aurora
  const installSpinner = ora('Installing Aurora...').start();

  try {
    // Create directory structure
    await installAurora(projectRoot, selectedAdapter);
    
    // Update project config
    await updateProjectConfig(projectRoot, selectedAdapter);

    installSpinner.succeed('Aurora installed successfully!');
    
    // Print success message
    printSuccessMessage(selectedAdapter);
  } catch (error) {
    installSpinner.fail('Installation failed');
    console.error(chalk.red(`\n${error.message}\n`));
    process.exit(1);
  }
}

function suggestAdapter(detectedType) {
  const typeMap = {
    'react-vite': 'web-react',
    'nextjs': 'web-nextjs',
    'express': 'api-express',
  };
  return typeMap[detectedType] || 'web-react';
}

async function installAurora(projectRoot, adapterName) {
  const auroraPath = join(projectRoot, 'aurora');
  const templatePath = join(__dirname, '../templates/aurora');

  // Create aurora directory structure
  ensureDir(auroraPath);
  ensureDir(join(auroraPath, 'core'));
  ensureDir(join(auroraPath, 'agents'));
  ensureDir(join(auroraPath, 'adapters'));
  ensureDir(join(auroraPath, 'project-docs'));

  // Copy core files
  await copyDir(join(templatePath, 'core'), join(auroraPath, 'core'));

  // Copy all agents
  await copyDir(join(templatePath, 'agents'), join(auroraPath, 'agents'));

  // Copy selected adapter
  await copyDir(
    join(templatePath, 'adapters', adapterName),
    join(auroraPath, 'adapters', adapterName)
  );

  // Copy adapter template as reference
  await copyDir(
    join(templatePath, 'adapters/template'),
    join(auroraPath, 'adapters/template')
  );

  // Copy project-docs structure
  await copyDir(
    join(templatePath, 'project-docs'),
    join(auroraPath, 'project-docs')
  );

  // Copy documentation
  const docs = ['README.md', 'GETTING_STARTED.md'];
  for (const doc of docs) {
    const srcPath = join(templatePath, doc);
    if (existsSync(srcPath)) {
      copyFileSync(srcPath, join(auroraPath, doc));
    }
  }
}

async function updateProjectConfig(projectRoot, adapterName) {
  const configPath = join(projectRoot, 'project-config.json');
  
  let config = {};
  if (existsSync(configPath)) {
    config = JSON.parse(readFileSync(configPath, 'utf-8'));
  }

  // Update or create aurora config
  config.aurora = {
    adapter: `aurora/adapters/${adapterName}`,
    version: '1.0.0',
    installed: new Date().toISOString(),
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
}

function printSuccessMessage(adapterName) {
  console.log(chalk.green.bold('\n✨ Aurora is ready!\n'));
  console.log(chalk.white('Next steps:\n'));
  console.log(chalk.cyan('  1. Validate installation:'));
  console.log(chalk.gray('     aurora validate\n'));
  console.log(chalk.cyan('  2. List available agents:'));
  console.log(chalk.gray('     aurora list --agents\n'));
  console.log(chalk.cyan('  3. Run an agent:'));
  console.log(chalk.gray('     aurora run quality-reviewer scan\n'));
  console.log(chalk.yellow('Documentation: aurora/README.md\n'));
}
