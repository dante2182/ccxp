<template>
  <section v-bind="$attrs" :id="id" class="services-section">
    <div class="services-container">
      <div class="services-sidebar">
        <h2 class="services-label">SERVICIOS</h2>
      </div>

      <div class="services-grid">
        <div v-for="service in services" :key="service.slug" class="service-card">
          <div class="service-image">
            <img :src="service.image" :alt="service.title" width="600" height="400" />
            <div class="watermark">ccip</div>
          </div>

          <div class="service-content">
            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-description">{{ service.description }}</p>
            <BaseButton :to="`/servicios/${service.slug}`" class="service-btn">DETALLES</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Service } from '@/types/service.types'
import { getAllServices } from '@/composables/useServices'
import BaseButton from '~/components/base/BaseButton.vue'

defineProps<{
  id?: string
}>()

const services: Service[] = getAllServices()
</script>

<style scoped src="@/assets/css/components/ServicesSection.css"></style>
