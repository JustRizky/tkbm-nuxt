<template>
  <div class="space-y-8">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Daftar Shift Kerja</h2>
        <p class="text-sm text-gray-500">{{ currentDate }}</p>
      </div>
      <button
        @click="isModalOpen = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm active:scale-95"
      >
        <Plus class="w-4 h-4" />
        Tambah Shift
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
            placeholder="Cari nama shift..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <button @click="refresh" class="text-xs font-bold text-blue-600 hover:underline">
          Refresh Data
        </button>
      </div>

      <div v-if="pending" class="p-10 text-center">Loading...</div>

      <div v-else-if="filteredData.length" class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-16">#</TableHead>
              <TableHead>Nama Shift</TableHead>
              <TableHead>Jam Kerja</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="(row, index) in filteredData"
              :key="row.id"
              class="hover:bg-gray-50 transition"
            >
              <TableCell class="text-gray-400">{{ index + 1 }}</TableCell>
              <TableCell>
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-bold uppercase',
                    row.nama === 'Shift 1'
                      ? 'bg-blue-100 text-blue-600'
                      : row.nama === 'Shift 2'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-red-100 text-red-600'
                  ]"
                >
                  {{ row.nama }}
                </span>
              </TableCell>
              <TableCell class="font-medium text-gray-700">
                <div class="flex items-center gap-2">
                  <Clock class="w-4 h-4 text-gray-400" />
                  {{ row.jamMulai }} - {{ row.jamSelesai }}
                </div>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <div
                    :class="[
                      'w-2 h-2 rounded-full',
                      row.status === 'AKTIF' ? 'bg-emerald-500' : 'bg-red-500'
                    ]"
                  ></div>
                  <span class="text-sm font-medium">{{ row.status }}</span>
                </div>
              </TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button class="text-gray-400 hover:text-gray-600 p-1">
                      <MoreVertical class="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="handleEdit(row)">Edit</DropdownMenuItem>
                    <DropdownMenuItem @click="handleDelete(row)" class="text-red-500"
                      >Hapus</DropdownMenuItem
                    >
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
              <h3 class="text-lg font-bold text-gray-800">
                {{ isEdit ? 'Edit Shift Kerja' : 'Tambah Shift Baru' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <X class="w-5 h-5" />
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Nama Shift</label>
                <input
                  v-model="form.nama"
                  type="text"
                  placeholder="Contoh: Shift I"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1">Jam Mulai</label>
                  <input
                    v-model="form.jamMulai"
                    type="time"
                    class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1">Jam Selesai</label>
                  <input
                    v-model="form.jamSelesai"
                    type="time"
                    class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select
                  v-model="form.status"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="NONAKTIF">NON-AKTIF</option>
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
                  class="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  {{ loading ? 'Menyimpan...' : 'Simpan Data' }}
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
import { ref, computed } from 'vue'
import { Plus, Search, MoreVertical, X, Clock, Play, Pause, Calendar } from 'lucide-vue-next'
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

const { data: response, pending, refresh } = await useFetch('/api/shift')
const shiftData = computed(() => response.value?.data || [])

const isModalOpen = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const loading = ref(false)
const searchQuery = ref('')
const currentDate = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const form = ref({ nama: '', jamMulai: '', jamSelesai: '', status: 'AKTIF' })

const closeModal = () => {
  isModalOpen.value = false
  isEdit.value = false
  form.value = { nama: '', jamMulai: '', jamSelesai: '', status: 'AKTIF' }
}

const getShiftColor = (name) => {
  if (name.includes('I')) return 'emerald'
  if (name.includes('II')) return 'blue'
  return 'rose'
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const url = isEdit.value ? '/api/shift/update' : '/api/shift/create'
    await $fetch(url, {
      method: isEdit.value ? 'PUT' : 'POST',
      body: isEdit.value ? { id: editId.value, ...form.value } : form.value
    })
    await refresh()
    closeModal()
  } catch (error) {
    alert(error.data?.statusMessage || 'Gagal menyimpan data')
  } finally {
    loading.value = false
  }
}

const handleEdit = (row) => {
  form.value = { ...row }
  editId.value = row.id
  isEdit.value = true
  isModalOpen.value = true
}

const handleDelete = async (row) => {
  if (confirm(`Hapus shift ${row.nama}?`)) {
    await $fetch('/api/shift/delete', { method: 'DELETE', body: { id: row.id } })
    await refresh()
  }
}

const filteredData = computed(() => {
  return shiftData.value.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const isShiftActiveNow = (mulai, selesai) => {
  const sekarang = new Date()
  const jamSekarang = sekarang.getHours() * 60 + sekarang.getMinutes()

  const [hMulai, mMulai] = mulai.split(':').map(Number)
  const [hSelesai, mSelesai] = selesai.split(':').map(Number)

  const totalMulai = hMulai * 60 + mMulai
  let totalSelesai = hSelesai * 60 + mSelesai

  if (totalSelesai < totalMulai) {
    return jamSekarang >= totalMulai || jamSekarang <= totalSelesai
  }

  return jamSekarang >= totalMulai && jamSekarang <= totalSelesai
}

const activeShiftName = computed(() => {
  const active = shiftData.value.find(
    (s) => s.status === 'AKTIF' && isShiftActiveNow(s.jamMulai, s.jamSelesai)
  )
  return active ? active.nama : 'Tidak Ada'
})

const stats = computed(() => [
  {
    label: 'Total Shift',
    value: shiftData.value.length,
    icon: Clock,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    label: 'Shift Aktif',
    value: shiftData.value.filter((s) => s.status === 'AKTIF').length,
    icon: Play,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    label: 'Shift Nonaktif',
    value: shiftData.value.filter((s) => s.status === 'NONAKTIF').length,
    icon: Pause,
    color: 'text-rose-600',
    bg: 'bg-rose-100'
  },
  {
    label: 'Shift Aktif Hari Ini',
    value: activeShiftName.value,
    icon: Calendar,
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  }
])
</script>
