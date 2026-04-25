<script setup>
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarRange,
  CalendarDays,
  ClipboardList
} from 'lucide-vue-next'

const userAuth = useCookie('user_auth')
const rolePath = computed(() => userAuth.value?.role?.toLowerCase() || 'anggota')

const menuItems = computed(() => [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: `/${rolePath.value}/dashboard`
  },
  {
    name: 'Regu Kerja',
    icon: Users,
    path: `/${rolePath.value}/regu-kerja`
  },
  {
    name: 'Shift Kerja',
    icon: Clock,
    path: `/${rolePath.value}/shift-kerja`
  },
  {
    name: 'Generate Jadwal',
    icon: CalendarRange,
    path: `/${rolePath.value}/generate`
  },
  {
    name: 'Jadwal Kerja',
    icon: CalendarDays,
    path: `/${rolePath.value}/jadwal`
  },
  {
    name: 'Izin Kerja',
    icon: ClipboardList,
    path: `/${rolePath.value}/izin-kerja`
  }
])
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50"
  >
    <div class="p-6 flex items-center gap-3">
      <div
        class="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold"
      >
        K
      </div>
      <div class="leading-tight">
        <h1 class="text-sm font-bold text-gray-800 uppercase">Koperasi Tenaga Kerja</h1>
        <p class="text-[10px] text-gray-500 uppercase">Bongkar Muat Usaha Karya</p>
      </div>
    </div>

    <div class="px-4 mb-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span
          class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 border border-gray-200 px-1 rounded"
        >
          ⌘ K
        </span>
      </div>
    </div>

    <nav class="flex-1 px-4 space-y-1">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-blue-700 group"
        active-class="bg-blue-50 !text-blue-700 shadow-sm"
      >
        <component
          :is="item.icon"
          class="w-5 h-5 transition-colors"
          :class="{ 'text-blue-600': $route.path === item.path }"
        />
        {{ item.name }}
      </NuxtLink>
    </nav>

    <div class="p-4 border-t border-gray-100">
      <div class="flex items-center gap-3 px-2 py-2">
        <div
          class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden"
        >
          <img src="https://ui-avatars.com/api/?name=Admin" alt="Admin" />
        </div>
        <div class="text-xs">
          <p class="font-bold text-gray-800">Admin</p>
        </div>
      </div>
    </div>
  </aside>
</template>
