/**
 * Aurora List Command
 * 
 * Lists available agents, adapters, and tools.
 */

import chalk from 'chalk';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function listCommand(options) {
  const projectRoot = process.cwd();
  const auroraPath = join(projectRoot, 'aurora');

  // Default to listing everything if no specific flag
  const listAll = !options.agents && !options.adapters && !options.tools;

  if (options.agents || listAll) {
    listAgents(auroraPath);
  }

  if (options.adapters || listAll) {
    listAdapters(auroraPath);
  }

  if (options.tools !== undefined) {
    listTools(auroraPath, options.tools);
  }
}

function listAgents(auroraPath) {
  console.log(chalk.bold.cyan('\n📋 Available Agents\n'));

  const agentsPath = join(auroraPath, 'agents');
  if (!existsSync(agentsPath)) {
    console.log(chalk.yellow('No agents found. Run "aurora init" to install.\n'));
    return;
  }

  // Read registry
  const registryPath = join(agentsPath, 'registry/agents.json');
  if (existsSync(registryPath)) {
    try {
      const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
      const agents = Object.entries(registry.agents || {});

      if (agents.length === 0) {
        console.log(chalk.yellow('No agents registered.\n'));
        return;
      }

      agents.forEach(([name, agent]) => {
        console.log(chalk.white(`  ${name}`));
        console.log(chalk.gray(`    ${agent.description || 'No description'}`));
        if (agent.capabilities?.length > 0) {
          console.log(chalk.gray(`    Capabilities: ${agent.capabilities.join(', ')}`));
        }
        console.log();
      });
    } catch (error) {
      console.error(chalk.red('Failed to read agents registry\n'));
    }
  } else {
    // Fallback: list directories
    const dirs = readdirSync(agentsPath, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'registry' && d.name !== 'shared')
      .map(d => d.name);

    if (dirs.length === 0) {
      console.log(chalk.yellow('No agents found.\n'));
      return;
    }

    dirs.forEach(name => {
      console.log(chalk.white(`  ${name}`));
    });
    console.log();
  }
}

function listAdapters(auroraPath) {
  console.log(chalk.bold.cyan('\n🔌 Available Adapters\n'));

  const adaptersPath = join(auroraPath, 'adapters');
  if (!existsSync(adaptersPath)) {
    console.log(chalk.yellow('No adapters found.\n'));
    return;
  }

  const dirs = readdirSync(adaptersPath, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'template')
    .map(d => d.name);

  if (dirs.length === 0) {
    console.log(chalk.yellow('No adapters found.\n'));
    return;
  }

  dirs.forEach(name => {
    const configPath = join(adaptersPath, name, 'config.json');
    if (existsSync(configPath)) {
      try {
        const config = JSON.parse(readFileSync(configPath, 'utf-8'));
        console.log(chalk.white(`  ${name}`));
        console.log(chalk.gray(`    ${config.description || 'No description'}`));
        if (config.supported_features?.length > 0) {
          console.log(chalk.gray(`    Features: ${config.supported_features.join(', ')}`));
        }
        console.log();
      } catch {
        console.log(chalk.white(`  ${name}`));
        console.log();
      }
    } else {
      console.log(chalk.white(`  ${name}`));
      console.log();
    }
  });
}

function listTools(auroraPath, agentName) {
  const title = agentName 
    ? `\n🔧 Tools for Agent: ${agentName}\n`
    : '\n🔧 All Tools\n';
  
  console.log(chalk.bold.cyan(title));

  const agentsPath = join(auroraPath, 'agents');
  if (!existsSync(agentsPath)) {
    console.log(chalk.yellow('No agents found.\n'));
    return;
  }

  // If specific agent requested
  if (agentName) {
    const agentPath = join(agentsPath, agentName, 'tools');
    if (!existsSync(agentPath)) {
      console.log(chalk.yellow(`No tools found for agent "${agentName}".\n`));
      return;
    }

    listAgentTools(agentName, agentPath);
    return;
  }

  // List all tools
  const agents = readdirSync(agentsPath, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'registry' && d.name !== 'shared')
    .map(d => d.name);

  agents.forEach(agent => {
    const toolsPath = join(agentsPath, agent, 'tools');
    if (existsSync(toolsPath)) {
      listAgentTools(agent, toolsPath);
    }
  });

  // List shared tools
  const sharedToolsPath = join(agentsPath, 'shared/tools');
  if (existsSync(sharedToolsPath)) {
    console.log(chalk.white('  shared (all agents)'));
    const tools = readdirSync(sharedToolsPath)
      .filter(f => f.endsWith('.sh'))
      .map(f => f.replace('.sh', ''));
    tools.forEach(tool => {
      console.log(chalk.gray(`    - ${tool}`));
    });
    console.log();
  }
}

function listAgentTools(agentName, toolsPath) {
  console.log(chalk.white(`  ${agentName}`));
  
  const tools = readdirSync(toolsPath)
    .filter(f => f.endsWith('.sh'))
    .map(f => f.replace('.sh', ''));

  if (tools.length === 0) {
    console.log(chalk.gray('    No tools'));
  } else {
    tools.forEach(tool => {
      console.log(chalk.gray(`    - ${tool}`));
    });
  }
  console.log();
}
