<script setup lang="ts">
import { useLanding } from '~/composables/useLanding'
import { useTheme } from '~/composables/useTheme'

const { theme } = useTheme()
const { quoteService, requestQuote } = useLanding()
</script>

<template>
  <div class="contents">
    <Hero :theme="theme" @quote="requestQuote()" />
    <TrustBar />
    <Services @quote="requestQuote" />
    <Approach @quote="requestQuote" />
    <About />
    <Blog @quote="requestQuote" />
    <Contact :preselect="quoteService" />
  </div>
</template>
