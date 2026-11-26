import ubigeoData from '~/data/ubigeo-peru.json'

export default defineEventHandler((event) => {
  const dep = getRouterParam(event, 'dep')

  if (typeof dep !== 'string') {
    return []
  }

  // Decodificar el parámetro de la URL
  const depDecoded = decodeURIComponent(dep)

  return Object.keys(ubigeoData?.[depDecoded] ?? {})
})
