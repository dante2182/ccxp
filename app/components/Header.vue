<template>
  <header ref="headerRef" :class="['header', { 'header-shrink': isShrunk }]">
    <div class="header-content">

      <!-- Logo -->
      <button @click="goToSection('home')" class="logo" aria-label="Inicio">
        <img src="/images/icon.webp" alt="CCIP" class="logo-image" width="60" height="60" />
      </button>

      <!-- Desktop Nav -->
      <nav class="nav desktop-nav">
        <button
          class="nav-link"
          :class="{ active: currentActive === 'home' }"
          @click="goToSection('home')"
        >
          Inicio
        </button>

        <button
          class="nav-link"
          :class="{ active: currentActive === 'services' }"
          @click="goToSection('services')"
        >
          Servicios
        </button>

        <button
          class="nav-link"
          :class="{ active: currentActive === 'projects' }"
          @click="goToSection('projects')"
        >
          Proyectos
        </button>
      </nav>

      <!-- Desktop Button -->
      <button
        class="contact-btn desktop-only"
        @click="goToSection('contact')"
      >
        Contáctanos
      </button>

      <!-- Mobile Button -->
      <button class="menu-btn mobile-only" @click="toggleMenu">
        <i :class="isMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="mobile-menu">
        <button @click="navigate('home')">Inicio</button>
        <button @click="navigate('services')">Servicios</button>
        <button @click="navigate('projects')">Proyectos</button>
        <button @click="navigate('contact')" class="contact-mobile">
          Contáctanos
        </button>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useHeaderScroll } from '@/composables/useHeaderScroll'

const { headerRef, currentActive, goToSection, isShrunk } = useHeaderScroll()

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const navigate = (section: any) => {
  goToSection(section)
  isMenuOpen.value = false
}

const handleResize = () => {
  if (window.innerWidth > 768) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped src="@/assets/css/components/Header.css"></style>
