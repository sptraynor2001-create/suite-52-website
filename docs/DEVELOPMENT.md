# Development Guide

Technical reference for developers working on the Suite 52 website.

## Tech Stack

### Core
- **React 18** - UI library with hooks
- **TypeScript 5** - Type-safe JavaScript
- **Vite 7** - Build tool and dev server
- **React Router 6** - Client-side routing

### Styling
- **Tailwind CSS 3** - Utility-first CSS framework
- **PostCSS** - CSS processing

### Type Safety
- **TypeScript** - Full type coverage
- **ESLint** - Code linting

## Project Architecture

**Feature-Based Modular Structure** - Each feature is self-contained and scalable.

```
suite-52-website/
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Root component with routing
│   ├── index.css             # Global styles (Tailwind)
│   ├── features/             # Feature modules (self-contained)
│   │   ├── music/
│   │   │   ├── index.ts      # Public exports
│   │   │   ├── Music.tsx     # Page component
│   │   │   ├── data.ts       # Songs data
│   │   │   └── types.ts      # Music-specific types
│   │   ├── live-sets/
│   │   │   ├── index.ts
│   │   │   ├── LiveSets.tsx
│   │   │   ├── data.ts       # Live sets data
│   │   │   └── types.ts
│   │   ├── shows/
│   │   │   ├── index.ts
│   │   │   ├── Shows.tsx
│   │   │   ├── data.ts       # Shows data
│   │   │   └── types.ts
│   │   ├── contact/
│   │   │   ├── index.ts
│   │   │   ├── Contact.tsx
│   │   │   ├── data.ts       # Social links
│   │   │   └── types.ts
│   │   ├── home/
│   │   │   ├── index.ts
│   │   │   └── Home.tsx
│   │   ├── about/
│   │   │   ├── index.ts
│   │   │   └── About.tsx
│   │   └── epk/
│   │       ├── index.ts
│   │       └── EPK.tsx
│   └── shared/               # Shared across features
│       └── components/
│           ├── index.ts      # Public exports
│           └── Navigation.tsx
├── public/                   # Static assets
│   └── images/              # Image storage
├── docs/                    # Documentation
└── dist/                    # Production build (ignored)
```

### Architecture Benefits
- ✅ **Modular** - Each feature is self-contained
- ✅ **Scalable** - Easy to add new features without touching others
- ✅ **Maintainable** - Changes isolated to feature folders
- ✅ **Clear ownership** - Each feature owns its data and types
- ✅ **Easy testing** - Test features independently

## Development Setup

### Prerequisites
```bash
node --version    # v18+ required
npm --version     # v9+ required
```

### Installation
```bash
# Clone repository
git clone https://github.com/user/suite-52-website.git
cd suite-52-website

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Available Scripts
```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Type System

### Core Types

Located in feature-specific `types.ts` files:

```typescript
interface Song {
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

interface LiveSet {
  id: string
  title: string
  date: string
  venue?: string
  city?: string
  duration?: string
  thumbnail?: string
  youtubeUrl?: string
  soundcloudUrl?: string
  mixcloudUrl?: string
  spotifyUrl?: string
  description?: string
  setlist?: string[]
}

interface Show {
  id: string
  date: string
  venue: string
  city: string
  state?: string
  country?: string
  ticketUrl?: string
  time?: string
  description?: string
  image?: string
  isSoldOut?: boolean
}

interface SocialLinks {
  instagram?: string
  tiktok?: string
  spotify?: string
  appleMusic?: string
  youtube?: string
  facebook?: string
  twitter?: string
}
```

### Adding New Types
1. Define in feature's `types.ts` file (e.g., `src/features/music/types.ts`)
2. Export from feature's `index.ts`
3. Import where needed: `import { Song } from '@/features/music'`

## Component Development

### Component Structure
```tsx
// Standard functional component
function ComponentName() {
  // Hooks at top
  const [state, setState] = useState(initialValue)
  
  // Event handlers
  const handleClick = () => {
    // Logic here
  }
  
  // Render
  return (
    <div className="tailwind classes">
      {/* JSX */}
    </div>
  )
}

export default ComponentName
```

### Props with TypeScript
```tsx
interface Props {
  title: string
  count?: number
  onClick: () => void
}

function Component({ title, count = 0, onClick }: Props) {
  return <button onClick={onClick}>{title}: {count}</button>
}
```

### Common Patterns

**Mapping Arrays:**
```tsx
{songs.map((song) => (
  <div key={song.id}>
    <h2>{song.title}</h2>
  </div>
))}
```

**Conditional Rendering:**
```tsx
{isLoggedIn && <UserProfile />}
{songs.length > 0 ? <SongList /> : <EmptyState />}
```

**Event Handling:**
```tsx
<button onClick={() => handleClick(id)}>
  Click Me
</button>
```

## Routing

