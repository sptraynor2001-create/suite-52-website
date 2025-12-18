/**
 * Aurora Git Utilities
 * 
 * Provides git operations for Aurora-managed projects.
 * Wraps common git commands and provides health checks.
 */

import { execSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Execute a git command and return the output
 */
export function git(args, options = {}) {
  const cwd = options.cwd || process.cwd();
  const cmd = `git ${args}`;
  
  try {
    const output = execSync(cmd, {
      cwd,
      encoding: 'utf-8',
      stdio: options.stdio || ['pipe', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024
    });
    return { success: true, output: output.trim(), exitCode: 0 };
  } catch (error) {
    return {
      success: false,
      output: error.stdout?.toString().trim() || '',
      error: error.stderr?.toString().trim() || error.message,
      exitCode: error.status || 1
    };
  }
}

/**
 * Check if directory is a git repository
 */
export function isGitRepo(cwd = process.cwd()) {
  return existsSync(join(cwd, '.git'));
}

/**
 * Get current branch name
 */
export function getCurrentBranch(cwd = process.cwd()) {
  const result = git('rev-parse --abbrev-ref HEAD', { cwd });
  return result.success ? result.output : null;
}

/**
 * Check if working tree is clean
 */
export function isCleanWorktree(cwd = process.cwd()) {
  const result = git('status --porcelain', { cwd });
  return result.success && result.output === '';
}

/**
 * Get uncommitted changes count
 */
export function getUncommittedCount(cwd = process.cwd()) {
  const result = git('status --porcelain', { cwd });
  if (!result.success) return 0;
  return result.output.split('\n').filter(Boolean).length;
}

/**
 * Get upstream tracking branch
 */
export function getUpstream(cwd = process.cwd()) {
  const result = git('rev-parse --abbrev-ref --symbolic-full-name @{u}', { cwd });
  return result.success ? result.output : null;
}

/**
 * Check if branch has upstream configured
 */
export function hasUpstream(cwd = process.cwd()) {
  return getUpstream(cwd) !== null;
}

/**
 * Get ahead/behind counts relative to upstream
 */
export function getAheadBehind(cwd = process.cwd()) {
  const result = git('rev-list --left-right --count @{u}...HEAD', { cwd });
  if (!result.success) return { ahead: 0, behind: 0 };
  
  const [behind, ahead] = result.output.split('\t').map(Number);
  return { ahead: ahead || 0, behind: behind || 0 };
}

/**
 * Get last commit info
 */
export function getLastCommit(cwd = process.cwd()) {
  const result = git('log -1 --format=%H|%s|%an|%ai', { cwd });
  if (!result.success) return null;
  
  const [hash, subject, author, date] = result.output.split('|');
  return { hash, subject, author, date };
}

/**
 * Check for merge conflicts
 */
export function hasMergeConflicts(cwd = process.cwd()) {
  const result = git('ls-files -u', { cwd });
  return result.success && result.output !== '';
}

/**
 * Check if rebase is in progress
 */
export function isRebaseInProgress(cwd = process.cwd()) {
  return existsSync(join(cwd, '.git', 'rebase-merge')) || 
         existsSync(join(cwd, '.git', 'rebase-apply'));
}

/**
 * Check if HEAD is detached
 */
export function isDetachedHead(cwd = process.cwd()) {
  const result = git('symbolic-ref -q HEAD', { cwd });
  return !result.success;
}

/**
 * Get comprehensive git status for a project
 */
export function getGitStatus(cwd = process.cwd()) {
  if (!isGitRepo(cwd)) {
    return { isRepo: false };
  }

  const branch = getCurrentBranch(cwd);
  const clean = isCleanWorktree(cwd);
  const uncommitted = getUncommittedCount(cwd);
  const upstream = getUpstream(cwd);
  const { ahead, behind } = getAheadBehind(cwd);
  const lastCommit = getLastCommit(cwd);
  const conflicts = hasMergeConflicts(cwd);
  const rebasing = isRebaseInProgress(cwd);
  const detached = isDetachedHead(cwd);

  return {
    isRepo: true,
    branch,
    clean,
    uncommitted,
    upstream,
    ahead,
    behind,
    lastCommit,
    conflicts,
    rebasing,
    detached
  };
}

/**
 * Get health issues for a project's git state
 */
export function getGitHealthIssues(cwd = process.cwd(), gitFlowConfig = {}) {
  const status = getGitStatus(cwd);
  const issues = [];

  if (!status.isRepo) {
    issues.push({ severity: 'error', message: 'Not a git repository' });
    return issues;
  }

  if (status.detached) {
    issues.push({ severity: 'warning', message: 'HEAD is detached' });
  }

  if (status.rebasing) {
    issues.push({ severity: 'error', message: 'Rebase in progress' });
  }

  if (status.conflicts) {
    issues.push({ severity: 'error', message: 'Merge conflicts present' });
  }

  if (!status.clean && gitFlowConfig.requireCleanWorktree) {
    issues.push({ severity: 'warning', message: `${status.uncommitted} uncommitted changes` });
  }

  if (!status.upstream && gitFlowConfig.requireUpstream) {
    issues.push({ severity: 'warning', message: 'No upstream tracking branch' });
  }

  if (status.behind > 0) {
    issues.push({ severity: 'info', message: `${status.behind} commits behind upstream` });
  }

  if (status.ahead > 10) {
    issues.push({ severity: 'warning', message: `${status.ahead} commits ahead (consider pushing)` });
  }

  return issues;
}

// ─────────────────────────────────────────────────────────────────────────────
// GIT FLOW OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch from remote
 */
export function fetch(remote = 'origin', cwd = process.cwd()) {
  return git(`fetch ${remote}`, { cwd });
}

/**
 * Pull current branch
 */
export function pull(cwd = process.cwd()) {
  return git('pull', { cwd });
}

/**
 * Push current branch
 */
export function push(options = {}, cwd = process.cwd()) {
  const args = ['push'];
  if (options.setUpstream) args.push('-u', options.remote || 'origin', options.branch || getCurrentBranch(cwd));
  if (options.force) args.push('--force-with-lease');
  return git(args.join(' '), { cwd });
}

/**
 * Create and checkout a new branch
 */
export function createBranch(branchName, baseBranch = null, cwd = process.cwd()) {
  const base = baseBranch || getCurrentBranch(cwd);
  
  // First checkout base and pull
  let result = git(`checkout ${base}`, { cwd });
  if (!result.success) return result;
  
  result = git('pull', { cwd });
  // Pull might fail if no upstream, that's okay
  
  // Create new branch
  result = git(`checkout -b ${branchName}`, { cwd });
  return result;
}

/**
 * Checkout existing branch
 */
export function checkout(branchName, cwd = process.cwd()) {
  return git(`checkout ${branchName}`, { cwd });
}

/**
 * Check if branch exists (local or remote)
 */
export function branchExists(branchName, cwd = process.cwd()) {
  const local = git(`rev-parse --verify ${branchName}`, { cwd });
  if (local.success) return { exists: true, local: true };
  
  const remote = git(`rev-parse --verify origin/${branchName}`, { cwd });
  if (remote.success) return { exists: true, local: false, remote: true };
  
  return { exists: false };
}

/**
 * Start a feature branch
 */
export function startFeature(name, gitFlowConfig, cwd = process.cwd()) {
  const branchName = `${gitFlowConfig.featurePrefix}${name}`;
  const baseBranch = gitFlowConfig.developmentBranch;
  
  // Check if branch already exists
  const exists = branchExists(branchName, cwd);
  if (exists.exists) {
    return { success: false, error: `Branch ${branchName} already exists` };
  }
  
  return createBranch(branchName, baseBranch, cwd);
}

/**
 * Start a release branch
 */
export function startRelease(version, gitFlowConfig, cwd = process.cwd()) {
  const branchName = `${gitFlowConfig.releasePrefix}${version}`;
  const baseBranch = gitFlowConfig.developmentBranch;
  
  const exists = branchExists(branchName, cwd);
  if (exists.exists) {
    return { success: false, error: `Branch ${branchName} already exists` };
  }
  
  return createBranch(branchName, baseBranch, cwd);
}

/**
 * Start a hotfix branch
 */
export function startHotfix(name, gitFlowConfig, cwd = process.cwd()) {
  const branchName = `${gitFlowConfig.hotfixPrefix}${name}`;
  const baseBranch = gitFlowConfig.productionBranch;
  
  const exists = branchExists(branchName, cwd);
  if (exists.exists) {
    return { success: false, error: `Branch ${branchName} already exists` };
  }
  
  return createBranch(branchName, baseBranch, cwd);
}

/**
 * Validate branch name against gitFlow prefixes
 */
export function validateBranchName(branchName, gitFlowConfig) {
  const { productionBranch, developmentBranch, featurePrefix, releasePrefix, hotfixPrefix } = gitFlowConfig;
  
  if (branchName === productionBranch || branchName === developmentBranch) {
    return { valid: true, type: 'protected' };
  }
  
  if (branchName.startsWith(featurePrefix)) {
    return { valid: true, type: 'feature', name: branchName.slice(featurePrefix.length) };
  }
  
  if (branchName.startsWith(releasePrefix)) {
    return { valid: true, type: 'release', name: branchName.slice(releasePrefix.length) };
  }
  
  if (branchName.startsWith(hotfixPrefix)) {
    return { valid: true, type: 'hotfix', name: branchName.slice(hotfixPrefix.length) };
  }
  
  return { valid: false, type: 'unknown' };
}

/**
 * Run pre-push gate checks
 */
export async function runPrePushGate(gitFlowConfig, cwd = process.cwd()) {
  const issues = [];
  const status = getGitStatus(cwd);
  const branch = status.branch;
  
  // Check clean worktree
  if (!status.clean && gitFlowConfig.requireCleanWorktree) {
    issues.push({ severity: 'error', message: 'Working tree is not clean', fix: 'Commit or stash changes' });
  }
  
  // Check upstream
  if (!status.upstream && gitFlowConfig.requireUpstream) {
    issues.push({ severity: 'error', message: 'No upstream configured', fix: 'git push -u origin ' + branch });
  }
  
  // Check not pushing directly to protected branches
  const branchInfo = validateBranchName(branch, gitFlowConfig);
  if (branchInfo.type === 'protected') {
    issues.push({ severity: 'warning', message: `Pushing directly to ${branch} (protected branch)` });
  }
  
  // Check behind upstream
  if (status.behind > 0) {
    issues.push({ severity: 'error', message: `Branch is ${status.behind} commits behind upstream`, fix: 'git pull --rebase' });
  }
  
  // Run configured checks (npm scripts)
  for (const check of gitFlowConfig.prePushChecks || []) {
    try {
      execSync(`npm run ${check}`, { cwd, stdio: 'pipe' });
    } catch (error) {
      issues.push({ severity: 'error', message: `Pre-push check failed: ${check}`, fix: `Fix issues and re-run: npm run ${check}` });
    }
  }
  
  return {
    passed: issues.filter(i => i.severity === 'error').length === 0,
    issues
  };
}

export default {
  git,
  isGitRepo,
  getCurrentBranch,
  isCleanWorktree,
  getUncommittedCount,
  getUpstream,
  hasUpstream,
  getAheadBehind,
  getLastCommit,
  hasMergeConflicts,
  isRebaseInProgress,
  isDetachedHead,
  getGitStatus,
  getGitHealthIssues,
  fetch,
  pull,
  push,
  createBranch,
  checkout,
  branchExists,
  startFeature,
  startRelease,
  startHotfix,
  validateBranchName,
  runPrePushGate
};
