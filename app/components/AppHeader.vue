<script setup lang="ts">
import { LayoutDashboard } from 'lucide-vue-next'

const { breadcrumbName } = useBreadcrumbs()
</script>

<template>
  <header class="h-16 flex items-center px-8 border-b border-slate-200 bg-white sticky top-0 z-40">
    <div class="flex items-center gap-2 text-slate-500">
      <LayoutDashboard class="w-4 h-4 text-blue-600" />
      <span class="text-slate-300 text-xs">/</span>
      <h2 class="text-sm font-semibold text-slate-800 tracking-tight">
        {{ breadcrumbName }}
      </h2>
    </div>
  </header>
</template>
