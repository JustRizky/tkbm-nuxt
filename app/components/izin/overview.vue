<template>
  <div class="space-y-8">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Persetujuan Izin Kerja</h2>
        <p class="text-sm text-gray-500">{{ currentDate }}</p>
      </div>

      <button
        v-if="isKRK"
        @click="openAddModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm active:scale-95 h-[40px] outline-none"
      >
        <Plus class="w-4 h-4" />
        Ajukan Izin
      </button>
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
            placeholder="Cari nomor KRK atau nama kepala..."
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
              <TableHead>Nama Kepala Regu</TableHead>
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
                    {{ row.regu?.namaKepala?.charAt(0) || '?' }}
                  </div>
                  <span class="font-semibold text-gray-800">{{
                    row.regu?.namaKepala || 'Tidak Diketahui'
                  }}</span>
                </div>
              </TableCell>
              <TableCell class="text-sm font-mono text-gray-500">{{
                row.regu?.nomorKRK || '-'
              }}</TableCell>
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
                    <template v-if="userRole === 'ADMIN'">
                      <DropdownMenuLabel
                        class="text-[10px] font-bold uppercase text-gray-400 mb-1 px-2"
                      >
                        Update Keputusan
                      </DropdownMenuLabel>
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
                    </template>

                    <template v-else-if="isKRK">
                      <div v-if="row.status === 'Menunggu Persetujuan'">
                        <DropdownMenuLabel
                          class="text-[10px] font-bold uppercase text-gray-400 mb-1 px-2"
                        >
                          Kelola Pengajuan
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          @click="openEditModal(row)"
                          class="text-blue-600 cursor-pointer font-bold focus:bg-blue-50 rounded-md"
                        >
                          <Pencil class="w-4 h-4 mr-2" /> Edit Alasan
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          @click="handleDelete(row)"
                          class="text-red-600 cursor-pointer font-bold focus:bg-red-50 rounded-md"
                        >
                          <Trash2 class="w-4 h-4 mr-2" /> Batalkan/Hapus
                        </DropdownMenuItem>
                      </div>
                      <span
                        v-else
                        class="text-[10px] text-gray-400 px-2 italic text-center block py-1"
                      >
                        Sudah {{ row.status }}
                      </span>
                    </template>

                    <span
                      v-else
                      class="text-[10px] text-gray-400 px-2 italic text-center block py-1"
                    >
                      Tidak ada akses aksi
                    </span>
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

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeModal"></div>
          <div class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 class="text-lg font-bold text-gray-800">
                {{ editId ? 'Edit Alasan Izin' : 'Ajukan Izin Kerja' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <X class="w-5 h-5" />
              </button>
            </div>
            <form @submit.prevent="handleSubmitIzin" class="p-6 space-y-4">
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1"
                  >Alasan Izin</label
                >
                <textarea
                  v-model="formIzin.alasan"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  required
                ></textarea>
              </div>
              <div class="flex gap-3 mt-6">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-lg text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm transition-all"
                >
                  {{ loading ? 'Mengirim...' : editId ? 'Simpan Perubahan' : 'Kirim Pengajuan' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Hourglass,
  Search,
  MoreVertical,
  Plus,
  X,
  Pencil,
  Trash2
} from 'lucide-vue-next'

// DATA FETCHING
// Pastikan API index.get.ts melakukan { include: { regu: true } }
const { data: response, pending, refresh } = await useFetch('/api/izin')
const izinData = computed(() => response.value?.data || [])

// AUTH & ROLE
const userAuth = useCookie('user_auth')
const userRole = computed(() => userAuth.value?.role?.toUpperCase() || 'ANGGOTA')
const isKRK = computed(() => userRole.value === 'KRK')

// STATE
const searchQuery = ref('')
const currentTime = ref(new Date())
const isModalOpen = ref(false)
const loading = ref(false)
const formIzin = ref({ alasan: '' })

// Perbaikan: Akses pencarian melalui objek regu
const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return izinData.value.filter(
    (i) =>
      i.regu?.namaKepala?.toLowerCase().includes(q) || i.regu?.nomorKRK?.toLowerCase().includes(q)
  )
})

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

// METHODS
const getStatusClass = (status) => {
  if (status === 'Disetujui') return 'bg-emerald-500 text-white'
  if (status === 'Ditolak') return 'bg-red-500 text-white'
  return 'bg-orange-100 text-orange-600'
}

const editId = ref(null)
const openEditModal = (row) => {
  editId.value = row.id
  formIzin.value.alasan = row.alasan
  isModalOpen.value = true
}

const openAddModal = () => {
  formIzin.value.alasan = ''
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editId.value = null
  formIzin.value.alasan = ''
}

const handleAction = async (row, status) => {
  try {
    await $fetch('/api/izin/update', {
      // Pastikan endpoint ini ada
      method: 'PUT',
      body: { id: row.id, status }
    })
    await refresh()
  } catch (error) {
    alert('Gagal update status')
  }
}

const handleSubmitIzin = async () => {
  if (!userAuth.value?.reguId) return alert('Data Regu Anda tidak ditemukan')

  loading.value = true
  const url = editId.value ? '/api/izin/update-alasan' : '/api/izin/create'
  const method = editId.value ? 'PUT' : 'POST'

  try {
    await $fetch(url, {
      method,
      body: {
        id: editId.value,
        alasan: formIzin.value.alasan
      }
    })
    await refresh()
    closeModal()
  } catch (error) {
    alert(error.data?.statusMessage || 'Gagal memproses izin')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (row) => {
  if (!confirm('Apakah Anda yakin ingin membatalkan pengajuan izin ini?')) return

  try {
    await $fetch('/api/izin/delete', {
      method: 'DELETE',
      body: { id: row.id }
    })
    alert('Pengajuan berhasil dihapus')
    await refresh()
  } catch (error) {
    alert('Gagal menghapus pengajuan')
  }
}

// DATE HELPERS
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

let timer
onMounted(() => (timer = setInterval(() => (currentTime.value = new Date()), 60000)))
onUnmounted(() => clearInterval(timer))
</script>
