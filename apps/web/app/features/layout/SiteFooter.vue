<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Logo y descripcion -->
      <div class="footer-column footer-brand">
        <div class="footer-brand-inner">
          <img src="/images/icon.webp" alt="CCIP" class="logo-image" width="60" height="60" />
          <p class="copyright">
            © 2026 CCIP. Todos los derechos reservados.<br />
            Soluciones en telecomunicaciones, redes y<br />
            seguridad tecnológica.
          </p>
        </div>
      </div>

      <!-- Servicios -->
      <div class="footer-column">
        <h3 class="footer-title">Servicios</h3>
        <ul class="footer-links">
          <li><NuxtLink to="/servicios/telecomunicaciones">Telecomunicaciones</NuxtLink></li>
          <li><NuxtLink to="/servicios/redes-telematica">Redes y Telemática</NuxtLink></li>
          <li><NuxtLink to="/servicios/seguridad-electronica">Seguridad Electrónica</NuxtLink></li>
          <li><NuxtLink to="/servicios/energia-electrica">Energía Eléctrica</NuxtLink></li>
        </ul>
      </div>

      <!-- Paginas -->
      <div class="footer-column">
        <h3 class="footer-title">Páginas</h3>
        <ul class="footer-links">
          <li><NuxtLink to="/">Inicio</NuxtLink></li>
          <li><NuxtLink to="/proyectos">Proyectos</NuxtLink></li>
        </ul>
      </div>

      <!-- Redes -->
      <div class="footer-column footer-social">
        <div class="social-icons">
          <a
            v-if="companySocial.facebook"
            :href="companySocial.facebook"
            target="_blank"
            rel="noopener"
            class="social-icon"
            aria-label="Facebook"
          >
            <i class="fab fa-facebook-f"></i>
          </a>

          <a
            v-if="companySocial.whatsapp"
            :href="companySocial.whatsapp"
            target="_blank"
            rel="noopener"
            class="social-icon"
            aria-label="WhatsApp"
          >
            <i class="fab fa-whatsapp"></i>
          </a>

          <a
            v-if="companySocial.instagram"
            :href="companySocial.instagram"
            target="_blank"
            rel="noopener"
            class="social-icon"
            aria-label="Instagram"
          >
            <i class="fab fa-instagram"></i>
          </a>

          <a
            v-if="companySocial.email"
            :href="companySocial.email"
            class="social-icon"
            aria-label="Email"
          >
            <i class="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useCompanySocial } from '~/composables/useCompanySocial'
const { companySocial } = useCompanySocial()
</script>

<style scoped src="./site-footer.css"></style>
