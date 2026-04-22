<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-gray-800">Selamat Datang, {{ userName }}!</h2>
      <p class="text-sm text-gray-500">{{ today }}</p>
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-lg font-bold text-gray-800">Jadwal Kerja</h3>
            <p class="text-xs text-gray-400">Overview Grafik Jadwal Terbaru</p>
          </div>
          <div class="flex items-center gap-2 text-[10px] text-gray-500">
            <div class="w-3 h-3 bg-blue-900 rounded-sm"></div> Jumlah Regu Bekerja
          </div>
        </div>

        <div class="h-64 flex items-end justify-between gap-2 pt-4 border-l border-b border-gray-100 relative">
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none pr-2">
            <div v-for="n in 6" :key="n"
              class="border-t border-gray-50 w-full text-[10px] text-gray-300 flex justify-end items-start">{{ 11 - n }}
            </div>
          </div>

          <div v-for="(val, day) in { Senin: 80, Selasa: 100, Rabu: 100, Kamis: 75, Jumat: 80, Sabtu: 65, Minggu: 65 }"
            :key="day" class="relative group flex-1 flex flex-col items-center">
            <div :style="{ height: val + '%' }"
              class="w-full max-w-[40px] bg-blue-900 rounded-t-sm transition-all hover:bg-blue-800"></div>
            <span class="text-[10px] text-gray-400 mt-2">{{ day }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800">Aktivitas Regu per Shift</h3>
        <p class="text-xs text-gray-400 mb-8">Overview Grafik Aktivitas Regu per Shift</p>

        <div class="relative w-48 h-48 mx-auto mb-8">
          <div class="absolute inset-0 rounded-full border-[25px] border-blue-600"
            style="clip-path: polygon(50% 50%, 100% 0, 100% 50%);"></div>
          <div class="absolute inset-0 rounded-full border-[25px] border-orange-400"
            style="clip-path: polygon(50% 50%, 0 0, 100% 0);"></div>
          <div class="absolute inset-0 rounded-full border-[25px] border-rose-600"
            style="clip-path: polygon(50% 50%, 0 0, 0 100%, 100% 100%, 100% 50%);"></div>
        </div>

        <div class="space-y-2">
          <div
            v-for="(color, shift) in { 'bg-blue-600': 'Shift I', 'bg-rose-600': 'Shift II', 'bg-orange-400': 'Shift III' }"
            :key="shift" class="flex items-center gap-2">
            <div :class="['w-2 h-2 rounded-full', color]"></div>
            <span class="text-xs text-gray-600 font-medium">{{ shift }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800 mb-6">Aktivitas Terbaru</h3>
        <div class="space-y-6">
          <div v-for="act in activities" :key="act.time" class="flex items-center gap-4">
            <div class="w-10 h-10 bg-rose-50 flex items-center justify-center rounded-lg text-rose-500">
              <Calendar class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm font-bold text-gray-800">{{ act.title }}</p>
              <p class="text-xs text-gray-400">{{ act.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800 mb-6">Panduan Singkat Penggunaan Sistem</h3>
        <div class="flex gap-4">
          <div class="flex-1 p-6 bg-slate-50 rounded-xl border border-gray-100">
            <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Info class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-gray-800 mb-2 leading-tight">Bagaimana Generate Jadwal</h4>
            <p class="text-[10px] text-gray-500 mb-4">Membuat jadwal kerja secara otomatis dan terstruktur</p>
            <NuxtLink to="#" class="text-blue-600 text-[10px] font-bold flex items-center gap-1 uppercase">
              Baca Artikel
              <ArrowUpRight class="w-3 h-3" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Ship, Truck, Calendar, Users,
  ArrowUpRight, Info
} from 'lucide-vue-next'

const userAuth = useCookie('user_auth')
const userName = computed(() => userAuth.value?.name || 'User')
const today = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const { data: dashboardData, pending } = await useFetch('/api/dashboard/stats')
const stats = computed(() => [
  {
    label: 'Total Regu Kapal',
    value: dashboardData.value?.totalKapal || 0,
    icon: Ship,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    label: 'Total Regu Darat',
    value: dashboardData.value?.totalDarat || 0,
    icon: Truck,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    label: 'Jadwal Hari Ini',
    value: '8',
    icon: Calendar,
    color: 'text-rose-600',
    bg: 'bg-rose-100'
  },
  {
    label: 'Total Regu Aktif',
    value: '16',
    icon: Users,
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  },
])

const activities = ref([
  { title: 'Jadwal diexport', time: '1 jam yang lalu', icon: Calendar },
  { title: 'Jadwal diexport', time: '2 jam yang lalu', icon: Calendar },
  { title: 'Jadwal diexport', time: 'kemarin', icon: Calendar },
])

</script>
