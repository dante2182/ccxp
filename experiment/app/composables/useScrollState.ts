import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Estado de scroll del header: marca scrolled, progreso y sección activa.
 * La lógica vive aquí; el componente solo renderiza los valores.
 */
export function useScrollState(sectionIds: readonly string[]) {
  const scrolled = ref(false)
  const progress = ref(0)
  const active = ref(sectionIds[0] ?? '')

  let raf = 0
  const update = () => {
    raf = 0
    const y = window.scrollY
    scrolled.value = y > 24
    const height = document.documentElement.scrollHeight - window.innerHeight
    progress.value = height > 0 ? Math.min(1, y / height) : 0

    let current = sectionIds[0] ?? ''
    sectionIds.forEach((id) => {
      const node = document.getElementById(id)
      if (node && node.getBoundingClientRect().top <= window.innerHeight * 0.32) current = id
    })
    active.value = current
  }

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
  })

  return { scrolled, progress, active }
}
