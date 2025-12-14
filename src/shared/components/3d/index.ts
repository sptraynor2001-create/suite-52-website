/**
 * 3D Components - Suite 52
 * Shared Three.js/React Three Fiber components
 */

export { Scene, SimpleScene } from './Scene'
export { 
  QualityProvider, 
  useQuality, 
  useThrottledFrame,
  useCanRender3D,
  usePrefersReducedMotion,
  qualityPresets,
  type QualityLevel,
  type QualitySettings,
} from './AdaptiveQuality'
export { ParticleSystem, PortalParticles } from './ParticleSystem'
export { PostProcessing, PortalPostProcessing, MinimalPostProcessing } from './PostProcessing'
export { CameraController, ScrollCamera, FlyThroughCamera } from './CameraController'
export { Fog, AnimatedFog, GradientFog } from './Fog'
export {
  whiteParticleMaterial,
  redParticleMaterial,
  connectionParticleMaterial,
  clusterParticleMaterial,
} from './particleMaterials'

