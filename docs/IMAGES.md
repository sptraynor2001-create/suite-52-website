# Image Management Guide

Complete guide for managing images, optimization, and best practices.

## Folder Structure

```
public/images/
├── songs/          # Album covers (800x800px)
├── livesets/       # Video thumbnails (1280x720px)
├── shows/          # Show posters (1200x800px)
├── backgrounds/    # Page backgrounds (1920x1080px+)
└── band/           # Press photos (1200x800px)
```

## Image Specifications

### Songs (Album Covers)
- **Purpose:** Display on Music page with streaming links
- **Size:** 800x800px to 1000x1000px (square)
- **Aspect Ratio:** 1:1
- **Format:** JPG (80-90% quality) or WebP
- **Max File Size:** 200KB
- **Naming:** `album-name.jpg` or `single-title.jpg`

### Live Sets (Thumbnails)
- **Purpose:** Video preview images for Live Sets page
- **Size:** 1280x720px (HD)
- **Aspect Ratio:** 16:9
- **Format:** JPG (80-90% quality) or WebP
- **Max File Size:** 300KB
- **Naming:** `setname-venue-date.jpg`
- **Source:** YouTube screenshot or custom thumbnail

### Shows (Posters)
- **Purpose:** Event promotion on Shows page
- **Size:** 1200x800px (landscape)
- **Aspect Ratio:** 3:2
- **Format:** JPG (80-90% quality) or WebP
- **Max File Size:** 300KB
- **Naming:** `venue-date.jpg` or `event-name.jpg`

### Backgrounds
- **Purpose:** Hero sections, page backgrounds
- **Size:** 1920x1080px minimum (larger for parallax)
- **Aspect Ratio:** 16:9 or wider
- **Format:** JPG (70-80% quality) or WebP
- **Max File Size:** 500KB
- **Naming:** `page-name-bg.jpg` or `hero-image.jpg`

### Band Photos
- **Purpose:** About page, press kit
- **Size:** 1200x800px minimum
- **Aspect Ratio:** 3:2 or 4:3
- **Format:** JPG (85-90% quality)
- **Max File Size:** 400KB
- **Naming:** `band-year.jpg` or `press-photo-1.jpg`

## Optimization Workflow

### Step 1: Prepare Image
1. Export at 2x target size (for retina displays)
2. Crop to exact aspect ratio
3. Ensure subject is well-framed
4. Check lighting and colors

