# Images Folder Structure

Store your static images in these folders for use throughout the website.

## Folder Organization

- **`songs/`** - Album covers and single artwork
- **`shows/`** - Show posters, venue photos, and event images
- **`backgrounds/`** - Background images for pages and sections
- **`band/`** - Band photos, press photos, and team photos

## Image Recommendations

### For Web Performance:
- Use modern formats: WebP or AVIF when possible (with JPG/PNG fallbacks)
- Optimize images before uploading (compress them)
- Recommended sizes:
  - Song covers: 800x800px
  - Show images: 1200x800px
  - Backgrounds: 1920x1080px (or larger for scroll effects)
  - Band photos: 1200x800px

### Mobile Optimization:
- All images will automatically scale on mobile
- Use aspect ratios that work on vertical screens (9:16 for backgrounds)
- Consider providing mobile-specific versions for critical images

## How to Use Images

In your data files (`src/data/songs.ts`, `src/data/shows.ts`):

```typescript
coverImage: '/images/songs/my-song-cover.jpg'
image: '/images/shows/venue-photo.jpg'
```

In React components:
```tsx
<img src="/images/backgrounds/hero-bg.jpg" alt="Background" />
```

For background images with Tailwind:
```tsx
<div style={{ backgroundImage: 'url(/images/backgrounds/hero.jpg)' }}>
```

