# Content Management Guide

Complete guide for managing all website content without touching code.

## Quick Reference

| Content Type | File | Folder |
|-------------|------|--------|
| Songs | `src/features/music/data.ts` | `public/images/songs/` |
| Live Sets | `src/features/live-sets/data.ts` | `public/images/livesets/` |
| Shows | `src/features/shows/data.ts` | `public/images/shows/` |
| Social Links | `src/features/contact/data.ts` | N/A |

## Adding Songs

**File:** `src/features/music/data.ts`

```typescript
export const songs: Song[] = [
  {
    id: '1',                                    // Unique identifier
    title: 'Your Song Title',                   // Required
    artist: 'Suite 52',                         // Optional
    releaseDate: '2025-01-15',                  // Required: YYYY-MM-DD
    coverImage: '/images/songs/cover.jpg',      // Optional
    spotifyUrl: 'https://open.spotify.com/...',// Optional
    appleMusicUrl: 'https://music.apple.com/...',// Optional
    youtubeUrl: 'https://youtube.com/...',      // Optional
    description: 'Brief description'            // Optional
  },
  // Add more songs...
]
```

**Steps:**
1. Upload album art to `public/images/songs/`
2. Add new entry to songs array
3. Save file - changes appear automatically

**Image specs:**
- Size: 800x800px to 1000x1000px
- Format: JPG, PNG, or WebP
- Compress before uploading

## Adding Live Sets

**File:** `src/features/live-sets/data.ts`

```typescript
export const liveSets: LiveSet[] = [
  {
    id: '1',                                      // Unique identifier
    title: 'Live Set Name',                       // Required
    date: '2025-02-15',                          // Required: YYYY-MM-DD
    venue: 'Venue Name',                          // Optional
    city: 'Los Angeles',                          // Optional
    duration: '60 minutes',                       // Optional
    thumbnail: '/images/livesets/thumb.jpg',     // Optional
    youtubeUrl: 'https://youtube.com/...',       // Optional
    soundcloudUrl: 'https://soundcloud.com/...', // Optional
    mixcloudUrl: 'https://mixcloud.com/...',     // Optional
    spotifyUrl: 'https://spotify.com/...',       // Optional
    description: 'Set description',               // Optional
    setlist: [                                    // Optional
      'Track 1',
      'Track 2',
      'Track 3'
    ]
  },
  // Add more live sets...
]
```

**Steps:**
1. Upload thumbnail to `public/images/livesets/`
2. Add new entry to liveSets array
3. Include video/audio links
4. Save file

**Image specs:**
- Size: 1280x720px (16:9 ratio)
- Format: JPG, PNG, or WebP
- Use video screenshot or custom thumbnail

## Adding Shows

**File:** `src/features/shows/data.ts`

```typescript
export const shows: Show[] = [
  {
    id: '1',                                  // Unique identifier
    date: '2025-03-15',                       // Required: YYYY-MM-DD
    venue: 'The Venue Name',                  // Required
    city: 'Los Angeles',                      // Required
    state: 'CA',                              // Optional
    country: 'USA',                           // Optional
    time: '8:00 PM',                          // Optional
    ticketUrl: 'https://tickets.com/...',    // Optional
    description: 'Special event info',        // Optional
    image: '/images/shows/poster.jpg',       // Optional
    isSoldOut: false                          // Optional: true/false
  },
  // Add more shows...
]
```

**Steps:**
1. (Optional) Upload show poster to `public/images/shows/`
2. Add new entry to shows array
3. Include ticket purchase link
4. Save file

**Image specs:**
- Size: 1200x800px (landscape)
- Format: JPG, PNG, or WebP

**Notes:**
- Shows automatically sort by date
- Past shows display separately from upcoming
- Mark sold out shows with `isSoldOut: true`

## Updating Social Links

**File:** `src/features/contact/data.ts`

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

**Steps:**
1. Update URLs in social.ts
2. Save file
3. Links appear on Contact page

## Data Format Rules

### Dates
Always use ISO format: `YYYY-MM-DD`
- ✅ Correct: `'2025-03-15'`
- ❌ Wrong: `'3/15/2025'` or `'March 15, 2025'`

### URLs
Always include protocol (https://)
- ✅ Correct: `'https://spotify.com/...'`
- ❌ Wrong: `'spotify.com/...'` or `'www.spotify.com'`

### IDs
Use simple, unique identifiers
- ✅ Correct: `'1'`, `'2'`, `'song-sunset'`
- ❌ Wrong: Duplicate IDs across items

### Images
Use forward slashes, start with `/images/`
- ✅ Correct: `'/images/songs/cover.jpg'`
- ❌ Wrong: `'images/songs/cover.jpg'` or `'./images/...'`

## Content Workflow

### Typical Song Release
1. Export album art (1000x1000px)
2. Compress image (TinyPNG, ImageOptim)
3. Upload to `public/images/songs/album-name.jpg`
4. Add entry to `src/features/music/data.ts`
5. Include all streaming links
6. Save and test locally (`npm run dev`)
7. Commit and push to deploy

### Typical Show Announcement
1. (Optional) Create show poster
2. Upload to `public/images/shows/`
3. Add entry to `src/features/shows/data.ts`
4. Include ticket link and venue details
5. Save and push to deploy

### Typical Live Set Upload
1. Upload video to YouTube/SoundCloud
2. Take screenshot for thumbnail
3. Upload thumbnail to `public/images/livesets/`
4. Add entry to `src/features/live-sets/data.ts`
5. Include video links and optional setlist
6. Save and push to deploy

## Tips & Best Practices

### Required vs Optional
- Only `id`, `title`, and `date` are truly required
- Add as much detail as you have
- Can always update entries later

### Image Optimization
- Compress before uploading (50-80% file size reduction)
- Tools: TinyPNG, ImageOptim, Squoosh
- WebP format best for quality/size ratio
- Always keep original hi-res versions

### Maintaining Order
- Songs: Display by release date (newest first)
- Live Sets: Display by date (newest first)
- Shows: Automatically split upcoming/past

### Testing Changes
```bash
npm run dev          # Test locally at localhost:5173
npm run build        # Check for errors before deploy
```

### Multiple Editors
- Only edit one file at a time
- Always pull latest changes before editing
- Coordinate with team on major updates

## Troubleshooting

### Image Not Showing
- Check file path starts with `/images/`
- Verify file exists in `public/images/`
- Check file name matches exactly (case-sensitive)
- Clear browser cache

### Date Not Formatting
- Must be YYYY-MM-DD format
- Check for typos
- Dates before 1970 may have issues

### Link Not Working
- Include `https://` protocol
- Test link in browser first
- Check for trailing spaces

### Build Errors
- Run `npm run build` to see specific error
- Check for missing commas between entries
- Verify all quotes are closed
- Look for TypeScript red underlines in editor

