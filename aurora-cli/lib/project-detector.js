/**
 * Project Type Detector
 * 
 * Detects the type of project in a directory based on files and dependencies.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export async function detectProjectType(projectRoot) {
  // Check for Next.js
  if (existsSync(join(projectRoot, 'next.config.js')) || 
      existsSync(join(projectRoot, 'next.config.mjs'))) {
    return 'nextjs';
  }

  // Check package.json for framework indicators
  const packageJsonPath = join(projectRoot, 'package.json');
  if (existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Check for Vite + React
      if (deps.vite && deps.react) {
        return 'react-vite';
      }

      // Check for Express
      if (deps.express) {
        return 'express';
      }

      // Check for React (generic)
      if (deps.react) {
        return 'react';
      }

      // Check for Node.js API project
      if (deps['@types/node'] && !deps.react && !deps.vue && !deps.angular) {
        return 'nodejs';
      }
    } catch (error) {
      // Invalid package.json, continue detection
    }
  }

  // Check for vite.config
  if (existsSync(join(projectRoot, 'vite.config.js')) || 
      existsSync(join(projectRoot, 'vite.config.ts'))) {
    return 'vite';
  }

  // Check for Express-specific files
  if (existsSync(join(projectRoot, 'app.js')) || 
      existsSync(join(projectRoot, 'server.js'))) {
    return 'express';
  }

  return null;
}

export function getRecommendedAdapter(projectType) {
  const adapterMap = {
    'nextjs': 'web-nextjs',
    'react-vite': 'web-react',
    'react': 'web-react',
    'vite': 'web-react',
    'express': 'api-express',
    'nodejs': 'api-express',
  };

  return adapterMap[projectType] || 'web-react';
}
