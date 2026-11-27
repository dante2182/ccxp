/**
 * Los anclas de sección viven en la home. Desde otras rutas deben apuntar a
 * `/#id` para volver a la portada antes de desplazarse.
 */
export function useSectionHref() {
  const route = useRoute()
  return (id: string) => (route.path === '/' ? `#${id}` : `/#${id}`)
}
