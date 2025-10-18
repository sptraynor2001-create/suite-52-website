# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev              # Start development server (http://localhost:5173)
npm run build           # Production build
npm run preview         # Preview production build

# Code Quality
npm run lint            # ESLint check
npm run test            # Run tests in watch mode
npm run test:run        # Run tests once
npm run test:coverage   # Full coverage report

# Test utilities
npm run test:ui         # Interactive test UI
npm run test:watch      # Watch mode (same as npm test)
```

## Architecture Overview

**Single-page React application** for Producer/DJ/Artist Suite 52 with technical aesthetic and mobile-first design.

### Key Architectural Patterns

1. **Modular Configuration System** (`src/config/`)
   - `app.ts`: Feature flags, animation settings, social links
   - `routing.ts`: Route definitions and navigation structure
   - Use `appConfig.features` to check if features are enabled

2. **Centralized Content Management** (`src/content/`)
   - All website copy in TypeScript files for easy editing
   - Organized by pages and components
   - No database - content is version controlled

3. **Complete Design System** (`src/themes/`)
   - `colors.ts`: Color schemes (technical aesthetic with poker red #e63946)
   - `typography.ts`: Ubuntu Mono font system with 10 options
   - `spacing.ts`: Consistent spacing scales
   - `animations.ts`: Animation configurations

4. **Self-Contained Features** (`src/features/`)
   - Each feature has own config, content, and types
   - Feature modules: home, about, music, live-sets, shows, contact, epk

### Routing Architecture

- **Home page** (`/`): Special landing page with no navigation header
- **Main app pages**: All other routes use shared `MainApp` component with sticky navigation
- **Lazy loading**: All page components are code-split for performance
- **EPK route** (`/epk`): Hidden from navigation, standalone component

### Component Organization

- `src/shared/components/ui/`: Base UI components (Button, Card, ReleaseCard)
- `src/shared/components/layout/`: Layout components (Navigation, PageLayout)
- `src/shared/components/effects/`: Visual effects (FallingCode)

## Testing

- **Framework**: Vitest + React Testing Library + jsdom
- **Coverage goals**: Statements >80%, Branches >75%, Functions >85%
- **Setup**: `src/test/setup.ts` configures testing environment
- **Test timeout**: 10 seconds for async operations

## Technology Stack

- **Core**: React 18 + TypeScript + Vite + Tailwind CSS
- **3D/Animations**: @react-three/fiber, @react-three/drei, Framer Motion
- **Routing**: React Router v7
- **Build**: Vite with ESM, fast HMR, bundle analysis

## Content Updates

To add new content (no database):

### Music Release
```typescript
// src/features/music/data.ts
{
  title: "Track Name",
  date: "2024-01-01", 
  coverArt: "/images/songs/cover.jpg",
  spotifyUrl: "https://spotify.com/track/123"
}
```

### Live Set
```typescript
// src/features/live-sets/data.ts  
{
  title: "Set Name",
  date: "2024-01-01",
  youtubeUrl: "https://youtube.com/watch?v=123"
}
```

## Mobile-First Design

- **Responsive breakpoints**: Mobile <768px, Desktop ≥768px
- **Home page**: Fixed viewport height, no scroll on mobile
- **Touch optimization**: Large tap targets, smooth animations
- **Instagram/TikTok friendly**: 9:16 aspect ratio support

## Performance Standards

- Bundle size <500KB
- Lighthouse score 90+
- Coverage >95%
- ESLint: Airbnb config, no warnings
- TypeScript: Strict mode, no `any` types