<template>
  <header class="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-white/10">
    <div class="container flex items-center justify-between h-16">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2">
        <img src="/logo.svg" class="h-7 w-7" alt="Harmonic Sniper logo" />
        <span class="font-bold text-white tracking-tight">Harmonic&nbsp;Sniper</span>
      </RouterLink>

      <!-- Nav desktop -->
      <nav class="hidden md:flex items-center gap-6 text-sm text-slate-300">
        <RouterLink :to="{ path: '/', hash: '#features' }" class="hover:text-white transition-colors">Características</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#how' }" class="hover:text-white transition-colors">Cómo funciona</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#pricing' }" class="hover:text-white transition-colors">Precios</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#faq' }" class="hover:text-white transition-colors">FAQ</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#contact' }" class="hover:text-white transition-colors">Contacto</RouterLink>

        <template v-if="isAuthed">
          <RouterLink to="/account" class="hover:text-white transition-colors">Mi cuenta</RouterLink>
          <button class="hover:text-white transition-colors" @click="onLogout">Salir</button>
        </template>
        <template v-else>
          <RouterLink to="/auth" class="hover:text-white transition-colors">Iniciar sesión</RouterLink>
        </template>
      </nav>

      <div class="flex items-center gap-3">
        <RouterLink :to="{ path: '/', hash: '#pricing' }" class="btn-primary hidden md:inline-flex">
          Probar ahora
        </RouterLink>

        <!-- Hamburger mobile -->
        <button
          class="md:hidden p-2 rounded-lg bg-white/5 border border-white/10"
          @click="menuOpen = !menuOpen"
          aria-label="Menú"
        >
          <svg v-if="!menuOpen" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="menuOpen" class="md:hidden border-t border-white/10 bg-slate-950/95 px-4 py-4 space-y-3 text-sm">
      <RouterLink @click="menuOpen=false" :to="{ path: '/', hash: '#features' }" class="block py-2 text-slate-300 hover:text-white">Características</RouterLink>
      <RouterLink @click="menuOpen=false" :to="{ path: '/', hash: '#how' }" class="block py-2 text-slate-300 hover:text-white">Cómo funciona</RouterLink>
      <RouterLink @click="menuOpen=false" :to="{ path: '/', hash: '#pricing' }" class="block py-2 text-slate-300 hover:text-white">Precios</RouterLink>
      <RouterLink @click="menuOpen=false" :to="{ path: '/', hash: '#faq' }" class="block py-2 text-slate-300 hover:text-white">FAQ</RouterLink>
      <RouterLink @click="menuOpen=false" :to="{ path: '/', hash: '#contact' }" class="block py-2 text-slate-300 hover:text-white">Contacto</RouterLink>
      <template v-if="isAuthed">
        <RouterLink @click="menuOpen=false" to="/account" class="block py-2 text-slate-300 hover:text-white">Mi cuenta</RouterLink>
        <button class="block py-2 text-slate-300 hover:text-white w-full text-left" @click="onLogout">Salir</button>
      </template>
      <template v-else>
        <RouterLink @click="menuOpen=false" to="/auth" class="block py-2 text-slate-300 hover:text-white">Iniciar sesión</RouterLink>
      </template>
      <RouterLink @click="menuOpen=false" :to="{ path: '/', hash: '#pricing' }" class="btn-primary w-full justify-center mt-2">
        Probar ahora
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
const { token, logout } = useAuth()
const isAuthed = computed(() => !!token.value)
const menuOpen = ref(false)
function onLogout() { logout(); window.location.href = '/' }
</script>
