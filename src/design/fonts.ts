/**
 * Design System - Typography
 * Font options for Suite 52
 * 
 * All fonts are monospace for technical/futuristic aesthetic
 * Current selection: Ubuntu Mono
 */

export const fontOptions = [
  { name: 'Share Tech Mono', family: 'Share Tech Mono, monospace' },
  { name: 'Overpass Mono', family: 'Overpass Mono, monospace' },
  { name: 'Red Hat Mono', family: 'Red Hat Mono, monospace' },
  { name: 'Cutive Mono', family: 'Cutive Mono, monospace' },
  { name: 'Oxygen Mono', family: 'Oxygen Mono, monospace' },
  { name: 'PT Mono', family: 'PT Mono, monospace' },
  { name: 'Inconsolata', family: 'Inconsolata, monospace' },
  { name: 'Nova Mono', family: 'Nova Mono, monospace' },
  { name: 'Azeret Mono', family: 'Azeret Mono, monospace' },
  { name: 'Ubuntu Mono', family: 'Ubuntu Mono, monospace' },
] as const

// Current active font for the app
export const activeFont = {
  name: 'Ubuntu Mono',
  family: 'Ubuntu Mono, monospace',
  googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap'
}

export type FontOption = typeof fontOptions[number]

