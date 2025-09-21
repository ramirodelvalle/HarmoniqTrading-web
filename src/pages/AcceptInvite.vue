<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'

const { API_BASE } = useAuth()

const code = ref('')
const loading = ref(false)
const errorMsg = ref<string|null>(null)
const successMsg = ref<string|null>(null)

onMounted(() => {
  const url = new URL(window.location.href)
  const qCode = url.searchParams.get('code')
  if (qCode) code.value = qCode.toUpperCase()
})

async function accept() {
  errorMsg.value = null
  successMsg.value = null
  if (!code.value || code.value.length < 4) {
    errorMsg.value = 'Ingresá un código válido.'
    return
  }
  loading.value = true
  try {
    await axios.post(`${API_BASE}/api/duo/accept`, { code: code.value.trim().toUpperCase() })
    successMsg.value = '¡Invitación activada! Ya puedes usar tu licencia.'
  } catch (e:any) {
    errorMsg.value = e?.response?.data?.message || 'No se pudo activar la invitación.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="min-h-[70vh] w-full grid place-items-center px-4">
    <div class="w-full max-w-md card p-6">
      <h1 class="text-xl font-semibold">Aceptar invitación (Elite Duo)</h1>
      <p class="text-slate-300 text-sm mt-2">Pega el código que te compartieron o entra con el link.</p>

      <div class="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          v-model="code"
          class="input"
          placeholder="Código (p. ej., 7K2Q9B)"
          maxlength="8"
          @input="code = code.toUpperCase()"
        />
        <button :disabled="loading" class="btn-primary" @click="accept">
          {{ loading ? 'Activando…' : 'Activar' }}
        </button>
      </div>

      <p v-if="errorMsg" class="text-sm text-red-400 mt-3">{{ errorMsg }}</p>
      <p v-if="successMsg" class="text-sm text-emerald-300 mt-3">{{ successMsg }}</p>

      <p class="text-[11px] text-slate-400 mt-4">
        Si recibiste un <strong>link</strong> (con <code>?code=</code>), el código se completa automáticamente.
      </p>
    </div>
  </section>
</template>

<style scoped>
.card{background:rgba(15,18,24,.96);border:1px solid rgba(255,255,255,.08);border-radius:16px}
.input{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 12px;outline:none}
.btn-primary{background:#8b5cf6;border-radius:12px;padding:10px 14px}
</style>
