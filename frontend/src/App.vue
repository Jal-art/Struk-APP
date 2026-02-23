<template>
  <div class="min-h-screen">
    <AppShell v-if="$route.name !== 'login'" />
    <RouterView v-else />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AppShell from './components/layout/AppShell.vue'

const route = useRoute()
</script>

<style scoped>
</style>
