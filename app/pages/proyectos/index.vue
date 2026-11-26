<template>
  <section class="projects-page">
    <Header />

    <div class="container">
      <h1 class="title">Nuestros Proyectos</h1>

      <div class="projects-grid">
        <NuxtLink
          v-for="project in projects"
          :key="project.id"
          :to="`/proyectos/${project.id}`"
          class="project-card"
        >
          <div class="image-wrapper">
            <img :src="project.image" :alt="project.title" width="600" height="400" />
          </div>

          <div class="card-content">
            <h2>{{ project.title }}</h2>
            <span class="cta">Ver proyecto →</span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <Footer />
  </section>
</template>

<script setup lang="ts">
import { getAllProjects } from '@/composables/useProjects'

const projects = getAllProjects()

useSeoMeta({
  title: 'Proyectos | CCIP',
  description: 'Proyectos realizados por CCIP a nivel nacional'
})




</script>

<style scoped src="~/assets/css/components/ProjectMain.css"></style>
