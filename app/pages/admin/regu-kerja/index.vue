<template>
  <div class="space-y-8">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Daftar Regu Kerja</h2>
        <p class="text-sm text-gray-500">Jum'at, 9 Januari 2026</p>
      </div>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm">
        <Plus class="w-4 h-4" />
        Tambah Data
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-4', stat.bg]">
          <component :is="stat.icon" :class="['w-6 h-6', stat.color]" />
        </div>
        <h3 class="text-3xl font-bold text-gray-800">{{ stat.value }}</h3>
        <p class="text-sm text-gray-500 font-medium mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="relative max-w-xs w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nomor atau nama KRK..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
            <Filter class="w-4 h-4" />
            Filters
          </button>
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
            Columns
            <ChevronDown class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50">
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Nomor KRK</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Jenis</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Nama Kepala Regu</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Anggota</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="row in reguData" :key="row.nomor" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-700">{{ row.nomor }}</td>
              <td class="px-6 py-4">
                <span 
                  :class="[
                    'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                    row.jenis === 'Kapal' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                  ]"
                >
                  {{ row.jenis }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                    <img :src="`https://ui-avatars.com/api/?name=${row.nama}&background=random`" alt="Avatar" />
                  </div>
                  <span class="text-sm font-semibold text-gray-800">{{ row.nama }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 font-medium">{{ row.anggota }} Orang</td>
              <td class="px-6 py-4 text-right">
                <button class="text-gray-400 hover:text-gray-600 p-1">
                  <MoreVertical class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-6 border-t border-gray-50 flex items-center justify-between">
        <p class="text-xs text-gray-500">Menampilkan 1 - 7 dari 115 data regu</p>
        <div class="flex items-center gap-2">
          <button class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"><ChevronLeft class="w-4 h-4" /></button>
          <button class="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold">1</button>
          <button class="w-8 h-8 rounded-lg hover:bg-gray-50 text-xs font-medium text-gray-600">2</button>
          <button class="w-8 h-8 rounded-lg hover:bg-gray-50 text-xs font-medium text-gray-600">3</button>
          <button class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight class="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Ship, Truck, Users, LayoutGrid, Plus, 
  Search, Filter, ChevronDown, MoreVertical,
  ChevronLeft, ChevronRight
} from 'lucide-vue-next'

const stats = [
  { label: 'Total Regu Kerja', value: '115', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Total Regu Kapal', value: '48', icon: Ship, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Total Regu Darat', value: '67', icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { label: 'Regu Aktif Hari Ini', value: '16', icon: LayoutGrid, color: 'text-orange-600', bg: 'bg-orange-100' },
]

const reguData = [
  { nomor: '333', jenis: 'Kapal', nama: 'Agus', anggota: 8 },
  { nomor: '334', jenis: 'Kapal', nama: 'Bambang', anggota: 8 },
  { nomor: '335', jenis: 'Darat', nama: 'Udin', anggota: 8 },
  { nomor: '336', jenis: 'Darat', nama: 'Joko', anggota: 8 },
  { nomor: '337', jenis: 'Darat', nama: 'Rizky', anggota: 8 },
  { nomor: '338', jenis: 'Darat', nama: 'Doni', anggota: 8 },
  { nomor: '339', jenis: 'Darat', nama: 'Fajar', anggota: 8 },
]
</script>
