export function getSiteUrl(): string {
  const { public: publicConfig } = useRuntimeConfig()
  return String(publicConfig.siteUrl).replace(/\/+$/, '')
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
