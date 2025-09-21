<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'

const { API_BASE } = useAuth()
const email = ref('')
const sending = ref(false)
const errorMsg = ref<string|null>(null)
const successMsg = ref<string|null>(null)

async function onSubmit() {
  errorMsg.value = null
  successMsg.value = null
  if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errorMsg.value = 'Ingresá un email válido.'
    return
  }
  sending.value = true
  try {
    await axios.post(`${API_BASE}/api/forgot`, { email: email.value.trim() })
    successMsg.value = 'Si el email existe, te enviamos un enlace de recuperación.'
  } catch (e:any) {
    errorMsg.value = e?.response?.data?.message || 'No se pudo procesar tu solicitud.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="min-h-[70vh] w-full grid place-items-center px-4">
    <div class="w-full max-w-md card p-6">
      <h1 class="text-2xl font-bold mb-2">Recuperar acceso</h1>
      <p class="text-slate-300 text-sm mb-4">
        Ingresá tu email y te enviaremos un enlace para restablecer la contraseña.
      </p>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input v-model="email" type="email" class="input w-full" placeholder="tucorreo@dominio.com" />
        </div>

        <button :disabled="sending" type="submit" class="btn-primary w-full">
          {{ sending ? 'Enviando…' : 'Enviar enlace' }}
        </button>

        <p v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-sm text-emerald-300">{{ successMsg }}</p>

        <div class="text-xs text-slate-400 mt-2">
          ¿Recordaste tu clave? <RouterLink to="/auth" class="underline">Volver a iniciar sesión</RouterLink>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.card{background:rgba(15,18,24,.96);border:1px solid rgba(255,255,255,.08);border-radius:16px}
.input{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 12px;width:100%}
.btn-primary{background:#8b5cf6;border-radius:12px;padding:10px 14px}
</style>
