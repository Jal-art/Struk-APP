import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    clinic: {
      name: 'Klinik Ratnasari Sehat RSA',
      address: 'Alamat Klinik (ubah di Settings)',
      phone: '+62 811-2111-1570'
    },
    darkMode: true
  }),
  actions: {
    load() {
      const raw = localStorage.getItem('struk_app_settings')
      if (raw) {
        const data = JSON.parse(raw)
        this.clinic = data.clinic || this.clinic
        this.darkMode = data.darkMode ?? true
      }
      this.applyTheme()
    },
    save() {
      localStorage.setItem('struk_app_settings', JSON.stringify({
        clinic: this.clinic,
        darkMode: this.darkMode
      }))
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      this.applyTheme()
      this.save()
    },
    applyTheme() {
      const html = document.documentElement
      if (this.darkMode) {
        html.classList.add('dark')
        html.style.colorScheme = 'dark'
      } else {
        html.classList.remove('dark')
        html.style.colorScheme = 'light'
      }
    }
  }
})
