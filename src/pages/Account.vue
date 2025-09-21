<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import DuoInvite from '@/components/DuoInvite.vue'

const { user, logout, API_BASE } = useAuth()

type Entitlements = {
  plan: string
  seats: number
  symbols: number | 'unlimited'
  alerts_per_month: number | 'unlimited'
  webhooks: number
  api: boolean
  latency: 'priority' | 'standard'
  confirmations: {
    main: boolean
    abcd: boolean
    institutionalD: boolean
    mtf?: boolean
    przScore?: boolean
  }
  copier?: boolean
}

const ents = ref<Entitlements | null>(null)
const loading = ref(true)
const ownerEmail = ref<string>((user.value as any)?.email || '')

const isDuo = computed(() => (ents.value?.seats ?? 0) === 2)
const planLabel = computed(() => {
  const p = ents.value?.plan || (user.value as any)?.plan || 'pro'
  // etiquetita legible
  if (p === 'lt-elite-duo') return 'Lifetime Elite Duo'
  if (p === 'lt-elite') return 'Lifetime Elite'
  if (p === 'lt-pro') return 'Lifetime Pro'
  if (p === 'elite') return isDuo.value ? 'Elite Duo' : 'Elite'
  return p[0].toUpperCase() + p.slice(1)
})

async function fetchEnts() {
  loading.value = true
  try {
    const { data } = await axios.get(`${API_BASE}/api/me/entitlements`)
    ents.value = data
    // fallback para mock: sincroniza seats/plan con localStorage si viniera vacío
    const raw = localStorage.getItem('auth_user')
    if (raw) {
      const u = JSON.parse(raw)
      if (u.plan && !data.plan) ents.value!.plan = u.plan
      if (typeof u.seats === 'number' && !data.seats) ents.value!.seats = u.seats
      if (!ownerEmail.value && u.email) ownerEmail.value = u.email
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchEnts)

function goUpgrade(target: 'elite' | 'elite-duo') {
  // re-usa tu checkout:
  axios.post(`${API_BASE}/api/checkout`, { planId: target, email: ownerEmail.value })
    .then(r => { if (r.data?.url) window.location.href = r.data.url })
    .catch(() => alert('No se pudo iniciar el checkout.'))
}
</script>

<template>
  <section class="container py-16">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl md:text-3xl font-bold">Tu cuenta</h1>
      <button class="btn-ghost" @click="logout()">Cerrar sesión</button>
    </div>

    <div class="grid md:grid-cols-3 gap-6 mt-8">
      <div class="card p-6 md:col-span-2">
        <h2 class="text-xl font-semibold">Resumen</h2>
        <p v-if="loading" class="text-slate-400 mt-2">Cargando…</p>

        <template v-else>
          <div class="mt-3 text-slate-300 space-y-1">
            <p><span class="text-slate-400">Plan:</span> <strong>{{ planLabel }}</strong></p>
            <p><span class="text-slate-400">Seats:</span> <strong>{{ ents?.seats ?? 1 }}</strong></p>
            <p><span class="text-slate-400">Símbolos:</span> <strong>{{ ents?.symbols }}</strong></p>
            <p><span class="text-slate-400">Alertas/mes:</span> <strong>{{ ents?.alerts_per_month }}</strong></p>
            <p><span class="text-slate-400">Latencia:</span> <strong>{{ ents?.latency }}</strong></p>
          </div>

          <!-- Upsell suave: si es Elite 1 seat, sugiere Duo -->
          <div v-if="ents && ents.plan?.includes('elite') && (ents.seats ?? 1) === 1"
            class="mt-6 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
            <p class="text-sm">
              ¿Operan 2? Pásate a <strong>Elite Duo</strong> y comparte tu licencia con un colega.
            </p>
            <div class="mt-3 flex gap-2">
              <button class="btn-primary" @click="goUpgrade('elite-duo')">Subir a Duo</button>
              <a href="#pricing" class="btn-ghost">Ver precios</a>
            </div>
          </div>
        </template>
      </div>

      <div class="card p-6">
        <h2 class="text-xl font-semibold">Datos</h2>
        <div class="mt-3 text-slate-300 text-sm space-y-1">
          <p><span class="text-slate-400">Email:</span> <strong>{{ ownerEmail }}</strong></p>
          <p><span class="text-slate-400">ID:</span> <strong>{{ (user as any)?.id || '—' }}</strong></p>
        </div>
      </div>
    </div>

    <!-- Invitación Duo -->
    <div v-if="!loading && isDuo" class="mt-8">
      <DuoInvite v-model:ownerEmail="ownerEmail" />
    </div>
  </section>

  <p class="mt-4 text-sm text-slate-400">
    ¿Te invitaron a un Duo?
    <a href="/accept" class="underline">Acepta tu invitación aquí</a>.
  </p>

</template>

<style scoped>
.card {
  background: rgba(15, 18, 24, .96);
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 16px
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
  padding: 8px 10px
}
</style>
