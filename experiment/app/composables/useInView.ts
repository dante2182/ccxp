import { onBeforeUnmount, onMounted, shallowRef } from 'vue'

/** Observa un elemento y lo marca una sola vez cuando entra al viewport. */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const nodeRef = shallowRef<T | null>(null)
  const inView = ref(false)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const el = nodeRef.value
    if (!el || typeof IntersectionObserver === 'undefined') {
      inView.value = true
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            inView.value = true
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px', ...options },
    )
    observer.observe(el)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { ref: nodeRef, inView }
}
