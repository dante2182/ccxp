import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:4173/?theme=dark', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
for (const [name, sel] of [['servicios','#servicios'],['capacidades','#capacidades'],['blog','#blog'],['contacto','#contacto']]) {
  await page.evaluate((s) => document.querySelector(s).scrollIntoView({behavior:'instant', block:'start'}), sel);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `qa/s-${name}.png` });
}
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1500);
await page.screenshot({ path: 'qa/s-footer.png' });
// open article
await page.evaluate(() => document.querySelector('#blog').scrollIntoView({behavior:'instant', block:'start'}));
await page.waitForTimeout(500);
await page.click('text=Leer artículo');
await page.waitForTimeout(700);
await page.screenshot({ path: 'qa/s-modal.png' });
await page.keyboard.press('Escape');
// light theme
await page.goto('http://localhost:4173/?theme=light', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
for (const [name, sel] of [['servicios','#servicios'],['capacidades','#capacidades'],['contacto','#contacto']]) {
  await page.evaluate((s) => document.querySelector(s).scrollIntoView({behavior:'instant', block:'start'}), sel);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `qa/light-${name}.png` });
}
// mobile
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await m.goto('http://localhost:4173/?theme=dark', { waitUntil: 'networkidle' });
await m.waitForTimeout(2000);
await m.screenshot({ path: 'qa/m-hero.png' });
await m.evaluate(() => document.querySelector('#servicios').scrollIntoView({behavior:'instant', block:'start'}));
await m.waitForTimeout(1400);
await m.screenshot({ path: 'qa/m-servicios.png' });
console.log('ERRORS', JSON.stringify(errors, null, 1));
await browser.close();
