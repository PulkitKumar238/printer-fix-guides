/**
 * Generates branded SVG placeholder art for every guide step image.
 * Run with: node scripts/gen-placeholders.mjs
 * Real raster photos can later replace these files at the same paths.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const W = 1200;
const H = 675;

// Note: the setup and scanner guides intentionally have no step images.
const guides = {
  offline: ['Restart everything', 'Use Printer Offline', 'Restart spooler', 'Check IP address', 'Reinstall driver'],
  drivers: ['Find your model', 'Download driver', 'Run installer', 'Print test page', 'Clear bad driver'],
  wifi: ['Use 2.4 GHz band', 'Fixed IP address', 'Improve signal', 'Sleep settings', 'Update firmware'],
  'not-printing': ['Clear the queue', 'Right printer', 'Check ink & paper', 'Clean print head', 'Restart & reinstall'],
  'paper-jam': ['Open everything', 'Pull paper out', 'Check for scraps', 'Phantom jam', 'Prevent next jam'],
};

const ink = '#1B3A4B';
const amber = '#FF6B35';
const paper = '#F7F4EE';

function svg(guide, n, label) {
  const num = n + 1;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${paper}"/>
      <stop offset="1" stop-color="#EFEAE0"/>
    </linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="${ink}" opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="22" fill="none" stroke="${ink}" stroke-opacity="0.12" stroke-width="2"/>
  <!-- printer mark -->
  <g transform="translate(${W / 2 - 120}, 168)" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.85">
    <rect x="40" y="70" width="160" height="86" rx="12"/>
    <path d="M72 70V34a10 10 0 0 1 10-10h76a10 10 0 0 1 10 10v36"/>
    <path d="M72 156v34a10 10 0 0 0 10 10h76a10 10 0 0 0 10-10v-34"/>
    <rect x="92" y="156" width="56" height="44" rx="4" fill="${paper}"/>
  </g>
  <circle cx="${W / 2 + 96}" cy="196" r="30" fill="${amber}"/>
  <text x="${W / 2 + 96}" y="206" font-family="Georgia, serif" font-size="30" font-weight="700" fill="#fff" text-anchor="middle">${num}</text>
  <text x="${W / 2}" y="470" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="700" fill="${ink}" text-anchor="middle">Step ${num} — ${label}</text>
  <text x="${W / 2}" y="516" font-family="Arial, sans-serif" font-size="22" fill="${ink}" fill-opacity="0.55" text-anchor="middle">Illustration placeholder · ${guide}</text>
</svg>
`;
}

let count = 0;
for (const [guide, labels] of Object.entries(guides)) {
  for (let i = 0; i < labels.length; i++) {
    const path = `public/images/guides/${guide}/step-${i + 1}.svg`;
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, svg(guide, i, labels[i]));
    count++;
  }
}

// Open Graph default image
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${ink}"/>
  <circle cx="980" cy="120" r="220" fill="${amber}" opacity="0.16"/>
  <text x="80" y="300" font-family="Georgia, serif" font-size="78" font-weight="700" fill="#fff">PrinterFix Guides</text>
  <text x="84" y="372" font-family="Arial, sans-serif" font-size="34" fill="#fff" fill-opacity="0.8">Clear, practical fixes for everyday printer problems.</text>
  <rect x="84" y="420" width="150" height="8" rx="4" fill="${amber}"/>
</svg>
`;
await mkdir('public/images', { recursive: true });
await writeFile('public/images/og-default.svg', og);

console.log(`Generated ${count} step placeholders + OG image.`);
