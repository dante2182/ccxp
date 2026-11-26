<template>
  <section
    v-bind="$attrs"
    :id="($attrs as any).id || id"
    class="projects-section"
    role="region"
    aria-label="Seccion de proyectos"
  >
    <div class="projects-container">
      <h2 class="projects-title">PROYECTOS DESTACADOS</h2>

      <!-- BOTON VER TODOS PROYECTOS -->
      <NuxtLink to="/proyectos" class="view-all-btn">
        VER MAS →
      </NuxtLink>

      <div class="carousel-wrapper">

        <!-- BOTON ANTERIOR -->
        <button
          class="carousel-btn carousel-btn-prev"
          @click="previousSlide"
          aria-label="Proyecto anterior"
        >
          ‹
        </button>

        <!-- CARRUSEL -->
        <div
          class="carousel-container"
          role="region"
          aria-label="Carrusel de proyectos"
          tabindex="0"
          @keydown.left.prevent="previousSlide"
          @keydown.right.prevent="nextSlide"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div
            class="carousel-track"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <NuxtLink
              v-for="(project, index) in projects"
              :key="index"
              :to="`/proyectos/${project.id}`"
              class="carousel-slide"
              role="group"
              :aria-roledescription="'slide'"
              :aria-label="`Proyecto ${index + 1} de ${projects.length}: ${project.title}`"
            >
              <img :src="project.image" :alt="project.title" width="800" height="600" />

              <div class="image-dark-overlay"></div>

              <div class="project-overlay">
                <p class="project-text">{{ project.title }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- BOTON SIGUIENTE -->
        <button
          class="carousel-btn carousel-btn-next"
          @click="nextSlide"
          aria-label="Siguiente proyecto"
        >
          ›
        </button>

      </div>
    </div>
  </section>
</template>


<style scoped src="../assets/css/components/ProjectsSection.css"></style>


<script setup lang="ts">



import type { Project } from '@/types/project.types'
import { getAllProjects } from '@/composables/useProjects'
import { useCarousel } from '~/composables/useCarousel'

defineProps<{ id?: string }>()

const projects: Project[] = getAllProjects()

const {
  currentIndex,
  nextSlide,
  previousSlide,
  goToSlide,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
} = useCarousel(projects.length)
</script>
