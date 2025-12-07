/**
 * Generate Splash Screen
 * Creates a splash.png from icon.png with proper sizing
 */

const sharp = require('sharp');
const path = require('path');

const SPLASH_SIZE = 2732; // iPad Pro size
const ICON_SIZE = 512;    // Size to render icon in splash
const BG_COLOR = '#16a34a'; // Green-600

async function generateSplash() {
  const resourcesDir = path.join(__dirname, '..', 'resources');
  const iconPath = path.join(resourcesDir, 'icon.png');
  const splashPath = path.join(resourcesDir, 'splash.png');
  const splashDarkPath = path.join(resourcesDir, 'splash-dark.png');

  console.log('Generating splash screens...');

  // Read the icon
  const icon = await sharp(iconPath)
    .resize(ICON_SIZE, ICON_SIZE)
    .toBuffer();

  // Calculate position to center the icon
  const left = Math.floor((SPLASH_SIZE - ICON_SIZE) / 2);
  const top = Math.floor((SPLASH_SIZE - ICON_SIZE) / 2);

  // Create light splash (green background)
  await sharp({
    create: {
      width: SPLASH_SIZE,
      height: SPLASH_SIZE,
      channels: 4,
      background: BG_COLOR
    }
  })
    .composite([{
      input: icon,
      left: left,
      top: top
    }])
    .png()
    .toFile(splashPath);

  console.log(`Created: ${splashPath}`);

  // Create dark splash (dark green background)
  await sharp({
    create: {
      width: SPLASH_SIZE,
      height: SPLASH_SIZE,
      channels: 4,
      background: '#064e3b' // Green-900
    }
  })
    .composite([{
      input: icon,
      left: left,
      top: top
    }])
    .png()
    .toFile(splashDarkPath);

  console.log(`Created: ${splashDarkPath}`);
  console.log('Splash screens generated successfully!');
}

generateSplash().catch(console.error);
