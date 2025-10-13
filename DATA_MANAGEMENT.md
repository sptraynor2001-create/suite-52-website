# Data Management Guide

This guide explains how to easily add and manage content on your Suite 52 website.

## 📁 File Structure

```
src/
  data/           # All your content lives here
    songs.ts      # Music releases
    shows.ts      # Show dates and venues
    social.ts     # Social media links
  types/
    index.ts      # TypeScript type definitions
  pages/          # Page components
  components/     # Reusable components
```

## 🎵 Adding New Songs

Edit `src/data/songs.ts`:

```typescript
export const songs: Song[] = [
  {
    id: '1',                    // Unique ID
    title: 'Song Name',         // Song title
    artist: 'Suite 52',         // Artist name (optional)
    releaseDate: '2025-01-15',  // Format: YYYY-MM-DD
    coverImage: '/images/songs/cover.jpg',  // Path to album art
    spotifyUrl: 'https://open.spotify.com/track/...',
    appleMusicUrl: 'https://music.apple.com/...',
    youtubeUrl: 'https://youtube.com/watch?v=...',
    description: 'A brief description of your song'
  },
  // Add more songs here...
]
```

### Image Setup for Songs:
1. Add your album art to `public/images/songs/`
2. Recommended size: 800x800px or 1000x1000px
3. Format: JPG, PNG, or WebP
4. Reference it: `/images/songs/your-cover.jpg`

## 🎤 Adding Shows

Edit `src/data/shows.ts`:

```typescript
export const shows: Show[] = [
  {
    id: '1',                       // Unique ID
    date: '2025-03-15',            // Format: YYYY-MM-DD
    venue: 'The Example Venue',    // Venue name
    city: 'Los Angeles',           // City
    state: 'CA',                   // State (optional)
    country: 'USA',                // Country (optional)
    time: '8:00 PM',               // Show time (optional)
    ticketUrl: 'https://tickets.example.com',  // Ticket link
    description: 'Special show description',   // (optional)
    image: '/images/shows/venue.jpg',          // (optional)
    isSoldOut: false               // Set to true if sold out
  },
  // Add more shows here...
]
```

### Image Setup for Shows:
1. Add venue/poster images to `public/images/shows/`
2. Recommended size: 1200x800px
3. Reference it: `/images/shows/your-image.jpg`

## 🔗 Updating Social Links

Edit `src/data/social.ts`:

```typescript
export const socialLinks: SocialLinks = {
  instagram: 'https://instagram.com/yourhandle',
  tiktok: 'https://tiktok.com/@yourhandle',
  spotify: 'https://open.spotify.com/artist/...',
  youtube: 'https://youtube.com/@yourhandle',
  facebook: 'https://facebook.com/yourpage',
  twitter: 'https://twitter.com/yourhandle',
}
```

## 🖼️ Managing Images

### Folder Structure:
```
public/images/
  songs/         # Album covers
  shows/         # Show posters, venue photos
  backgrounds/   # Background images for pages
  band/          # Band photos, press photos
```

### Best Practices:
- **Compress images** before uploading (use tools like TinyPNG)
- **Use descriptive names**: `album-cover-sunset.jpg` not `IMG_1234.jpg`
- **Recommended formats**: WebP for best quality/size ratio, JPG/PNG as fallbacks
- **Mobile optimization**: All images automatically scale on mobile devices

### Recommended Sizes:
- Album covers: 800x800px to 1000x1000px
- Show images: 1200x800px (landscape)
- Background images: 1920x1080px or larger
- Band photos: 1200x800px

## 📱 Mobile Optimization

All pages are automatically mobile-responsive! The design includes:
- ✅ Responsive navigation with hamburger menu
- ✅ Touch-friendly buttons and links
- ✅ Optimized layouts for small screens
- ✅ Fast loading times
- ✅ Instagram/TikTok bio link optimized

## 🚀 Quick Start Workflow

1. **Add a new song:**
   - Upload album art to `public/images/songs/`
   - Add song entry to `src/data/songs.ts`
   - Save and the website updates automatically!

2. **Add a new show:**
   - (Optional) Upload show image to `public/images/shows/`
   - Add show entry to `src/data/shows.ts`
   - Include ticket link
   - Save and it appears on the Shows page!

3. **Update social links:**
   - Edit `src/data/social.ts`
   - Links appear on Contact page automatically

## 💡 Tips

- **Dates:** Always use YYYY-MM-DD format (2025-01-15)
- **IDs:** Use simple unique IDs like '1', '2', '3' or descriptive ones like 'song-sunset'
- **URLs:** Always include `https://` in links
- **Testing:** Run `npm run dev` to test locally before deploying
- **Deployment:** Changes pushed to GitHub deploy automatically

## 🎨 Customization

Want to change colors, fonts, or styling? All visual design uses Tailwind CSS.
Edit the components in `src/pages/` and `src/components/` to customize the look.

## ❓ Need Help?

- Check `public/images/README.md` for image guidelines
- TypeScript will show you errors if data format is wrong
- All fields marked "optional" can be omitted

