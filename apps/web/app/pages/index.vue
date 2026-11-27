<template>
  <div class="home-page">
    <SiteHeader />

    <section id="home" class="hero">
      <div class="hero-background">
        <video
          class="hero-video"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          poster="/images/hero.webp"
        >
          <source src="/videos/hero2.mp4" type="video/mp4" />
        </video>

        <div class="hero-overlay"></div>
      </div>

      <div class="hero-content">
        <h1 class="hero-title">
          CORPORACIÓN DE CONTRATISTAS Y<br />
          PROVEEDORES GENERALES S.R.L.
        </h1>

        <div class="scroll-indicator" @click="handleScrollClick">⌄</div>
      </div>
    </section>

    <section id="about">
      <AboutSection />
    </section>

    <section id="services">
      <ServicesSection />
    </section>

    <section id="projects">
      <ProjectsSection />
    </section>

    <section id="team">
      <TeamSection />
    </section>

    <section id="parter">
      <PartnersSection />
    </section>

    <section id="contact">
      <ContactSection />
    </section>

    <section id="footer">
      <SiteFooter />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHeaderScroll } from '@/composables/useHeaderScroll'
import ContactSection from '~/features/contact/ContactSection.vue'
import SiteFooter from '~/features/layout/SiteFooter.vue'
import SiteHeader from '~/features/layout/SiteHeader.vue'

const { goToSection } = useHeaderScroll()

const handleScrollClick = () => {
  goToSection('about')
}
</script>
<style scoped src="../assets/css/pages/IndexSection.css"></style>
