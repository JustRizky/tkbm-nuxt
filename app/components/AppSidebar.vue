<template>
  <Sidebar collapsible="icon" class="border-r border-gray-200">
    <SidebarHeader class="p-6">
      <div class="flex items-start gap-3 group-data-[collapsible=icon]:justify-center">
        <div
          class="w-10 h-10 min-w-[40px] bg-blue-900 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
        >
          <img src="/logo.png" alt="Logo" class="w-full h-full object-cover" />
        </div>
        <div class="leading-tight flex-1 group-data-[collapsible=icon]:hidden">
          <h1 class="text-xs font-bold text-gray-800 uppercase break-words">
            Koperasi Tenaga Kerja Bongkar Muat Usaha Karya
          </h1>
        </div>
      </div>
    </SidebarHeader>

    <div class="px-4 mb-4 group-data-[collapsible=icon]:hidden">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <SidebarInput
          v-model="searchQuery"
          placeholder="Cari menu..."
          class="pl-9 bg-gray-50 border-gray-200"
        />
      </div>
    </div>

    <SidebarContent class="px-2">
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in menuItems" :key="item.path">
            <SidebarMenuButton
              as-child
              :is-active="$route.path === item.path"
              tooltip="item.name"
              class="relative group/menu-button data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 transition-colors"
            >
              <NuxtLink :to="item.path" class="flex items-center gap-3">
                <div
                  class="absolute left-0 w-1 h-6 bg-blue-700 rounded-r-full opacity-0 transition-all"
                  :class="{ 'opacity-100': $route.path === item.path }"
                />
                <component
                  :is="item.icon"
                  class="w-5 h-5"
                  :class="{ 'text-blue-700': $route.path === item.path }"
                />
                <span class="group-data-[collapsible=icon]:hidden">{{ item.name }}</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <div
            v-if="menuItems.length === 0"
            class="text-[10px] text-center text-gray-400 mt-4 group-data-[collapsible=icon]:hidden"
          >
            Menu tidak ditemukan
          </div>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="p-2 border-t border-gray-100">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div class="flex items-center gap-3 w-full">
                  <div
                    class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0 border border-emerald-200"
                  >
                    <img
                      :src="`https://ui-avatars.com/api/?name=${userAuth?.name || 'Admin'}`"
                      alt="User"
                    />
                  </div>
                  <div
                    class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden"
                  >
                    <span class="truncate font-bold text-gray-800">{{
                      userAuth?.name || 'Admin'
                    }}</span>
                    <span class="truncate text-xs text-gray-500 capitalize">{{ rolePath }}</span>
                  </div>
                  <ChevronsUpDown
                    class="ml-auto size-4 group-data-[collapsible=icon]:hidden text-gray-400"
                  />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              :side-offset="4"
            >
              <DropdownMenuLabel class="p-0 font-normal">
                <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div
                    class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0"
                  >
                    <img
                      :src="`https://ui-avatars.com/api/?name=${userAuth?.name || 'Admin'}`"
                      alt="User"
                    />
                  </div>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ userAuth?.name || 'Admin' }}</span>
                    <span class="truncate text-xs text-gray-500">{{
                      userAuth?.email || 'admin@koperasi.com'
                    }}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                @click="handleLogout"
                class="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
              >
                <LogOut class="mr-2 size-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarRange,
  CalendarDays,
  ClipboardList,
  Search,
  ChevronsUpDown,
  LogOut
} from 'lucide-vue-next'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput
} from '@/components/ui/sidebar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const userAuth = useCookie('user_auth')
const rolePath = computed(() => userAuth.value?.role?.toLowerCase() || 'anggota')
const userRole = computed(() => userAuth.value?.role?.toUpperCase() || 'ANGGOTA')

const searchQuery = ref('')

const menuItems = computed(() => {
  const allMenus = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: `/${rolePath.value}/dashboard`,
      roles: ['ADMIN', 'PENGURUS', 'KRK', 'ANGGOTA']
    },
    {
      name: 'Regu Kerja',
      icon: Users,
      path: `/${rolePath.value}/regu-kerja`,
      roles: ['ADMIN', 'KRK']
    },
    { name: 'Shift Kerja', icon: Clock, path: `/${rolePath.value}/shift-kerja`, roles: ['ADMIN'] },
    {
      name: 'Generate Jadwal',
      icon: CalendarRange,
      path: `/${rolePath.value}/generate`,
      roles: ['ADMIN']
    },
    {
      name: 'Jadwal Kerja',
      icon: CalendarDays,
      path: `/${rolePath.value}/jadwal`,
      roles: ['ADMIN', 'PENGURUS', 'KRK', 'ANGGOTA']
    },
    {
      name: 'Izin Kerja',
      icon: ClipboardList,
      path: `/${rolePath.value}/izin-kerja`,
      roles: ['ADMIN', 'KRK']
    }
  ]

  return allMenus.filter((item) => {
    const hasRole = item.roles.includes(userRole.value)
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return hasRole && matchesSearch
  })
})

const handleLogout = () => {
  const auth = useCookie('user_auth')
  auth.value = null
  navigateTo('/login')
}
</script>
