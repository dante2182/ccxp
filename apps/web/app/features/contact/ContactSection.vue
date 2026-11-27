<template>
  <section :id="id" class="contact-section">
    <div class="contact-hero">
      <div class="contact-hero-overlay"></div>
      <div class="contact-hero-content">
        <h2 class="contact-title">CONTÁCTANOS</h2>
        <p class="contact-subtitle">Estamos disponibles para atender sus consultas</p>
      </div>
    </div>

    <div class="contact-main">
      <ContactForm />

      <div class="contact-map">
        <iframe
          :src="contactMap.iframeUrl"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>

    <div class="contact-data">
      <div v-for="(item, index) in contactInfo" :key="index" class="contact-data-item">
        <i :class="`fas ${item.icon}`"></i>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useContact } from '~/composables/useContact'
import ContactForm from './ContactForm.vue'

withDefaults(defineProps<{ id?: string }>(), { id: 'contacto' })

const { contactInfo, contactMap } = useContact()
</script>

<style src="./contact.css"></style>
