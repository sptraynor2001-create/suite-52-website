/**
 * Aurora Workflow Command
 * 
 * Manage multi-agent workflows with persistent state.
 * Enables coordinated agent execution across sessions.
 */

import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { spawn } from 'child_process';
import { join } from 'path';
import AuroraWorkspace from '../lib/workspace.js';

// Predefined workflow templates
const WORKFLOW_TEMPLATES = {
  'new-feature': {
    description: 'New feature development workflow',
    agents: ['architect', 'quality-reviewer', 'test-generator']
  },
  'fix-violations': {
    description: 'Fix code quality violations',
    agents: ['quality-reviewer', 'theme-enforcer', 'refactorer', 'quality-reviewer']
  },
  'pre-deploy': {
    description: 'Pre-deployment verification',
    agents: ['quality-reviewer', 'test-reviewer', 'coverage-analyzer']
  },
  'refactor': {
    description: 'Code refactoring workflow',
    agents: ['code-analyzer', 'architect', 'refactorer', 'test-generator', 'quality-reviewer']
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: start
// ─────────────────────────────────────────────────────────────────────────────

export async function workflowStartCommand(description, options) {
  const workspace = new AuroraWorkspace();

  try {
    const project = options.project 
      ? workspace.getProject(options.project)
      : workspace.getCurrentProject();

    if (!project) {
      console.error(chalk.red('\n✗ No project specified or current project set.\n'));
      process.exit(1);
    }

    // Check for existing active workflow
    const activeWorkflow = workspace.getActiveWorkflow(project.id);
    if (activeWorkflow) {
      console.log(chalk.yellow(`\n⚠ Active workflow exists: ${activeWorkflow.description}`));
      console.log(chalk.gray(`  ID: ${activeWorkflow.id}`));
      console.log(chalk.gray(`  Status: ${activeWorkflow.status}`));
      
      if (!options.force) {
        const { action } = await inquirer.prompt([{
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: 'Resume existing workflow', value: 'resume' },
            { name: 'Cancel existing and start new', value: 'replace' },
            { name: 'Abort', value: 'abort' }
          ]
        }]);

        if (action === 'abort') {
          console.log(chalk.gray('Cancelled.\n'));
          process.exit(0);
        }

        if (action === 'resume') {
          return workflowResumeCommand({ ...options, project: project.id });
        }

        // Cancel existing
        workspace.updateWorkflow(activeWorkflow.id, { status: 'cancelled' });
      }
    }

    // Determine agents to use
    let agents = [];
    
    if (options.template) {
      const template = WORKFLOW_TEMPLATES[options.template];
      if (!template) {
        console.error(chalk.red(`\n✗ Unknown template: ${options.template}`));
        console.log(chalk.gray('Available templates:'));
        for (const [name, t] of Object.entries(WORKFLOW_TEMPLATES)) {
          console.log(chalk.gray(`  - ${name}: ${t.description}`));
        }
        process.exit(1);
      }
      agents = template.agents;
      console.log(chalk.gray(`Using template: ${options.template}`));
    } else if (options.agents) {
      agents = options.agents.split(',').map(a => a.trim());
    } else {
      // Interactive agent selection
      const { selectedAgents } = await inquirer.prompt([{
        type: 'checkbox',
        name: 'selectedAgents',
        message: 'Select agents for this workflow:',
        choices: [
          { name: 'architect - Architecture review', value: 'architect' },
          { name: 'quality-reviewer - Code quality checks', value: 'quality-reviewer' },
          { name: 'theme-enforcer - Theme token enforcement', value: 'theme-enforcer' },
          { name: 'refactorer - Code refactoring', value: 'refactorer' },
          { name: 'test-generator - Generate tests', value: 'test-generator' },
          { name: 'test-reviewer - Review test quality', value: 'test-reviewer' },
          { name: 'coverage-analyzer - Coverage analysis', value: 'coverage-analyzer' },
          { name: 'code-analyzer - Code complexity analysis', value: 'code-analyzer' },
          { name: 'debugger - Debug assistance', value: 'debugger' }
        ]
      }]);
      agents = selectedAgents;
    }

    if (agents.length === 0) {
      console.error(chalk.red('\n✗ No agents selected for workflow.\n'));
      process.exit(1);
    }

    // Create workflow
    const workflow = workspace.createWorkflow(project.id, description, agents);

    console.log(chalk.bold(`\n🔄 Workflow created: ${description}\n`));
    console.log(chalk.gray(`  ID: ${workflow.id}`));
    console.log(chalk.gray(`  Project: ${project.name}`));
    console.log(chalk.gray(`  Agents: ${agents.join(' → ')}`));
    console.log();

    // Start immediately if requested
    if (options.run) {
      return executeWorkflow(workspace, workflow, project, options);
    }

    console.log(chalk.gray('To start this workflow, run:'));
    console.log(chalk.cyan(`  aurora workflow-resume ${workflow.id}\n`));

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) console.error(error.stack);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: resume
// ─────────────────────────────────────────────────────────────────────────────

export async function workflowResumeCommand(workflowId, options) {
  const workspace = new AuroraWorkspace();

  try {
    let workflow;
    
    if (workflowId) {
      workflow = workspace.getWorkflow(workflowId);
    } else {
      // Find active workflow for current project
      const project = workspace.getCurrentProject();
      if (project) {
        workflow = workspace.getActiveWorkflow(project.id);
      }
    }

    if (!workflow) {
      console.error(chalk.red('\n✗ No workflow found to resume.\n'));
      console.log(chalk.gray('Start a new workflow with: aurora workflow-start "description"\n'));
      process.exit(1);
    }

    if (workflow.status === 'completed') {
      console.log(chalk.yellow('\n⚠ Workflow already completed.\n'));
      process.exit(0);
    }

    if (workflow.status === 'cancelled' || workflow.status === 'failed') {
      console.log(chalk.yellow(`\n⚠ Workflow was ${workflow.status}. Use --force to restart.\n`));
      if (!options.force) process.exit(1);
    }

    const project = workspace.getProject(workflow.projectId);
    if (!project) {
      console.error(chalk.red('\n✗ Project for this workflow no longer exists.\n'));
      process.exit(1);
    }

    console.log(chalk.bold(`\n▶ Resuming workflow: ${workflow.description}\n`));
    console.log(chalk.gray(`  ID: ${workflow.id}`));
    console.log(chalk.gray(`  Progress: ${workflow.currentAgentIndex}/${workflow.agents.length}`));
    console.log();

    return executeWorkflow(workspace, workflow, project, options);

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) console.error(error.stack);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: status
// ─────────────────────────────────────────────────────────────────────────────

export async function workflowStatusCommand(options) {
  const workspace = new AuroraWorkspace();

  try {
    const workflows = workspace.listWorkflows(
      options.all ? {} : { projectId: workspace.getCurrentProject()?.id }
    );

    if (workflows.length === 0) {
      console.log(chalk.gray('\nNo workflows found.\n'));
      process.exit(0);
    }

    console.log(chalk.bold('\n📋 Workflows\n'));

    for (const workflow of workflows.slice(0, options.limit || 10)) {
      const statusIcon = {
        'pending': '○',
        'in_progress': '▶',
        'paused': '⏸',
        'completed': '✓',
        'failed': '✗',
        'cancelled': '⊘'
      }[workflow.status] || '?';

      const statusColor = {
        'pending': chalk.gray,
        'in_progress': chalk.blue,
        'paused': chalk.yellow,
        'completed': chalk.green,
        'failed': chalk.red,
        'cancelled': chalk.gray
      }[workflow.status] || chalk.white;

      console.log(statusColor(`${statusIcon} ${workflow.description}`));
      console.log(chalk.gray(`  ID: ${workflow.id}`));
      console.log(chalk.gray(`  Project: ${workflow.projectName}`));
      console.log(chalk.gray(`  Status: ${workflow.status}`));
      
      // Show agent progress
      const completedAgents = workflow.agents.filter(a => a.status === 'completed').length;
      console.log(chalk.gray(`  Progress: ${completedAgents}/${workflow.agents.length} agents`));
      
      if (options.verbose) {
        console.log(chalk.gray(`  Created: ${new Date(workflow.createdAt).toLocaleString()}`));
        console.log(chalk.gray(`  Agents: ${workflow.agents.map(a => a.name).join(' → ')}`));
      }
      console.log();
    }

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: cancel
// ─────────────────────────────────────────────────────────────────────────────

export async function workflowCancelCommand(workflowId, options) {
  const workspace = new AuroraWorkspace();

  try {
    const workflow = workspace.getWorkflow(workflowId);
    
    if (!workflow) {
      console.error(chalk.red(`\n✗ Workflow not found: ${workflowId}\n`));
      process.exit(1);
    }

    if (workflow.status === 'completed' || workflow.status === 'cancelled') {
      console.log(chalk.yellow(`\n⚠ Workflow already ${workflow.status}.\n`));
      process.exit(0);
    }

    if (!options.yes) {
      const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: `Cancel workflow "${workflow.description}"?`,
        default: false
      }]);
      if (!confirm) {
        console.log(chalk.gray('Cancelled.\n'));
        process.exit(0);
      }
    }

    workspace.updateWorkflow(workflowId, { status: 'cancelled' });
    console.log(chalk.green(`\n✓ Workflow cancelled: ${workflow.description}\n`));

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKFLOW EXECUTION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

async function executeWorkflow(workspace, workflow, project, options) {
  // Mark workflow as in progress
  workspace.updateWorkflow(workflow.id, { status: 'in_progress' });

  console.log(chalk.bold('Starting workflow execution...\n'));

  for (let i = workflow.currentAgentIndex; i < workflow.agents.length; i++) {
    const agent = workflow.agents[i];
    
    // Update current agent
    workspace.updateWorkflow(workflow.id, { currentAgentIndex: i });
    workspace.updateWorkflowAgent(workflow.id, i, { 
      status: 'in_progress',
      startedAt: new Date().toISOString()
    });

    console.log(chalk.bold(`\n[${ i + 1}/${workflow.agents.length}] Running: @${agent.name}`));
    console.log(chalk.gray('─'.repeat(50)));

    // Run the agent (this is where you'd invoke the actual agent)
    // For now, we'll prompt for manual execution
    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: `Execute @${agent.name}?`,
      choices: [
        { name: 'Run agent (manual execution in chat)', value: 'run' },
        { name: 'Mark as completed', value: 'complete' },
        { name: 'Skip this agent', value: 'skip' },
        { name: 'Pause workflow', value: 'pause' },
        { name: 'Cancel workflow', value: 'cancel' }
      ]
    }]);

    if (action === 'cancel') {
      workspace.updateWorkflow(workflow.id, { status: 'cancelled' });
      workspace.updateWorkflowAgent(workflow.id, i, { status: 'failed' });
      console.log(chalk.yellow('\n⚠ Workflow cancelled.\n'));
      process.exit(0);
    }

    if (action === 'pause') {
      workspace.updateWorkflow(workflow.id, { status: 'paused' });
      workspace.updateWorkflowAgent(workflow.id, i, { status: 'pending' });
      console.log(chalk.yellow('\n⏸ Workflow paused.'));
      console.log(chalk.gray(`Resume with: aurora workflow-resume ${workflow.id}\n`));
      process.exit(0);
    }

    if (action === 'skip') {
      workspace.updateWorkflowAgent(workflow.id, i, { 
        status: 'skipped',
        completedAt: new Date().toISOString()
      });
      console.log(chalk.gray(`Skipped @${agent.name}`));
      continue;
    }

    if (action === 'run') {
      console.log(chalk.cyan(`\n💡 In Cursor chat, invoke: @${agent.name}`));
      console.log(chalk.gray('   Or run: aurora run ' + agent.name + ' <tool>\n'));
      
      const { completed } = await inquirer.prompt([{
        type: 'confirm',
        name: 'completed',
        message: `Is @${agent.name} execution complete?`,
        default: true
      }]);

      if (!completed) {
        workspace.updateWorkflow(workflow.id, { status: 'paused' });
        console.log(chalk.yellow('\n⏸ Workflow paused.'));
        console.log(chalk.gray(`Resume with: aurora workflow-resume ${workflow.id}\n`));
        process.exit(0);
      }
    }

    // Mark agent as completed
    workspace.updateWorkflowAgent(workflow.id, i, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
    console.log(chalk.green(`✓ @${agent.name} completed`));
  }

  // All agents completed
  workspace.updateWorkflow(workflow.id, { 
    status: 'completed',
    completedAt: new Date().toISOString()
  });

  console.log(chalk.bold.green('\n✓ Workflow completed successfully!\n'));
  
  // Show summary
  const completed = workflow.agents.filter(a => a.status === 'completed').length;
  const skipped = workflow.agents.filter(a => a.status === 'skipped').length;
  
  console.log(chalk.gray('Summary:'));
  console.log(chalk.gray(`  Completed: ${completed}`));
  if (skipped > 0) console.log(chalk.gray(`  Skipped: ${skipped}`));
  console.log();
}
