/**
 * Aurora Config Command
 * 
 * Manage global workspace configuration
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import AuroraWorkspace from '../lib/workspace.js';

export async function configCommand(action, key, value, options) {
  const workspace = new AuroraWorkspace();

  try {
    if (action === 'get') {
      await getConfig(workspace, key, options);
    } else if (action === 'set') {
      await setConfig(workspace, key, value, options);
    } else if (action === 'list') {
      await listConfig(workspace, options);
    } else if (action === 'reset') {
      await resetConfig(workspace, options);
    } else {
      console.error(chalk.red(`\n✗ Unknown action: ${action}`));
      console.log(chalk.gray('Valid actions: get, set, list, reset\n'));
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
 * Get configuration value
 */
async function getConfig(workspace, key, options) {
  const config = workspace.loadConfig();
  
  if (!key) {
    console.error(chalk.red('\n✗ Configuration key required\n'));
    process.exit(1);
  }

  const value = getNestedValue(config, key);

  if (value === undefined) {
    console.error(chalk.red(`\n✗ Configuration key not found: ${key}\n`));
    process.exit(1);
  }

  if (options.json) {
    console.log(JSON.stringify(value, null, 2));
  } else {
    console.log(chalk.bold(`\n${key}: `) + chalk.gray(JSON.stringify(value)));
    console.log();
  }
}

/**
 * Set configuration value
 */
async function setConfig(workspace, key, value, options) {
  if (!key || value === undefined) {
    console.error(chalk.red('\n✗ Both key and value required\n'));
    process.exit(1);
  }

  const config = workspace.loadConfig();
  
  // Parse value (try JSON first, then use as string)
  let parsedValue = value;
  try {
    parsedValue = JSON.parse(value);
  } catch (e) {
    // Keep as string
  }

  // Validate key path
  const validPaths = [
    'settings.autoSync',
    'settings.logLevel',
    'settings.parallelExecution',
    'settings.maxParallelJobs'
  ];

  if (!validPaths.includes(key) && !options.force) {
    console.error(chalk.red(`\n✗ Invalid configuration key: ${key}`));
    console.log(chalk.yellow('\nValid keys:'));
    validPaths.forEach(k => console.log(chalk.gray(`  - ${k}`)));
    console.log(chalk.gray('\nUse --force to set custom keys\n'));
    process.exit(1);
  }

  setNestedValue(config, key, parsedValue);
  workspace.saveConfig(config);

  console.log(chalk.green(`\n✓ Configuration updated: ${key} = ${JSON.stringify(parsedValue)}\n`));
}

/**
 * List all configuration
 */
async function listConfig(workspace, options) {
  const config = workspace.loadConfig();

  console.log(chalk.bold('\n⚙️  Aurora Configuration\n'));

  if (options.json) {
    console.log(JSON.stringify(config, null, 2));
  } else {
    displayConfigRecursive(config, '');
    console.log();
  }
}

/**
 * Reset configuration to defaults
 */
async function resetConfig(workspace, options) {
  if (!options.yes) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Reset all configuration to defaults?',
        default: false
      }
    ]);

    if (!confirm) {
      console.log(chalk.gray('Reset cancelled.\n'));
      process.exit(0);
    }
  }

  const defaultConfig = {
    version: '1.0.0',
    currentProject: null,
    settings: {
      autoSync: true,
      logLevel: 'info',
      parallelExecution: true,
      maxParallelJobs: 3
    },
    created: new Date().toISOString()
  };

  workspace.saveConfig(defaultConfig);
  console.log(chalk.green('\n✓ Configuration reset to defaults\n'));
}

/**
 * Helper: Get nested object value by path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

/**
 * Helper: Set nested object value by path
 */
function setNestedValue(obj, path, value) {
  const parts = path.split('.');
  const last = parts.pop();
  const target = parts.reduce((acc, part) => {
    if (!acc[part]) acc[part] = {};
    return acc[part];
  }, obj);
  target[last] = value;
}

/**
 * Helper: Display configuration recursively
 */
function displayConfigRecursive(obj, prefix) {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      console.log(chalk.bold(fullKey + ':'));
      displayConfigRecursive(value, fullKey);
    } else {
      const displayValue = Array.isArray(value) 
        ? `[${value.join(', ')}]`
        : JSON.stringify(value);
      console.log(chalk.gray(`  ${fullKey}: `) + displayValue);
    }
  }
}
