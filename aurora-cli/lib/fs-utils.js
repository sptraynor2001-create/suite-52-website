/**
 * File System Utilities
 * 
 * Helper functions for directory and file operations.
 */

import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

export function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

export function copyDir(source, destination) {
  return new Promise((resolve, reject) => {
    try {
      ensureDir(destination);
      cpSync(source, destination, { recursive: true });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export function fileExists(path) {
  return existsSync(path) && statSync(path).isFile();
}

export function dirExists(path) {
  return existsSync(path) && statSync(path).isDirectory();
}

export function listFiles(dirPath, extension = null) {
  if (!dirExists(dirPath)) {
    return [];
  }

  const files = readdirSync(dirPath);
  
  if (extension) {
    return files.filter(f => f.endsWith(extension));
  }
  
  return files;
}
