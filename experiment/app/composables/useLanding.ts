import { ref } from 'vue'

const quoteService = ref<string | undefined>(undefined)

export function useLanding() {
  const scrollToSection = (id: string, updateHash = true) => {
    const target = document.getElementById(id)
    if (!target) return

    const href = `#${id}`
    if (updateHash && window.location.hash !== href) window.history.pushState(null, '', href)
    window.requestAnimationFrame(() => {
      const headerHeight =
        document.querySelector<HTMLElement>('header')?.getBoundingClientRect().height ?? 0
      const top = window.scrollY + target.getBoundingClientRect().top - headerHeight
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    })
  }

  const requestQuote = (service?: string) => {
    quoteService.value = service ?? 'Otra solución / asesoría a medida'
    window.setTimeout(() => scrollToSection('contacto', false), 40)
  }

  const handleSectionNavigation = (event: MouseEvent) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) {
      return
    }

    const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]')
    const href = link?.getAttribute('href')
    const target = href && href.length > 1 ? document.getElementById(href.slice(1)) : null
    if (!link || !href || !target || link.target === '_blank' || link.hasAttribute('download'))
      return

    event.preventDefault()
    scrollToSection(href.slice(1))
  }

  return { quoteService, scrollToSection, requestQuote, handleSectionNavigation }
}
