<script setup>
import { LayoutDashboard } from 'lucide-vue-next'
</script>

<template>
  <header class="h-16 flex items-center px-8 border-b border-gray-200 bg-white sticky top-0 z-40">
    <div class="flex items-center gap-2 text-gray-500">
      <LayoutDashboard class="w-4 h-4" />
      <span class="text-gray-400">/</span>
      <span class="text-sm font-medium text-gray-800">Dashboard</span>
    </div>
  </header>
</template>
