/**
 * Aurora Compare Command
 * 
 * Compare quality metrics across multiple projects
 */

import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import AuroraWorkspace from '../lib/workspace.js';

export async function compareCommand(metric, options) {
  const workspace = new AuroraWorkspace();
  const spinner = ora();

  try {
    const projects = workspace.listProjects({ enabled: true });

    if (projects.length === 0) {
      console.log(chalk.yellow('\nNo enabled projects found.'));
      console.log(chalk.gray('Run "aurora register <path>" to register projects.\n'));
      process.exit(1);
    }

    spinner.start(`Comparing ${metric} across ${projects.length} projects...`);

    const comparisons = [];

    for (const project of projects) {
      const data = await collectMetric(project, metric);
      comparisons.push({
        project,
        data
      });
    }

    spinner.succeed(chalk.green(`Collected ${metric} data from ${projects.length} projects`));

    // Display comparison
    console.log(chalk.bold(`\n📊 ${metric.toUpperCase()} Comparison\n`));

    if (metric === 'quality') {
      displayQualityComparison(comparisons, options);
    } else if (metric === 'coverage') {
      displayCoverageComparison(comparisons, options);
    } else if (metric === 'complexity') {
      displayComplexityComparison(comparisons, options);
    } else {
      displayGenericComparison(comparisons, options);
    }

  } catch (error) {
    spinner.fail(chalk.red('Comparison failed'));
    console.error(chalk.red(`\nError: ${error.message}\n`));
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Collect metric data from a project
 */
async function collectMetric(project, metric) {
  const auroraPath = join(project.path, 'aurora');

  try {
    if (metric === 'quality') {
      // Try to find quality report
      const reportPath = join(auroraPath, 'reports', 'quality-latest.json');
      if (existsSync(reportPath)) {
        return JSON.parse(readFileSync(reportPath, 'utf-8'));
      }
      return { available: false };
    }

    if (metric === 'coverage') {
      // Try to find coverage report
      const coveragePath = join(project.path, 'coverage', 'coverage-summary.json');
      if (existsSync(coveragePath)) {
        const coverage = JSON.parse(readFileSync(coveragePath, 'utf-8'));
        return coverage.total || { available: false };
      }
      return { available: false };
    }

    if (metric === 'complexity') {
      // Try to find complexity report
      const reportPath = join(auroraPath, 'reports', 'complexity-latest.json');
      if (existsSync(reportPath)) {
        return JSON.parse(readFileSync(reportPath, 'utf-8'));
      }
      return { available: false };
    }

    return { available: false };
  } catch (error) {
    return { available: false, error: error.message };
  }
}

/**
 * Display quality comparison
 */
function displayQualityComparison(comparisons, options) {
  const headers = ['Project', 'Violations', 'Warnings', 'Files', 'Score'];
  const rows = [];

  comparisons.forEach(({ project, data }) => {
    if (!data.available) {
      rows.push([
        project.name,
        chalk.gray('N/A'),
        chalk.gray('N/A'),
        chalk.gray('N/A'),
        chalk.gray('No data')
      ]);
      return;
    }

    const violations = data.summary?.totalViolations || 0;
    const warnings = data.summary?.totalWarnings || 0;
    const files = data.summary?.filesScanned || 0;
    const score = data.summary?.qualityScore || 0;

    rows.push([
      project.name,
      violations === 0 ? chalk.green('0') : chalk.red(violations),
      warnings === 0 ? chalk.green('0') : chalk.yellow(warnings),
      files,
      getScoreColor(score)
    ]);
  });

  displayTable(headers, rows);

  // Show best/worst
  const valid = comparisons.filter(c => c.data.available);
  if (valid.length > 0) {
    const sorted = valid.sort((a, b) => 
      (b.data.summary?.qualityScore || 0) - (a.data.summary?.qualityScore || 0)
    );
    
    console.log(chalk.gray('\n─'.repeat(60)));
    console.log(chalk.green(`🏆 Best: ${sorted[0].project.name} (score: ${sorted[0].data.summary?.qualityScore || 0})`));
    if (sorted.length > 1) {
      console.log(chalk.yellow(`⚠️  Needs work: ${sorted[sorted.length - 1].project.name} (score: ${sorted[sorted.length - 1].data.summary?.qualityScore || 0})`));
    }
    console.log();
  }
}

/**
 * Display coverage comparison
 */
function displayCoverageComparison(comparisons, options) {
  const headers = ['Project', 'Lines', 'Branches', 'Functions', 'Statements'];
  const rows = [];

  comparisons.forEach(({ project, data }) => {
    if (!data.available) {
      rows.push([
        project.name,
        chalk.gray('N/A'),
        chalk.gray('N/A'),
        chalk.gray('N/A'),
        chalk.gray('N/A')
      ]);
      return;
    }

    rows.push([
      project.name,
      getCoverageColor(data.lines?.pct),
      getCoverageColor(data.branches?.pct),
      getCoverageColor(data.functions?.pct),
      getCoverageColor(data.statements?.pct)
    ]);
  });

  displayTable(headers, rows);

  // Show average
  const valid = comparisons.filter(c => c.data.available);
  if (valid.length > 0) {
    const avgLines = valid.reduce((sum, c) => sum + (c.data.lines?.pct || 0), 0) / valid.length;
    console.log(chalk.gray('\n─'.repeat(60)));
    console.log(chalk.gray(`Average line coverage: ${avgLines.toFixed(1)}%\n`));
  }
}

/**
 * Display complexity comparison
 */
function displayComplexityComparison(comparisons, options) {
  const headers = ['Project', 'Avg Complexity', 'Max Complexity', 'Files', 'High Risk'];
  const rows = [];

  comparisons.forEach(({ project, data }) => {
    if (!data.available) {
      rows.push([
        project.name,
        chalk.gray('N/A'),
        chalk.gray('N/A'),
        chalk.gray('N/A'),
        chalk.gray('N/A')
      ]);
      return;
    }

    const avgComplexity = data.summary?.averageComplexity || 0;
    const maxComplexity = data.summary?.maxComplexity || 0;
    const files = data.summary?.filesAnalyzed || 0;
    const highRisk = data.summary?.highRiskFiles || 0;

    rows.push([
      project.name,
      getComplexityColor(avgComplexity),
      getComplexityColor(maxComplexity),
      files,
      highRisk === 0 ? chalk.green('0') : chalk.red(highRisk)
    ]);
  });

  displayTable(headers, rows);
}

/**
 * Display generic comparison
 */
function displayGenericComparison(comparisons, options) {
  console.log(chalk.yellow('Generic comparison display\n'));
  
  comparisons.forEach(({ project, data }) => {
    console.log(chalk.bold(project.name));
    console.log(JSON.stringify(data, null, 2));
    console.log();
  });
}

/**
 * Display a simple table
 */
function displayTable(headers, rows) {
  const colWidths = headers.map((h, i) => {
    const maxWidth = Math.max(
      h.length,
      ...rows.map(r => stripAnsi(r[i]?.toString() || '').length)
    );
    return maxWidth + 2;
  });

  // Header
  const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join('');
  console.log(chalk.bold(headerRow));
  console.log(chalk.gray('─'.repeat(headerRow.length)));

  // Rows
  rows.forEach(row => {
    const rowStr = row.map((cell, i) => {
      const str = cell?.toString() || '';
      const padding = colWidths[i] - stripAnsi(str).length;
      return str + ' '.repeat(padding);
    }).join('');
    console.log(rowStr);
  });
}

/**
 * Helper: Strip ANSI codes for length calculation
 */
function stripAnsi(str) {
  return str.replace(/\u001b\[[0-9;]*m/g, '');
}

/**
 * Helper: Color code for quality score
 */
function getScoreColor(score) {
  if (score >= 90) return chalk.green(`${score}%`);
  if (score >= 70) return chalk.yellow(`${score}%`);
  return chalk.red(`${score}%`);
}

/**
 * Helper: Color code for coverage percentage
 */
function getCoverageColor(pct) {
  if (pct === undefined) return chalk.gray('N/A');
  if (pct >= 80) return chalk.green(`${pct.toFixed(1)}%`);
  if (pct >= 60) return chalk.yellow(`${pct.toFixed(1)}%`);
  return chalk.red(`${pct.toFixed(1)}%`);
}

/**
 * Helper: Color code for complexity
 */
function getComplexityColor(complexity) {
  if (complexity === undefined) return chalk.gray('N/A');
  if (complexity <= 10) return chalk.green(complexity.toFixed(1));
  if (complexity <= 20) return chalk.yellow(complexity.toFixed(1));
  return chalk.red(complexity.toFixed(1));
}
