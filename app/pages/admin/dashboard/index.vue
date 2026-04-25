<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-gray-800">Selamat Datang, {{ userName }}!</h2>
      <p class="text-sm text-gray-500">{{ today }}</p>
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-lg font-bold text-gray-800">Jadwal Kerja</h3>
            <p class="text-xs text-gray-400">Overview Grafik Jadwal Terbaru</p>
          </div>
          <div class="flex items-center gap-2 text-[10px] text-gray-500">
            <div class="w-3 h-3 bg-blue-900 rounded-sm"></div>
            Jumlah Regu Bekerja
          </div>
        </div>

        <div
          class="h-64 flex items-end justify-between gap-2 pt-4 border-l border-b border-gray-100 relative"
        >
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none pr-2">
            <div
              v-for="n in 5"
              :key="n"
              class="border-t border-gray-50 w-full text-[10px] text-gray-300 flex justify-end items-start"
            >
              {{ (6 - n) * 2 }}
            </div>
          </div>

          <div
            v-for="item in grafikJadwal"
            :key="item.day"
            class="relative group flex-1 flex flex-col items-center justify-end h-full"
          >
            <div
              class="absolute -top-8 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {{ item.actualValue }} Regu
            </div>
            <div
              :style="{ height: item.height + '%' }"
              class="w-full max-w-[40px] bg-blue-900 rounded-t-sm transition-all hover:bg-blue-800"
            ></div>
            <span class="text-[10px] text-gray-400 mt-2">{{ item.day }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800">Aktivitas Regu per Shift</h3>
        <p class="text-xs text-gray-400 mb-8">Overview Grafik Aktivitas Regu per Shift</p>

        <div class="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
          <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="transparent"
              stroke="#f3f4f6"
              stroke-width="4"
            ></circle>

            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="transparent"
              stroke="#2563eb"
              stroke-width="4"
              :stroke-dasharray="`${shiftStats[0].percent} 100`"
              stroke-dashoffset="0"
            ></circle>

            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="transparent"
              stroke="#e11d48"
              stroke-width="4"
              :stroke-dasharray="`${shiftStats[1].percent} 100`"
              :stroke-dashoffset="-shiftStats[0].percent"
            ></circle>

            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="transparent"
              stroke="#fb923c"
              stroke-width="4"
              :stroke-dasharray="`${shiftStats[2].percent} 100`"
              :stroke-dashoffset="-(shiftStats[0].percent + shiftStats[1].percent)"
            ></circle>
          </svg>

          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-2xl font-bold text-gray-800">{{
              dashboardData?.shiftData?.total || 0
            }}</span>
            <span class="text-[10px] text-gray-400 uppercase">Total Regu</span>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in shiftStats"
            :key="item.label"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
              <span class="text-xs text-gray-600 font-medium">{{ item.label }}</span>
            </div>
            <span class="text-xs font-bold text-gray-800">{{ item.count }} Regu</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-800 mb-6">Aktivitas Terbaru</h3>
        <div class="space-y-6">
          <p v-if="activities.lenght === 0" class="text-sm text-gray-400 text-center py-4">
            Belum ada aktivitias terbaru.
          </p>
          <div v-for="(act, index) in activities" :key="index" class="flex items-center gap-4">
            <div
              class="w-10 h-10 bg-rose-50 flex items-center justify-center rounded-lg text-rose-500"
            >
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(guide, index) in guides"
            :key="index"
            class="p-6 bg-slate-50 rounded-xl border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center mb-4',
                  guide.colorClass
                ]"
              >
                <component :is="guide.icon" class="w-5 h-5" />
              </div>

              <h4 class="text-sm font-bold text-gray-800 mb-2 leading-tight">
                {{ guide.title }}
              </h4>

              <p class="text-[10px] text-gray-500 mb-4">
                {{ guide.description }}
              </p>
            </div>

            <NuxtLink
              :to="guide.link"
              class="text-purple-600 text-[10px] font-bold flex items-center gap-1 uppercase hover:underline"
            >
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
import { Ship, Truck, Calendar, Users, ArrowUpRight, Info } from 'lucide-vue-next'

const userAuth = useCookie('user_auth')
const userName = computed(() => userAuth.value?.name || 'User')
const today = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const { data: dashboardData, pending } = await useFetch('/api/dashboard/stats')
const stats = computed(() => {
  const listJadwal = dashboardData.value?.jadwalHariIni || []
  const totalReguAktif = [...new Set(listJadwal.map((j) => j.reguId))].length

  return [
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
      value: listJadwal.length,
      icon: Calendar,
      color: 'text-rose-600',
      bg: 'bg-rose-100'
    },
    {
      label: 'Total Regu Aktif',
      value: totalReguAktif,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]
})

const grafikJadwal = computed(() => {
  const data = dashboardData.value?.grafikData || []

  if (!data.length) return []

  const maxCount = Math.max(...data.map((d) => d.count || 0), 1)

  return data.map((d) => ({
    day: d.day,
    height: Math.max((d.count / maxCount) * 100, 5),
    actualValue: d.count
  }))
})

const shiftStats = computed(() => {
  const data = dashboardData.value?.shiftData || { shift1: 0, shift2: 0, shift3: 0, total: 0 }
  const total = data.total || 1

  return [
    {
      label: 'Shift I',
      count: data.shift1,
      color: '#2563eb',
      percent: (data.shift1 / total) * 100
    },
    {
      label: 'Shift II',
      count: data.shift2,
      color: '#e11d48',
      percent: (data.shift2 / total) * 100
    },
    {
      label: 'Shift III',
      count: data.shift3,
      color: '#fb923c',
      percent: (data.shift3 / total) * 100
    }
  ]
})

const activities = computed(() => {
  return dashboardData.value?.activities || []
})

const guides = [
  {
    title: 'Bagaimana Generate Jadwal',
    description: 'Membuat jadwal kerja secara otomatis dan terstruktur.',
    link: '/panduan/generate-jadwal',
    icon: Info,
    colorClass: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Manajemen Regu Kerja',
    description: 'Cara mengelola data regu kapal dan darat serta pembagian anggota.',
    link: '/panduan/regu',
    icon: Users,
    colorClass: 'bg-blue-100 text-blue-600'
  }
]
</script>
