# Suite 52 Website

A modern, mobile-responsive website built with React, TypeScript, and Tailwind CSS. Optimized for Instagram and TikTok bio links.

## 🚀 Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

## 📱 Features

- ✅ Fully mobile-responsive design
- ✅ Easy content management (no database needed)
- ✅ TypeScript for type safety
- ✅ Fast loading and optimized for mobile networks
- ✅ SEO-friendly routing
- ✅ Hidden EPK page (accessible only by direct URL)

## 🎯 Pages

- **Home** - Landing page with hero section
- **About** - Band information and bio
- **Music** - Song releases with streaming links
- **Live Sets** - Live performances, DJ sets, and recorded sessions
- **Shows** - Upcoming and past shows with ticket links
- **Contact** - Contact info and social links
- **EPK** - Hidden press kit page (accessible at `/epk`)

## 🏃 Quick Start

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Visit `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📝 Managing Content

All content is managed through simple TypeScript files - no database needed!

### Adding Songs
Edit `src/data/songs.ts` to add new music releases with streaming links.

### Adding Live Sets
Edit `src/data/liveSets.ts` to add live performances and DJ sets with video/audio links.

### Adding Shows
Edit `src/data/shows.ts` to add show dates, venues, and ticket links.

### Updating Social Links
Edit `src/data/social.ts` to update your social media links.

**📖 For detailed instructions, see [DATA_MANAGEMENT.md](./DATA_MANAGEMENT.md)**

## 🖼️ Managing Images

Store images in organized folders:
- `public/images/songs/` - Album covers
- `public/images/livesets/` - Live set thumbnails and video screenshots
- `public/images/shows/` - Show posters and venue photos
- `public/images/backgrounds/` - Background images
- `public/images/band/` - Band photos

**📖 For image guidelines, see [public/images/README.md](./public/images/README.md)**

## 📱 Mobile Optimization

This website is optimized for mobile devices:
- Responsive navigation with hamburger menu
- Touch-friendly buttons and links
- Optimized images for mobile networks
- Fast loading times
- Perfect for Instagram/TikTok bio links

## 🔒 Hidden EPK Page

The Electronic Press Kit page is hidden from navigation but accessible at:
```
yourdomain.com/epk
```

Share this URL directly with press, venues, and industry professionals.

## 🌐 Deployment

This site is configured for easy deployment to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Changes pushed to the `main` branch will automatically deploy if set up with your hosting provider.

## 📦 Project Structure

```
suite-52-website/
├── src/
│   ├── components/      # Reusable components (Navigation, etc.)
│   ├── pages/           # Page components
│   ├── data/            # Content data files
│   │   ├── songs.ts     # Music releases
│   │   ├── liveSets.ts  # Live performances and DJ sets
│   │   ├── shows.ts     # Show information
│   │   └── social.ts    # Social media links
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component with routing
│   └── main.tsx         # Application entry point
├── public/
│   └── images/          # Static images
├── DATA_MANAGEMENT.md   # Detailed content management guide
└── package.json         # Dependencies and scripts
```

## 🛠️ Development

### TypeScript
All files use TypeScript for type safety. The editor will show errors if data format is incorrect.

### Tailwind CSS
Styling uses Tailwind's utility classes. Customize colors and design in component files.

### Hot Module Replacement
Changes to code automatically update in the browser during development.

## 📄 License

All rights reserved - Suite 52

## 🆘 Support

For questions or issues, check:
- [DATA_MANAGEMENT.md](./DATA_MANAGEMENT.md) - Content management guide
- [public/images/README.md](./public/images/README.md) - Image guidelines
