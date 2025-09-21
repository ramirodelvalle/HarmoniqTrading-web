<script setup lang="ts">
import { ref, computed } from 'vue'

/** Emits: buy(planId), open-refund */
const emit = defineEmits<{
  (e: 'buy', planId: string): void
  (e: 'open-refund'): void
}>()

/** Config */
const DISCOUNT_YEARLY = 0.20
const CURRENCY = 'USD'
const money = (n: number, frac = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: CURRENCY,
    maximumFractionDigits: frac, minimumFractionDigits: frac
  }).format(n)

const baseMonthly = [
  {
    id: 'pro',
    name: 'Pro',
    monthly: 34,
    badge: 'Popular',
    features: [
      '6 de 6 patrones',
      '100 símbolos',
      'Backtests avanzados',
      'Webhooks + Telegram/Discord',
      'Patrones custom (ajustes básicos)',
      'Confirmaciones: Botón + AB=CD',
      '¿Son 2? Duo te queda por persona 👇',
    ],
    cta: 'Comprar',
  },
  {
    id: 'elite',
    name: 'Elite',
    monthly: 69,
    features: [
      '6 de 6 patrones',
      'Símbolos ilimitados',
      'Auto-Trade Connector',
      'Prioridad 24/5',
      'Confirmaciones: Botón + AB=CD + Precio institucional en D',
      '1 usuario',
    ],
    cta: 'Comprar Elite',
  },
  {
    id: 'elite-duo',
    name: 'Elite Duo',
    monthly: 99,
    badge: 'Mejor para 2 traders',
    highlight: true,
    features: [
      'Todo lo de Elite',
      'Incluye 2 usuarios (seats) simultáneos',
    ],
    cta: 'Invitar y comprar Duo',
  },
  {
    id: 'starter',
    name: 'Starter',
    monthly: 17,
    features: [
      '3 de 6 patrones (Bat, Gartley, Cypher)',
      '5 símbolos',
      '20 alertas básicas',
      'Timeframes 15m–4h',
      'Confirmaciones: Botón principal',
    ],
    cta: 'Probar 7 días',
  },
]

/** Lifetime (fijos) */
const lifetimePlans = [
  {
    id: 'lt-elite',
    name: 'Lifetime Elite',
    price: 749,
    tagline: '1 año de soporte y updates',
    features: [
      '6 de 6 patrones',
      'Símbolos ilimitados',
      'Auto-Trade Connector',
      'Prioridad 24/5',
      'Confirmaciones: Botón + AB=CD + Precio institucional en D',
      '1 usuario',
    ],
    cta: 'Comprar de por vida',
  },
  {
    id: 'lt-elite-duo',
    name: 'Lifetime Elite Duo',
    price: 999,
    badge: '2 usuarios',
    tagline: '1 año de soporte y updates',
    features: [
      'Todo lo de Elite',
      'Incluye 2 usuarios (seats) simultáneos',
    ],
    cta: 'Comprar Duo de por vida',
    highlight: true,
  },
  {
    id: 'lt-pro',
    name: 'Lifetime Pro',
    price: 499,
    tagline: '1 año de soporte y updates',
    features: [
      '6 de 6 patrones',
      '100 símbolos',
      'Backtests avanzados',
      'Webhooks + Telegram/Discord',
      'Confirmaciones: Botón + AB=CD',
    ],
    cta: 'Comprar de por vida',
  },
]

/** Toggle de facturación */
const billing = ref<'monthly' | 'yearly' | 'lifetime'>('monthly')

type PlanCard = {
  id: string
  name: string
  priceLabel: string
  suffix?: string
  tagline?: string
  badge?: string
  highlight?: boolean
  features: string[]
  cta?: string
  savingsText?: string
}

/** Helpers anual */
const yearlyPrice = (m: number) => Math.round(m * 12 * (1 - DISCOUNT_YEARLY))
const yearlySavings = (m: number) => Math.round(m * 12 - yearlyPrice(m))

/** Prioridad de render (no dependemos del orden del array) */
const PRIORITY: Record<string, number> = {
  'pro': 1, 'pro-year': 1,
  'elite': 2, 'elite-year': 2,
  'elite-duo': 3, 'elite-duo-year': 3,
  'starter': 4, 'starter-year': 4,
  'lt-elite': 1,
  'lt-elite-duo': 2,
  'lt-pro': 3,
}

/** Data para las cards según toggle (✅ sin computed anidados) */
const plansByBilling = computed<PlanCard[]>(() => {
  if (billing.value === 'lifetime') {
    return lifetimePlans
      .map<PlanCard>(p => ({
        id: p.id,
        name: p.name,
        priceLabel: money(p.price),
        suffix: undefined,
        tagline: p.tagline,
        badge: (p as any).badge,
        highlight: (p as any).highlight,
        features: p.features,
        cta: p.cta,
        savingsText: undefined,
      }))
      .sort((a, b) => (PRIORITY[a.id] ?? 99) - (PRIORITY[b.id] ?? 99))
  }

  const yearly = billing.value === 'yearly'
  return baseMonthly
    .map<PlanCard>(p => {
      const id = yearly ? `${p.id}-year` : p.id
      const price = yearly ? yearlyPrice(p.monthly) : p.monthly
      const savings = yearly ? yearlySavings(p.monthly) : 0
      return {
        id,
        name: p.name,
        priceLabel: money(price),
        suffix: yearly ? '/año' : '/mes',
        tagline: (p as any).tagline,
        badge: (p as any).badge,
        highlight: (p as any).highlight,
        features: p.features,
        cta: yearly ? 'Elegir anual' : p.cta,
        savingsText: yearly ? `Ahorra ${money(savings)} vs. mensual` : undefined,
      }
    })
    .sort((a, b) => (PRIORITY[a.id] ?? 99) - (PRIORITY[b.id] ?? 99))
})

