import { onBeforeUnmount, onMounted, ref, type ShallowRef } from 'vue'

/**
 * Muestra las acciones móviles del hero solo cuando está en viewport
 * y el ancho es menor a lg. Umbrales y media query idénticos al demo aprobado.
 */
export function useHeroVisibility(sectionRef: ShallowRef<HTMLElement | null>) {
  const showMobileActions = ref(false)
  let observer: IntersectionObserver | undefined
  let mobileViewport: MediaQueryList | undefined
  let heroIsVisible = false
  let visibilityUpdate: (() => void) | undefined

  onMounted(() => {
    const section = sectionRef.value
    if (!section) return
    mobileViewport = window.matchMedia('(max-width: 1023px)')
    visibilityUpdate = () => {
      showMobileActions.value = Boolean(mobileViewport?.matches && heroIsVisible)
    }
    observer = new IntersectionObserver(([entry]) => {
      if (!entry) return
      heroIsVisible = entry.isIntersecting
      visibilityUpdate?.()
    })
    observer.observe(section)
    mobileViewport.addEventListener('change', visibilityUpdate)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    if (mobileViewport && visibilityUpdate)
      mobileViewport.removeEventListener('change', visibilityUpdate)
  })

  return { showMobileActions }
}
