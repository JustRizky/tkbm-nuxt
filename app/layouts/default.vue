<template>
  <div class="min-h-screen bg-slate-50 flex">
    <AppSidebar />

    <div class="flex-1 ml-64 flex flex-col">
      <AppHeader />
      
      <main class="p-8 flex-1">
        <slot />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
