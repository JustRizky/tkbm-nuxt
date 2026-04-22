<template>
  <div class="relative min-h-screen flex items-center justify-center bg-gray-900 font-sans">
    <div class="absolute inset-0 bg-cover bg-center z-0" style="background-image: url('/background.jpg')">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-900/90 from-[90%] to-white to-[90%] mix-blend-normal">
      </div>
    </div>

    <div class="relative z-10 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
      <div class="text-white max-w-xl">
        <div class="flex items-center gap-4 mb-8">
          <img src="/logo.png" alt="Logo" class="h-20 w-20 object-contain shadow-lg rounded-full bg-white p-1" />
          <h2 class="text-xl font-bold leading-tight">
            Koperasi Tenaga Kerja<br />Bongkar Muat Usaha Karya
          </h2>
        </div>

        <h1 class="text-6xl font-extrabold mb-4 tracking-tight">Selamat Datang</h1>
        <p class="text-2xl font-semibold mb-6">Gunakan Sistem Penjadwalan Regu Kerja TKBM!</p>
        <p class="text-lg text-gray-200 leading-relaxed">
          Sistem ini menyediakan semua fitur yang memudahkan pengelolaan jadwal regu kerja TKBM
          secara efisien. Pantau jadwal, kelola shift.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div class="flex flex-col items-center mb-8">
          <div class="p-3 bg-gray-50 rounded-full mb-4">
            <svg
xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800">Login</h3>
          <p class="text-sm text-gray-500 text-center mt-2">
            Masukkan username dan password untuk masuk ke sistem Penjadwalan Regu Kerja TKBM.
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
v-model="form.username" type="text" placeholder="Masukkan username"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
v-model="form.password" type="password" placeholder="Masukkan password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
          </div>

          <div class="flex items-center">
            <input
id="remember" type="checkbox"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label for="remember" class="ml-2 text-sm text-gray-600">Remember me</label>
          </div>

          <button
type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            Login
          </button>
        </form>
      </div>
    </div>

    <div class="absolute bottom-6 w-full text-center text-gray-300 text-sm z-10">
      © 2026 Koperasi Tenaga Kerja Bongkar Muat Usaha Karya. All rights reserved
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  alias: '/'
})

const form = ref({
  username: '',
  password: ''
})

const handleLogin = () => {
  console.log('Login attempt:', form.value)
}
</script>
