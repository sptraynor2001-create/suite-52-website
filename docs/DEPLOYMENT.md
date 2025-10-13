# Deployment Guide

Complete guide for deploying and hosting your Suite 52 website.

## Quick Deploy

The simplest way to deploy is using a platform that supports automatic deployment:

1. Push code to GitHub
2. Connect GitHub to hosting platform
3. Platform automatically builds and deploys on every push

## Recommended Platforms

### Vercel (Recommended)
**Best for:** Zero-config deployment, excellent performance

**Setup:**
1. Sign up at [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect GitHub repository
4. Click "Deploy"

**Done!** Auto-deploys on every push to main.

**Domain Setup:**
- Add custom domain in Vercel dashboard
- Update DNS records at domain registrar
- SSL certificate automatically provisioned

### Netlify
**Best for:** Simple deployment, great for beginners

**Setup:**
1. Sign up at [netlify.com](https://netlify.com)
2. "Add new site" > "Import from Git"
3. Select GitHub repository
4. Build settings auto-detected
5. Click "Deploy site"

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`

**Domain Setup:**
- Add custom domain in Netlify dashboard
- Follow DNS configuration instructions
- Free SSL included

### GitHub Pages
**Best for:** Free hosting for GitHub repos

**Setup:**
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/suite-52-website"
}
```
3. Run `npm run deploy`
4. Enable Pages in repo settings

**Custom Domain:**
- Add `CNAME` file to `public/` with your domain
- Configure DNS with CNAME record pointing to `username.github.io`

### Cloudflare Pages
**Best for:** Global CDN, great performance

**Setup:**
1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. "Create a project" > Connect GitHub
3. Select repository
4. Configure build:
   - Build command: `npm run build`
   - Build output: `dist`
5. Deploy

## Build Commands

### Local Build
```bash
npm run build
```
Outputs to `dist/` folder

### Preview Build Locally
```bash
npm run preview
```
Serves production build at localhost:4173

### Development Server
```bash
npm run dev
```
Hot-reload server at localhost:5173

## Environment Variables

### Creating .env File
```bash
# .env (add to .gitignore)
VITE_API_KEY=your_api_key_here
VITE_SITE_URL=https://suite52.com
```

### Accessing in Code
```typescript
const apiKey = import.meta.env.VITE_API_KEY
```

### Platform-Specific Setup

**Vercel:**
- Dashboard > Settings > Environment Variables
- Add variables with `VITE_` prefix

**Netlify:**
- Site settings > Build & deploy > Environment
- Add variables

**GitHub Pages:**
- Repository Settings > Secrets and variables > Actions
- Add as secrets

## Custom Domain Setup

### Step 1: Purchase Domain
Buy from: GoDaddy, Namecheap, Google Domains, Cloudflare

### Step 2: DNS Configuration

**For Vercel/Netlify:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com (or netlify domain)

Type: A
Name: @
Value: [Platform IP address]
```

**For Cloudflare Pages:**
- Automatically configured if domain on Cloudflare
- Otherwise, add CNAME to pages.dev domain

### Step 3: SSL Certificate
- All platforms auto-provision SSL (HTTPS)
- Can take 24-48 hours to activate
- No configuration needed

### Step 4: Verification
- Visit your domain (may take time to propagate)
- Check HTTPS works correctly
- Test all pages load

## Deployment Workflow

### Standard Workflow
```bash
# 1. Make changes locally
npm run dev

# 2. Test changes
npm run build
npm run preview

# 3. Commit changes
git add .
git commit -m "Your changes"

# 4. Push to deploy
git push origin main

# 5. Platform auto-deploys (usually 1-2 minutes)
```

### Pre-deployment Checklist
- [ ] Test locally with `npm run dev`
- [ ] Build succeeds with `npm run build`
- [ ] Preview looks correct with `npm run preview`
- [ ] All images load correctly
- [ ] Links work (internal and external)
- [ ] Mobile responsive checked
- [ ] Content data validated
- [ ] No console errors

## Continuous Deployment

### Branch Strategy
```
main (production)       ← Auto-deploys to live site
└── develop (staging)   ← Auto-deploys to staging URL
    └── feature-x       ← Test branches
```

### Preview Deployments
**Vercel/Netlify:**
- Every pull request gets preview URL
- Test changes before merging
- Share preview with team

## Monitoring & Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

```typescript
// src/main.tsx
import { inject } from '@vercel/analytics';
inject();
```

### Google Analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (Privacy-friendly)
```html
<!-- Add to index.html -->
<script defer data-domain="suite52.com" src="https://plausible.io/js/script.js"></script>
```

## Performance Optimization

### Build Optimization
Already configured:
- ✅ Vite production optimization
- ✅ Code splitting
- ✅ CSS minification
- ✅ Tree shaking

### Image Optimization
- Use WebP format where possible
- Compress before upload (see IMAGES.md)
- Lazy load images below fold

### Caching Strategy
Automatic with Vercel/Netlify:
- HTML: No cache (always fresh)
- JS/CSS: Cache with hash (1 year)
- Images: Cache with headers

## Rollback & Versioning

### Vercel Rollback
1. Dashboard > Deployments
2. Find previous good deployment
3. Click "..." > "Promote to Production"

### Netlify Rollback
1. Deploys tab
2. Select previous deploy
3. Click "Publish deploy"

### Git Rollback
```bash
# Rollback to specific commit
git revert HEAD
git push origin main

# Or reset to previous version
git reset --hard commit-hash
git push origin main --force
```

## Troubleshooting

### Build Fails

**Check build logs:**
- Look for TypeScript errors
- Check missing dependencies
- Verify file paths

**Common fixes:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Update dependencies
npm update

# Check for syntax errors
npm run build
```

### Site Not Updating

**Solutions:**
1. Check deployment status in dashboard
2. Hard refresh browser (Cmd/Ctrl + Shift + R)
3. Clear CDN cache in platform settings
4. Verify commit pushed to correct branch

### 404 Errors

**React Router fix:**
Add to platform configuration:

**Vercel** - Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Netlify** - Create `public/_redirects`:
```
/*    /index.html   200
```

### Images Not Loading

**Check:**
- File paths start with `/images/`
- Files exist in `public/images/`
- File names match exactly (case-sensitive)
- Images included in git commit

## Security

### Environment Secrets
- Never commit `.env` file
- Use platform environment variables
- Rotate API keys periodically

### HTTPS
- Always use HTTPS (automatic with platforms)
- Force HTTPS redirects (usually default)
- Check SSL certificate validity

### Headers
Add security headers in platform config:

**Vercel** - `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## Cost Estimate

### Free Tier (Hobby Projects)
- **Vercel:** Free (100GB bandwidth/month)
- **Netlify:** Free (100GB bandwidth/month)
- **Cloudflare Pages:** Free (unlimited bandwidth)
- **GitHub Pages:** Free (1GB storage)

### Paid Tiers (High Traffic)
- **Vercel Pro:** $20/month (1TB bandwidth)
- **Netlify Pro:** $19/month (400GB bandwidth)
- **Cloudflare Pages:** Pay-as-you-go

**Domain:** $10-15/year
**Total:** $0-20/month depending on traffic

## Platform Comparison

| Feature | Vercel | Netlify | Cloudflare | GitHub Pages |
|---------|--------|---------|------------|--------------|
| Free Tier | ✅ | ✅ | ✅ | ✅ |
| Custom Domain | ✅ | ✅ | ✅ | ✅ |
| Auto SSL | ✅ | ✅ | ✅ | ✅ |
| Preview Deploys | ✅ | ✅ | ✅ | ❌ |
| Edge Functions | ✅ | ✅ | ✅ | ❌ |
| Analytics | ✅ | ✅ | ✅ | ❌ |
| Build Time | Fast | Fast | Fast | Medium |
| CDN | Global | Global | Global | Basic |

