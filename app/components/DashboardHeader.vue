<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800">Selamat Datang, {{ userName }}!</h2>
    <p class="text-sm text-gray-500">{{ today }}</p>
  </div>
</template>

<script setup>
const userAuth = useCookie('user_auth')
const userName = computed(() => userAuth.value?.name || 'User')

const today = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
</script>
