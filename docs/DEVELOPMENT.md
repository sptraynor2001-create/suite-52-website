# Development Guide

Technical reference for developers working on the Suite 52 website.

## Tech Stack

### Core
- **React 18** - UI library with hooks
- **TypeScript 5** - Type-safe JavaScript
- **Vite 7** - Build tool and dev server
- **React Router 6** - Routing (EPK page only)

### Styling
- **Tailwind CSS 3** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Inline Styles** - Dynamic styling with design tokens

### Type Safety
- **TypeScript** - Full type coverage
- **ESLint** - Code linting

## Architecture

### Single-Page App (SPA)
The site uses **state-based navigation** - no URL changes between main sections.

**How it works:**
1. `App.tsx` manages current page state
2. Navigation buttons update state (not URL)
3. Content switches instantly without reload
4. Only `/epk` has its own URL route

**Benefits:**
- ⚡ Instant page transitions
- 🎯 No scrollbar flickering
- 🚀 Better UX for music sites
- 📱 Smoother mobile experience

### Project Structure

**Feature-based modular architecture:**

```
src/
├── features/              # Self-contained feature modules
│   ├── home/
│   │   ├── index.ts      # Barrel export
│   │   └── Home.tsx      # Landing page
│   ├── music/
│   │   ├── index.ts
│   │   ├── Music.tsx
│   │   ├── data.ts       # Songs content
│   │   └── types.ts      # Song interface
│   ├── shows/
│   ├── live-sets/
│   ├── about/
│   ├── contact/
│   │   ├── data.ts       # Social links (Instagram, email)
│   │   └── types.ts
│   └── epk/              # Separate URL route
├── shared/
│   └── components/
│       ├── Navigation.tsx    # Header with tab buttons
│       └── atoms/            # Atomic components
│           ├── Button.tsx
│           ├── Card.tsx
│           └── GlowText.tsx
├── design/                   # Design system (atomic)
│   ├── colors.ts            # Color palette (grayscale mode)
│   ├── gradients.ts         # Gradient definitions
│   ├── tokens.ts            # Design tokens (spacing, shadows, etc)
│   ├── fonts.ts             # Font system (Ubuntu Mono + 9 alternates)
│   └── index.ts             # Barrel export
├── App.tsx                  # Root app with state management
├── main.tsx                 # React entry point
└── index.css                # Global styles + Ubuntu Mono import
```

## Design System

### Typography (`src/design/fonts.ts`)

**Active Font:** Ubuntu Mono (monospace)

**Available alternates (10 total):**
- Share Tech Mono
- Overpass Mono
- Red Hat Mono
- Cutive Mono
- Oxygen Mono
- PT Mono
- Inconsolata
- Nova Mono
- Azeret Mono
- Ubuntu Mono ✓

**Switch fonts app-wide:**
Edit `activeFont` object in `fonts.ts`

### Colors (`src/design/colors.ts`)

**Current Mode:** Grayscale

```typescript
colors = {
  background: {
    app: '#000000',        // Pure black
    nav: 'rgba(0,0,0,0.7)', // Translucent black
  },
  text: {
    primary: '#ffffff',    // White
    secondary: 'rgba(255,255,255,0.8)',
  },
  accent: {
    primary: '#e63946',    // Poker red (active tabs)
  }
}
```

**Color palette preserved in comments** for easy restoration to full color mode.

### Design Tokens (`src/design/tokens.ts`)

Includes:
- Spacing scale
- Typography scale
- Shadow definitions
- Border radius
- Transitions
- Breakpoints

### Gradients (`src/design/gradients.ts`)

Currently grayscale. Commented color gradients available for restoration.

## Navigation System

### State-Based Navigation

**File:** `src/shared/components/Navigation.tsx`

```typescript
type Page = 'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}
```

**States:**
- **Normal:** White text
- **Hover:** White underline appears
- **Active:** Poker red + italic

**Navigation order:**
HOME → MUSIC → SHOWS → LIVE SETS → ABOUT → CONTACT

