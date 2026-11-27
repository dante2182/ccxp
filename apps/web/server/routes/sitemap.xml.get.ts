import projects from '~/data/projects.json'
import services from '~/data/services.json'
import { escapeXml, getSiteUrl } from '../utils/site-url'

interface SitemapEntry {
  path: string
  changefreq: 'weekly' | 'monthly'
  priority: string
}

export default defineEventHandler((event) => {
  const siteUrl = escapeXml(getSiteUrl())

  const entries: SitemapEntry[] = [
    { path: '/', changefreq: 'weekly', priority: '1' },
    { path: '/proyectos', changefreq: 'monthly', priority: '0.8' },
    ...projects.map((project) => ({
      path: `/proyectos/${project.id}`,
      changefreq: 'monthly' as const,
      priority: '0.7',
    })),
    ...services.map((service) => ({
      path: `/servicios/${service.slug}`,
      changefreq: 'monthly' as const,
      priority: '0.9',
    })),
  ]

  const urls = entries
    .map(
      ({ path, changefreq, priority }) => `  <url>
    <loc>${siteUrl}${escapeXml(path)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
    )
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
})
