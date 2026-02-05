const { registerRoot } = require('remotion');
const { DemoVideo } = require('./video.js');

registerRoot(DemoVideo);

console.log('✅ Remotion video composition ready.');
console.log('To preview: npx remotion preview');
console.log('To render: npx remotion render src/index.js DemoVideo out/demo.mp4');