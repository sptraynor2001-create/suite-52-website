/**
 * Aurora Git Command
 * 
 * Git management for Aurora projects with standardized gitFlow workflow.
 * Provides status, health, feature/release/hotfix branching, and pre-push gates.
 */

import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import AuroraWorkspace from '../lib/workspace.js';
import {
  isGitRepo,
  getGitStatus,
  getGitHealthIssues,
  startFeature,
  startRelease,
  startHotfix,
  push,
  runPrePushGate,
  validateBranchName,
  fetch
} from '../lib/git.js';

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: status
// ─────────────────────────────────────────────────────────────────────────────

export async function gitStatusCommand(options) {
  const workspace = new AuroraWorkspace();

  try {
    const projects = options.all 
      ? workspace.listProjects({ enabled: true })
      : [workspace.getCurrentProject()].filter(Boolean);

    if (projects.length === 0) {
      if (options.all) {
        console.log(chalk.yellow('\nNo registered projects found.'));
      } else {
        console.log(chalk.yellow('\nNo current project set. Use --all or set a current project.'));
      }
      process.exit(1);
    }

    console.log(chalk.bold('\n📊 Git Status\n'));

    for (const project of projects) {
      const status = getGitStatus(project.path);
      
      if (!status.isRepo) {
        console.log(chalk.red(`✗ ${project.name}`) + chalk.gray(' (not a git repo)'));
        continue;
      }

      const branchColor = status.clean ? chalk.green : chalk.yellow;
      const cleanIcon = status.clean ? '✓' : '○';
      
      console.log(branchColor(`${cleanIcon} ${project.name}`));
      console.log(chalk.gray(`  Branch: ${status.branch}`));
      
      if (!status.clean) {
        console.log(chalk.yellow(`  Changes: ${status.uncommitted} uncommitted`));
      }
      
      if (status.upstream) {
        const syncStatus = [];
        if (status.ahead > 0) syncStatus.push(`${status.ahead} ahead`);
        if (status.behind > 0) syncStatus.push(`${status.behind} behind`);
        if (syncStatus.length > 0) {
          console.log(chalk.gray(`  Sync: ${syncStatus.join(', ')}`));
        }
      } else {
        console.log(chalk.yellow(`  Upstream: not configured`));
      }

      if (status.lastCommit && options.verbose) {
        console.log(chalk.gray(`  Last: ${status.lastCommit.subject.slice(0, 50)}`));
      }
      
      console.log();
    }

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) console.error(error.stack);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: health
// ─────────────────────────────────────────────────────────────────────────────

export async function gitHealthCommand(options) {
  const workspace = new AuroraWorkspace();

  try {
    const projects = options.all 
      ? workspace.listProjects({ enabled: true })
      : [workspace.getCurrentProject()].filter(Boolean);

    if (projects.length === 0) {
      console.log(chalk.yellow('\nNo projects to check.\n'));
      process.exit(1);
    }

    console.log(chalk.bold('\n🏥 Git Health Check\n'));

    let totalIssues = 0;
    let projectsWithIssues = 0;

    for (const project of projects) {
      const gitFlowConfig = workspace.getGitFlowConfig(project.id);
      const issues = getGitHealthIssues(project.path, gitFlowConfig);
      
      if (issues.length === 0) {
        console.log(chalk.green(`✓ ${project.name}`) + chalk.gray(' - healthy'));
      } else {
        projectsWithIssues++;
        totalIssues += issues.length;
        
        const hasError = issues.some(i => i.severity === 'error');
        const icon = hasError ? chalk.red('✗') : chalk.yellow('⚠');
        console.log(`${icon} ${project.name}`);
        
        for (const issue of issues) {
          const color = issue.severity === 'error' ? chalk.red 
                      : issue.severity === 'warning' ? chalk.yellow 
                      : chalk.gray;
          console.log(color(`    ${issue.message}`));
        }
      }
      console.log();
    }

    // Summary
    console.log(chalk.gray('─'.repeat(50)));
    if (totalIssues === 0) {
      console.log(chalk.green.bold('\n✓ All projects healthy\n'));
    } else {
      console.log(chalk.yellow(`\n⚠ ${projectsWithIssues} project(s) with ${totalIssues} issue(s)\n`));
    }

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) console.error(error.stack);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: feature start
// ─────────────────────────────────────────────────────────────────────────────

export async function gitFeatureStartCommand(name, options) {
  const workspace = new AuroraWorkspace();
  const spinner = ora();

  try {
    const project = options.project 
      ? workspace.getProject(options.project)
      : workspace.getCurrentProject();

    if (!project) {
      console.error(chalk.red('\n✗ No project specified or current project set.\n'));
      process.exit(1);
    }

    const gitFlowConfig = workspace.getGitFlowConfig(project.id);
    const status = getGitStatus(project.path);

    // Pre-flight checks
    if (!status.isRepo) {
      console.error(chalk.red(`\n✗ ${project.name} is not a git repository.\n`));
      process.exit(1);
    }

    if (!status.clean && gitFlowConfig.requireCleanWorktree) {
      console.error(chalk.red(`\n✗ Working tree has uncommitted changes.`));
      console.log(chalk.gray('  Commit or stash changes before starting a feature.\n'));
      process.exit(1);
    }

    const branchName = `${gitFlowConfig.featurePrefix}${name}`;
    
    console.log(chalk.bold(`\n🌿 Starting feature: ${name}\n`));
    console.log(chalk.gray(`  Project: ${project.name}`));
    console.log(chalk.gray(`  Base: ${gitFlowConfig.developmentBranch}`));
    console.log(chalk.gray(`  Branch: ${branchName}`));
    console.log();

    if (!options.yes) {
      const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Create this feature branch?',
        default: true
      }]);
      if (!confirm) {
        console.log(chalk.gray('Cancelled.\n'));
        process.exit(0);
      }
    }

    spinner.start('Creating feature branch...');
    
    const result = startFeature(name, gitFlowConfig, project.path);
    
    if (!result.success) {
      spinner.fail(chalk.red('Failed to create feature branch'));
      console.error(chalk.red(`  ${result.error}\n`));
      process.exit(1);
    }

    spinner.succeed(chalk.green(`Feature branch created: ${branchName}`));

    // Push with upstream if requested
    if (!options.noPush) {
      spinner.start('Pushing to remote...');
      const pushResult = push({ setUpstream: true, branch: branchName }, project.path);
      
      if (pushResult.success) {
        spinner.succeed(chalk.green('Pushed with upstream tracking'));
      } else {
        spinner.warn(chalk.yellow('Push failed (you can push manually)'));
        if (options.verbose) console.log(chalk.gray(`  ${pushResult.error}`));
      }
    }

    console.log(chalk.bold.green(`\n✓ Feature '${name}' started successfully\n`));
    console.log(chalk.gray('Next steps:'));
    console.log(chalk.gray('  1. Make your changes'));
    console.log(chalk.gray('  2. Commit with descriptive messages'));
    console.log(chalk.gray(`  3. Run: aurora git gate pre-push`));
    console.log(chalk.gray(`  4. Run: aurora git feature finish --pr\n`));

  } catch (error) {
    spinner.fail('Failed');
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) console.error(error.stack);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: feature finish
// ─────────────────────────────────────────────────────────────────────────────

