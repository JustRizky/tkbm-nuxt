<template>
  <div class="space-y-8">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Persetujuan Izin Kerja</h2>
        <p class="text-sm text-gray-500">{{ currentDate }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-4', stat.bg]">
          <component :is="stat.icon" :class="['w-6 h-6', stat.color]" />
        </div>
        <h3 class="text-3xl font-bold text-gray-800">{{ stat.value }}</h3>
        <p class="text-sm text-gray-500 font-medium mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div
        class="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div class="relative max-w-xs w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nomor atau nama..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <button @click="refresh" class="text-xs font-bold text-blue-600 hover:underline">
          Refresh List
        </button>
      </div>

      <div v-if="pending" class="p-10 text-center text-gray-500 font-medium">
        Menarik data izin...
      </div>

      <div v-else-if="filteredData.length" class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-16">#</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama Anggota</TableHead>
              <TableHead>No. KRK</TableHead>
              <TableHead>Alasan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="w-20 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="(row, index) in filteredData"
              :key="row.id"
              class="hover:bg-gray-50 transition"
            >
              <TableCell class="text-gray-400 font-medium">{{ index + 1 }}</TableCell>
              <TableCell class="text-sm text-gray-600">{{ formatDate(row.tanggal) }}</TableCell>
              <TableCell>
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[10px]"
                  >
                    {{ row.nama?.charAt(0) || 'U' }}
                  </div>
                  <span class="font-semibold text-gray-800">{{ row.nama }}</span>
                </div>
              </TableCell>
              <TableCell class="text-sm font-mono text-gray-500">{{ row.nomorKRK }}</TableCell>
              <TableCell class="text-sm text-gray-600 max-w-[200px] truncate">
                {{ row.alasan }}
              </TableCell>
              <TableCell>
                <span
                  :class="[
                    'px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider',
                    getStatusClass(row.status)
                  ]"
                >
                  {{ row.status }}
                </span>
              </TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button
                      class="text-gray-400 hover:text-gray-600 p-1 outline-none transition-colors"
                    >
                      <MoreVertical class="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-48 p-2">
                    <DropdownMenuLabel
                      class="text-[10px] font-bold uppercase text-gray-400 mb-1 px-2"
                      >Update Keputusan</DropdownMenuLabel
                    >
                    <DropdownMenuItem
                      @click="handleAction(row, 'Disetujui')"
                      class="text-emerald-600 cursor-pointer font-bold focus:bg-emerald-50 rounded-md"
                    >
                      <CheckCircle2 class="w-4 h-4 mr-2" /> Setujui Izin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="handleAction(row, 'Ditolak')"
                      class="text-red-600 cursor-pointer font-bold focus:bg-red-50 rounded-md"
                    >
                      <XCircle class="w-4 h-4 mr-2" /> Tolak Izin
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div v-else class="p-10 text-center text-gray-400 italic">
        Belum ada pengajuan izin hari ini.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar, CheckCircle2, XCircle, Hourglass, Search, MoreVertical } from 'lucide-vue-next'

const { data: response, pending, refresh } = await useFetch('/api/izin-kerja')
const izinData = computed(() => response.value?.data || [])

const searchQuery = ref('')
const currentTime = ref(new Date())

const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return izinData.value.filter((i) => i.nama?.toLowerCase().includes(q))
})

const getStatusClass = (status) => {
  if (status === 'Disetujui') return 'bg-emerald-500 text-white'
  if (status === 'Ditolak') return 'bg-red-500 text-white'
  return 'bg-orange-100 text-orange-600'
}

const handleAction = async (row, status) => {
  try {
    await $fetch('/api/izin-kerja/update', {
      method: 'PUT',
      body: { id: row.id, status }
    })
    await refresh()
  } catch (error) {
    alert('Gagal update status')
  }
}

const stats = computed(() => [
  {
    label: 'Total Izin',
    value: izinData.value.length,
    icon: Calendar,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    label: 'Disetujui',
    value: izinData.value.filter((i) => i.status === 'Disetujui').length,
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100'
  },
  {
    label: 'Ditolak',
    value: izinData.value.filter((i) => i.status === 'Ditolak').length,
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-100'
  },
  {
    label: 'Menunggu',
    value: izinData.value.filter((i) => i.status === 'Menunggu Persetujuan').length,
    icon: Hourglass,
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  }
])

const currentDate = computed(() =>
  currentTime.value.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
)
const formatDate = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
</script>
