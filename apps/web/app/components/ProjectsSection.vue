<template>
  <section
    v-bind="$attrs"
    :id="id"
    class="projects-section"
    role="region"
    aria-label="Seccion de proyectos"
  >
    <div class="projects-container">
      <h2 class="projects-title">PROYECTOS DESTACADOS</h2>

      <!-- BOTON VER TODOS PROYECTOS -->
      <BaseButton to="/proyectos" class="view-all-btn"> VER MAS → </BaseButton>

      <div class="carousel-wrapper">
        <!-- BOTON ANTERIOR -->
        <button
          class="carousel-btn carousel-btn-prev"
          aria-label="Proyecto anterior"
          @click="previousSlide"
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
          <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <BaseCard
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
            </BaseCard>
          </div>
        </div>

        <!-- BOTON SIGUIENTE -->
        <button
          class="carousel-btn carousel-btn-next"
          aria-label="Siguiente proyecto"
          @click="nextSlide"
        >
          ›
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Project } from '@/types/project.types'
import { getAllProjects } from '@/composables/useProjects'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import { useCarousel } from '~/composables/useCarousel'

defineProps<{ id?: string }>()

const projects: Project[] = getAllProjects()

const {
  currentIndex,
  nextSlide,
  previousSlide,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
} = useCarousel(projects.length)
</script>

<style scoped src="../assets/css/components/ProjectsSection.scss"></style>
