<template>
  <section v-bind="$attrs" :id="id" class="team-section">
    <div class="team-hero">
      <div class="team-hero-overlay"></div>
      <div class="team-hero-content">
        <h2 class="team-title">NUESTRO EQUIPO</h2>
        <p class="team-subtitle">
          Ofrecemos servicios especializados para satisfacer las necesidades tecnológicas más
          exigentes de su empresa
        </p>
      </div>
    </div>

    <div class="team-container">
      <div class="team-grid">
        <div v-for="(member, index) in teamMembers" :key="index" class="team-card">
          <div class="team-card-inner">
            <!-- Avatar / Imagen del miembro -->
            <div class="team-avatar">
              <img
                v-if="member.avatar"
                :src="member.avatar"
                :alt="member.name"
                width="200"
                height="200"
              />
              <div v-else class="default-avatar">
                {{ member.name[0] }}
              </div>
            </div>

            <!-- Info del miembro -->
            <div class="team-info">
              <h3 class="team-member-name">{{ member.name }}</h3>
              <p class="team-member-position">{{ member.position }}</p>
            </div>

            <!-- Redes sociales -->
            <div v-if="member.social && Object.keys(member.social).length > 0" class="team-social">
              <!-- Facebook -->
              <a
                v-if="member.social?.facebook"
                :href="member.social.facebook"
                target="_blank"
                rel="noopener"
                class="social-icon"
                aria-label="Facebook"
              >
                <i class="fab fa-facebook"></i>
              </a>

              <!-- WhatsApp -->
              <a
                v-if="member.social?.whatsapp"
                :href="member.social.whatsapp"
                target="_blank"
                rel="noopener"
                class="social-icon"
                aria-label="WhatsApp"
              >
                <i class="fab fa-whatsapp"></i>
              </a>

              <!-- Instagram -->
              <a
                v-if="member.social?.instagram"
                :href="member.social.instagram"
                target="_blank"
                rel="noopener"
                class="social-icon"
                aria-label="Instagram"
              >
                <i class="fab fa-instagram"></i>
              </a>

              <!-- Email -->
              <a
                v-if="member.social?.email"
                :href="member.social.email"
                class="social-icon"
                aria-label="Email"
              >
                <i class="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTeam } from '~/composables/useTeam'

defineProps<{ id?: string }>()

const { teamMembers } = useTeam()
</script>

<style scoped src="@/assets/css/components/TeamSection.scss"></style>
