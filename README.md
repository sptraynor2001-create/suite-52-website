# Suite 52 Website

Modern single-page website for Suite 52 - Producer / DJ / Artist. Built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ Single-page app (no URL changes between sections)
- ✅ Full TypeScript support with type safety
- ✅ Ubuntu Mono monospace font for technical aesthetic
- ✅ Grayscale design with poker red accents
- ✅ Sticky navigation with smooth transitions
- ✅ Easy content management (no database)
- ✅ Fast performance with Vite
- ✅ Mobile-optimized for Instagram/TikTok bio links

## Quick Start

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit http://localhost:5174 (or 5173)

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

**Feature-based modular architecture** for easy scaling:

```
suite-52-website/
├── src/
│   ├── features/           # Self-contained feature modules
│   │   ├── home/           # Home page (Suite 52 title)
│   │   ├── music/          # Music releases
│   │   ├── shows/          # Show listings
│   │   ├── live-sets/      # Live set recordings
│   │   ├── about/          # Artist bio
│   │   ├── contact/        # Contact & socials
│   │   └── epk/            # EPK (separate URL)
│   ├── shared/             # Shared resources
│   │   └── components/     # Navigation, atoms
│   ├── design/             # Design system
│   │   ├── colors.ts       # Color palette
│   │   ├── gradients.ts    # Gradients
│   │   ├── tokens.ts       # Design tokens
│   │   └── fonts.ts        # Font system (10 options)
│   └── App.tsx             # Root app
├── public/
│   ├── favicon.svg         # Music note icon
│   └── images/             # Static images
├── docs/                   # Documentation
│   ├── CONTENT.md          # Content management
│   ├── DESIGN.md           # Design system
│   ├── IMAGES.md           # Image guidelines
│   ├── DEPLOYMENT.md       # Deploy instructions
│   └── DEVELOPMENT.md      # Technical docs
└── README.md               # This file
```

## Navigation

Single-page app with instant content switching (no page reloads):

| Section | Description |
|---------|-------------|
| **HOME** | Landing page with artist title |
| **MUSIC** | Song releases with streaming links |
| **SHOWS** | Upcoming and past shows |
| **LIVE SETS** | Live performances and DJ sets |
| **ABOUT** | Artist bio and information |
| **CONTACT** | Contact info and social links |
| **EPK** | `/epk` - Separate URL, hidden from nav |

**Navigation order:** HOME → MUSIC → SHOWS → LIVE SETS → ABOUT → CONTACT

## Design System

### Colors
- **Background:** Pure black (#000000)
- **Text:** White (#ffffff)
- **Active tab:** Poker red (#e63946)
- **Mode:** Grayscale (color palette preserved in comments)

### Typography
- **Font:** Ubuntu Mono (monospace)
- **Style:** Technical, futuristic, IDE-inspired
- **Alternates:** 10 fonts available in `src/design/fonts.ts`

### Navigation States
- **Normal:** White text, straight
- **Hover:** White underline appears
- **Active:** Red italic text (selected page)

## Managing Content

### Add a Song
1. Upload album art to `public/images/songs/`
2. Edit `src/features/music/data.ts`
3. Add entry with title, date, streaming links
4. Deploy

### Add a Live Set
1. Upload thumbnail to `public/images/livesets/`
2. Edit `src/features/live-sets/data.ts`
3. Add entry with video/audio links
4. Deploy

### Add a Show
1. (Optional) Upload poster to `public/images/shows/`
2. Edit `src/features/shows/data.ts`
3. Add venue, date, ticket link
4. Deploy

### Update Contact Info
Edit `src/features/contact/data.ts`:
- Instagram: @suite52sounds
- Email: suite52sounds@gmail.com

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS + inline styles
- **Routing:** React Router (EPK only)
- **State:** React hooks (no external state management)
- **Deployment:** Static site (any host)

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app logic & page switching |
| `src/shared/components/Navigation.tsx` | Header navigation |
| `src/design/fonts.ts` | Font system (Ubuntu Mono + 9 alternates) |
| `src/design/colors.ts` | Color palette (grayscale mode) |
| `src/features/*/data.ts` | Content data files |
| `public/favicon.svg` | Music note icon |

## Development

### Console Logging
Extensive logging for debugging:
- 📐 Navigation dimensions
- 🖱️ Hover events
- 🔗 Navigation clicks
- 🏠 Page mounting
- 📱 Viewport info
- 🔤 Font loading

### Architecture
- **Atomic design** with color/gradient/token files
- **Feature modules** with self-contained data/types/components
- **Single-page** with instant tab switching
- **Sticky navigation** always visible
- **Forced scrollbar** prevents layout shift

## Documentation

- 📄 **CONTENT.md** - How to manage content
- 🎨 **DESIGN.md** - Design system details
- 🖼️ **IMAGES.md** - Image specs and optimization
- 🚀 **DEPLOYMENT.md** - Hosting and deployment
- 💻 **DEVELOPMENT.md** - Technical architecture

## Contact

- **Instagram:** [@suite52sounds](https://instagram.com/suite52sounds)
- **Email:** suite52sounds@gmail.com

---

Built with precision for Suite 52. Technical. Digital. Sound.
