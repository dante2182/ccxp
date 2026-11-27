<template>
  <section v-bind="$attrs" :id="id" class="about-section">
    <div class="about-container">
      <!-- Imagen -->
      <div class="about-image">
        <img src="/images/about-tecnico.webp" alt="Trabajador técnico" width="400" height="300" />
      </div>

      <!-- Contenido principal -->
      <div class="about-content">
        <div class="about-title-wrapper">
          <h2 class="about-title">SOBRE NOSOTROS</h2>
        </div>

        <p class="about-text">
          Somos una empresa dedicada a la innovación y uso de las tecnologías de la información,
          brindando soluciones integrales en:
        </p>

        <ul class="services-list">
          <li>Telecomunicaciones</li>
          <li>Redes y Telemática</li>
          <li>Energía Eléctrica</li>
          <li>Seguridad Electrónica y Video Vigilancia</li>
        </ul>

        <p class="about-text">
          Con personal capacitado y experiencia en proyectos a nivel nacional.
        </p>
      </div>
    </div>

    <!-- Sección Misión y Visión -->
    <div class="mission-vision-container">
      <div class="mission-card">
        <h3 class="mv-card-title">Nuestra Misión</h3>
        <p class="card-text">
          Proporcionar soluciones tecnológicas innovadoras y de calidad que impulsen el crecimiento
          de nuestros clientes, mediante servicios especializados en telecomunicaciones, redes y
          seguridad electrónica.
        </p>
      </div>

      <div class="vision-card">
        <h3 class="mv-card-title">Nuestra Visión</h3>
        <p class="card-text">
          Ser reconocidos como líderes en soluciones tecnológicas a nivel nacional, destacando por
          nuestra excelencia, innovación continua y compromiso con la satisfacción de nuestros
          clientes.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ id?: string }>()
</script>

<style src="../assets/css/components/AboutSection.scss"></style>
