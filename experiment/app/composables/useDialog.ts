import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

/** Bloqueo de scroll, Escape y foco inicial para los diálogos del demo. */
export function useDialog(
  open: Ref<boolean>,
  close: () => void,
  focusTarget?: Ref<HTMLElement | null>,
  restoreFocus = true,
) {
  if (!import.meta.client) return

  let previousOverflow = ''
  let previousFocus: HTMLElement | null = null

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close()
  }

  watch(
    open,
    (isOpen) => {
      if (isOpen) {
        previousOverflow = document.body.style.overflow
        previousFocus =
          document.activeElement instanceof HTMLElement ? document.activeElement : null
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKey)
        nextTick(() => focusTarget?.value?.focus())
      } else {
        document.body.style.overflow = previousOverflow
        window.removeEventListener('keydown', onKey)
        if (restoreFocus) previousFocus?.focus()
      }
    },
    { flush: 'post' },
  )

  onBeforeUnmount(() => {
    if (!open.value) return
    document.body.style.overflow = previousOverflow
    window.removeEventListener('keydown', onKey)
    if (restoreFocus) previousFocus?.focus()
  })
}
