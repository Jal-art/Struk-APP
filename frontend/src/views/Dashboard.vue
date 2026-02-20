<template>
  <div class="pt-6">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p class="text-slate-300 mt-1">Kelola transaksi & cetak struk dengan cepat.</p>
      </div>
      <RouterLink to="/new" class="no-print">
        <Button>➕ Buat Struk</Button>
      </RouterLink>
    </div>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card class="p-5 lg:col-span-1">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-300">Status API</p>
          <span class="text-xs px-2 py-1 rounded-lg ring-1 ring-white/10 bg-white/5">{{ apiStatus }}</span>
        </div>
        <p class="mt-3 text-3xl font-semibold">{{ store.items.length }}</p>
        <p class="text-sm text-slate-300 mt-1">Transaksi tersimpan</p>
        <div class="mt-4 flex gap-2">
          <Button variant="ghost" @click="reload">↻ Refresh</Button>
          <RouterLink to="/settings"><Button variant="ghost">⚙️ Settings</Button></RouterLink>
        </div>
      </Card>

      <Card class="p-5 lg:col-span-2">
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold">Riwayat</p>
              <p class="text-xs text-slate-400">Klik item untuk buka & print.</p>
            </div>
            <input v-model="q" class="w-full max-w-xs rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm placeholder:text-slate-500 focus:ring-white/20"
                   placeholder="Cari pasien / kode..." />
          </div>

          <!-- Filter Section -->
          <div class="flex gap-3 flex-wrap items-end">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-slate-400">Dari:</label>
              <input v-model="dateFrom" type="date" class="rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm focus:ring-white/20" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-slate-400">Sampai:</label>
              <input v-model="dateTo" type="date" class="rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm focus:ring-white/20" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-slate-400">Metode Bayar:</label>
              <select v-model="paymentMethodFilter" class="rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm focus:ring-white/20">
                <option value="">Semua Metode</option>
                <option value="cash">Cash</option>
                <option value="transfer">Transfer</option>
                <option value="qris">QRIS</option>
                <option value="debit">Debit</option>
              </select>
            </div>
            <button v-if="dateFrom || dateTo || paymentMethodFilter" @click="resetFilters" class="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-white/5 transition">
              ✕ Reset Filter
            </button>
          </div>
        </div>

        <div class="mt-4">
          <div v-if="store.loading" class="text-sm text-slate-300">Memuat...</div>
          <div v-else-if="store.error" class="text-sm text-rose-300">{{ store.error }}</div>

          <div v-else class="divide-y divide-white/10">
            <RouterLink
              v-for="t in filtered"
              :key="t.id"
              :to="`/receipt/${t.id}`"
              class="block py-3 hover:bg-white/5 rounded-xl px-3 transition"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-sm font-semibold truncate">{{ t.patientName || '—' }}</p>
                  <p class="text-xs text-slate-400 truncate">{{ t.code }} • {{ shortDate(t.createdAt) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold">{{ rupiah(t.total) }}</p>
                  <p class="text-xs text-slate-400">{{ t.paymentMethod || '-' }}</p>
                </div>
              </div>
            </RouterLink>

            <div v-if="filtered.length === 0" class="py-8 text-center text-sm text-slate-400">
              Belum ada transaksi yang cocok.
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import { useReceiptsStore } from '../stores/receipts'
import { rupiah, shortDate } from '../lib/format'
import api from '../lib/http'

const store = useReceiptsStore()
const q = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const paymentMethodFilter = ref('')
const apiStatus = ref('checking...')

const filtered = computed(() => {
  let result = store.items

  // Filter berdasarkan pencarian
  const s = q.value.trim().toLowerCase()
  if (s) {
    result = result.filter(x =>
      String(x.patientName || '').toLowerCase().includes(s) ||
      String(x.code || '').toLowerCase().includes(s)
    )
  }

  // Filter berdasarkan tanggal from
  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value)
    result = result.filter(x => new Date(x.createdAt) >= fromDate)
  }

  // Filter berdasarkan tanggal to
  if (dateTo.value) {
    const toDate = new Date(dateTo.value)
    toDate.setHours(23, 59, 59, 999)
    result = result.filter(x => new Date(x.createdAt) <= toDate)
  }

  // Filter berdasarkan metode bayar
  if (paymentMethodFilter.value) {
    result = result.filter(x =>
      String(x.paymentMethod || '').toLowerCase() === paymentMethodFilter.value.toLowerCase()
    )
  }

  return result
})

function resetFilters() {
  dateFrom.value = ''
  dateTo.value = ''
  paymentMethodFilter.value = ''
}

async function reload() {
  await store.fetchAll()
}

onMounted(async () => {
  try {
    const { data } = await api.get('/health')
    apiStatus.value = data?.status || 'ok'
  } catch {
    apiStatus.value = 'offline'
  }
  await store.fetchAll()
})
</script>

<style scoped></style>
