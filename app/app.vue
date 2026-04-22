<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  title: 'Sistem Penjadwalan TKBM - Koperasi Usaha Karya',
  meta: [
    { name: 'description', content: 'Manajemen jadwal regu kerja operasional bongkar muat.' }
  ],
  bodyAttrs: {
    class: 'antialiased text-slate-900 bg-gray-50'
  }
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
