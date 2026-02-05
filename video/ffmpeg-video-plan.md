# FFmpeg Video Production Plan
## $10K Quality Demo Without Remotion

## 🎬 Production Approach
**Combine:** SVG animations + Screen recordings + FFmpeg compositing + Audio

### Assets Needed:
1. **Animated SVG scenes** (90 seconds total)
2. **Screen recordings** (UI interactions)
3. **Audio track** (music + sound effects)
4. **Voiceover** (optional, can use TTS)

### Toolchain:
- **SVG animations** → CSS/JS animated SVG exports
- **Screen recording** → OBS or simple screen capture
- **Compositing** → FFmpeg command line
- **Audio** → Audacity or FFmpeg filters

## 📋 Scene Breakdown with FFmpeg Commands

### Scene 1: Problem Statement (0-10s)
**Content:** Fragmented portfolio visualization
**Production:** Animated SVG showing scattered assets
**FFmpeg command:**
```bash
# Generate 10-second animation from SVG
ffmpeg -i problem.svg -vf "fps=30,scale=1920:1080" -t 10 scene1.mp4
```

### Scene 2: Solution Reveal (10-30s)
**Content:** UI sliding in with portfolio dashboard
**Production:** SVG animation + screen recording overlay
**FFmpeg command:**
```bash
# Composite SVG animation with UI recording
ffmpeg -i solution.svg -i ui-recording.mp4 -filter_complex \
"[0:v]setpts=PTS-STARTPTS[v0]; \
 [1:v]setpts=PTS-STARTPTS+10/TB[v1]; \
 [v0][v1]overlay=enable='between(t,10,30)'" \
-t 20 scene2.mp4
```

### Scene 3: Multi-Chain Demo (30-50s)
**Content:** Chain cards flipping through balances
**Production:** Animated chain logos + balance updates
**FFmpeg command:**
```bash
# Create chain animation sequence
ffmpeg -i eth-balance.svg -i sol-balance.svg -i matic-balance.svg \
-filter_complex \
"[0:v]trim=0:5,setpts=PTS-STARTPTS[v0]; \
 [1:v]trim=0:5,setpts=PTS-STARTPTS[v1]; \
 [2:v]trim=0:5,setpts=PTS-STARTPTS[v2]; \
 [v0][v1][v2]concat=n=3:v=1:a=0" \
-t 15 scene3.mp4
```

### Scene 4: Risk Engine (50-70s)
**Content:** Risk dashboard with warnings
**Production:** Animated risk heatmap + warning pulses
**FFmpeg command:**
```bash
# Animated risk visualization
ffmpeg -i risk-base.svg -i warning-pulse.gif \
-filter_complex \
"[0:v][1:v]overlay=enable='between(t,55,60)':x=100:y=100" \
-t 15 scene4.mp4
```

### Scene 5: USDC Integration (70-85s)
**Content:** USDC at center with connections
**Production:** Animated USDC logo + connection lines
**FFmpeg command:**
```bash
# Radial animation of connections
ffmpeg -i usdc-center.svg -vf "rotate=0.5*PI*t/15" \
-t 15 scene5.mp4
```

### Scene 6: Call to Action (85-90s)
**Content:** Hackathon submission card
**Production:** Text overlay with fade-in
**FFmpeg command:**
```bash
# Text overlay with fade
ffmpeg -i background.mp4 -vf \
"drawtext=text='#USDCHackathon':fontsize=72:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(t,0,5)'" \
-t 5 scene6.mp4
```

## 🛠 FFmpeg Production Pipeline

### Step 1: Create SVG Animations
```bash
# Convert SVG to PNG sequence for animation
rsvg-convert -f png -o frame-%04d.png animated.svg
# Or use Inkscape batch export
```

### Step 2: Generate Video from Frames
```bash
# PNG sequence to video
ffmpeg -framerate 30 -i frame-%04d.png -c:v libx264 -pix_fmt yuv420p animation.mp4
```

### Step 3: Add Audio Track
```bash
# Add background music
ffmpeg -i animation.mp4 -i music.mp3 -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 output.mp4
```

### Step 4: Add Voiceover
```bash
# Mix voiceover with reduced music volume
ffmpeg -i output.mp4 -i voiceover.mp3 -filter_complex \
"[0:a]volume=0.3[a0]; \
 [1:a]volume=1.0[a1]; \
 [a0][a1]amix=inputs=2:duration=longest" \
-c:v copy final.mp4
```

### Step 5: Add Subtitles
```bash
# Burn in subtitles
ffmpeg -i final.mp4 -vf "subtitles=subtitles.srt" final-with-subs.mp4
```

## 🎨 SVG Animation Techniques

### CSS Animations in SVG
```svg
<svg>
  <style>
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
    .pulsing {
      animation: pulse 2s infinite;
    }
  </style>
  <circle class="pulsing" cx="100" cy="100" r="50" fill="#5925E6"/>
</svg>
```

### SMIL Animations (Native SVG)
```svg
<svg>
  <circle cx="100" cy="100" r="20" fill="#E79E00">
    <animate attributeName="r" from="20" to="30" dur="1s" repeatCount="indefinite"/>
  </circle>
</svg>
```

### JavaScript Animation (Export as Video)
```html
<svg id="animated">
  <script>
    const svg = document.getElementById('animated');
    let scale = 1;
    setInterval(() => {
      scale = scale === 1 ? 1.1 : 1;
      svg.querySelector('circle').setAttribute('r', 50 * scale);
    },联系
  </script>
</svg>
```

## ⚡ Optimization

### Reduce File Size
```bash
# Optimize video
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset medium -acodec aac -b:a 128k output.mp4

# Optimize SVG
svgo --multipass animated.svg
```

### Maintain Quality
- **Resolution:** 1920x1080 (1080p)
- **Bitrate:** 8-12 Mbps for 1080p
- **Frame rate:** 30 fps smooth
- **Audio:** 128kbps AAC stereo

## ✅ Quality Checklist

### Technical Quality
- [ ] **1080p HD** resolution
- [ ] **30fps smooth** animation
- [ ] **Clear audio** mix (music + voice)
- [ ] **Professional pacing** (not too fast/slow)
- [ ] **Mobile optimized** (looks good on phone)

### Content Quality
- [ ] **Hook in 3 seconds**
- [ ] **Clear value proposition**
- [ ] **Technical credibility** shown
- [ ] **Emotional resonance** achieved
- [ ] **Clear call to action**

### Production Quality
- [ ] **Consistent color palette**
- [ ] **Professional typography**
- [ ] **Smooth transitions**
- [ ] **Synced audio/video**
- [ ] **No amateur mistakes**

## 📦 Export & Delivery

### Final Export Settings
```bash
ffmpeg -i final.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 18 \
  -c:a aac \
  -b:a 192k \
  -movflags +faststart \
  output-1080p.mp4
```

### File Size Target
- **90 seconds @ 1080p:** 50-100 MB
- **Compressed for web:** 20-50 MB with good quality
- **Streaming optimized:** H.264 with fast start

### Distribution Format
1. **MP4** - Universal compatibility
2. **WebM** - Smaller size for web
3. **GIF** - Short clips for social media
4. **YouTube upload** - Highest quality preservation

---

**Production Time:** 2-3 hours for competent FFmpeg user
**Alternative:** Use Shotcut/OpenShot GUI if CLI is too complex
**Critical Path:** Create animated SVG assets first