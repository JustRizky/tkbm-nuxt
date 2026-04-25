<template>
  <div class="space-y-8">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Manajemen Anggota Regu</h2>
        <p class="text-sm text-gray-500">
          Regu {{ reguInfo?.nomorKRK || '...' }} - {{ reguInfo?.namaKepala }}
        </p>
      </div>
      <button
        @click="openAddModal"
        :disabled="isLimitReached && !isEdit"
        :class="[
          'px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm active:scale-95',
          isLimitReached && !isEdit
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        ]"
      >
        <Plus class="w-4 h-4" />
        {{ isLimitReached ? 'Kuota Penuh' : 'Tambah Anggota' }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
          <Users class="w-6 h-6 text-blue-600" />
        </div>
        <h3 class="text-3xl font-bold text-gray-800">{{ reguLimit }}</h3>
        <p class="text-sm text-gray-500 font-medium mt-1">Maksimal Anggota</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
          <UserCheck class="w-6 h-6 text-emerald-600" />
        </div>
        <h3 class="text-3xl font-bold text-gray-800">{{ anggotaList.length }}</h3>
        <p class="text-sm text-gray-500 font-medium mt-1">Anggota Terdaftar</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div
          :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            isLimitReached ? 'bg-red-100' : 'bg-orange-100'
          ]"
        >
          <LayoutGrid :class="['w-6 h-6', isLimitReached ? 'text-red-600' : 'text-orange-600']" />
        </div>
        <h3 class="text-3xl font-bold text-gray-800">{{ reguLimit - anggotaList.length }}</h3>
        <p class="text-sm text-gray-500 font-medium mt-1">Sisa Slot</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-50 flex justify-between items-center">
        <div class="relative max-w-xs w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama anggota..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div v-if="pending" class="p-10 text-center text-gray-400 italic">Memuat data...</div>

      <div v-else-if="filteredAnggota.length" class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-16">#</TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Kedudukan</TableHead>
              <TableHead class="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(user, index) in filteredAnggota"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <TableCell class="text-gray-400">{{ index + 1 }}</TableCell>
              <TableCell class="font-bold text-gray-700">{{ user.name }}</TableCell>
              <TableCell>
                <code class="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">{{
                  user.username
                }}</code>
              </TableCell>
              <TableCell>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border"
                  :class="
                    user.role === 'KRK'
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                  "
                >
                  {{ user.role }}
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
                    <DropdownMenuItem @click="openEditModal(user)" class="cursor-pointer">
                      <Pencil class="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="confirmDelete(user)"
                      class="text-red-500 cursor-pointer"
                    >
                      <Trash2 class="w-4 h-4 mr-2" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div v-else class="p-10 text-center text-gray-500">Belum ada anggota.</div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeModal"></div>
          <div class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 class="text-lg font-bold text-gray-800">
                {{ isEdit ? 'Edit Data Anggota' : 'Tambah Anggota Baru' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <X class="w-5 h-5" />
              </button>
            </div>

            <form @submit.prevent="isEdit ? handleUpdate() : handleCreate()" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Username</label>
                  <input
                    v-model="form.username"
                    type="text"
                    class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">
                    Password {{ isEdit ? '(Opsional)' : '' }}
                  </label>
                  <input
                    v-model="form.password"
                    type="password"
                    placeholder="••••••"
                    class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    :required="!isEdit"
                  />
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
                  {{ loading ? 'Menyimpan...' : isEdit ? 'Update Anggota' : 'Simpan Anggota' }}
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
import {
  Plus,
  Search,
  Users,
  UserCheck,
  LayoutGrid,
  Trash2,
  X,
  MoreVertical,
  Pencil
} from 'lucide-vue-next'
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

const { data: response, pending, refresh } = await useFetch('/api/krk')
const reguInfo = computed(() => response.value?.data || null)
const anggotaList = computed(() => reguInfo.value?.anggota || [])
const reguLimit = computed(() => reguInfo.value?.totalAnggota || 0)
const isLimitReached = computed(() => anggotaList.value.length >= reguLimit.value)

const isModalOpen = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const loading = ref(false)
const searchQuery = ref('')
const form = ref({ name: '', username: '', password: '' })

const openAddModal = () => {
  if (isLimitReached.value) return alert('Kuota anggota sudah maksimal!')
  isEdit.value = false
  isModalOpen.value = true
}

const openEditModal = (user) => {
  isEdit.value = true
  editId.value = user.id
  form.value = {
    name: user.name,
    username: user.username,
    password: ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  isEdit.value = false
  editId.value = null
  form.value = { name: '', username: '', password: '' }
}

const handleCreate = async () => {
  loading.value = true
  try {
    await $fetch('/api/krk/create', {
      method: 'POST',
      body: {
        ...form.value,
        reguId: reguInfo.value.id
      }
    })
    alert('Anggota berhasil ditambahkan!')
    await refresh()
    closeModal()
  } catch (e) {
    alert(e.data?.statusMessage || 'Gagal menambah anggota')
  } finally {
    loading.value = false
  }
}

const handleUpdate = async () => {
  loading.value = true
  try {
    await $fetch('/api/krk/update', {
      method: 'PUT',
      body: {
        ...form.value,
        id: editId.value
      }
    })
    alert('Data anggota diperbarui!')
    await refresh()
    closeModal()
  } catch (e) {
    alert(e.data?.statusMessage || 'Gagal update data')
  } finally {
    loading.value = false
  }
}

const confirmDelete = async (user) => {
  if (confirm(`Hapus ${user.name} dari regu?`)) {
    try {
      await $fetch('/api/krk/delete', {
        method: 'POST',
        body: { id: user.id }
      })
      alert('Berhasil dihapus')
      await refresh()
    } catch (e) {
      alert('Gagal menghapus: ' + e.data?.statusMessage)
    }
  }
}

// -- Helpers --
const filteredAnggota = computed(() => {
  return anggotaList.value.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
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
