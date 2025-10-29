# 📂 Public Assets Folder

This folder contains all your static assets (images, 3D models, audio files, etc.)

## 📁 Folder Structure

```
public/
├── models/         # 3D models (.glb, .gltf)
├── sounds/         # Audio files (.mp3, .wav)
├── gallery/        # Gallery section images
├── projects/       # Project screenshots
└── vite.svg        # Default favicon (replace this!)
```

## 🎨 Adding Your Assets

### 3D Models

1. Export from Blender/other software as `.glb`
2. Place in `public/models/`
3. Reference in components: `/models/your-model.glb`

**Recommended tools**:
- [Blender](https://www.blender.org/) - Free 3D modeling
- [Sketchfab](https://sketchfab.com/) - Download free models
- [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline) - Compress models

**Model optimization**:
```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Compress model
gltf-pipeline -i model.glb -o model-compressed.glb --draco.compressionLevel=10
```

### Images

**For Gallery** (`gallery/`):
- Recommended size: 1920x1080px
- Format: WebP (best) or JPG
- Keep under 500KB each

**For Projects** (`projects/`):
- Recommended size: 1200x800px
- Format: WebP or JPG
- Keep under 300KB each

**Image optimization**:
```bash
# Convert to WebP (best compression)
# macOS: brew install webp
# Linux: sudo apt install webp

cwebp input.jpg -q 80 -o output.webp
```

### Audio Files

**For Sound Effects** (`sounds/`):
- Format: MP3 (best compatibility)
- Keep under 50KB for UI sounds
- Bitrate: 128kbps is sufficient

**Recommended sounds**:
- `hover.mp3` - Subtle "tick" sound
- `click.mp3` - Satisfying "pop" sound
- `whoosh.mp3` - Transition sound
- `ambient.mp3` - Background music (optional)

**Free sound resources**:
- [Freesound](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [Mixkit](https://mixkit.co/free-sound-effects/)

## 📝 File Naming

Use kebab-case (lowercase with hyphens):
```
✅ Good:
- my-project-screenshot.jpg
- character-model.glb
- hover-sound.mp3

❌ Bad:
- MyProjectScreenshot.jpg
- Character Model.glb
- HoverSound.mp3
```

## 🔗 Referencing Assets in Code

All files in `public/` are available at the root URL:

```javascript
// 3D Models
<primitive object={useGLTF('/models/character.glb').scene} />

// Images
<img src="/gallery/photo1.jpg" alt="Description" />

// Audio
const audio = new Audio('/sounds/hover.mp3')
```

## 💾 Size Guidelines

**Total public folder size**: Keep under 10MB for fast loading

**Individual file limits**:
- 3D models: < 2MB each (compressed)
- Gallery images: < 500KB each
- Project images: < 300KB each
- Audio files: < 50KB for effects, < 5MB for music
- Icons/SVGs: < 10KB each

## 🎯 Required Assets (Placeholders Needed)

Add your own versions of these:

### Favicon
- `favicon.ico` (16x16, 32x32, 48x48)
- `favicon.png` (512x512)

### Open Graph (Social Sharing)
- `og-image.jpg` (1200x630px)

### Models (Optional)
- `models/character.glb` - Replace placeholder character
- `models/desk.glb` - Custom desk model
- `models/laptop.glb` - Laptop model

### Gallery Images (Recommended)
- `gallery/workspace.jpg`
- `gallery/conference.jpg`
- `gallery/team.jpg`
- `gallery/hackathon.jpg`
- `gallery/adventure.jpg`

### Project Screenshots (Required)
- `projects/project1.jpg`
- `projects/project2.jpg`
- `projects/project3.jpg`
- etc.

## 🎨 Image Specifications

### Gallery Photos
```
Format: WebP or JPG
Size: 1920x1080px (16:9 ratio)
Quality: 80-85%
File size: < 500KB
```

### Project Screenshots
```
Format: WebP or JPG
Size: 1200x800px (3:2 ratio)
Quality: 80%
File size: < 300KB
```

### Open Graph Image
```
Format: JPG
Size: 1200x630px
Quality: 90%
File size: < 500KB
```

## 🔧 Optimization Tools

**Online**:
- [TinyPNG](https://tinypng.com/) - Compress images
- [Squoosh](https://squoosh.app/) - Image optimization
- [CloudConvert](https://cloudconvert.com/) - Convert formats

**Command Line**:
```bash
# ImageMagick (resize & compress)
brew install imagemagick
convert input.jpg -resize 1920x1080 -quality 85 output.jpg

# WebP (convert to WebP)
brew install webp
cwebp input.jpg -q 80 -o output.webp

# FFmpeg (audio compression)
brew install ffmpeg
ffmpeg -i input.wav -b:a 128k output.mp3
```

## 📱 Responsive Images

Next.js automatically optimizes images with the Image component:

```javascript
import Image from 'next/image'

<Image 
  src="/gallery/photo.jpg"
  alt="Description"
  width={1920}
  height={1080}
  quality={85}
/>
```

## 🚫 What NOT to Put Here

- ❌ Source code
- ❌ Configuration files
- ❌ API keys or secrets
- ❌ Node modules
- ❌ Temporary files
- ❌ Files over 5MB (unless absolutely necessary)

## ✅ Checklist Before Deploy

- [ ] All images optimized (WebP or compressed JPG)
- [ ] 3D models compressed
- [ ] Audio files at reasonable bitrate
- [ ] Custom favicon added
- [ ] Open Graph image created
- [ ] No placeholder text in images
- [ ] All file names are web-friendly (no spaces)
- [ ] Total folder size < 10MB

---

**Need help?** Check the main [README.md](../README.md) or [CUSTOMIZATION.md](../CUSTOMIZATION.md)

