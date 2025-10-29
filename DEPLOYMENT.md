# 🚀 Deployment Guide

Complete guide to deploying your 3D portfolio website to various platforms.

## 📋 Pre-Deployment Checklist

Before deploying, make sure you've completed:

- [ ] Updated all personal information (name, email, social links)
- [ ] Added your projects to the Projects section
- [ ] Customized colors and styling to match your brand
- [ ] Added your own images to the Gallery
- [ ] Tested on mobile, tablet, and desktop
- [ ] Optimized images (use WebP format, compress large files)
- [ ] Removed any placeholder or lorem ipsum text
- [ ] Updated meta tags for SEO
- [ ] Tested audio on/off functionality
- [ ] Verified all links work correctly

## 🎯 Recommended: Deploy to Vercel

Vercel is the easiest and best option for Next.js projects.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 3D Portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-portfolio.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration
   - Click "Deploy"

3. **Configure Domain (Optional)**
   - In Vercel dashboard, go to "Settings" → "Domains"
   - Add your custom domain (e.g., `yourname.com`)
   - Follow DNS configuration instructions
   - Vercel automatically provisions SSL certificate

4. **Environment Variables**
   
   If you add any API keys or secrets later:
   - Go to "Settings" → "Environment Variables"
   - Add variables (they won't be exposed to client)
   
   Example:
   ```
   NEXT_PUBLIC_CONTACT_FORM_API=your_api_key
   ```

### Vercel Configuration File (Optional)

Create `vercel.json` for advanced settings:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*).(glb|gltf)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 🌊 Deploy to Netlify

### Method 1: Git Integration

1. **Push to GitHub** (same as above)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Configure build settings:
     ```
     Build command: npm run build
     Publish directory: .next
     ```
   - Click "Deploy"

3. **Configure Domain**
   - Go to "Domain settings"
   - Add custom domain
   - Update DNS records

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/*.glb"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 🔥 Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```
   
   Select:
   - Public directory: `out`
   - Configure as single-page app: Yes
   - Set up automatic builds: No (or Yes for GitHub Actions)

4. **Update next.config.js** for static export:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   }
   
   module.exports = nextConfig
   ```

5. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## ☁️ Deploy to AWS Amplify

1. **Push to GitHub**

2. **Go to AWS Amplify Console**
   - Select "Host web app"
   - Connect GitHub repository
   - Amplify auto-detects Next.js

3. **Build Settings** (auto-configured):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. **Deploy**
   - Click "Save and deploy"
   - Amplify builds and deploys automatically

## 🐳 Deploy with Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

Update `next.config.js`:

```javascript
const nextConfig = {
  output: 'standalone',
  // ... other configs
}
```

**Build and run**:
```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

## 🎨 Static Export (GitHub Pages, etc.)

For platforms that only support static files:

1. **Update next.config.js**:
   ```javascript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     basePath: '/your-repo-name', // For GitHub Pages
   }
   ```

2. **Build**:
   ```bash
   npm run build
   ```
   
   This creates an `out/` folder with static files.

3. **Deploy to GitHub Pages**:
   ```bash
   # Add gh-pages package
   npm install --save-dev gh-pages
   
   # Add to package.json scripts
   "deploy": "gh-pages -d out"
   
   # Deploy
   npm run deploy
   ```

## 📊 Performance Optimization

### Image Optimization

```bash
# Install Sharp (if using Next.js Image component)
npm install sharp

# Use WebP format
# In public/ folder, convert images:
# brew install webp (Mac)
# sudo apt install webp (Linux)

cwebp input.jpg -q 80 -o output.webp
```

### 3D Model Optimization

Use [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline):

```bash
npm install -g gltf-pipeline

# Compress .glb file
gltf-pipeline -i model.glb -o model-compressed.glb --draco.compressionLevel=10
```

### Bundle Analysis

```bash
# Install bundle analyzer
npm install @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true npm run build
```

## 🔒 Security Headers

Add to `next.config.js`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

## 📈 Analytics Integration

### Google Analytics

1. **Get GA4 tracking ID**

2. **Add to app/layout.jsx**:
   ```javascript
   import Script from 'next/script'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <head>
           <Script
             src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
             strategy="afterInteractive"
           />
           <Script id="google-analytics" strategy="afterInteractive">
             {`
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
               gtag('config', 'G-XXXXXXXXXX');
             `}
           </Script>
         </head>
         <body>{children}</body>
       </html>
     )
   }
   ```

### Vercel Analytics

```bash
npm install @vercel/analytics

# Add to app/layout.jsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🐛 Troubleshooting Deployment Issues

### Build Fails

**Error**: Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error**: Out of memory
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 3D Models Not Loading

- Ensure files are in `public/` folder
- Check file paths (case-sensitive on Linux)
- Verify MIME types in server config
- Check CORS headers

### Performance Issues

- Enable compression in hosting platform
- Use CDN for static assets
- Implement lazy loading
- Reduce 3D scene complexity for mobile

### Audio Not Working

- Browsers block autoplay - require user interaction first
- Check audio file formats (MP3 is widely supported)
- Verify file paths
- Test MIME types

## 📞 Post-Deployment

### Testing

- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (iOS and Android)
- [ ] Check all links
- [ ] Verify analytics tracking
- [ ] Test contact form
- [ ] Check page speed: [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Test WebGL performance: [WebGL Report](https://webglreport.com/)

### SEO

- [ ] Submit to Google Search Console
- [ ] Create and submit sitemap
- [ ] Set up Google Analytics
- [ ] Add structured data (JSON-LD)
- [ ] Verify Open Graph tags
- [ ] Test with [Rich Results Test](https://search.google.com/test/rich-results)

### Monitoring

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Enable error tracking (Sentry)
- [ ] Monitor Core Web Vitals
- [ ] Set up performance budgets

## 🎉 You're Live!

Congratulations on deploying your portfolio! 🚀

Share it with:
- LinkedIn
- Twitter
- Reddit (r/webdev, r/web_design)
- Dev.to
- Designer News
- Hacker News (Show HN)

## 🔄 Continuous Deployment

Set up auto-deployment on git push:

**Vercel**: Automatically deploys on push to main branch

**GitHub Actions** (for other platforms):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

---

**Need help?** Open an issue on GitHub or check the troubleshooting section!

