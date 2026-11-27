import { ref, onMounted, onUnmounted } from 'vue'

export function useCarousel(totalSlides: number) {
  const currentIndex = ref<number>(0)

  /* autoplay */
  let autoPlayInterval: ReturnType<typeof setInterval> | null = null

  /* touch */
  let touchStartX = 0
  let touchEndX = 0

  /* navigation */
  const nextSlide = (): void => {
    currentIndex.value = (currentIndex.value + 1) % totalSlides
  }

  const previousSlide = (): void => {
    currentIndex.value = currentIndex.value === 0 ? totalSlides - 1 : currentIndex.value - 1
  }

  const goToSlide = (index: number): void => {
    currentIndex.value = index
  }

  /* touch handlers */
  const handleTouchStart = (e: TouchEvent): void => {
    const touch = e.touches.item(0)
    if (!touch) return
    touchStartX = touch.clientX
  }

  const handleTouchMove = (e: TouchEvent): void => {
    const touch = e.touches.item(0)
    if (!touch) return
    touchEndX = touch.clientX
  }

  const handleTouchEnd = (): void => {
    if (touchStartX - touchEndX > 50) nextSlide()
    if (touchEndX - touchStartX > 50) previousSlide()
  }

  /* autoplay */
  const startAutoPlay = (): void => {
    autoPlayInterval = setInterval(nextSlide, 5000)
  }

  const stopAutoPlay = (): void => {
    if (autoPlayInterval) clearInterval(autoPlayInterval)
  }

  onMounted(startAutoPlay)
  onUnmounted(stopAutoPlay)

  return {
    currentIndex,
    nextSlide,
    previousSlide,
    goToSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
