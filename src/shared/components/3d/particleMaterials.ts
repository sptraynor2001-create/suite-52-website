/**
 * Common particle material configurations
 * Shared constants for consistent particle rendering across visualizations
 */

import * as THREE from 'three'

/**
 * Standard white particle material configuration
 */
export const whiteParticleMaterial = {
  size: 0.02,
  color: 0xffffff,
  transparent: true,
  opacity: 0.9,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
} as const

/**
 * Standard red accent particle material configuration
 */
export const redParticleMaterial = {
  size: 0.02,
  color: 0xe63946,
  transparent: true,
  opacity: 1.0,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
} as const

/**
 * Small connection particle material configuration
 */
export const connectionParticleMaterial = {
  size: 0.015,
  color: 0xe63946,
  transparent: true,
  opacity: 0.85,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
} as const

/**
 * Large cluster particle material configuration
 */
export const clusterParticleMaterial = {
  size: 0.03,
  color: 0xffffff,
  transparent: true,
  opacity: 0.95,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
} as const
