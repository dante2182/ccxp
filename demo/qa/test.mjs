import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const results = {};

// 1 theme toggle
results.startTheme = await page.evaluate(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');
await page.click('[data-theme-toggle]');
await page.waitForTimeout(700);
results.afterToggle = await page.evaluate(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');

// 2 quote preselect from service card
await page.evaluate(() => document.querySelector('#servicios').scrollIntoView({behavior:'instant', block:'start'}));
await page.waitForTimeout(900);
await page.screenshot({ path: 'qa/t-light-servicios.png' });
await page.locator('#servicios button:has-text("Cotizar este servicio")').nth(2).click();
await page.waitForTimeout(1500);
results.selectedService = await page.locator('#field-servicio').inputValue();
results.contactInView = await page.evaluate(() => {
  const r = document.querySelector('#contacto').getBoundingClientRect();
  return Math.round(r.top);
});
await page.screenshot({ path: 'qa/t-light-contacto.png' });

// 3 form validation then success
await page.click('button[type=submit]:has-text("Enviar solicitud")');
await page.waitForTimeout(400);
results.errorCount = await page.locator('p[id^="error-"]').count();
await page.fill('#field-nombre', 'María Fernanda Quispe');
await page.fill('#field-email', 'maria@empresa.com');
await page.fill('#field-mensaje', 'Necesitamos certificar fibra óptica en dos sedes de Arequipa.');
await page.check('#field-acepta');
await page.click('button[type=submit]:has-text("Enviar solicitud")');
await page.waitForTimeout(1600);
results.successVisible = await page.locator('text=Solicitud recibida').isVisible();
results.folio = await page.locator('text=/CCIP-2026-\\d+/').first().textContent().catch(() => null);
await page.screenshot({ path: 'qa/t-success.png' });

// 4 scrolled header in light
await page.evaluate(() => window.scrollTo(0, 2600));
await page.waitForTimeout(900);
await page.screenshot({ path: 'qa/t-light-scrolled.png', clip: { x: 0, y: 0, width: 1440, height: 140 } });

// 5 back to dark header
await page.click('[data-theme-toggle]');
await page.waitForTimeout(800);
await page.screenshot({ path: 'qa/t-dark-scrolled.png', clip: { x: 0, y: 0, width: 1440, height: 140 } });

// 6 mobile menu
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await m.goto('http://localhost:4173/?theme=dark', { waitUntil: 'networkidle' });
await m.waitForTimeout(1500);
await m.screenshot({ path: 'qa/t-mobile-hero.png' });
await m.click('button[aria-label="Abrir menú"]');
await m.waitForTimeout(600);
await m.screenshot({ path: 'qa/t-mobile-menu.png' });
await m.click('nav[aria-label="Navegación móvil"] a:has-text("Servicios")');
await m.waitForTimeout(1200);
results.mobileMenuClosed = await m.locator('button[aria-label="Abrir menú"]').isVisible();
await m.screenshot({ path: 'qa/t-mobile-servicios.png' });

// 7 light capabilities screenshot
await page.goto('http://localhost:4173/?theme=light', { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelector('#capacidades').scrollIntoView({behavior:'instant', block:'start'}));
await page.waitForTimeout(1400);
await page.screenshot({ path: 'qa/t-light-capacidades.png' });
await page.evaluate(() => window.scrollBy(0, 760));
await page.waitForTimeout(1000);
await page.screenshot({ path: 'qa/t-light-noc.png' });

results.errors = errors;
console.log(JSON.stringify(results, null, 1));
await browser.close();
