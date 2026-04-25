<template>
  <div class="space-y-8">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Daftar Jadwal Kerja</h2>
        <p class="text-sm text-gray-500">{{ currentDate }}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm active:scale-95 h-[40px] outline-none"
          >
            <Download class="w-4 h-4" />
            Export Data
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-48 p-2 rounded-xl shadow-xl border-gray-100">
          <DropdownMenuItem
            @click="exportExcel"
            class="cursor-pointer flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
          >
            <div class="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <FileSpreadsheet class="w-4 h-4 text-green-600" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-gray-800">Format Excel</span>
              <span class="text-[10px] text-gray-400">Unduh file .xlsx</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            @click="exportPDF"
            class="cursor-pointer flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 mt-1"
          >
            <div class="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <FileText class="w-4 h-4 text-red-600" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-gray-800">Format PDF</span>
              <span class="text-[10px] text-gray-400">Unduh dokumen .pdf</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="space-y-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase ml-1">Filter Tanggal</label>
          <input
            type="date"
            v-model="filter.tanggal"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
        <div class="space-y-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase ml-1">Filter Shift</label>
          <select
            v-model="filter.shift"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
          >
            <option value="">Semua Shift</option>
            <option v-for="s in shiftData" :key="s.id" :value="s.nama">{{ s.nama }}</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase ml-1">Jenis Regu</label>
          <select
            v-model="filter.jenis"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
          >
            <option value="">Semua Jenis</option>
            <option value="KAPAL">KAPAL</option>
            <option value="DARAT">DARAT</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase ml-1">Status</label>
          <select
            v-model="filter.status"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
          >
            <option value="">Semua Status</option>
            <option value="Aanvraag">Aanvraag</option>
            <option value="Kapal Sandar">Kapal Sandar</option>
            <option value="Batal">Batal</option>
          </select>
        </div>
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

      <div v-if="pending" class="p-10 text-center text-gray-500">Memuat data jadwal...</div>

      <div v-else-if="filteredData.length" class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-16">#</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama Kepala</TableHead>
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
                  <span class="font-medium text-gray-800">{{ row.regu?.namaKepala || '-' }}</span>
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
                    <DropdownMenuItem @click="handleEdit(row)" class="cursor-pointer"
                      >Edit</DropdownMenuItem
                    >
                    <DropdownMenuItem @click="handleDelete(row)" class="text-red-600 cursor-pointer"
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
              <h3 class="text-lg font-bold text-gray-800">Edit Status Jadwal</h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <X class="w-5 h-5" />
              </button>
            </div>
            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase mb-1"
                  >Nama Kapal</label
                >
                <input
                  v-model="form.namaKapal"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase mb-1"
                  >Status Pekerjaan</label
                >
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
                  {{ loading ? 'Menyimpan...' : 'Simpan' }}
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
  Ship,
  Users,
  Search,
  MoreVertical,
  X,
  Download,
  Clock,
  FileSpreadsheet,
  FileText
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
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// -- DATA FETCHING --
const { data: response, pending, refresh } = await useFetch('/api/jadwal')
const { data: shiftResponse } = await useFetch('/api/shift')

const jadwalData = computed(() => response.value?.data || [])
const shiftData = computed(() => shiftResponse.value?.data || [])

// -- STATE --
const isModalOpen = ref(false)
const editId = ref(null)
const loading = ref(false)
const searchQuery = ref('')
const currentTime = ref(new Date())
const filter = ref({
  tanggal: '',
  shift: '',
  jenis: '',
  status: ''
})

const form = ref({
  namaKapal: '',
  status: 'Aanvraag'
})

// -- LOGIC --
const filteredData = computed(() => {
  let data = [...jadwalData.value]
  const q = searchQuery.value.toLowerCase()

  if (q) {
    data = data.filter(
      (i) =>
        i.regu?.namaKepala?.toLowerCase().includes(q) ||
        i.namaKapal?.toLowerCase().includes(q) ||
        i.regu?.nomorKRK?.includes(q)
    )
  }

  if (filter.value.tanggal) {
    data = data.filter((i) => i.tanggal.startsWith(filter.value.tanggal))
  }
  if (filter.value.shift) {
    data = data.filter((i) => i.shift?.nama === filter.value.shift)
  }
  if (filter.value.jenis) {
    data = data.filter((i) => i.jenis === filter.value.jenis)
  }
  if (filter.value.status) {
    data = data.filter((i) => i.status === filter.value.status)
  }

  return data
})

