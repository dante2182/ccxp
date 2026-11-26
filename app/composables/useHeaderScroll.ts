import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export type SectionId =
  | 'home'
  | 'about'
  | 'services'
  | 'projects'
  | 'contact'

export function useHeaderScroll() {
  const route = useRoute()
  const router = useRouter()

  const headerRef = ref<HTMLElement | null>(null)
  const activeSection = ref<SectionId>('home')
  const isShrunk = ref(false)

  let scrollTimeout: ReturnType<typeof setTimeout> | null = null
  let pendingSection: SectionId | null = null
  let lastScrollY = 0
  let scrollVelocity = 0
  let headerHeightCache = 0 // Cache para el header height
  let rafId: number | null = null // Para requestAnimationFrame

  const isHomePage = computed(() => route.path === '/')

  /* ===============================
     SCROLL TO SECTION
  ================================ */
  const scrollToSection = (id: SectionId) => {
    const el = document.getElementById(id)
    if (!el) return

    // Usar cache en lugar de acceder directamente
    if (!headerHeightCache && headerRef.value) {
      headerHeightCache = headerRef.value.offsetHeight
    }
    const headerHeight = headerHeightCache || 0
    const y = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    })
  }

  /* ===============================
     NAVIGATION
  ================================ */
  const goToSection = (id: SectionId) => {
    if (isHomePage.value) {
      scrollToSection(id)
    } else {
      router.push({
        path: '/',
        state: { scrollTo: id }
      })
    }
  }

  /* ===============================
     ACTIVE SECTION (HOME ONLY)
  ================================ */
  const updateActiveSection = (newSection: SectionId) => {
    if (scrollTimeout) clearTimeout(scrollTimeout)

    pendingSection = newSection

    const baseDelay = 5
    const velocityThreshold = 10
    const delay = Math.abs(scrollVelocity) > velocityThreshold ? 300 : baseDelay

    scrollTimeout = setTimeout(() => {
      if (pendingSection && activeSection.value !== pendingSection) {
        activeSection.value = pendingSection
      }
      pendingSection = null
    }, delay)
  }

  /* ===============================
     SCROLL HANDLER (GLOBAL) - OPTIMIZADO
  ================================ */
  const handleScroll = () => {
    // Cancelar RAF anterior si existe
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }

    // Usar RAF para agrupar las lecturas
    rafId = requestAnimationFrame(() => {
      // Shrink SIEMPRE (todas las páginas)
      isShrunk.value = window.scrollY > 50

      // Secciones SOLO en HOME
      if (!isHomePage.value) {
        rafId = null
        return
      }

      const currentScrollY = window.scrollY
      scrollVelocity = currentScrollY - lastScrollY
      lastScrollY = currentScrollY

      const sections: SectionId[] = [
        'home',
        'about',
        'services',
        'projects',
        'contact'
      ]

      // Actualizar cache del header solo si es necesario
      if (!headerHeightCache && headerRef.value) {
        headerHeightCache = headerRef.value.offsetHeight
      }

      const scrollPos = window.scrollY + headerHeightCache + 100

      let current: SectionId = 'home'

      // Leer todas las propiedades geométricas de una vez
      for (const id of sections) {
        const el = document.getElementById(id)
        if (!el) continue

        const sectionTop = el.offsetTop
        const sectionBottom = sectionTop + el.offsetHeight

        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          current = id
          break
        }
      }

      if (current !== activeSection.value) {
        updateActiveSection(current)
      }

      rafId = null
    })
  }

  /* ===============================
     ACTIVE STATE FINAL (KEY)
  ================================ */
  const currentActive = computed<SectionId>(() => {
    if (isHomePage.value) {
      return activeSection.value
    }

    if (route.path.startsWith('/servicios')) return 'services'
    if (route.path.startsWith('/proyectos')) return 'projects'
    if (route.path.startsWith('/contacto')) return 'contact'

    return 'home'
  })

  /* ===============================
     LIFECYCLE
  ================================ */
  onMounted(() => {
    const targetSection = history.state?.scrollTo as SectionId | undefined

    if (targetSection && isHomePage.value) {
      setTimeout(() => {
        scrollToSection(targetSection)
        window.history.replaceState({}, '', '/')
      }, 100)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    if (scrollTimeout) clearTimeout(scrollTimeout)
    if (rafId !== null) cancelAnimationFrame(rafId)
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    headerRef,
    currentActive,
    goToSection,
    isShrunk
  }
}
