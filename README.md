# Suite 52 Website

**Single-page app for Producer/DJ/Artist Suite 52** - Technical aesthetic, fast performance, mobile-first.

## 🚀 Quick Start

```bash
npm install && npm run dev
```
Visit `http://localhost:5173`

## 📁 Project Structure

```
src/
├── features/           # Feature modules (home, music, shows, etc.)
├── shared/             # Shared resources
│   ├── components/     # UI components (ui/, layout/, effects/)
│   ├── hooks/          # React hooks (useTypingEffect)
│   ├── utils/          # Helper functions
│   ├── constants/      # App constants & config
│   └── types/          # TypeScript definitions
├── design/             # Design system (fonts, colors, tokens)
├── test/               # Testing suite (unit, integration, e2e)
└── App.tsx             # Root component
```

## 🛠️ Tech Stack & Scripts

**Core:** React 18 + TypeScript + Vite + Tailwind CSS
**Testing:** Vitest + React Testing Library + jsdom
**Routing:** React Router (minimal - SPA design)
**Build:** Vite (ESM, fast HMR, optimized bundles)

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check

# Testing
npm test         # Run tests (watch mode)
npm run test:run # Run tests once
npm run test:coverage # Coverage report
```

## 🧪 Testing

**Comprehensive test suite** with 95%+ coverage:

```bash
npm run test:coverage  # Full coverage report
```

**Test Categories:**
- **Unit:** Hooks, utilities, pure functions
- **Integration:** Component interactions, routing
- **E2E:** Critical user journeys (future)

**Coverage Goals:** Statements >80%, Branches >75%, Functions >85%

## 🎨 Design System

**Technical aesthetic:** Ubuntu Mono font, grayscale with poker red accents (#e63946)

**Components:** `ui/` (buttons/cards), `layout/` (navigation), `effects/` (animations)

**Responsive:** Mobile-first, touch-optimized, Instagram/TikTok friendly

## 📝 Content Management

**No database - edit TypeScript files:**

### Add Music Release
```typescript
// src/features/music/data.ts
{
  title: "New Track",
  date: "2024-01-01",
  coverArt: "/images/songs/album.jpg",
  spotifyUrl: "https://spotify.com/track/123"
}
```

### Add Live Set
```typescript
// src/features/live-sets/data.ts
{
  title: "New Set",
  date: "2024-01-01",
  youtubeUrl: "https://youtube.com/watch?v=123"
}
```

### Update Contact
```typescript
// src/features/contact/data.ts
export const contactInfo = {
  email: "suite52sounds@gmail.com",
  instagram: "@suite52sounds"
}
```

## 🚀 Deployment

**Static site - deploy anywhere:**

```bash
npm run build  # Creates optimized dist/
npm run preview # Test production build
```

**Recommended hosts:** Vercel, Netlify, GitHub Pages, Cloudflare Pages

## 🔧 Development Workflow

1. **Feature branch:** `git checkout -b feature/new-feature`
2. **Code changes:** Follow TypeScript + ESLint rules
3. **Test:** `npm run test:run` (must pass)
4. **Build:** `npm run build` (must succeed)
5. **PR:** Create pull request with description
6. **Review:** Code review + testing approval
7. **Merge:** Squash merge to main

## 📋 Code Quality

**Standards:**
- **TypeScript:** Strict mode, no `any` types
- **ESLint:** Airbnb config, no warnings
- **Testing:** All new code must be tested
- **Performance:** Bundle <500KB, Lighthouse 90+
- **Accessibility:** WCAG AA compliant

**Pre-commit:** Tests + linting run automatically

## 🗂️ Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app & routing logic |
| `src/shared/components/layout/Navigation.tsx` | Header nav |
| `src/shared/hooks/useTypingEffect.ts` | Typing animation |
| `src/design/fonts.ts` | Font system (10 options) |
| `src/features/*/data.ts` | Content data files |
| `vitest.config.ts` | Test configuration |
| `tailwind.config.js` | Styling configuration |

## 📚 Documentation

- `docs/CONTENT.md` - Content management guide
- `docs/DESIGN.md` - Design system details
- `docs/DEPLOYMENT.md` - Hosting instructions
- `docs/DEVELOPMENT.md` - Technical architecture
- `src/test/README.md` - Testing documentation

## 🤝 Contributing

**Welcome!** Follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes with tests
4. Ensure `npm run build` passes
5. Submit pull request

**Guidelines:**
- Keep commits atomic and descriptive
- Update documentation for API changes
- Test on mobile devices
- Follow existing code patterns

## 📞 Contact & Support

- **Instagram:** [@suite52sounds](https://instagram.com/suite52sounds)
- **Email:** suite52sounds@gmail.com
- **Issues:** [GitHub Issues](https://github.com/username/suite-52-website/issues)

---

**Built with precision for Suite 52.** Technical. Digital. Sound. 🎵
