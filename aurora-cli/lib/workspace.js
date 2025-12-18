/**
 * Aurora Workspace Manager
 * 
 * Manages the global Aurora workspace (~/.aurora/) that tracks:
 * - Registered projects
 * - Global configuration
 * - Shared agent library
 * - Execution logs
 */

import { homedir } from 'os';
import { join, resolve } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { ensureDirSync } from 'fs-extra';

export class AuroraWorkspace {
  constructor() {
    this.workspaceDir = join(homedir(), '.aurora');
    this.configPath = join(this.workspaceDir, 'config.json');
    this.projectsPath = join(this.workspaceDir, 'projects.json');
    this.agentsDir = join(this.workspaceDir, 'agents');
    this.logsDir = join(this.workspaceDir, 'logs');
    
    this.ensureWorkspace();
  }

  /**
   * Ensure workspace directory structure exists
   */
  ensureWorkspace() {
    ensureDirSync(this.workspaceDir);
    ensureDirSync(this.agentsDir);
    ensureDirSync(this.logsDir);

    // Initialize config if not exists
    if (!existsSync(this.configPath)) {
      this.saveConfig({
        version: '1.0.0',
        currentProject: null,
        settings: {
          autoSync: true,
          logLevel: 'info',
          parallelExecution: true,
          maxParallelJobs: 3
        },
        gitFlow: {
          productionBranch: 'main',
          developmentBranch: 'develop',
          featurePrefix: 'feature/',
          releasePrefix: 'release/',
          hotfixPrefix: 'hotfix/',
          requireCleanWorktree: true,
          requireUpstream: true,
          prePushChecks: ['quality:ci']
        },
        created: new Date().toISOString()
      });
    }

    // Initialize projects registry if not exists
    if (!existsSync(this.projectsPath)) {
      this.saveProjects({
        version: '1.0.0',
        projects: [],
        updated: new Date().toISOString()
      });
    }
  }

  /**
   * Load global configuration
   */
  loadConfig() {
    try {
      return JSON.parse(readFileSync(this.configPath, 'utf-8'));
    } catch (error) {
      throw new Error(`Failed to load workspace config: ${error.message}`);
    }
  }

