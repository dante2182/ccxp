import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const valueOf = (flag, fallback) => {
  const index = args.indexOf(flag)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}

const out = valueOf('--out', 'qa/baseline')
const base = valueOf('--base', 'http://localhost:4173').replace(/\/$/, '')
const channel = valueOf('--channel', process.env.PLAYWRIGHT_CHANNEL)
const [viewportWidth, viewportHeight] = valueOf('--viewport', '1440x1100')
  .split('x')
  .map(Number)
mkdirSync(out, { recursive: true })

const browser = await chromium.launch(channel ? { channel } : {})
const errors = []

const makePage = async (options = {}) => {
  const page = await browser.newPage({
    viewport: { width: viewportWidth, height: viewportHeight },
    reducedMotion: 'reduce',
    ...options,
  })
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  return page
}

const shot = async (page, name) => {
  await page.screenshot({ path: join(out, `${name}.png`) })
  console.log(name)
}

const scrollTo = async (page, selector) => {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, selector)
  await page.waitForTimeout(900)
}

const page = await makePage()

await page.goto(`${base}/?theme=dark`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1400)
writeFileSync(
  join(out, 'aprobado-index.html'),
  await (await fetch(`${base}/?theme=dark`)).text(),
)
await shot(page, 'dark-home')

for (const [name, selector] of [
  ['dark-servicios', '#servicios'],
  ['dark-capacidades', '#capacidades'],
  ['dark-nosotros', '#nosotros'],
  ['dark-blog', '#blog'],
  ['dark-contacto', '#contacto'],
]) {
  await scrollTo(page, selector)
  await shot(page, name)
}

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(1000)
await shot(page, 'dark-footer')

await page.evaluate(() => document.querySelector('#blog')?.scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(400)
await page.locator('#blog details summary').first().click()
await page.locator('#blog details button:has-text("Leer artículo completo")').first().click()
await page.waitForTimeout(700)
await shot(page, 'dark-articulo-modal')
await page.keyboard.press('Escape')

await page.goto(`${base}/blog?theme=dark`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)
await shot(page, 'dark-blog-index')

await page.goto(`${base}/blog/fibra-5g?theme=dark`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)
await shot(page, 'dark-blog-article')

await page.goto(`${base}/?theme=light`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1400)
await shot(page, 'light-home')
for (const [name, selector] of [
  ['light-servicios', '#servicios'],
  ['light-capacidades', '#capacidades'],
  ['light-contacto', '#contacto'],
]) {
  await scrollTo(page, selector)
  await shot(page, name)
}

const mobile = await makePage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
await mobile.goto(`${base}/?theme=dark`, { waitUntil: 'networkidle' })
await mobile.waitForTimeout(1600)
await shot(mobile, 'mobile-dark-home')
await mobile.locator('button[aria-label="Abrir menú"]').click()
await mobile.waitForTimeout(600)
await shot(mobile, 'mobile-dark-menu')
await mobile.locator('nav[aria-label="Navegación móvil"] a:has-text("Servicios")').click()
await mobile.waitForTimeout(1000)
await shot(mobile, 'mobile-dark-servicios')

writeFileSync(join(out, 'errors.json'), `${JSON.stringify(errors, null, 2)}\n`)
console.log('ERRORS', JSON.stringify(errors, null, 2))
await browser.close()