### Step 2: Resize
Use one of these methods:
- **Online:** [Squoosh.app](https://squoosh.app)
- **Mac:** Preview > Tools > Adjust Size
- **Windows:** Paint or Photos app
- **CLI:** ImageMagick or Sharp

### Step 3: Compress
Reduce file size without quality loss:
- **TinyPNG** - PNG/JPG compression
- **Squoosh** - Modern formats (WebP, AVIF)
- **ImageOptim** (Mac) - Batch optimization
- **Target:** 50-70% file size reduction

### Step 4: Name & Upload
1. Use descriptive, lowercase names
2. Separate words with hyphens
3. Include relevant keywords
4. Upload to appropriate folder in `public/images/`

## Format Selection Guide

### JPG (JPEG)
**Best for:** Photos, complex images, backgrounds
**Pros:** Universal support, good compression
**Cons:** Lossy compression
**Use when:** Maximum compatibility needed

### PNG
**Best for:** Simple graphics, logos, transparency needs
**Pros:** Lossless, supports transparency
**Cons:** Larger file sizes
**Use when:** Need transparent backgrounds

### WebP
**Best for:** All photos (modern browsers)
**Pros:** Smaller than JPG, better quality
**Cons:** Not supported in older browsers
**Use when:** Building for modern audience

### AVIF
**Best for:** Next-gen optimization
**Pros:** Best compression available
**Cons:** Limited browser support (2023+)
**Use when:** Progressive enhancement strategy

## Mobile Optimization

### Responsive Images
All images automatically scale on mobile devices via Tailwind CSS.

### Best Practices
1. **Optimize for mobile first:** Most traffic will be mobile
2. **Use correct aspect ratios:** Prevents layout shift
3. **Test on actual devices:** Emulators aren't perfect
4. **Consider data usage:** Mobile users may have limited data
5. **Lazy loading:** Built-in for images below fold

### Mobile-Specific Sizes
For critical images, consider mobile versions:
- Album covers: 400x400px version
- Show posters: 600x400px version
- Backgrounds: 1080x1920px (portrait)

## Advanced Techniques

### Responsive Image Sets
```html
<img 
  src="/images/songs/album.jpg"
  srcset="/images/songs/album-400.jpg 400w,
          /images/songs/album-800.jpg 800w,
          /images/songs/album-1200.jpg 1200w"
  sizes="(max-width: 768px) 400px, 800px"
  alt="Album Name"
/>
```

### Background Images with CSS
```tsx
<div 
  className="h-96 bg-cover bg-center"
  style={{ backgroundImage: 'url(/images/backgrounds/hero.jpg)' }}
>
  Content here
</div>
```

### Image Loading States
```tsx
<img 
  src="/images/songs/album.jpg"
  alt="Album"
  loading="lazy"
  onError={(e) => {
    e.currentTarget.src = '/images/placeholder.jpg'
  }}
/>
```

## Batch Processing

### Using ImageMagick (Command Line)
```bash
# Resize all images in folder to 800x800
mogrify -resize 800x800 -path output/ *.jpg

# Convert to WebP
for f in *.jpg; do cwebp -q 85 "$f" -o "${f%.jpg}.webp"; done

# Compress JPGs
jpegoptim --max=85 --strip-all *.jpg
```

### Using Node.js (Sharp)
```javascript
const sharp = require('sharp');

sharp('input.jpg')
  .resize(800, 800)
  .jpeg({ quality: 85 })
  .toFile('output.jpg');
```

## Organization Tips

### Naming Conventions
```
✅ Good:
- sunset-album-cover.jpg
- live-set-la-2025.jpg
- show-poster-march.jpg

❌ Bad:
- IMG_1234.jpg
- photo.jpg
- untitled-1.jpg
```

### Version Control
- Keep originals in separate folder (not in public/)
- Name versions: `photo-original.jpg`, `photo-optimized.jpg`
- Document any edits (crop, filters, adjustments)

### Backup Strategy
- Keep master copies outside project
- Use cloud storage (Google Drive, Dropbox)
- Organize by shoot/session/date

## Common Issues

### Image Not Displaying
**Problem:** Broken image icon shows
**Solutions:**
- Check file path (must start with `/images/`)
- Verify file exists in correct folder
- Check file name (case-sensitive)
- Clear browser cache
- Check file permissions

### Image Too Large
**Problem:** Slow page load
**Solutions:**
- Run through compression tool
- Reduce dimensions if oversized
- Convert to WebP format
- Check file size (aim for <300KB)

### Image Looks Blurry
**Problem:** Poor quality on retina displays
**Solutions:**
- Export at 2x size (1600x1600 for 800x800 display)
- Increase compression quality
- Use WebP instead of JPG
- Check source image quality

### Wrong Aspect Ratio
**Problem:** Image looks stretched or cropped
**Solutions:**
- Crop to exact ratio before upload
- Use CSS `object-fit: cover` or `object-fit: contain`
- Provide images in correct dimensions
- Test on mobile and desktop

## Performance Checklist

Before uploading any image:
- [ ] Resized to appropriate dimensions
- [ ] Compressed to reduce file size
- [ ] Named descriptively with hyphens
- [ ] Tested on mobile and desktop
- [ ] File size under recommended max
- [ ] Aspect ratio matches usage
- [ ] Alt text planned (for accessibility)

## Tools Reference

### Online Tools
- **Squoosh.app** - Best all-in-one optimizer
- **TinyPNG.com** - Quick PNG/JPG compression
- **Compressor.io** - Lossless compression
- **Remove.bg** - Background removal
- **Photopea.com** - Free Photoshop alternative

### Desktop Tools
- **ImageOptim** (Mac) - Batch optimization
- **GIMP** - Free photo editing
- **Photoshop** - Professional editing
- **Figma** - Design and export

### Command Line
- **ImageMagick** - Resize, convert, edit
- **jpegoptim** - JPG optimization
- **pngquant** - PNG optimization
- **cwebp** - WebP conversion

## Quick Reference

| Type | Size | Ratio | Max Size |
|------|------|-------|----------|
| Album Cover | 800-1000px² | 1:1 | 200KB |
| Live Set Thumb | 1280x720px | 16:9 | 300KB |
| Show Poster | 1200x800px | 3:2 | 300KB |
| Background | 1920x1080px | 16:9 | 500KB |
| Band Photo | 1200x800px | 3:2 | 400KB |

