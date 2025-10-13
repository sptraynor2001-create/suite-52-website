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

```
suite-52-website/
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Root component with routing
│   ├── index.css             # Global styles (Tailwind)
│   ├── components/           # Reusable components
│   │   └── Navigation.tsx    # Site navigation
│   ├── pages/                # Route components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Music.tsx
│   │   ├── LiveSets.tsx
│   │   ├── Shows.tsx
│   │   ├── Contact.tsx
│   │   └── EPK.tsx
│   ├── data/                 # Content data files
│   │   ├── songs.ts
│   │   ├── liveSets.ts
│   │   ├── shows.ts
│   │   └── social.ts
│   └── types/                # TypeScript definitions
│       └── index.ts
├── public/                   # Static assets
│   └── images/              # Image storage
├── docs/                    # Documentation
└── dist/                    # Production build (ignored)
```

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

Located in `src/types/index.ts`:

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
1. Define in `src/types/index.ts`
2. Export for use across app
3. Import where needed

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

### New Content Type
1. Define TypeScript interface in `src/types/index.ts`
2. Create data file in `src/data/`
3. Create page component in `src/pages/`
4. Add route in `src/App.tsx`
5. Add to navigation if public
6. Document in CONTENT.md

### New Page
1. Create component in `src/pages/PageName.tsx`
2. Add route in `src/App.tsx`
3. Add to navigation in `src/components/Navigation.tsx`
4. Test on mobile and desktop

### New Component
1. Create in `src/components/ComponentName.tsx`
2. Export as default
3. Import where needed
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
// ✅ Do: Group by feature
pages/Music/
  ├── Music.tsx
  ├── SongCard.tsx
  └── types.ts

// ❌ Don't: Random organization
components/
  ├── Component1.tsx
  ├── random-helper.ts
  └── Component2.tsx
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