export async function gitFeatureFinishCommand(options) {
  const workspace = new AuroraWorkspace();
  const spinner = ora();

  try {
    const project = options.project 
      ? workspace.getProject(options.project)
      : workspace.getCurrentProject();

    if (!project) {
      console.error(chalk.red('\n✗ No project specified or current project set.\n'));
      process.exit(1);
    }

    const gitFlowConfig = workspace.getGitFlowConfig(project.id);
    const status = getGitStatus(project.path);

    // Validate we're on a feature branch
    const branchInfo = validateBranchName(status.branch, gitFlowConfig);
    if (branchInfo.type !== 'feature') {
      console.error(chalk.red(`\n✗ Not on a feature branch (current: ${status.branch})`));
      console.log(chalk.gray(`  Feature branches should start with: ${gitFlowConfig.featurePrefix}\n`));
      process.exit(1);
    }

    console.log(chalk.bold(`\n🏁 Finishing feature: ${branchInfo.name}\n`));

    // Run pre-push gate
    spinner.start('Running pre-push checks...');
    const gateResult = await runPrePushGate(gitFlowConfig, project.path);
    
    if (!gateResult.passed) {
      spinner.fail(chalk.red('Pre-push checks failed'));
      for (const issue of gateResult.issues.filter(i => i.severity === 'error')) {
        console.log(chalk.red(`  ✗ ${issue.message}`));
        if (issue.fix) console.log(chalk.gray(`    Fix: ${issue.fix}`));
      }
      console.log();
      process.exit(1);
    }
    
    spinner.succeed(chalk.green('Pre-push checks passed'));

    // Push latest changes
    spinner.start('Pushing latest changes...');
    const pushResult = push({}, project.path);
    if (pushResult.success) {
      spinner.succeed('Changes pushed');
    } else {
      spinner.warn('Push skipped (may already be up to date)');
    }

    // Create PR if requested
    if (options.pr) {
      spinner.start('Creating pull request...');
      
      try {
        const prTitle = `Feature: ${branchInfo.name}`;
        const prBody = `## Summary\nFeature branch: \`${status.branch}\`\n\n## Test plan\n- [ ] Tests pass\n- [ ] Quality checks pass`;
        
        execSync(
          `gh pr create --base ${gitFlowConfig.developmentBranch} --title "${prTitle}" --body "${prBody}"`,
          { cwd: project.path, stdio: 'pipe' }
        );
        
        spinner.succeed(chalk.green('Pull request created'));
      } catch (error) {
        spinner.warn(chalk.yellow('Could not create PR (gh CLI may not be installed or authenticated)'));
        console.log(chalk.gray(`  Create PR manually: ${status.branch} → ${gitFlowConfig.developmentBranch}\n`));
      }
    }

    console.log(chalk.bold.green(`\n✓ Feature '${branchInfo.name}' ready for review\n`));

  } catch (error) {
    spinner.fail('Failed');
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) console.error(error.stack);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: release cut
// ─────────────────────────────────────────────────────────────────────────────

export async function gitReleaseCutCommand(version, options) {
  const workspace = new AuroraWorkspace();
  const spinner = ora();

  try {
    const project = options.project 
      ? workspace.getProject(options.project)
      : workspace.getCurrentProject();

    if (!project) {
      console.error(chalk.red('\n✗ No project specified.\n'));
      process.exit(1);
    }

    const gitFlowConfig = workspace.getGitFlowConfig(project.id);
    const branchName = `${gitFlowConfig.releasePrefix}${version}`;

    console.log(chalk.bold(`\n🚀 Cutting release: ${version}\n`));
    console.log(chalk.gray(`  Project: ${project.name}`));
    console.log(chalk.gray(`  Base: ${gitFlowConfig.developmentBranch}`));
    console.log(chalk.gray(`  Branch: ${branchName}`));
    console.log();

    if (!options.yes) {
      const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Create this release branch?',
        default: true
      }]);
      if (!confirm) {
        console.log(chalk.gray('Cancelled.\n'));
        process.exit(0);
      }
    }

    spinner.start('Creating release branch...');
    const result = startRelease(version, gitFlowConfig, project.path);
    
    if (!result.success) {
      spinner.fail(chalk.red('Failed to create release branch'));
      console.error(chalk.red(`  ${result.error}\n`));
      process.exit(1);
    }

    spinner.succeed(chalk.green(`Release branch created: ${branchName}`));

    // Push
    spinner.start('Pushing to remote...');
    const pushResult = push({ setUpstream: true, branch: branchName }, project.path);
    if (pushResult.success) {
      spinner.succeed('Pushed with upstream tracking');
    } else {
      spinner.warn('Push failed (you can push manually)');
    }

    // Create PR to main
    if (options.pr) {
      spinner.start('Creating pull request to main...');
      try {
        execSync(
          `gh pr create --base ${gitFlowConfig.productionBranch} --title "Release ${version}" --body "## Release ${version}"`,
          { cwd: project.path, stdio: 'pipe' }
        );
        spinner.succeed('Pull request created');
      } catch {
        spinner.warn('Could not create PR automatically');
      }
    }

    console.log(chalk.bold.green(`\n✓ Release '${version}' branch created\n`));

  } catch (error) {
    spinner.fail('Failed');
    console.error(chalk.red(`\nError: ${error.message}\n`));
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: hotfix start
// ─────────────────────────────────────────────────────────────────────────────

export async function gitHotfixStartCommand(name, options) {
  const workspace = new AuroraWorkspace();
  const spinner = ora();

  try {
    const project = options.project 
      ? workspace.getProject(options.project)
      : workspace.getCurrentProject();

    if (!project) {
      console.error(chalk.red('\n✗ No project specified.\n'));
      process.exit(1);
    }

    const gitFlowConfig = workspace.getGitFlowConfig(project.id);
    const branchName = `${gitFlowConfig.hotfixPrefix}${name}`;

    console.log(chalk.bold(`\n🔥 Starting hotfix: ${name}\n`));
    console.log(chalk.gray(`  Project: ${project.name}`));
    console.log(chalk.gray(`  Base: ${gitFlowConfig.productionBranch}`));
    console.log(chalk.gray(`  Branch: ${branchName}`));
    console.log();

    if (!options.yes) {
      const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Create this hotfix branch?',
        default: true
      }]);
      if (!confirm) {
        console.log(chalk.gray('Cancelled.\n'));
        process.exit(0);
      }
    }

    spinner.start('Creating hotfix branch...');
    const result = startHotfix(name, gitFlowConfig, project.path);
    
    if (!result.success) {
      spinner.fail(chalk.red('Failed to create hotfix branch'));
      console.error(chalk.red(`  ${result.error}\n`));
      process.exit(1);
    }

    spinner.succeed(chalk.green(`Hotfix branch created: ${branchName}`));

    // Push
    if (!options.noPush) {
      spinner.start('Pushing to remote...');
      const pushResult = push({ setUpstream: true, branch: branchName }, project.path);
      if (pushResult.success) {
        spinner.succeed('Pushed with upstream tracking');
      } else {
        spinner.warn('Push failed (you can push manually)');
      }
    }

    console.log(chalk.bold.green(`\n✓ Hotfix '${name}' started\n`));
    console.log(chalk.gray('Next steps:'));
    console.log(chalk.gray('  1. Fix the issue'));
    console.log(chalk.gray('  2. Commit and push'));
    console.log(chalk.gray(`  3. Create PR to ${gitFlowConfig.productionBranch}\n`));

  } catch (error) {
    spinner.fail('Failed');
    console.error(chalk.red(`\nError: ${error.message}\n`));
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: gate pre-push
// ─────────────────────────────────────────────────────────────────────────────

export async function gitGateCommand(gate, options) {
  const workspace = new AuroraWorkspace();

  try {
    const projects = options.all 
      ? workspace.listProjects({ enabled: true })
      : [workspace.getCurrentProject()].filter(Boolean);

    if (projects.length === 0) {
      console.error(chalk.red('\n✗ No project specified.\n'));
      process.exit(1);
    }

    if (gate !== 'pre-push') {
      console.error(chalk.red(`\n✗ Unknown gate: ${gate}`));
      console.log(chalk.gray('Available gates: pre-push\n'));
      process.exit(1);
    }

    console.log(chalk.bold('\n🚧 Running pre-push gate\n'));

    let allPassed = true;

    for (const project of projects) {
      const gitFlowConfig = workspace.getGitFlowConfig(project.id);
      
      console.log(chalk.bold(`${project.name}`));
      
      const result = await runPrePushGate(gitFlowConfig, project.path);
      
      if (result.passed) {
        console.log(chalk.green('  ✓ All checks passed'));
      } else {
        allPassed = false;
        for (const issue of result.issues) {
          const color = issue.severity === 'error' ? chalk.red 
                      : issue.severity === 'warning' ? chalk.yellow 
                      : chalk.gray;
          const icon = issue.severity === 'error' ? '✗' : '⚠';
          console.log(color(`  ${icon} ${issue.message}`));
          if (issue.fix && options.verbose) {
            console.log(chalk.gray(`    Fix: ${issue.fix}`));
          }
        }
      }
      console.log();
    }

    console.log(chalk.gray('─'.repeat(50)));
    if (allPassed) {
      console.log(chalk.green.bold('\n✓ Pre-push gate passed - safe to push\n'));
    } else {
      console.log(chalk.red.bold('\n✗ Pre-push gate failed - fix issues before pushing\n'));
      process.exit(1);
    }

  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) console.error(error.stack);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMMAND: sync (fetch all)
// ─────────────────────────────────────────────────────────────────────────────

export async function gitSyncCommand(options) {
  const workspace = new AuroraWorkspace();
  const spinner = ora();

  try {
    const projects = options.all 
      ? workspace.listProjects({ enabled: true })
      : [workspace.getCurrentProject()].filter(Boolean);

    if (projects.length === 0) {
      console.log(chalk.yellow('\nNo projects to sync.\n'));
      process.exit(1);
    }

    console.log(chalk.bold('\n🔄 Syncing git remotes\n'));

    for (const project of projects) {
      spinner.start(`Fetching ${project.name}...`);
      
      const result = fetch('origin', project.path);
      
      if (result.success) {
        spinner.succeed(`${project.name}`);
      } else {
        spinner.warn(`${project.name} (fetch failed)`);
      }
    }

    console.log(chalk.green('\n✓ Sync complete\n'));

  } catch (error) {
    spinner.fail('Sync failed');
    console.error(chalk.red(`\nError: ${error.message}\n`));
    process.exit(1);
  }
}