const stats = computed(() => [
  {
    label: 'Total Jadwal',
    value: filteredData.value.length,
    icon: Calendar,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    label: 'Kapal Sandar',
    value: filteredData.value.filter((j) => j.status === 'Kapal Sandar').length,
    icon: Ship,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    label: 'Jadwal Batal',
    value: filteredData.value.filter((j) => j.status === 'Batal').length,
    icon: X,
    color: 'text-red-600',
    bg: 'bg-red-100'
  },
  {
    label: 'Regu Terlibat',
    value: [...new Set(filteredData.value.map((j) => j.reguId))].length,
    icon: Users,
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  }
])

// -- ACTION HANDLERS --
const handleEdit = (row) => {
  form.value = { namaKapal: row.namaKapal, status: row.status }
  editId.value = row.id
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editId.value = null
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await $fetch('/api/jadwal/update', {
      method: 'PUT',
      body: { id: editId.value, ...form.value }
    })
    await refresh()
    closeModal()
  } catch (e) {
    alert('Gagal update')
  } finally {
    loading.value = false
  }
}

const exportExcel = () => {
  const fileDate = new Date().toISOString().split('T')[0]
  const dataToExport = filteredData.value.map((row, index) => ({
    No: index + 1,
    Tanggal: formatDate(row.tanggal),
    'Nama Kepala': row.regu?.namaKepala || '-',
    'Nomor KRK': row.regu?.nomorKRK || '-',
    Jenis: row.jenis,
    Shift: row.shift?.nama || '-',
    'Nama Kapal': row.namaKapal || '-',
    Status: row.status
  }))
  const worksheet = XLSX.utils.json_to_sheet(dataToExport)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Jadwal')
  XLSX.writeFile(workbook, `Jadwal_TKBM_${fileDate}.xlsx`)
}

const exportPDF = () => {
  const doc = new jsPDF()
  const fileDate = new Date().toISOString().split('T')[0]

  const img = new Image()
  img.src = '/logo.png'
  img.onload = () => {
    try {
      doc.addImage(img, 'PNG', 14, 10, 25, 25)
    } catch (e) {
      console.error('Logo gagal load', e)
    }
    generateContent(doc, fileDate)
  }
}

const generateContent = (doc, fileDate) => {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('KOPERASI TENAGA KERJA BONGKAR MUAT USAHA KARYA', 45, 18)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('TERMINAL PETI KEMAS BERLIAN TANJUNG PERAK SURABAYA', 45, 24)
  doc.text('Jl. Kalimas Baru No. 107 Surabaya', 45, 29)
  doc.text('ktbm.tgperak@gmail.com | ktbm.tanjungperak@gmail.com', 45, 34)
  doc.setLineWidth(0.8)
  doc.line(14, 40, 196, 40)
  doc.setLineWidth(0.2)
  doc.line(14, 42, 196, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('ROLLING KERJA KOPERASI TKBM', 105, 52, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const tglFilter = filter.value.tanggal ? formatDate(filter.value.tanggal) : 'Semua Tanggal'
  const shiftFilter = filter.value.shift || 'Semua Shift'
  doc.text('Tanggal', 80, 60)
  doc.text(':', 80 + 20, 60)
  doc.text(tglFilter, 110, 60)
  doc.text('Shift', 80, 66)
  doc.text(':', 80 + 20, 66)
  doc.text(shiftFilter, 110, 66)

  const tableRows = filteredData.value.map((row, index) => [
    index + 1,
    formatDate(row.tanggal),
    row.regu?.namaKepala || '-',
    row.regu?.nomorKRK || '-',
    row.jenis,
    row.shift?.nama || '-',
    row.namaKapal || '-',
    row.status
  ])

  autoTable(doc, {
    head: [['No', 'Tanggal', 'Nama Kepala', 'KRK', 'Jenis', 'Shift', 'Kapal', 'Status']],
    body: tableRows,
    startY: 70,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 8 }
  })
  doc.save(`Jadwal_TKBM_${fileDate}.pdf`)
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
const currentDate = computed(() =>
  currentTime.value.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
)

let timer
onMounted(() => (timer = setInterval(() => (currentTime.value = new Date()), 60000)))
onUnmounted(() => clearInterval(timer))
</script>
