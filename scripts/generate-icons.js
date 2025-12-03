const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');
const screenshotsDir = path.join(__dirname, '../public/screenshots');

// Ensure directories exist
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// Tree icon SVG - simple tree silhouette with green theme
const createTreeIcon = (size) => {
  const padding = Math.round(size * 0.1);
  const treeWidth = size - padding * 2;
  const treeHeight = size - padding * 2;

  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#16a34a"/>
        <stop offset="100%" style="stop-color:#15803d"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bg)"/>
    <g transform="translate(${padding}, ${padding})">
      <!-- Tree crown -->
      <path d="M${treeWidth/2} ${treeHeight*0.08}
               L${treeWidth*0.15} ${treeHeight*0.55}
               L${treeWidth*0.3} ${treeHeight*0.55}
               L${treeWidth*0.1} ${treeHeight*0.75}
               L${treeWidth*0.35} ${treeHeight*0.75}
               L${treeWidth*0.35} ${treeHeight*0.92}
               L${treeWidth*0.65} ${treeHeight*0.92}
               L${treeWidth*0.65} ${treeHeight*0.75}
               L${treeWidth*0.9} ${treeHeight*0.75}
               L${treeWidth*0.7} ${treeHeight*0.55}
               L${treeWidth*0.85} ${treeHeight*0.55}
               Z" fill="white"/>
    </g>
  </svg>`;
};

// New assessment icon - plus sign
const createNewIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#16a34a"/>
    <rect x="${size*0.42}" y="${size*0.2}" width="${size*0.16}" height="${size*0.6}" fill="white" rx="${size*0.04}"/>
    <rect x="${size*0.2}" y="${size*0.42}" width="${size*0.6}" height="${size*0.16}" fill="white" rx="${size*0.04}"/>
  </svg>`;
};

// List icon - three lines
const createListIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#16a34a"/>
    <rect x="${size*0.2}" y="${size*0.25}" width="${size*0.6}" height="${size*0.12}" fill="white" rx="${size*0.03}"/>
    <rect x="${size*0.2}" y="${size*0.44}" width="${size*0.6}" height="${size*0.12}" fill="white" rx="${size*0.03}"/>
    <rect x="${size*0.2}" y="${size*0.63}" width="${size*0.6}" height="${size*0.12}" fill="white" rx="${size*0.03}"/>
  </svg>`;
};

// Screenshot placeholder
const createScreenshot = () => {
  return `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
    <rect width="1280" height="720" fill="#f0fdf4"/>
    <rect x="40" y="40" width="1200" height="80" fill="#16a34a" rx="8"/>
    <text x="80" y="95" font-family="Arial, sans-serif" font-size="36" fill="white" font-weight="bold">TRAQ Assessment</text>
    <rect x="40" y="140" width="1200" height="540" fill="white" stroke="#e5e7eb" stroke-width="2" rx="8"/>
    <text x="640" y="400" font-family="Arial, sans-serif" font-size="24" fill="#6b7280" text-anchor="middle">Tree Risk Assessment Form</text>
    <text x="640" y="440" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af" text-anchor="middle">Assessment data will appear here</text>
  </svg>`;
};

async function generateIcons() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

  console.log('Generating app icons...');
  for (const size of sizes) {
    const svg = Buffer.from(createTreeIcon(size));
    await sharp(svg)
      .png()
      .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
    console.log(`  Created icon-${size}x${size}.png`);
  }

  console.log('Generating shortcut icons...');
  const newIconSvg = Buffer.from(createNewIcon(96));
  await sharp(newIconSvg)
    .png()
    .toFile(path.join(iconsDir, 'new-assessment.png'));
  console.log('  Created new-assessment.png');

  const listIconSvg = Buffer.from(createListIcon(96));
  await sharp(listIconSvg)
    .png()
    .toFile(path.join(iconsDir, 'list.png'));
  console.log('  Created list.png');

  console.log('Generating screenshot...');
  const screenshotSvg = Buffer.from(createScreenshot());
  await sharp(screenshotSvg)
    .png()
    .toFile(path.join(screenshotsDir, 'assessment-form.png'));
  console.log('  Created assessment-form.png');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
