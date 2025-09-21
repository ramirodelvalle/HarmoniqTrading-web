<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const emit = defineEmits<{ (e: 'oauth-google'): void }>()
const router = useRouter()
const { login, signup } = useAuth()

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const showPwd = ref(false)
const remember = ref(true)

const loading = ref(false)
const errorMsg = ref<string | null>(null)
const successMsg = ref<string | null>(null)

onMounted(() => {
  const url = new URL(window.location.href)
  const qMode = url.searchParams.get('mode')
  if (qMode === 'signup' || qMode === 'login') mode.value = qMode as any
})

async function onSubmit() {
  errorMsg.value = null
  successMsg.value = null
  if (!email.value || !password.value) { errorMsg.value = 'Completá email y contraseña.'; return }
  if (!/^\S+@\S+\.\S+$/.test(email.value)) { errorMsg.value = 'Email inválido.'; return }

  loading.value = true
  try {
    const url = new URL(window.location.href)
    const next = url.searchParams.get('next') || '/'

    if (mode.value === 'login') {
      await login(email.value.trim(), password.value, remember.value)
      successMsg.value = 'Sesión iniciada. Redirigiendo…'
      setTimeout(() => router.push(next), 400)
    } else {
      const res = await signup(email.value.trim(), password.value)
      successMsg.value = res?.token ? 'Cuenta creada. Redirigiendo…' : 'Cuenta creada. Ahora inicia sesión.'
      setTimeout(() => {
        if (res?.token) router.push(next)
        else router.push(`/auth?mode=login&next=${encodeURIComponent(next)}`)
      }, 600)
    }
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || 'No se pudo completar la operación.'
  } finally {
    loading.value = false
  }
}

function switchMode(next: 'login' | 'signup') {
  mode.value = next
  errorMsg.value = null
  successMsg.value = null
}
</script>

<template>
  <section class="min-h-[80vh] w-full grid place-items-center px-4">
    <div class="w-full max-w-md card p-6">
      <div class="flex gap-2 mb-6">
        <button class="btn-ghost flex-1" :class="mode==='login' && 'ring-2 ring-brand'" @click="switchMode('login')">Iniciar sesión</button>
        <button class="btn-ghost flex-1" :class="mode==='signup' && 'ring-2 ring-brand'" @click="switchMode('signup')">Crear cuenta</button>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input v-model="email" type="email" autocomplete="email" class="input w-full" placeholder="tucorreo@dominio.com" />
        </div>

        <div>
          <label class="block text-sm mb-1">Contraseña</label>
          <div class="relative">
            <input :type="showPwd ? 'text' : 'password'" v-model="password" autocomplete="current-password" class="input w-full pr-20" placeholder="••••••••" />
            <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-xs btn-ghost" @click="showPwd = !showPwd">
              {{ showPwd ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <label class="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="remember" /> Recordarme
          </label>
          <a href="/forgot" class="text-sm underline text-slate-300 hover:text-white">Olvidé mi contraseña</a>
        </div>

        <button :disabled="loading" type="submit" class="btn-primary w-full">
          {{ loading ? (mode==='login' ? 'Ingresando…' : 'Creando…') : (mode==='login' ? 'Entrar' : 'Crear cuenta') }}
        </button>

        <button type="button" class="btn-ghost w-full" @click="emit('oauth-google')" title="Próximamente: Google OAuth">
          Continuar con Google
        </button>

        <p v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-sm text-emerald-300">{{ successMsg }}</p>

        <p class="text-[11px] text-slate-400 mt-2">
          Al continuar aceptas nuestros <a href="/terms" class="underline">Términos</a> y
          <a href="/privacy" class="underline">Política de Privacidad</a>.
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.card { background: rgba(15,18,24,.9); border: 1px solid rgba(255,255,255,.08); border-radius: 16px; }
.input { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); border-radius: 12px; padding: 10px 12px; outline: none; width: 100%; }
.btn-primary { background: #8b5cf6; border-radius: 12px; padding: 10px 14px; }
.btn-ghost { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 8px 10px; }
.ring-brand { box-shadow: 0 0 0 2px rgba(139,92,246,.7); }
</style>
