<template>
  <section id="contact" class="container py-24">
    <div class="max-w-2xl mx-auto">
      <div class="card p-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold">¿Tenés alguna duda?</h2>
          <p class="text-slate-300 mt-2 text-sm">Respondemos en menos de 24 horas. También podés escribirnos a <a href="mailto:support@harmonicsniper.com" class="underline text-brand-light">support@harmonicsniper.com</a></p>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-slate-300 mb-1">Nombre</label>
              <input v-model="name" type="text" placeholder="Tu nombre" class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm text-slate-300 mb-1">Email</label>
              <input v-model="email" type="email" placeholder="tu@email.com" class="input w-full" required />
            </div>
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">Mensaje</label>
            <textarea v-model="message" rows="4" placeholder="Tu consulta sobre Harmonic Sniper…" class="input w-full resize-none" required></textarea>
          </div>

          <p v-if="success" class="text-emerald-400 text-sm text-center">✓ Mensaje enviado. Te respondemos pronto.</p>
          <p v-if="error" class="text-red-400 text-sm text-center">No se pudo enviar. Escribinos directo a support@harmonicsniper.com</p>

          <button type="submit" :disabled="loading" class="btn-primary w-full justify-center">
            {{ loading ? 'Enviando…' : 'Enviar mensaje' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
const name = ref('')
const email = ref('')
const message = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref(false)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

async function submit() {
  loading.value = true
  success.value = false
  error.value = false
  try {
    await axios.post(`${API_BASE}/api/contact`, { name: name.value, email: email.value, message: message.value })
    success.value = true
    name.value = ''; email.value = ''; message.value = ''
  } catch (e) {
    error.value = true
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 10px;
  padding: 10px 14px;
  outline: none;
  color: white;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}
.input:focus { border-color: rgba(91,108,255,.6); }
</style>
