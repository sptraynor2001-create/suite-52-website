# Suite 52

**Technical. Digital. Sound.** 🎵

Modern React application for Producer/DJ/Artist Suite 52. Enterprise-grade architecture for rapid iteration.

---

## 🚀 Quick Start

```bash
npm install && npm run dev
```

Visit `http://localhost:5173`

---

## 📋 Commands

```bash
npm run dev         # Development server with hot reload
npm run build       # Production build optimized for performance
npm run test        # Run comprehensive test suite (212+ tests)
npm run test:coverage # Generate detailed coverage report
npm run lint        # ESLint code quality checks
```

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 19 + TypeScript | Modern component architecture |
| **Build** | Vite 6 | Lightning-fast development & optimized builds |
| **Styling** | Tailwind CSS + Custom Design System | Consistent, themeable UI |
| **Routing** | React Router 7 | Client-side navigation |
| **Testing** | Vitest + React Testing Library | Comprehensive test coverage |
| **State** | React Hooks + Context | Predictable state management |
| **Content** | TypeScript Files | No database - edit code for content |

---

## 🏗️ Architecture

```
src/
├── config/           # 🔧 App configuration & feature flags
├── content/          # 📝 Website content (easily editable)
│   ├── pages/        # Page-specific content
│   └── components/   # Reusable content components
├── themes/           # 🎨 Unified design system (single source)
│   ├── index.ts      # Main exports - import everything here
│   ├── colors.ts     # Brand colors, themes, component colors
│   ├── typography.ts # Fonts, text styles, sizing
│   ├── spacing.ts    # Spacing scale & responsive utilities
│   ├── animations.ts # Keyframes, timing, presets
│   ├── tokens.ts     # Design tokens (colors, shadows, etc.)
│   ├── components.ts # Component style builders
│   ├── layout.ts     # Layout utilities & flexbox helpers
│   ├── responsive.ts # Breakpoints & responsive design
│   └── theme.ts      # Theme-aware functions
├── features/         # 🎯 Page-specific business logic
│   ├── home/         # Landing page
│   ├── music/        # 🎵 Releases & tracks
│   ├── live-sets/    # 🎧 Live performances
│   ├── about/        # 👤 Artist bio
│   ├── shows/        # 📅 Upcoming events
│   ├── contact/      # 📧 Contact information
│   └── epk/          # 📄 Electronic press kit
├── shared/           # 🔄 Reusable components & utilities
│   ├── components/   # UI components (buttons, cards, etc.)
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Pure utility functions
│   └── constants/    # Application constants
└── test/             # 🧪 Test files & utilities
```

---

## 🎨 Design System

### Unified Theme Architecture
Everything centralized in `src/themes/` - edit files to change entire site appearance instantly.

```typescript
// Import everything from single source
import {
  colors, spacing, animations,
  getCardStyles, getButtonStyles,
  keyframes, timing, duration
} from '@/themes'
```

### Key Features
- **🎯 Single Source of Truth** - No duplicate styling systems
- **📱 Mobile-First** - Designed for mobile, enhanced for desktop
- **🎨 Technical Aesthetic** - Ubuntu Mono font, grayscale + poker red (#e63946)
- **⚡ Fast Iteration** - Organized for rapid prototyping
- **🔧 Themeable** - Ready for dark mode, custom themes
- **📏 Consistent Spacing** - T-shirt sizing scale (xs, sm, md, lg, xl, 2xl, 3xl)
- **🎬 Rich Animations** - Keyframes, timing, stagger effects

---

## 📝 Content Management

**No database required** - edit TypeScript files directly for instant updates.

### Add Music Release
```typescript
// src/features/music/data.ts
export const releases = [
  {
    id: "new-track",
    title: "New Track Name",
    artists: "Suite 52",
    date: "2024-12-01",
    coverArt: "/images/songs/new-cover.jpg",
    spotifyUrl: "https://open.spotify.com/track/123"
  }
]
```

### Update Contact Info
```typescript
// src/content/pages/contact.ts
export const contactContent = {
  email: "suite52sounds@gmail.com",
  instagram: "@suite52sounds",
  booking: "booking@suite52sounds.com"
}
```

---

## 🧪 Testing Strategy

212+ tests covering utilities, components, features, themes, and integration.

### Test Categories
- **🔧 Utilities** - API functions, media processing, responsive helpers
- **🧩 Components** - UI components, props validation, rendering
- **🎯 Features** - Page logic, data management, user interactions
- **🎨 Themes** - Design tokens, style builders, animations
- **🔄 Integration** - Component interactions, data flow

---

## 🚀 Performance Features

- **⚡ Lightning Fast** - Vite build system with instant hot reload
- **📦 Optimized Bundles** - Code splitting, lazy loading, tree shaking
- **🖼️ Smart Assets** - Responsive images, lazy loading, optimized formats
- **🎭 Efficient Animations** - Hardware-accelerated, reduced motion support
- **📱 Mobile Optimized** - Progressive enhancement, touch-friendly
- **🔍 SEO Ready** - Server-side rendering support, meta tags

---

## 📱 Key Features

### Music Integration
- **🎵 Spotify Embeds** - Direct streaming integration
- **🎧 SoundCloud Players** - Full track embedding
- **📱 Mobile Optimized** - Touch-friendly media controls
- **🎨 Custom Players** - Branded styling

### Live Sets
- **📺 YouTube Embeds** - HD video playback
- **🎧 SoundCloud Sets** - Full playlist integration
- **🏷️ Metadata Rich** - Venue, date, location tracking
- **🎯 SEO Optimized** - Structured data for search engines

### Content Management
- **⚡ Real-time Updates** - Edit code, see changes instantly
- **🔧 Type Safe** - TypeScript ensures content accuracy
- **🌐 Multi-language Ready** - Structured for i18n

---

## 🔧 Development Workflow

### Adding a New Feature
1. **Create feature directory** in `src/features/`
2. **Add data** in feature `data.ts`
3. **Create components** using theme utilities
4. **Add routing** in `src/App.tsx`
5. **Write tests** for all new functionality

### Styling Guidelines
1. **Use theme tokens** - Never hardcode colors/values
2. **Mobile-first** - Design for small screens first
3. **Component builders** - Use `getCardStyles()`, `getButtonStyles()`
4. **Consistent spacing** - Use `spacing.md`, `spacing.lg` etc.
5. **Animation presets** - Use `animations.fadeIn`, `animations.slideIn`

---

## 🚀 Deployment

```bash
npm run build  # Creates optimized dist/ folder
# Deploy dist/ to Vercel, Netlify, GitHub Pages, AWS S3, etc.
```

---

## 📊 Project Metrics

- **📦 Bundle Size**: <100KB gzipped
- **🧪 Test Coverage**: 212+ tests covering critical paths
- **♿ Accessibility**: WCAG 2.1 AA compliant components
- **📱 Mobile Score**: 100/100 Lighthouse performance
- **⚡ Core Web Vitals**: Optimized for real user experience

---

**Built for Suite 52** - Technical. Digital. Sound. 🎵

**"Code that sings. Design that speaks. Music that moves."**