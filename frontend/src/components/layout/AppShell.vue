<template>
  <div class="relative min-h-screen transition-colors duration-200" :class="darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-900'">
    <div class="absolute inset-0" :class="darkMode 
      ? 'bg-[radial-gradient(1200px_800px_at_20%_-10%,rgba(59,130,246,0.35),transparent),radial-gradient(1000px_700px_at_90%_10%,rgba(16,185,129,0.25),transparent),radial-gradient(900px_600px_at_50%_110%,rgba(236,72,153,0.20),transparent)]'
      : 'bg-[radial-gradient(1200px_800px_at_20%_-10%,rgba(59,130,246,0.15),transparent),radial-gradient(1000px_700px_at_90%_10%,rgba(16,185,129,0.10),transparent),radial-gradient(900px_600px_at_50%_110%,rgba(236,72,153,0.08),transparent)]'
    "></div>

    <header class="relative no-print border-b transition-colors duration-200" :class="darkMode ? 'border-slate-800' : 'border-slate-200'">
      <div class="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="@/assets/logo.png" alt="Logo" class="h-10 w-10 rounded-2xl shadow-soft">
          <div>
            <p class="text-sm" :class="darkMode ? 'text-slate-300' : 'text-slate-600'">Struk Generator</p>
            <h1 class="text-lg font-semibold tracking-tight">Klinik & Kasir</h1>
          </div>
        </div>

        <nav class="flex items-center gap-2 text-sm">
          <RouterLink class="navlink" to="/">Dashboard</RouterLink>
          <RouterLink class="navlink" to="/new">Buat Struk</RouterLink>
          <RouterLink class="navlink" to="/settings">Settings</RouterLink>
          <a class="navlink" href="https://github.com/" target="_blank" rel="noreferrer">Docs</a>
        </nav>
        <button
          @click="appStore.toggleDarkMode()"
          class="ml-4 p-2 rounded-lg transition-colors duration-200"
          :class="darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'"
          :title="darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <span class="text-lg">{{ darkMode ? '🌙' : '☀️' }}</span>
        </button>
      </div>
    </header>

    <main class="relative">
      <div class="mx-auto max-w-6xl px-4 pb-10">
        <RouterView />
      </div>
    </main>

    <footer class="relative no-print border-t transition-colors duration-200" :class="darkMode ? 'border-slate-800' : 'border-slate-200'">
      <div class="mx-auto max-w-6xl px-4 py-8 text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-600'">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <p>© {{ year }} Struk App • Vue 3 + Express + MySQL</p>
          <p class="opacity-80">Tip: klik “Print” untuk cetak versi thermal.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const year = new Date().getFullYear()
const darkMode = computed(() => appStore.darkMode)
</script>

<style scoped>
.navlink {
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: color 200ms, background-color 200ms, border-color 200ms;
}

.dark .navlink {
  color: rgba(226, 232, 240, 0.9);
  border: 1px solid transparent;
}

.dark .navlink:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.navlink {
  color: rgb(87, 83, 77);
  border: 1px solid transparent;
}

.navlink:hover {
  color: rgb(15, 23, 42);
  background-color: rgb(226, 232, 240);
  border-color: rgb(203, 213, 225);
}

.dark .router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
}

.router-link-active {
  background-color: rgb(203, 213, 225);
  border: 1px solid rgb(148, 163, 184);
  color: rgb(15, 23, 42);
}
</style>
