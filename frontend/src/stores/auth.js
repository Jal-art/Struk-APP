import { defineStore } from 'pinia'
import api from '../lib/http'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isLoading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin'
    },

    actions: {
        async login(username, password) {
            this.isLoading = true
            this.error = null
            try {
                const response = await api.post('/auth/login', { username, password })
                this.token = response.data.token
                this.user = response.data.user
                localStorage.setItem('struk_auth_token', this.token)
                localStorage.setItem('struk_auth_user', JSON.stringify(this.user))
                // Update axios header
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
            } catch (e) {
                this.error = e.userMessage || 'Login gagal'
                throw e
            } finally {
                this.isLoading = false
            }
        },

        async logout() {
            this.isLoading = true
            try {
                await api.post('/auth/logout')
            } catch (e) {
                console.error('Logout error:', e)
            } finally {
                this.token = null
                this.user = null
                localStorage.removeItem('struk_auth_token')
                localStorage.removeItem('struk_auth_user')
                delete api.defaults.headers.common['Authorization']
                this.isLoading = false
            }
        },

        async fetchProfile() {
            try {
                const response = await api.get('/auth/profile')
                this.user = response.data.data
            } catch (e) {
                console.error('Fetch profile error:', e)
                this.logout()
            }
        },

        loadFromStorage() {
            const token = localStorage.getItem('struk_auth_token')
            const user = localStorage.getItem('struk_auth_user')
            if (token && user) {
                this.token = token
                this.user = JSON.parse(user)
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }
        },

        clearError() {
            this.error = null
        }
    }
})
