<template>
  <div class="space-y-8">
    <div class="flex justify-between items-end">
      <div>
        <PageHeader />
      </div>
      <button
        @click="isModalOpen = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm active:scale-95"
      >
        <Plus class="w-4 h-4" />
        Tambah Data
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
            placeholder="Cari nomor atau nama..."
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
              <TableHead>Nomor KRK</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Kepala Regu</TableHead>
              <TableHead>Anggota</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="(row, index) in filteredData"
              :key="row.id"
              class="hover:bg-gray-50 transition"
            >
              <TableCell class="text-gray-400">
                {{ index + 1 }}
              </TableCell>

              <TableCell class="font-bold">
                {{ row.nomorKRK }}
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
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs"
                  >
                    {{ row.namaKepala?.charAt(0) || '?' }}
                  </div>
                  <span>{{ row.namaKepala || '-' }}</span>
                </div>
              </TableCell>

              <TableCell> {{ row.totalAnggota }} Orang </TableCell>

              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button class="text-gray-400 hover:text-gray-600 p-1">
                      <MoreVertical class="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="handleEdit(row)"> Edit </DropdownMenuItem>
                    <DropdownMenuItem @click="handleDelete(row)" class="text-red-500">
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
              <h3 class="text-lg font-bold text-gray-800">
                {{ isEdit ? 'Edit Regu Kerja' : 'Tambah Regu Kerja Baru' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <X class="w-5 h-5" />
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Nomor KRK</label>
                <input
                  v-model="form.nomorKRK"
                  type="text"
                  placeholder="333"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Jenis Regu</label>
                <select
                  v-model="form.jenis"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                >
                  <option value="KAPAL">KAPAL</option>
                  <option value="DARAT">DARAT</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Nama Kepala Regu</label>
                <input
                  v-model="form.namaKepala"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Jumlah Anggota</label>
                <input
                  v-model.number="form.totalAnggota"
                  type="number"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                />
              </div>
              <div class="pt-4 border-t border-gray-100 space-y-4">
                <div class="flex items-center gap-2">
                  <ShieldCheck class="w-4 h-4 text-blue-600" />
                  <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest"
                    >Kredensial Login KRK</span
                  >
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Username</label>
                    <input
                      v-model="form.usernameKRK"
                      type="text"
                      placeholder="user_krk"
                      class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                      :required="!isEdit"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Password</label>
                    <input
                      v-model="form.passwordKRK"
                      type="password"
                      placeholder="••••••"
                      class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                      :required="!isEdit"
                    />
                  </div>
                </div>
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
import { Ship, Truck, Users, LayoutGrid, Plus, Search, MoreVertical, X } from 'lucide-vue-next'
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

const { data: response, pending, refresh } = await useFetch('/api/regu')
const reguData = computed(() => response.value?.data || [])

const isModalOpen = ref(false)
const loading = ref(false)
const searchQuery = ref('')
const currentDate = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const form = ref({
  nomorKRK: '',
  jenis: 'KAPAL',
  namaKepala: '',
  totalAnggota: 8,
  usernameKRK: '',
  passwordKRK: ''
})

const closeModal = () => {
  isModalOpen.value = false
  isEdit.value = false
  editId.value = null
  form.value = {
    nomorKRK: '',
    jenis: 'KAPAL',
    namaKepala: '',
    totalAnggota: 8,
    usernameKRK: '',
    passwordKRK: ''
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEdit.value) {
      await $fetch('/api/regu/update', {
        method: 'PUT',
        body: {
          id: editId.value,
          ...form.value
        }
      })

      alert('Data berhasil diupdate!')
    } else {
      await $fetch('/api/regu/create', {
        method: 'POST',
        body: form.value
      })

      alert('Sukses! Regu ' + form.value.nomorKRK + ' berhasil disimpan.')
    }

    await refresh()
    closeModal()
  } catch (error) {
    alert(error.data?.statusMessage || 'Gagal menyimpan data')
  } finally {
    loading.value = false
  }
}

const isEdit = ref(false)
const editId = ref(null)

const handleEdit = (row) => {
  form.value = {
    ...row,
    usernameKRK: row.anggota && row.anggota.length > 0 ? row.anggota[0].username : '',
    passwordKRK: ''
  }
  editId.value = row.id
  isEdit.value = true
  isModalOpen.value = true
}

const handleDelete = async (row) => {
  if (confirm(`Apakah Anda yakin ingin menghapus regu ${row.nomorKRK}?`)) {
    try {
      await $fetch('/api/regu/delete', {
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

const filteredData = computed(() => {
  return reguData.value.filter(
    (item) =>
      item.nomorKRK.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.namaKepala.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const stats = computed(() => [
  {
    label: 'Total Regu Kerja',
    value: reguData.value.length,
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    label: 'Total Regu Kapal',
    value: reguData.value.filter((r) => r.jenis === 'KAPAL').length,
    icon: Ship,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    label: 'Total Regu Darat',
    value: reguData.value.filter((r) => r.jenis === 'DARAT').length,
    icon: Truck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100'
  },
  {
    label: 'Update Baru',
    value: reguData.value.length > 0 ? 'Aktif' : 'Kosong',
    icon: LayoutGrid,
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  }
])
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
