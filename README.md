# Suite 52 Website

Single-page React app for Producer/DJ/Artist Suite 52. Technical aesthetic, mobile-first design.

## Quick Start

```bash
npm install && npm run dev
```

Visit `http://localhost:5173`

## Development Commands

```bash
npm run dev         # Development server
npm run build       # Production build  
npm run test        # Run tests
npm run test:coverage # Coverage report
npm run lint        # ESLint check
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom themes
- **Testing**: Vitest + React Testing Library
- **Routing**: React Router

## Architecture

```
src/
├── config/         # App configuration & feature flags
├── content/        # All website copy (edit here for content changes)  
├── themes/         # Design system (colors, typography, spacing)
├── features/       # Page components (home, about, music, etc)
├── shared/         # Reusable components, hooks, utilities
└── test/           # Test files
```

## Content Management

**No database needed** - edit TypeScript files directly:

### Add Music Release
```typescript
// src/features/music/data.ts
{
  title: "Track Name",
  date: "2024-01-01",
  coverArt: "/images/songs/cover.jpg", 
  spotifyUrl: "https://spotify.com/track/123"
}
```

### Update Contact Info
```typescript  
// src/content/pages/contact.ts
export const contactContent = {
  email: "suite52sounds@gmail.com",
  instagram: "@suite52sounds"
}
```

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main routing & app logic |
| `src/config/app.ts` | Feature flags & settings |
| `src/themes/` | Complete design system |
| `src/content/pages/` | Page content (easily editable) |
| `src/features/music/data.ts` | Music releases |

## Deployment

```bash
npm run build  # Creates optimized dist/ folder
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, etc).

## Development Notes

- **Mobile-first**: All components designed for mobile, enhanced for desktop
- **Technical aesthetic**: Ubuntu Mono font, grayscale + poker red (#e63946)
- **Performance**: Bundle splitting, lazy loading, optimized assets
- **Testing**: 95% coverage target with comprehensive test suite

## Theme System

Colors, spacing, typography all centralized in `src/themes/`. Edit these files to change the entire site's appearance.

## Browser Support

Modern browsers supporting ES2020+ features. Automatically handles legacy browsers via Vite.

---

**Built for Suite 52** - Technical. Digital. Sound. 🎵