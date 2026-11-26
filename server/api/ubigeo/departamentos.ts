import ubigeoData from '~/data/ubigeo-peru.json'

export default defineEventHandler(() => {
  return Object.keys(ubigeoData)
})
