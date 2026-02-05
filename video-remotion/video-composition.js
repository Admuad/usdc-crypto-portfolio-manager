const puppeteer = require('puppeteer');
const fs = require('fs');
const { execSync } = require('child_process');

async function captureDashboard() {
  console.log('📸 Capturing dashboard screenshots...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // Full dashboard
  await page.screenshot({ path: '/tmp/dashboard-full.png', fullPage: true });
  
  // Cropped sections for different scenes
  await page.setViewport({ width:1040, height:600 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: '/tmp/dashboard-hero.png' });
  
  await page.setViewport({ width: 800, height: 400 });
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.screenshot({ path: '/tmp/dashboard-streams.png' });
  
  await browser.close();
  console.log('✅ Screenshots captured');
}

async function createVideo() {
  // Use ffmpeg to combine images + audio
  const cmd = `
    ffmpeg -y \
    -loop 1 -t 15 -i /tmp/dashboard-hero.png \
    -i /tmp/tts-Yt4u39/voice-1770272549046.mp3 \
    -loop 1 -t of 15 -i /tmp/dashboard-full.png \
    -i /tmp/tts-K4gTmH/voice-1770272556490.mp3 \
    -loop 1 -t 20 -i /tmp/dashboard-streams.png \
    -i /tmp/tts-pEvvEP/voice-1770272563667.mp3 \
    -filter_complex "
      [0:v]fade=in:0:30,fade=out:14:30[v0];
      [2:v]fade=in:0:30,fade=out:14:30[v1];
      [4:v]fade=in:0:30,fade=out:19:30[v2];
      [v0][0:a][v1][1:a][v2][2:a]concat=n=3:v=1:a=1
    " \
    -c:v libx264 -preset medium -crf 18 \
    -c:a aac -b:a 128k \
    /home/ubuntu/usdc-portfolio-manager/demo-video.mp4
  `;
  
  console.log('🎬 Rendering video...');
  execSync(cmd, { stdio: 'inherit' });
  console.log('✅ Video created: demo-video.mp4');
}

(async () => {
  await captureDashboard();
  await createVideo();
})();