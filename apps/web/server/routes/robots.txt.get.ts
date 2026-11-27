import { getSiteUrl } from '../utils/site-url'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${getSiteUrl()}/sitemap.xml
`
})
