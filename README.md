# Suite 52 Website

Modern, mobile-optimized website for Suite 52. Built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ Full TypeScript support with type safety
- ✅ Mobile-first responsive design
- ✅ Easy content management (no database)
- ✅ Fast performance with Vite
- ✅ Automatic deployment ready
- ✅ Optimized for Instagram/TikTok bio links

## Quick Start

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit http://localhost:5173

### Build
```bash
npm run build
```
Outputs to `dist/` folder

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
suite-52-website/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route pages
│   ├── data/               # Content data files
│   │   ├── songs.ts        # Music releases
│   │   ├── liveSets.ts     # Live performances
│   │   ├── shows.ts        # Show dates
│   │   └── social.ts       # Social links
│   ├── types/              # TypeScript definitions
│   └── App.tsx             # Root component
├── public/
│   └── images/             # Static images
├── docs/                   # Documentation
│   ├── CONTENT.md          # Content management
│   ├── IMAGES.md           # Image guidelines
│   ├── DEPLOYMENT.md       # Deploy instructions
│   └── DEVELOPMENT.md      # Technical docs
└── README.md               # This file
```

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero section |
| About | `/about` | Band information and bio |
| Music | `/music` | Song releases with streaming links |
| Live Sets | `/live-sets` | Live performances and DJ sets |
| Shows | `/shows` | Upcoming and past shows |
| Contact | `/contact` | Contact info and social links |
| EPK | `/epk` | Hidden press kit (no navigation) |

## Managing Content

### Add a Song
1. Upload album art to `public/images/songs/`
2. Edit `src/data/songs.ts`
3. Add entry with title, date, streaming links
4. Save and deploy

### Add a Live Set
1. Upload thumbnail to `public/images/livesets/`
2. Edit `src/data/liveSets.ts`
3. Add entry with video links
4. Save and deploy

### Add a Show
1. (Optional) Upload poster to `public/images/shows/`
2. Edit `src/data/shows.ts`
3. Add venue, date, ticket link
4. Save and deploy

### Update Social Links
1. Edit `src/data/social.ts`
2. Update URLs
3. Save and deploy

**📖 See [docs/CONTENT.md](docs/CONTENT.md) for complete guide**

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript 5 | Type safety |
| Vite 7 | Build tool |
| Tailwind CSS 3 | Styling |
| React Router 6 | Routing |

## Documentation

### For Content Managers
- **[CONTENT.md](docs/CONTENT.md)** - How to add songs, shows, live sets
- **[IMAGES.md](docs/IMAGES.md)** - Image specs and optimization

### For Developers
- **[DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Technical documentation
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deploy to production

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Click Deploy
4. Done! Auto-deploys on every push

### Netlify
1. Push to GitHub
2. Import on [netlify.com](https://netlify.com)
3. Build settings auto-detected
4. Deploy

### Other Options
- Cloudflare Pages
- GitHub Pages
- Any static host

**📖 See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete guide**

## Mobile Optimization

Built mobile-first for maximum compatibility:

- Responsive navigation with hamburger menu
- Touch-friendly buttons (min 44x44px)
- Optimized images for mobile networks
- Fast loading times (< 2s)
- Perfect for Instagram/TikTok bio links

Tested on:
- iOS Safari (iPhone/iPad)
- Android Chrome
- Desktop browsers (Chrome, Safari, Firefox)

## Image Management

### Folder Structure
```
public/images/
├── songs/          # Album covers (800x800px)
├── livesets/       # Video thumbnails (1280x720px)
├── shows/          # Show posters (1200x800px)
├── backgrounds/    # Page backgrounds (1920x1080px)
└── band/           # Press photos (1200x800px)
```

### Best Practices
- Compress images before upload (use TinyPNG, Squoosh)
- Use descriptive filenames: `album-name.jpg`
- Recommended format: WebP for modern browsers, JPG fallback
- Keep file sizes under 300KB

**📖 See [docs/IMAGES.md](docs/IMAGES.md) for complete guide**

## Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-page

# 2. Make changes
npm run dev

# 3. Test build
npm run build
npm run preview

# 4. Commit and push
git add .
git commit -m "Add new page"
git push origin feature/new-page

# 5. Create pull request
# 6. Merge and auto-deploy
```

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/PageName.tsx`
2. Add route in `src/App.tsx`
3. Add to navigation in `src/components/Navigation.tsx`
4. Test mobile responsiveness

### Customizing Styles
- Edit Tailwind classes in components
- Modify `tailwind.config.js` for theme changes
- Add custom CSS to `src/index.css` (sparingly)

### Updating Content
- All content in `src/data/` files
- No database required
- TypeScript ensures data format correctness

## TypeScript

Strict type checking prevents errors:

```typescript
// Type safety for all data
interface Song {
  id: string
  title: string
  releaseDate: string
  // ... more fields
}

// Editor shows errors immediately
const song: Song = {
  id: '1',
  title: 'Song Name',
  // Missing releaseDate - TypeScript error!
}
```

## Performance

### Built-in Optimizations
- ✅ Code splitting by route
- ✅ Tree shaking (removes unused code)
- ✅ CSS minification
- ✅ Asset optimization
- ✅ Lazy loading images

### Lighthouse Score Goals
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Safari | Last 2 versions |
| Firefox | Last 2 versions |
| Edge | Last 2 versions |
| iOS Safari | Last 2 versions |
| Android Chrome | Last 2 versions |

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with clear commits
4. Test thoroughly
5. Submit pull request

## License

All rights reserved - Suite 52

## Support

- 📖 **Documentation:** See `docs/` folder
- 🐛 **Issues:** Open GitHub issue
- 💬 **Questions:** Contact development team

## Resources

### Official Docs
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Tools
- [Squoosh](https://squoosh.app) - Image optimization
- [TinyPNG](https://tinypng.com) - PNG/JPG compression
- [Can I Use](https://caniuse.com) - Browser compatibility

---

**Built with ❤️ for Suite 52**
