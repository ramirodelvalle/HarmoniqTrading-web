<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

/** v-model:ownerEmail (se completa en /account) */
const ownerEmail = defineModel('ownerEmail', { type: String, default: '' })

/** State */
const inviteeEmail = ref('')
const status = ref('')         // mensaje simple arriba/abajo del formulario
const error = ref(null)        // error para copy/link
const success = ref(null)      // éxito para copy/link
const invites = ref([])        // [{ email, code, status }]

/** Cargar invitaciones existentes (mock: /api/me/entitlements) */
async function loadInvites() {
  try {
    const { data } = await axios.get(`${API_BASE}/api/me/entitlements`)
    invites.value = data?.invites || []
  } catch {
    invites.value = []
  }
}

onMounted(loadInvites)

/** Enviar invitación */
async function invite() {
  status.value = 'Enviando…'
  error.value = null
  success.value = null
  try {
    await axios.post(`${API_BASE}/api/duo/invite`, {
      ownerEmail: ownerEmail.value,
      inviteeEmail: inviteeEmail.value,
    })
    status.value = 'Invitación enviada. Tu compañero ya puede activar su seat.'
    inviteeEmail.value = ''
    await loadInvites()
  } catch (e) {
    console.error(e)
    status.value = e?.response?.data?.message || 'No se pudo enviar la invitación.'
  }
}

/** Link y copy al portapapeles */
function inviteLink(code) {
  const url = new URL(window.location.origin + '/accept')
  url.searchParams.set('code', code)
  return url.toString()
}
async function copy(text) {
  error.value = null
  success.value = null
  try {
    await navigator.clipboard.writeText(text)
    success.value = 'Link copiado al portapapeles.'
  } catch {
    error.value = 'No se pudo copiar el link.'
  }
}
</script>

<template>
  <div class="card p-4">
    <h4 class="font-semibold mb-2">Invitar compañero (Elite Duo)</h4>
    <p class="text-slate-300 text-sm mb-3">
      Comparte tu licencia con un segundo usuario. Recibirá un email o un link para activar.
    </p>

    <!-- Form -->
    <div class="flex gap-2">
      <input v-model="inviteeEmail" type="email" placeholder="email@compañero.com" class="input flex-1"
        autocomplete="email" />
      <button class="btn-primary" @click="invite">Invitar</button>
    </div>
    <p class="text-xs text-slate-400 mt-2">{{ status }}</p>
    <p v-if="error" class="text-xs text-red-400 mt-1">{{ error }}</p>
    <p v-if="success" class="text-xs text-emerald-300 mt-1">{{ success }}</p>

    <!-- Lista de invitaciones -->
    <div v-if="invites.length" class="mt-5">
      <h5 class="text-sm font-semibold text-slate-300">Invitaciones</h5>

      <!-- ⬇️ ESTA ES LA LISTA QUE ME PREGUNTABAS DÓNDE VA -->
      <ul class="mt-2 text-sm text-slate-300 space-y-1">
        <li v-for="i in invites" :key="i.code" class="flex items-center justify-between gap-2">
          <span>
            {{ i.email }} —
            <span :class="i.status === 'active' ? 'text-emerald-300' : 'text-amber-300'">
              {{ i.status }}
            </span>
          </span>
          <div class="flex items-center gap-2">
            <code class="text-xs bg-white/10 px-2 py-1 rounded">{{ i.code }}</code>
            <button class="btn-ghost text-xs" @click="copy(inviteLink(i.code))">Copiar link</button>
          </div>
        </li>
      </ul>
    </div>

    <div class="mt-4 text-xs text-slate-400">
      Tu compañero también puede activar desde aquí:
      <a href="/accept" class="underline">/accept</a> (pega el código).
    </div>
  </div>
</template>

<style scoped>
.card {
  background: rgba(15, 18, 24, .96);
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 16px
}

.input {
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 12px;
  padding: 10px 12px;
  outline: none
}

.btn-primary {
  background: #8b5cf6;
  border-radius: 12px;
  padding: 10px 14px
}

.btn-ghost {
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 10px;
  padding: 6px 10px
}
</style>
