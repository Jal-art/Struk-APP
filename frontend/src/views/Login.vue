<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-10">
    <!-- Toast (User-friendly notification) -->
    <transition name="toast">
      <div
        v-if="toast.show"
        class="fixed top-5 right-5 z-50 w-[92vw] max-w-sm rounded-xl border px-4 py-3 shadow-lg backdrop-blur
               bg-white/95 dark:bg-slate-900/95
               border-slate-200 dark:border-slate-800"
      >
        <div class="flex items-start gap-3">
          <div
            class="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg"
            :class="toast.type === 'error'
              ? 'bg-red-500/10 text-red-600 dark:text-red-300'
              : 'bg-blue-500/10 text-blue-600 dark:text-blue-300'"
          >
            <svg v-if="toast.type === 'error'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 102 0 1 1 0 00-2 0zm0-8a1 1 0 012 0v6a1 1 0 11-2 0V5z"
                clip-rule="evenodd"
              />
            </svg>
            <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 9.25A8.001 8.001 0 1110.75 17.997a.75.75 0 01-1.5 0A8.001 8.001 0 012.003 9.25z" />
              <path
                d="M13.78 7.72a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97 2.97-2.97a.75.75 0 011.06 0z"
              />
            </svg>
          </div>

          <div class="flex-1">
            <p class="text-sm font-semibold text-slate-900 dark:text-white">
              {{ toast.type === 'error' ? 'Gagal' : 'Info' }}
            </p>
            <p class="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
              {{ toast.message }}
            </p>
          </div>

          <button
            type="button"
            class="rounded-lg px-2 py-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
            @click="hideToast"
            aria-label="Close toast"
          >
            ✕
          </button>
        </div>
      </div>
    </transition>

    <div class="w-full max-w-md">
      <!-- Brand -->
      <div class="text-center mb-8">
        <div class="mx-auto w-20 h-20 rounded-2xl shadow-lg mb-4 flex items-center justify-center bg-white dark:bg-slate-800 p-1">
          <img src="@/assets/logo.png" alt="Logo" class="w-full h-full object-contain" />
        </div>
        <h1 class="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Struk App</h1>
        <p class="mt-1 text-slate-600 dark:text-slate-300">Sistem Manajemen Kuitansi</p>
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Masuk ke akun</h2>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Masukkan username dan password untuk melanjutkan.
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Username
            </label>
            <div class="relative">
              <input
                v-model="form.username"
                type="text"
                autocomplete="username"
                placeholder="Masukkan username"
                class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 dark:focus:border-blue-400 transition"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Password
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Masukkan password"
                class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 pr-11 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 dark:focus:border-blue-400 transition"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
                :disabled="isLoading"
                aria-label="Toggle password visibility"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 1019.542 10h-2.003a8 8 0 10-13.72 1.713l-1.112-1.112zM10 12a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Alert di bawah Password -->
          <transition name="fade">
            <div
              v-if="error"
              class="rounded-lg border border-red-300 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40 px-3 py-2.5 flex items-start gap-2"
            >
              <svg class="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-red-800 dark:text-red-300">
                  {{ error }}
                </p>
              </div>
            </div>
          </transition>

          <!-- Remember -->
          <div class="flex items-center justify-between gap-3">
            <label class="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 select-none">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/20"
                :disabled="isLoading"
              />
              Ingat saya
            </label>

            <!-- spacer biar layout tetap rapi -->
            <span class="text-sm text-transparent select-none">.</span>
          </div>

          <!-- Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="!isLoading">Masuk</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memproses...
            </span>
          </button>

          <!-- Demo helper -->
          <div class="pt-2">
            <button
              type="button"
              @click="fillDemo"
              class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold py-3 transition flex items-center justify-center gap-2"
            >
              <span class="text-lg">👤</span>
              Pakai akun demo (admin / admin123)
            </button>

            <p class="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
              © 2026 Struk App • Versi 1.0.0
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ username: '', password: '' })
const isLoading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(true)

// Toast state + helpers
const toast = ref({
  show: false,
  message: '',
  type: 'info' // 'info' | 'error'
})

let toastTimer = null

const showToast = (message, type = 'info') => {
  toast.value = { show: true, message, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const hideToast = () => {
  toast.value.show = false
  if (toastTimer) clearTimeout(toastTimer)
}

// helper untuk tentukan login sukses/gagal (biar toast pasti muncul)
const isLoginOk = (res) => {
  if (res === true) return true
  if (res && typeof res === 'object') {
    if (res.success === true) return true
    if (res.ok === true) return true
    if (res.status === 'success') return true
  }
  // fallback cek state store (sesuaikan kalau punya field berbeda)
  if (authStore?.isAuthenticated === true) return true
  if (authStore?.user != null) return true
  if (authStore?.token) return true
  return false
}

const handleLogin = async () => {
  error.value = ''

  if (!form.value.username || !form.value.password) {
    const msg = 'Username dan password harus diisi.'
    error.value = msg
    showToast(msg, 'error')
    return
  }

  isLoading.value = true
  try {
    const res = await authStore.login(
      form.value.username,
      form.value.password,
      { rememberMe: rememberMe.value }
    )

    // ✅ ini yang bikin toast muncul meski login() tidak throw
    if (!isLoginOk(res)) {
      const msg =
        authStore?.error ||
        authStore?.errorMessage ||
        'Username atau password salah.'
      error.value = msg
      showToast(msg, 'error')
      return
    }

    router.push('/')
  } catch (e) {
    const msg =
      e?.userMessage ||
      e?.message ||
      'Login gagal. Coba periksa kembali kredensial Anda.'
    error.value = msg
    showToast(msg, 'error')
  } finally {
    isLoading.value = false
  }
}

const fillDemo = () => {
  form.value.username = 'admin'
  form.value.password = 'admin123'
  error.value = ''
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>