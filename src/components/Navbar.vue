<template>
  <header class="sticky top-0 z-40 bg-slate-950/60 backdrop-blur border-b border-white/10">
    <div class="container flex items-center justify-between h-16">
      <RouterLink to="/" class="flex items-center gap-2">
        <img src="/logo.svg" class="h-7 w-7" alt="logo" />
        <span class="font-semibold">AutoTrader&nbsp;Pro</span>
      </RouterLink>

      <nav class="hidden md:flex items-center gap-6 text-sm text-slate-300">
        <RouterLink :to="{ path: '/', hash: '#features' }" class="hover:text-white">Características</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#how' }" class="hover:text-white">Cómo funciona</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#pricing' }" class="hover:text-white">Precios</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#faq' }" class="hover:text-white">FAQ</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#contact' }" class="hover:text-white">Contacto</RouterLink>
        <RouterLink to="/demo" class="hover:text-white">Demo</RouterLink>

        <template v-if="isAuthed">
          <RouterLink to="/account" class="hover:text-white">Mi cuenta</RouterLink>
          <button class="hover:text-white" @click="onLogout">Salir</button>
        </template>
        <template v-else>
          <RouterLink to="/auth" class="hover:text-white">Iniciar sesión</RouterLink>
        </template>
      </nav>

      <RouterLink :to="{ path: '/', hash: '#pricing' }" class="btn-primary">Probar ahora</RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
const { token, logout } = useAuth()
const isAuthed = computed(() => !!token.value)
function onLogout() { logout(); window.location.href = '/' }
</script>
