import ubigeoData from '~/data/ubigeo-peru.json'

export default defineEventHandler((event) => {
  const dep = getRouterParam(event, 'dep')
  const prov = getRouterParam(event, 'prov')

  if (typeof dep !== 'string' || typeof prov !== 'string') {
    return []
  }

  // Decodificar los parámetros de la URL
  const depDecoded = decodeURIComponent(dep)
  const provDecoded = decodeURIComponent(prov)

  return ubigeoData?.[depDecoded]?.[provDecoded] ?? []
})