/** —— Banner Duo por persona —— */
const duoMonthly = baseMonthly.find(p => p.id === 'elite-duo')!.monthly
const duoYearlyTotal = yearlyPrice(duoMonthly)
const duoPerPersonMonthly = money(duoMonthly / 2, 2)
const duoPerPersonYearlyMonthlyEq = money(duoYearlyTotal / 2 / 12, 2)
const duoLifetimeTotal = lifetimePlans.find(p => p.id === 'lt-elite-duo')!.price
const duoPerPersonLifetime = money(duoLifetimeTotal / 2, 2)

/** Handlers */
function onBuy(planId: string) { emit('buy', planId) }
</script>

<template>
  <section id="pricing" class="container py-24">
    <h2 class="text-3xl md:text-4xl font-bold text-center">Precios</h2>
    <p class="text-slate-300 text-center max-w-2xl mx-auto mt-2">
      Elige el plan que se adapte a tu operativa. Cancela cuando quieras.
    </p>

    <!-- Banner: valor del Duo por persona -->
    <div
      class="mt-8 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-300/15 border border-amber-400/40 p-5 text-center">
      <p class="text-lg md:text-xl font-semibold">
        <span class="hidden md:inline">💥 </span>
        <span class="font-bold">Elite Duo</span> = <span class="underline">2 usuarios</span>.
        Te sale <span class="text-amber-300 font-bold">{{ duoPerPersonMonthly }}</span> por persona al mes,
        <span class="text-amber-300 font-bold">{{ duoPerPersonYearlyMonthlyEq }}</span>/mes por persona en anual,
        o <span class="text-amber-300 font-bold">{{ duoPerPersonLifetime }}</span> por persona de por vida.
      </p>
      <p class="text-xs text-slate-400 mt-1">
        (Mensual total {{ money(duoMonthly) }}, Anual total {{ money(duoYearlyTotal) }}, Lifetime total {{
          money(duoLifetimeTotal) }})
      </p>
    </div>

    <!-- Toggle -->
    <div class="flex items-center justify-center gap-2 mt-6">
      <button class="btn-ghost" :class="billing === 'monthly' && 'ring-2 ring-brand'"
        @click="billing = 'monthly'">Mensual</button>
      <button class="btn-ghost" :class="billing === 'yearly' && 'ring-2 ring-brand'" @click="billing = 'yearly'">
        Anual <span class="ml-2 text-xs badge">-20%</span>
      </button>
      <button class="btn-ghost" :class="billing === 'lifetime' && 'ring-2 ring-brand'" @click="billing = 'lifetime'">De
        por
        vida</button>
    </div>

    <!-- Cards -->
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      <article v-for="p in plansByBilling" :key="p.id" class="card p-6"
        :class="p.highlight && 'border border-brand/60 shadow-glow'">
        <h3 class="text-xl font-semibold flex items-center gap-2">
          {{ p.name }}
          <span v-if="p.badge" class="badge">{{ p.badge }}</span>
        </h3>

        <p class="text-3xl font-extrabold mt-2">
          {{ p.priceLabel }}<span v-if="p.suffix" class="text-base text-slate-400">{{ p.suffix }}</span>
        </p>
        <p v-if="p.tagline" class="text-xs text-slate-400 mt-1">{{ p.tagline }}</p>

        <p v-if="p.savingsText"
          class="text-xs mt-2 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 inline-block">
          {{ p.savingsText }}
        </p>

        <!-- Hint por persona en Duo -->
        <p v-if="p.id === 'elite-duo' || p.id === 'elite-duo-year'" class="text-xs mt-2 text-amber-300">
          ≈ {{ p.id === 'elite-duo' ? duoPerPersonMonthly : duoPerPersonYearlyMonthlyEq }} por persona
        </p>
        <p v-else-if="p.id === 'lt-elite-duo'" class="text-xs mt-2 text-amber-300">
          ≈ {{ duoPerPersonLifetime }} por persona (pago único)
        </p>

        <ul class="mt-4 text-slate-300 space-y-2">
          <li v-for="f in p.features" :key="f">{{ f }}</li>
        </ul>

        <div class="mt-6 grid gap-2">
          <button class="w-full" :class="p.highlight ? 'btn-primary' : 'btn-ghost'" @click="onBuy(p.id)">
            {{ p.cta || 'Elegir' }}
          </button>

          <!-- Texto breve (sin botón) solo en Duo y Pro -->
          <p v-if="p.id === 'elite-duo' || p.id === 'pro' || p.id === 'pro-year'"
            class="text-[11px] text-slate-400 text-center">
            <button class="underline text-amber-300 hover:text-amber-200" @click="$emit('open-refund')">
              Prueba 7 días / devolución 14 días
            </button>
          </p>
        </div>

      </article>
    </div>

    <!-- Mini-mensaje de reembolso (global, debajo de las cards) -->
    <div class="mt-4 text-center text-sm text-slate-300">
      ¿Dudas?
      <button class="underline text-amber-300 hover:text-amber-200" @click="$emit('open-refund')">
        Prueba 7 días y devolución 14 días
      </button>.
    </div>

    <!-- Notas -->
    <div class="text-xs text-slate-400 mt-6 text-center space-y-1">
      <p>* Prueba 7 días / devolución 14 días en Pro, Elite y Lifetime.</p>
      <p>* Las licencias de por vida incluyen 1 año de soporte/actualizaciones. Renovación opcional: $59/año.</p>
      <p>* Elite Duo incluye 2 usuarios simultáneos (seats). Gestión de seats en tu panel.</p>
      <p>* No es asesoramiento financiero. Operar implica riesgo.</p>
    </div>
  </section>
</template>
