<template>
  <section v-bind="$attrs" :id="($attrs as any).id || id" class="partners-section">
    <div v-for="(group, groupIndex) in partnerGroups" :key="groupIndex" class="partner-group">
      <div class="partner-group-header">
        <h2 class="partner-group-title">
          {{ group.title }}
        </h2>
      </div>

      <div class="partner-logos">
        <div class="logos-track">
          <!-- Lista original -->
          <div v-for="(partner, index) in group.partners" :key="'a-' + index" class="partner-logo">
            <img
              :src="partner.image"
              :alt="partner.alt || 'Partner logo'"
              class="partner-image"
              width="150"
              height="150"
            />
          </div>

          <!-- Lista duplicada (para efecto infinito) -->
          <div v-for="(partner, index) in group.partners" :key="'b-' + index" class="partner-logo">
            <img
              :src="partner.image"
              :alt="partner.alt || 'Partner logo'"
              class="partner-image"
              width="150"
              height="150"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePartners } from '@/composables/usePartners'

defineProps({
  id: {
    type: String,
    default: '',
  },
})

const { partnerGroups } = usePartners()
</script>

<style scoped src="@/assets/css/components/PartnersSection.css"></style>