  /**
   * Save global configuration
   */
  saveConfig(config) {
    try {
      writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save workspace config: ${error.message}`);
    }
  }

  /**
   * Load projects registry
   */
  loadProjects() {
    try {
      return JSON.parse(readFileSync(this.projectsPath, 'utf-8'));
    } catch (error) {
      throw new Error(`Failed to load projects registry: ${error.message}`);
    }
  }

  /**
   * Save projects registry
   */
  saveProjects(projects) {
    try {
      projects.updated = new Date().toISOString();
      writeFileSync(this.projectsPath, JSON.stringify(projects, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save projects registry: ${error.message}`);
    }
  }

  /**
   * Register a new project
   */
  registerProject(projectPath, options = {}) {
    const registry = this.loadProjects();
    // Use resolve() to handle both relative and absolute paths correctly
    const absolutePath = resolve(projectPath);

    // Check if already registered
    const existing = registry.projects.find(p => p.path === absolutePath);
    if (existing && !options.force) {
      throw new Error(`Project already registered: ${existing.name || absolutePath}`);
    }

    // Validate project has Aurora installed
    const auroraPath = join(absolutePath, 'aurora');
    if (!existsSync(auroraPath)) {
      throw new Error(`Aurora not found at ${absolutePath}. Run 'aurora init' first.`);
    }

    // Load project config
    const projectConfigPath = join(absolutePath, 'project-config.json');
    let projectConfig = {};
    if (existsSync(projectConfigPath)) {
      projectConfig = JSON.parse(readFileSync(projectConfigPath, 'utf-8'));
    }

    // Detect adapter from project-config.json (supports both aurora.adapter and legacy .adapter)
    const detectedAdapter = projectConfig.aurora?.adapter || projectConfig.adapter || 'web-react';
    
    // Load adapter config from the detected adapter path
    const adapterConfigPath = join(auroraPath, 'adapters', detectedAdapter, 'config.json');
    let adapterConfig = {};
    if (existsSync(adapterConfigPath)) {
      adapterConfig = JSON.parse(readFileSync(adapterConfigPath, 'utf-8'));
    }

    const project = {
      id: options.id || this.generateProjectId(absolutePath),
      name: options.name || projectConfig.name || this.getProjectNameFromPath(absolutePath),
      path: absolutePath,
      adapter: adapterConfig.adapter_name || detectedAdapter,
      registered: new Date().toISOString(),
      enabled: true,
      metadata: {
        description: projectConfig.description || '',
        version: projectConfig.version || '1.0.0',
        features: adapterConfig.supported_features || []
      }
    };

    // Remove existing if force update
    if (existing && options.force) {
      registry.projects = registry.projects.filter(p => p.path !== absolutePath);
    }

    registry.projects.push(project);
    this.saveProjects(registry);

    return project;
  }

  /**
   * Unregister a project
   */
  unregisterProject(projectId) {
    const registry = this.loadProjects();
    const project = this.getProject(projectId);
    
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    registry.projects = registry.projects.filter(p => p.id !== project.id);
    this.saveProjects(registry);

    return project;
  }

  /**
   * Get project by ID or name
   */
  getProject(identifier) {
    const registry = this.loadProjects();
    return registry.projects.find(p => 
      p.id === identifier || 
      p.name === identifier ||
      p.path === identifier
    );
  }

  /**
   * List all registered projects
   */
  listProjects(options = {}) {
    const registry = this.loadProjects();
    let projects = registry.projects;

    if (options.enabled !== undefined) {
      projects = projects.filter(p => p.enabled === options.enabled);
    }

    if (options.adapter) {
      projects = projects.filter(p => p.adapter === options.adapter);
    }

    return projects;
  }

  /**
   * Set current/active project
   */
  setCurrentProject(projectId) {
    const project = this.getProject(projectId);
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const config = this.loadConfig();
    config.currentProject = project.id;
    this.saveConfig(config);

    return project;
  }

  /**
   * Get current/active project
   */
  getCurrentProject() {
    const config = this.loadConfig();
    if (!config.currentProject) {
      return null;
    }

    return this.getProject(config.currentProject);
  }

  /**
   * Update project metadata
   */
  updateProject(projectId, updates) {
    const registry = this.loadProjects();
    const project = this.getProject(projectId);
    
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const index = registry.projects.findIndex(p => p.id === project.id);
    registry.projects[index] = { ...project, ...updates };
    this.saveProjects(registry);

    return registry.projects[index];
  }

  /**
   * Get workspace statistics
   */
  getStats() {
    const registry = this.loadProjects();
    const config = this.loadConfig();

    return {
      totalProjects: registry.projects.length,
      enabledProjects: registry.projects.filter(p => p.enabled).length,
      currentProject: config.currentProject,
      adapters: [...new Set(registry.projects.map(p => p.adapter))],
      workspaceDir: this.workspaceDir
    };
  }

  /**
   * Helper: Generate project ID from path
   */
  generateProjectId(path) {
    const name = this.getProjectNameFromPath(path);
    return name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }

  /**
   * Helper: Extract project name from path
   */
  getProjectNameFromPath(path) {
    return path.split('/').filter(Boolean).pop() || 'unknown';
  }

  /**
   * Log execution event
   */
  logExecution(projectId, agentId, toolId, result) {
    const logFile = join(this.logsDir, `${projectId}.log`);
    const entry = {
      timestamp: new Date().toISOString(),
      projectId,
      agentId,
      toolId,
      result,
      exitCode: result.exitCode || 0
    };

    try {
      let logs = [];
      if (existsSync(logFile)) {
        logs = JSON.parse(readFileSync(logFile, 'utf-8'));
      }
      logs.push(entry);
      
      // Keep only last 1000 entries
      if (logs.length > 1000) {
        logs = logs.slice(-1000);
      }
      
      writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (error) {
      // Log errors shouldn't block execution
      console.warn(`Failed to write execution log: ${error.message}`);
    }
  }

  /**
   * Get execution logs for a project
   */
  getExecutionLogs(projectId, options = {}) {
    const logFile = join(this.logsDir, `${projectId}.log`);
    
    if (!existsSync(logFile)) {
      return [];
    }

    try {
      let logs = JSON.parse(readFileSync(logFile, 'utf-8'));

      if (options.agent) {
        logs = logs.filter(l => l.agentId === options.agent);
      }

      if (options.limit) {
        logs = logs.slice(-options.limit);
      }

      return logs;
    } catch (error) {
      console.warn(`Failed to read execution logs: ${error.message}`);
      return [];
    }
  }

  /**
   * Get failures from recent logs (across all projects or specific project)
   */
  getFailures(options = {}) {
    const projects = options.projectId 
      ? [this.getProject(options.projectId)].filter(Boolean)
      : this.listProjects({ enabled: true });
    
    const failures = [];
    const limit = options.limit || 20;

    for (const project of projects) {
      const logs = this.getExecutionLogs(project.id, { limit: 100 });
      const projectFailures = logs
        .filter(l => l.exitCode !== 0)
        .map(l => ({ ...l, projectName: project.name, projectPath: project.path }));
      failures.push(...projectFailures);
    }

    return failures
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // WORKFLOW STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get workflows directory path
   */
  get workflowsDir() {
    const dir = join(this.workspaceDir, 'workflows');
    ensureDirSync(dir);
    return dir;
  }

  /**
   * Create a new workflow
   */
  createWorkflow(projectId, description, agents = []) {
    const project = this.getProject(projectId);
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const workflowId = `wf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const workflow = {
      id: workflowId,
      projectId: project.id,
      projectName: project.name,
      description,
      status: 'pending', // pending, in_progress, paused, completed, failed
      agents: agents.map((agent, index) => ({
        name: agent,
        order: index,
        status: 'pending', // pending, in_progress, completed, failed, skipped
        startedAt: null,
        completedAt: null,
        result: null
      })),
      currentAgentIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null
    };

    const workflowPath = join(this.workflowsDir, `${workflowId}.json`);
    writeFileSync(workflowPath, JSON.stringify(workflow, null, 2), 'utf-8');

    return workflow;
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(workflowId) {
    const workflowPath = join(this.workflowsDir, `${workflowId}.json`);
    if (!existsSync(workflowPath)) {
      return null;
    }
    return JSON.parse(readFileSync(workflowPath, 'utf-8'));
  }

  /**
   * Update workflow state
   */
  updateWorkflow(workflowId, updates) {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const updated = { ...workflow, ...updates, updatedAt: new Date().toISOString() };
    const workflowPath = join(this.workflowsDir, `${workflowId}.json`);
    writeFileSync(workflowPath, JSON.stringify(updated, null, 2), 'utf-8');

    return updated;
  }

  /**
   * Update workflow agent status
   */
  updateWorkflowAgent(workflowId, agentIndex, agentUpdates) {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    if (agentIndex < 0 || agentIndex >= workflow.agents.length) {
      throw new Error(`Invalid agent index: ${agentIndex}`);
    }

    workflow.agents[agentIndex] = { ...workflow.agents[agentIndex], ...agentUpdates };
    workflow.updatedAt = new Date().toISOString();

    const workflowPath = join(this.workflowsDir, `${workflowId}.json`);
    writeFileSync(workflowPath, JSON.stringify(workflow, null, 2), 'utf-8');

    return workflow;
  }

  /**
   * List workflows (optionally filtered)
   */
  listWorkflows(options = {}) {
    const files = existsSync(this.workflowsDir) 
      ? readdirSync(this.workflowsDir).filter(f => f.endsWith('.json'))
      : [];

    let workflows = files.map(f => {
      try {
        return JSON.parse(readFileSync(join(this.workflowsDir, f), 'utf-8'));
      } catch {
        return null;
      }
    }).filter(Boolean);

    if (options.projectId) {
      workflows = workflows.filter(w => w.projectId === options.projectId);
    }

    if (options.status) {
      workflows = workflows.filter(w => w.status === options.status);
    }

    // Sort by most recent first
    return workflows.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  /**
   * Get active workflow for a project (if any)
   */
  getActiveWorkflow(projectId) {
    const workflows = this.listWorkflows({ projectId });
    return workflows.find(w => w.status === 'in_progress' || w.status === 'paused');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // GIT FLOW CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get gitFlow configuration (workspace defaults + project overrides)
   */
  getGitFlowConfig(projectId = null) {
    const config = this.loadConfig();
    const defaults = config.gitFlow || {
      productionBranch: 'main',
      developmentBranch: 'develop',
      featurePrefix: 'feature/',
      releasePrefix: 'release/',
      hotfixPrefix: 'hotfix/',
      requireCleanWorktree: true,
      requireUpstream: true,
      prePushChecks: ['quality:ci']
    };

    if (!projectId) {
      return defaults;
    }

    const project = this.getProject(projectId);
    if (!project?.gitFlow) {
      return defaults;
    }

    return { ...defaults, ...project.gitFlow };
  }

  /**
   * Update gitFlow configuration
   */
  setGitFlowConfig(updates, projectId = null) {
    if (projectId) {
      // Project-specific override
      const project = this.getProject(projectId);
      if (!project) {
        throw new Error(`Project not found: ${projectId}`);
      }
      this.updateProject(projectId, { gitFlow: { ...project.gitFlow, ...updates } });
    } else {
      // Workspace default
      const config = this.loadConfig();
      config.gitFlow = { ...config.gitFlow, ...updates };
      this.saveConfig(config);
    }
  }
}

export default AuroraWorkspace;
