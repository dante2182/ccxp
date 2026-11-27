import { ref, watch } from 'vue'
import type { Theme } from '~/types/content.types'

// Estado compartido, equivalente al useState<Theme> de App.tsx.
const theme = ref<Theme>('dark')
const ripple = ref<{ x: number; y: number; id: number } | null>(null)
let rippleTimer: number | undefined

const applyTheme = (value: Theme) => {
  const root = document.documentElement
  root.classList.toggle('dark', value === 'dark')
  root.style.colorScheme = value
  try {
    window.localStorage.setItem('ccip-theme', value)
  } catch {
    /* storage may be unavailable */
  }
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', value === 'dark' ? '#061429' : '#edf2f7')
}

if (import.meta.client) {
  watch(theme, applyTheme)
}

export function useTheme() {
  /** El script síncrono del head ya aplicó la clase; solo sincronizamos el ref. */
  const syncFromDom = () => {
    const current: Theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    theme.value = current
    applyTheme(current)
  }

  const toggleTheme = () => {
    const button = document.querySelector<HTMLElement>('[data-theme-toggle]')
    if (button) {
      const rect = button.getBoundingClientRect()
      ripple.value = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        id: Date.now(),
      }
      if (rippleTimer) window.clearTimeout(rippleTimer)
      rippleTimer = window.setTimeout(() => {
        ripple.value = null
      }, 900)
    }
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, ripple, syncFromDom, toggleTheme }
}