### Sticky Header

```css
position: sticky
top: 0
z-index: 1000
```

Always visible, content scrolls beneath.

### Forced Scrollbar

```css
/* index.css */
html, body {
  overflow-y: scroll;  /* Prevent layout shift */
}
```

Keeps layout stable when switching between short/long pages.

## Content Management

### Data Files

Each feature has a `data.ts` file:

```typescript
// src/features/music/data.ts
export const songs: Song[] = [
  {
    id: '1',
    title: 'Track Name',
    releaseDate: '2025-01-15',
    spotifyUrl: 'https://...',
    // ... more fields
  }
]
```

**No database needed** - just edit TypeScript files.

### Types

Each feature defines its own types:

```typescript
// src/features/music/types.ts
export interface Song {
  id: string
  title: string
  artist?: string
  releaseDate: string
  coverImage?: string
  spotifyUrl?: string
  appleMusicUrl?: string
  youtubeUrl?: string
  description?: string
}
```

## Development Workflow

### Commands

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Server

- **Hot Module Replacement (HMR)** - Instant updates
- **Console logging** - Extensive debug info
- **Port:** Usually 5173 or 5174

### Console Logs

The app logs everything for easy debugging:

```
📐 Navigation dimensions
🖱️ Hover on: MUSIC
🔗 Navigating to: music
🏠 Home page mounted
📱 Viewport: { width: 1354, height: 900 }
🔤 Active font: Ubuntu Mono
✅ Font loaded: Ubuntu Mono
```

## Adding Features

### 1. Create Feature Folder

```bash
src/features/new-feature/
├── index.ts           # Export component
├── NewFeature.tsx     # Page component
├── data.ts            # Content
└── types.ts           # TypeScript types
```

### 2. Update App.tsx

```typescript
import NewFeature from '@/features/new-feature'

type Page = 'home' | ... | 'new-feature'

const renderPage = () => {
  switch (currentPage) {
    // ... existing cases
    case 'new-feature':
      return <NewFeature />
  }
}
```

### 3. Update Navigation

```typescript
const navLinks = [
  // ... existing links
  { page: 'new-feature', label: 'NEW FEATURE' },
]
```

## Styling Approach

### Atomic Design

1. **Design tokens** → Define once in `design/`
2. **Atomic components** → Use tokens
3. **Feature components** → Use atoms

### Inline Styles vs Tailwind

```tsx
// Use inline styles for dynamic values
<div style={{ color: colors.text.primary }}>

// Use Tailwind for static utilities
<div className="flex items-center">
```

## TypeScript Configuration

### Path Aliases

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Usage:
```typescript
import { colors } from '@/design'
import Home from '@/features/home'
```

### Strict Mode

Full strict mode enabled for maximum type safety.

## Performance

### Optimizations
- ✅ State-based navigation (no reloads)
- ✅ Lazy loading ready (React.lazy)
- ✅ Vite code splitting
- ✅ Font preloading in index.css
- ✅ Minimal dependencies

### Bundle Size
- React + Router: ~45KB gzipped
- No heavy libraries
- Images served from `/public`

## Browser Support

- **Modern browsers** (ES2020+)
- **Mobile optimized** (iOS Safari, Chrome)
- **Responsive** design
- **No IE11** support

## Git Workflow

```bash
# Make changes
git add -A

# Commit with descriptive message
git commit -m "Add feature X"

# Push to origin
git push
```

## Troubleshooting

### Layout Shifts
**Issue:** Content jumps when switching pages
**Fix:** Forced scrollbar in `index.css`

### Font Not Loading
**Issue:** Ubuntu Mono not appearing
**Fix:** Check Google Fonts import in `index.css`

### Navigation Not Updating
**Issue:** Active state not changing
**Fix:** Check `currentPage` state in `App.tsx`

### TypeScript Errors
**Issue:** Import errors with `@/` paths
**Fix:** Check `tsconfig.json` and `vite.config.ts`

---

**Architecture Status:** Production-ready single-page app with atomic design system.
