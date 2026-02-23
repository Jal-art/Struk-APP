import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Load theme on app start
const { useAppStore } = await import('./stores/app.js')
const appStore = useAppStore()
appStore.load()

// Load auth from storage
const { useAuthStore } = await import('./stores/auth.js')
const authStore = useAuthStore()
authStore.loadFromStorage()

app.use(router).mount('#app')
