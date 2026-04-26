<template>
  <SidebarProvider>
    <div class="min-h-screen bg-slate-50 flex w-full">
      <AppSidebar />

      <div class="flex-1 flex flex-col min-w-0">
        <AppHeader>
          <SidebarTrigger class="-ml-1" />
        </AppHeader>

        <main class="p-8 flex-1">
          <slot />
        </main>

        <AppFooter />
      </div>
    </div>
  </SidebarProvider>
</template>

<script setup>
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '~/components/AppSidebar.vue'
</script>
