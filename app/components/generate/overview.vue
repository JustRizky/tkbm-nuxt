<template>
  <div class="space-y-8">
    <div class="flex justify-between items-end">
      <div>
        <PageHeader />
      </div>
      <div class="flex items-center gap-3">
        <div class="flex flex-col items-end">
          <label class="text-[10px] font-bold text-gray-400 uppercase mr-1">Jumlah Gang</label>
          <input
            v-model="jumlahGang"
            type="number"
            min="1"
            max="10"
            class="w-20 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
        <button
          @click="handleGenerate"
          :disabled="generating"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm active:scale-95 disabled:bg-gray-400 h-[40px] self-end"
        >
          <Zap v-if="!generating" class="w-4 h-4" />
          <Loader2 v-else class="w-4 h-4 animate-spin" />
          {{ generating ? 'Generating...' : 'Generate Jadwal' }}
        </button>
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
            placeholder="Cari regu atau kapal..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <button @click="refresh" class="text-xs font-bold text-blue-600 hover:underline">
          Refresh Data
        </button>
      </div>

      <div v-if="pending" class="p-10 text-center text-gray-500">Loading data jadwal...</div>

      <div v-else-if="filteredData.length" class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-16">#</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama Regu</TableHead>
              <TableHead>Nomor KRK</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Nama Kapal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="w-20"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="(row, index) in filteredData"
              :key="row.id"
              class="hover:bg-gray-50 transition"
            >
              <TableCell class="text-gray-400">{{ index + 1 }}</TableCell>
              <TableCell class="text-sm text-gray-600 whitespace-nowrap">
                {{ formatDate(row.tanggal) }}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs"
                  >
                    {{ row.regu?.namaKepala?.charAt(0) || 'R' }}
                  </div>
                  <span class="font-medium text-gray-800">{{
                    row.regu?.namaKepala || 'Regu'
                  }}</span>
                </div>
              </TableCell>
              <TableCell class="text-sm font-mono text-gray-600">
                {{ row.regu?.nomorKRK || '-' }}
              </TableCell>
              <TableCell>
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-bold uppercase',
                    row.jenis === 'KAPAL'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-emerald-100 text-emerald-600'
                  ]"
                >
                  {{ row.jenis }}
                </span>
              </TableCell>
              <TableCell>
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-bold uppercase',
                    row.shift?.nama === 'Shift 1'
                      ? 'bg-blue-100 text-blue-600'
                      : row.shift?.nama === 'Shift 2'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-red-100 text-red-600'
                  ]"
                >
                  {{ row.shift?.nama }}
                </span>
              </TableCell>
              <TableCell class="text-sm text-gray-700">{{ row.namaKapal || '-' }}</TableCell>
              <TableCell>
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-bold uppercase',
                    row.status === 'Aanvraag'
                      ? 'bg-black text-white'
                      : row.status === 'Batal'
                        ? 'bg-red-600 text-white'
                        : row.status === 'Kapal Sandar'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 text-white'
                  ]"
                >
                  {{ row.status }}
                </span>
              </TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button class="text-gray-400 hover:text-gray-600 p-1 outline-none">
                      <MoreVertical class="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-32">
                    <DropdownMenuItem @click="handleEdit(row)" class="cursor-pointer">
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="handleDelete(row)"
                      class="text-red-600 cursor-pointer"
                    >
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div v-else class="p-10 text-center text-gray-500">Data tidak ditemukan</div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeModal"></div>
          <div
            class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all"
          >
            <div class="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 class="text-lg font-bold text-gray-800">Edit Jadwal Kerja</h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <X class="w-5 h-5" />
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Nama Kapal</label>
                <input
                  v-model="form.namaKapal"
                  type="text"
                  placeholder="Masukkan nama kapal..."
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Status Pekerjaan</label>
                <select
                  v-model="form.status"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                >
                  <option value="Aanvraag">Aanvraag</option>
                  <option value="Kapal Sandar">Kapal Sandar</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Batal">Batal</option>
                </select>
              </div>

              <div class="flex gap-3 mt-6">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
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
import { Calendar, Ship, Users, Zap, Search, MoreVertical, Loader2, X } from 'lucide-vue-next'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'

