<template>
  <section v-if="project" class="project-page">
    <Header />

    <!-- HERO -->
    <section class="hero">
      <img :src="project.image" :alt="project.title" />
      <div class="hero-overlay">
        <div class="hero-content">
          <span class="hero-badge">Proyecto destacado</span>
          <h1>{{ project.title }}</h1>
        </div>
      </div>
    </section>

    <!-- CONTENIDO PRINCIPAL -->
    <section class="main-content">
      <div class="content-wrapper">

        <!-- SIDEBAR -->
        <aside class="sidebar">
          <div class="info-box">
            <h3>Información del proyecto</h3>



            <div class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              <div>
                <span class="label">Categoría</span>
                <p>Infraestructura y Telecomunicaciones</p>
              </div>
            </div>

          </div>

          <!-- CTA -->
          <div class="cta-box">
            <h3>¿Interesado en un proyecto similar?</h3>
            <p>Contáctanos para discutir cómo podemos ayudarte.</p>

            <button
              class="cta-btn"
              @click="goToContact"
            >
              Solicitar cotización
            </button>
          </div>
        </aside>

        <!-- CONTENIDO -->
        <div class="main-area">
          <div class="featured-image">
            <img :src="project.image" :alt="project.title" />
          </div>

          <div class="section-block">
            <div class="section-header">
              <h2>Descripción del proyecto</h2>
              <div class="header-line"></div>
            </div>
            <p class="description-text">{{ project.description }}</p>
          </div>

          <div v-if="project.details?.scope" class="section-block">
            <div class="section-header">
              <h2>Alcance del proyecto</h2>
              <div class="header-line"></div>
            </div>
            <p>{{ project.details.scope }}</p>
          </div>

          <div class="two-column-grid">
            <div v-if="project.details?.technologies" class="section-block">
              <div class="section-header">
                <h2>Tecnologías</h2>
                <div class="header-line"></div>
              </div>
              <ul class="tech-list">
                <li v-for="tech in project.details.technologies" :key="tech">
                  ⚡ {{ tech }}
                </li>
              </ul>
            </div>

            <div v-if="project.details?.benefits" class="section-block">
              <div class="section-header">
                <h2>Beneficios</h2>
                <div class="header-line"></div>
              </div>
              <ul class="benefits-list">
                <li v-for="benefit in project.details.benefits" :key="benefit">
                  ✓ {{ benefit }}
                </li>
              </ul>
            </div>
          </div>

          <div class="back-section">
            <NuxtLink to="/proyectos" class="back-btn">
              ← Ver todos los proyectos
            </NuxtLink>
          </div>
        </div>

      </div>
    </section>

    <Footer />
  </section>

  <!-- NOT FOUND -->
  <section v-else class="not-found">
    <h1>Proyecto no encontrado</h1>
    <NuxtLink to="/proyectos">Volver</NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getProjectById } from '@/composables/useProjects'
import { useHeaderScroll } from '@/composables/useHeaderScroll'
import '@/assets/css/components/ProjectId.css'

const route = useRoute()
const project = getProjectById(route.params.id as string)

/* 🔥 MISMA MECÁNICA QUE EL HEADER */
const { goToSection } = useHeaderScroll()

const goToContact = () => {
  goToSection('contact')
}

useSeoMeta({
  title: project ? `${project.title} | CCIP` : 'Proyecto no encontrado | CCIP'
})
</script>
