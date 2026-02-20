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

app.use(router).mount('#app')
