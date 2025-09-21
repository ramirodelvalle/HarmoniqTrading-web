<template>
  <main>
    <HarmonicBatStatic />
    <Hero />
    <Features />
    <HowItWorks />
    <Pricing @buy="openCheckout" @open-refund="onOpenRefund" />
    <DuoInvite v-if="seats === 2" v-model:ownerEmail="email" />
    <Testimonials />
    <FAQ />
    <CTA @buy="openCheckout" />
    <ContactForm />

    <!-- 👇 ahora con v-model:open -->
    <RefundPolicy v-model:open="showRefund" supportEmail="support@harmonicsniper.com" />

    <div class="container my-12 text-sm text-slate-400">
      <p>Este sitio es informativo…</p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Hero from '@/components/Hero.vue'
import Features from '@/components/Features.vue'
import HowItWorks from '@/components/HowItWorks.vue'
import Pricing from '@/components/Pricing.vue'
import Testimonials from '@/components/Testimonials.vue'
import FAQ from '@/components/FAQ.vue'
import ContactForm from '@/components/ContactForm.vue'
import CTA from '@/components/CTA.vue'
import HarmonicBatStatic from '@/components/HarmonicBatStatic.vue'
import DuoInvite from '@/components/DuoInvite.vue'
import RefundPolicy from '@/components/RefundPolicy.vue'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

const showRefund = ref(false)
function onOpenRefund() { showRefund.value = true }

const email = ref('cliente@example.com')

// 👇 más simple: solo seats
const seats = ref(0)

onMounted(async () => {
  // const { data } = await axios.get(`${API_BASE}/api/me/entitlements`)
  // seats.value = data?.seats ?? 0
})

async function openCheckout(planId = 'pro', buyerEmail = email.value) {
  try {
    const { data } = await axios.post(`${API_BASE}/api/checkout`, { planId, email: buyerEmail })
    if (data?.url) window.location.href = data.url
  } catch (e) {
    alert('No se pudo iniciar el checkout. Inténtalo más tarde.')
    console.error(e)
  }
}
</script>
