<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Trash</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola transaksi yang telah dihapus</p>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="flex gap-3">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari kode, nama pasien..."
        class="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="handleSearch"
        :disabled="loading"
        class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50"
      >
        Cari
      </button>
      <button
        @click="handleClearSearch"
        class="px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition"
      >
        Reset
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-4 rounded-lg" :class="darkMode ? 'bg-slate-800' : 'bg-slate-100'">
        <p class="text-sm text-slate-500 dark:text-slate-400">Total di Trash</p>
        <p class="text-2xl font-bold">{{ trashedItems.length }}</p>
      </div>
      <div class="p-4 rounded-lg" :class="darkMode ? 'bg-slate-800' : 'bg-slate-100'">
        <p class="text-sm text-slate-500 dark:text-slate-400">Total Nilai</p>
        <p class="text-2xl font-bold">{{ formatCurrency(totalValue) }}</p>
      </div>
      <div class="p-4 rounded-lg" :class="darkMode ? 'bg-slate-800' : 'bg-slate-100'">
        <p class="text-sm text-slate-500 dark:text-slate-400">Dihapus pada</p>
        <p class="text-lg font-semibold">{{ lastDeleted || '-' }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-slate-500 dark:text-slate-400">Loading...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!trashedItems.length" class="text-center py-12">
      <p class="text-3xl mb-2"></p>
      <p class="text-slate-500 dark:text-slate-400">Trash kosong</p>
    </div>

    <!-- Trashed Items Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr :class="darkMode ? 'bg-slate-800' : 'bg-slate-100'">
            <th class="px-4 py-3 text-left font-semibold">Kode</th>
            <th class="px-4 py-3 text-left font-semibold">Pasien</th>
            <th class="px-4 py-3 text-left font-semibold">Unit</th>
            <th class="px-4 py-3 text-right font-semibold">Total</th>
            <th class="px-4 py-3 text-left font-semibold">Dihapus</th>
            <th class="px-4 py-3 text-center font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in trashedItems"
            :key="item.id"
            :class="darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'"
            class="border-t transition"
          >
            <td class="px-4 py-3 font-mono font-semibold">{{ item.code }}</td>
            <td class="px-4 py-3">{{ item.patientName || '-' }}</td>
            <td class="px-4 py-3 text-xs">{{ item.unit || '-' }}</td>
            <td class="px-4 py-3 text-right font-semibold">{{ formatCurrency(item.total) }}</td>
            <td class="px-4 py-3 text-xs">{{ formatDate(item.deletedAt) }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2 justify-center">
                <button
                  @click="handleRestore(item.id)"
                  :disabled="processingId === item.id"
                  class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition disabled:opacity-50"
                  title="Kembalikan dari trash"
                >
                  ↩️ Restore
                </button>
                <button
                  @click="handlePermanentDelete(item.id)"
                  :disabled="processingId === item.id"
                  class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition disabled:opacity-50"
                  title="Hapus permanen"
                >
                  🗑️ Hapus
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bulk Actions -->
    <div v-if="trashedItems.length" class="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
      <p class="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
        💡 Tip: Data di trash akan dihapus otomatis setelah 30 hari
      </p>
      <button
        @click="handleEmptyTrash"
        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
      >
        🔥 Kosongkan Semua Trash
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useReceiptsStore } from '@/stores/receipts'
import { useAppStore } from '@/stores/app'

const receiptsStore = useReceiptsStore()
const appStore = useAppStore()
const darkMode = computed(() => appStore.darkMode)

const searchQuery = ref('')
const loading = computed(() => receiptsStore.loading)
const trashedItems = computed(() => receiptsStore.trashedItems)
const processingId = ref(null)

const totalValue = computed(() => {
  return trashedItems.value.reduce((sum, item) => sum + (item.total || 0), 0)
})

const lastDeleted = computed(() => {
  if (!trashedItems.value.length) return '-'
  const latest = new Date(trashedItems.value[0].deletedAt)
  return latest.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
})

onMounted(() => {
  receiptsStore.fetchTrashed()
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSearch = async () => {
  await receiptsStore.fetchTrashed(searchQuery.value)
}

const handleClearSearch = async () => {
  searchQuery.value = ''
  await receiptsStore.fetchTrashed('')
}

const handleRestore = async (id) => {
  if (!confirm('Kembalikan transaksi ini dari trash?')) return
  
  processingId.value = id
  try {
    await receiptsStore.restore(id)
    alert('✅ Transaksi telah dipulihkan')
  } catch (e) {
    alert('❌ ' + (e.userMessage || 'Gagal memulihkan'))
  } finally {
    processingId.value = null
  }
}

const handlePermanentDelete = async (id) => {
  if (!confirm('⚠️ Hapus permanen? Data tidak bisa dikembalikan!')) return
  
  processingId.value = id
  try {
    await receiptsStore.permanentlyDelete(id)
    alert('✅ Transaksi telah dihapus permanen')
  } catch (e) {
    alert('❌ ' + (e.userMessage || 'Gagal menghapus'))
  } finally {
    processingId.value = null
  }
}

const handleEmptyTrash = async () => {
  if (!confirm('⚠️ Kosongkan SEMUA trash? Data tidak bisa dikembalikan!')) return
  
  const count = trashedItems.value.length
  let deleted = 0
  
  for (const item of trashedItems.value) {
    try {
      await receiptsStore.permanentlyDelete(item.id)
      deleted++
    } catch (e) {
      console.error(e)
    }
  }
  
  alert(`✅ ${deleted}/${count} transaksi telah dihapus permanen`)
}
</script>