### Route Configuration
Located in `src/App.tsx`:

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/music" element={<Music />} />
  <Route path="/live-sets" element={<LiveSets />} />
  <Route path="/shows" element={<Shows />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/epk" element={<EPK />} />
</Routes>
```

### Adding New Route
1. Create page component in `src/pages/`
2. Import in `src/App.tsx`
3. Add `<Route>` element
4. Add to navigation if public

### Navigation Links
```tsx
import { Link } from 'react-router-dom'

<Link to="/about">About</Link>
```

## Styling with Tailwind

### Common Classes
```tsx
// Layout
className="flex items-center justify-between"
className="grid grid-cols-1 md:grid-cols-3 gap-4"
className="max-w-7xl mx-auto px-4"

// Spacing
className="p-4 m-2"           // padding, margin
className="py-8 px-4"         // vertical/horizontal
className="space-y-4"         // gap between children

// Typography
className="text-xl font-bold text-gray-900"
className="text-sm text-gray-600"

// Responsive
className="hidden md:block"   // hide on mobile
className="text-sm md:text-lg" // responsive size
```

### Custom Styles
When Tailwind isn't enough:

```tsx
// Inline styles
<div style={{ backgroundImage: 'url(/images/bg.jpg)' }}>

// Custom CSS (use sparingly)
// Add to src/index.css or component-specific .css file
```

### Tailwind Configuration
Edit `tailwind.config.js` for customization:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        brand: '#your-color',
      },
      fontFamily: {
        custom: ['Your Font', 'sans-serif'],
      },
    },
  },
}
```

## State Management

### Local State (useState)
```tsx
const [isOpen, setIsOpen] = useState(false)
```

### Data Fetching
Currently: Static imports from data files
Future: Add API calls with fetch or Axios

### Global State
Not currently needed. If required:
- React Context for theme/auth
- Zustand for complex state
- TanStack Query for server state

## Adding Features

### New Feature Module
1. Create feature folder: `src/features/my-feature/`
2. Add component: `MyFeature.tsx`
3. Add types: `types.ts` (if needed)
4. Add data: `data.ts` (if needed)
5. Create barrel export: `index.ts`
6. Add route in `src/App.tsx`
7. Add to navigation if public
8. Document in `docs/CONTENT.md`

**Example - Adding "Merch" Feature:**
```
src/features/merch/
├── index.ts           # export { default } from './Merch'
├── Merch.tsx          # Page component
├── types.ts           # interface Product { ... }
└── data.ts            # export const products: Product[]
```

### New Shared Component
1. Create in `src/shared/components/ComponentName.tsx`
2. Export from `src/shared/components/index.ts`
3. Import: `import { ComponentName } from '@/shared/components'`
4. Keep components focused and reusable

## Performance

### Built-in Optimizations
- ✅ Code splitting by route
- ✅ Tree shaking
- ✅ CSS minification
- ✅ Asset optimization

### Image Optimization
```tsx
<img 
  loading="lazy"           // Lazy load below fold
  src="/images/photo.jpg"
  alt="Description"
/>
```

### Bundle Analysis
```bash
npm run build -- --analyze
```

## Testing

### Manual Testing Checklist
- [ ] All routes load correctly
- [ ] Navigation works
- [ ] Images display
- [ ] Links work (internal/external)
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Forms submit (if any)

### Browser Testing
Test in:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Mobile Safari (iOS)
- Mobile Chrome (Android)

## Code Quality

### TypeScript Best Practices
```typescript
// ✅ Do: Explicit types
function greet(name: string): string {
  return `Hello ${name}`
}

// ❌ Don't: 'any' type
function process(data: any) { }

// ✅ Do: Optional chaining
const city = show?.venue?.city

// ✅ Do: Nullish coalescing
const name = song.artist ?? 'Unknown'
```

### React Best Practices
```tsx
// ✅ Do: Destructure props
function Card({ title, description }: Props) { }

// ❌ Don't: Inline object creation in render
{items.map(item => <Card key={item.id} data={{...}} />)}

// ✅ Do: Extract to variable
const cardData = prepareCardData(item)
return <Card key={item.id} data={cardData} />

// ✅ Do: Use key prop in lists
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

### File Organization
```
// ✅ Do: Feature-based (current structure)
features/music/
  ├── index.ts        # Barrel exports
  ├── Music.tsx       # Page component
  ├── data.ts         # Songs data
  └── types.ts        # Music types

// ❌ Don't: Type-based organization
pages/
  └── Music.tsx
data/
  └── songs.ts
types/
  └── musicTypes.ts
```

## Git Workflow

### Branch Naming
```
feature/add-merch-page
fix/navigation-mobile
refactor/update-types
```

### Commit Messages
```bash
# Good commits
git commit -m "Add merch page with product grid"
git commit -m "Fix mobile navigation menu toggle"
git commit -m "Update TypeScript interfaces for shows"

# Bad commits
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with clear messages
5. Push to remote
6. Create PR with description
7. Address review comments
8. Merge when approved

## Troubleshooting

### TypeScript Errors
```bash
# Clear cache
rm -rf node_modules .vite
npm install

# Check for errors
npm run build
```

### Hot Reload Not Working
```bash
# Restart dev server
# (Ctrl+C then npm run dev)

# Or delete .vite folder
rm -rf .vite
```

### Import Errors
```typescript
// ✅ Correct: .tsx extension
import Component from './Component'

// ❌ Wrong: Including extension
import Component from './Component.tsx'
```

## Environment Setup

### VS Code Extensions
Recommended:
- ESLint
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Auto Rename Tag
- Prettier

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Deployment

See **DEPLOYMENT.md** for complete deployment guide.

Quick deploy to Vercel:
```bash
npm install -g vercel
vercel
```

## Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com)

### Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind Play](https://play.tailwindcss.com)
- [Can I Use](https://caniuse.com) - Browser support

### Community
- [React Discord](https://discord.gg/react)
- [TypeScript Discord](https://discord.gg/typescript)
- [Stack Overflow](https://stackoverflow.com)

