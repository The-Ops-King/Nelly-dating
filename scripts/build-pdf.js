// Renders each HTML doc to PDF with the preinstalled Chromium.
// Usage: node scripts/build-pdf.js
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const docs = [
  ['onboarding/onboarding.html', 'Nelly-Sales-Onboarding.pdf'],
  ['playbook/playbook.html', 'Nelly-Sales-Playbook.pdf'],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [src, out] of docs) {
    const file = path.resolve(__dirname, '..', src);
    try { require('fs').accessSync(file); } catch { console.log('skip', src); continue; }
    await page.goto('file://' + file, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: path.resolve(__dirname, '..', out), format: 'Letter', printBackground: true, preferCSSPageSize: true });
    console.log('built', out);
  }
  await browser.close();
})();