const { data: response, pending, refresh } = await useFetch('/api/jadwal')
const { data: shiftResponse } = await useFetch('/api/shift')

const jadwalData = computed(() => response.value?.data || [])
const shiftData = computed(() => shiftResponse.value?.data || [])

const isModalOpen = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const loading = ref(false)
const generating = ref(false)
const jumlahGang = ref(1)
const searchQuery = ref('')
const currentTime = ref(new Date())
let timer

const form = ref({
  namaKapal: '',
  status: 'Aanvraag'
})

const getActiveShiftName = () => {
  if (!shiftData.value.length) return '-'
  const sekarang = currentTime.value.getHours() * 60 + currentTime.value.getMinutes()

  const active = shiftData.value.find((s) => {
    if (s.status !== 'AKTIF') return false
    const [hM, mM] = s.jamMulai.split(':').map(Number)
    const [hS, mS] = s.jamSelesai.split(':').map(Number)
    const mulai = hM * 60 + mM
    let selesai = hS * 60 + mS
    if (selesai < mulai) return sekarang >= mulai || sekarang <= selesai
    return sekarang >= mulai && sekarang <= selesai
  })
  return active ? active.nama : '-'
}

const closeModal = () => {
  isModalOpen.value = false
  isEdit.value = false
  editId.value = null
  form.value = { namaKapal: '', status: 'Aanvraag' }
}

const handleEdit = (row) => {
  form.value = {
    namaKapal: row.namaKapal,
    status: row.status
  }
  editId.value = row.id
  isEdit.value = true
  isModalOpen.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEdit.value) {
      await $fetch('/api/jadwal/update', {
        method: 'PUT',
        body: {
          id: editId.value,
          ...form.value
        }
      })
      alert('Jadwal berhasil diupdate!')
    }
    await refresh()
    closeModal()
  } catch (error) {
    alert(error.data?.statusMessage || 'Gagal menyimpan data')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (row) => {
  if (confirm(`Apakah Anda yakin ingin menghapus jadwal regu ${row.regu?.namaKepala}?`)) {
    try {
      await $fetch('/api/jadwal/delete', {
        method: 'DELETE',
        body: { id: row.id }
      })
      alert('Data berhasil dihapus!')
      await refresh()
    } catch (error) {
      alert('Gagal menghapus: ' + error.data?.statusMessage)
    }
  }
}

const handleGenerate = async () => {
  if (jumlahGang.value < 1) {
    alert('Minimal jumlah gang adalah 1')
    return
  }

  generating.value = true
  try {
    await $fetch('/api/jadwal/generate', {
      method: 'POST',
      body: { jumlah: jumlahGang.value }
    })
    await refresh()
    alert(`Sukses! ${jumlahGang.value} Gang berhasil dibuat.`)
  } catch (error) {
    alert('Gagal generate: ' + (error.data?.statusMessage || 'Terjadi kesalahan'))
  } finally {
    generating.value = false
  }
}
const currentDate = computed(() =>
  currentTime.value.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
)

const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return jadwalData.value.filter(
    (i) => i.regu?.namaKepala?.toLowerCase().includes(q) || i.namaKapal?.toLowerCase().includes(q)
  )
})

const stats = computed(() => [
  {
    label: 'Jadwal Dibuat',
    value: jadwalData.value.length,
    icon: Calendar,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    label: 'Kapal Sandar',
    value: jadwalData.value.filter((j) => j.status === 'Kapal Sandar').length,
    icon: Ship,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    label: 'Shift Aktif Sekarang',
    value: getActiveShiftName(),
    icon: Calendar,
    color: 'text-rose-600',
    bg: 'bg-rose-100'
  },
  {
    label: 'Total Regu Aktif',
    value: [...new Set(jadwalData.value.map((j) => j.reguId))].length,
    icon: Users,
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  }
])

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 60000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
