<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm"
      @click.self="close"
      role="dialog"
      aria-modal="true"
      aria-labelledby="refund-title"
    >
      <div
        ref="panelRef"
        class="card p-6 max-w-2xl w-[92vw] md:w-full"
        tabindex="-1"
      >
        <header class="flex items-center justify-between">
          <h3 id="refund-title" class="text-xl font-semibold">Política de reembolsos</h3>
          <button class="btn-ghost text-sm" @click="close" aria-label="Cerrar">✕</button>
        </header>

        <p class="text-slate-300 text-sm mt-3">
          Ofrecemos <strong>7 días de prueba</strong> y <strong>14 días de devolución</strong> en Pro, Elite y Lifetime.
          Si el producto no cumple tus expectativas, podés solicitar el reembolso dentro del plazo indicado.
        </p>

        <ul class="list-disc ml-5 mt-3 text-sm text-slate-300 space-y-1">
          <li>Reembolso completo si no se supera el período de prueba y no se violan los Términos de Uso.</li>
          <li>El uso indebido, compartición no autorizada o abuso de límites invalida la elegibilidad.</li>
          <li>Las licencias <em>Lifetime</em> incluyen <strong>1 año de soporte/actualizaciones</strong>. Renovación opcional: <strong>$59/año</strong>.</li>
        </ul>

        <div class="mt-4 text-sm text-slate-400">
          <p>
            Para iniciar un reembolso, escribinos a
            <a class="underline" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a>
            con el email de compra y el motivo. Respondemos en 24–48&nbsp;h hábiles.
          </p>
        </div>

        <footer class="mt-6 flex flex-wrap gap-2 justify-end">
          <RouterLink :to="{ path: '/', hash: '#pricing' }" class="btn-ghost">Ver planes</RouterLink>
          <button class="btn-primary" @click="close">Entendido</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  supportEmail?: string
}>()

const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

const supportEmail = props.supportEmail ?? 'soporte@tu-dominio.com'
const panelRef = ref<HTMLElement | null>(null)

// cerrar helpers
function close() { emit('update:open', false) }

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

// lock scroll cuando está abierto
watch(() => props.open, (v) => {
  if (v) {
    document.body.style.overflow = 'hidden'
    setTimeout(() => panelRef.value?.focus(), 0)
    window.addEventListener('keydown', onKey)
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKey)
  }
})

onMounted(() => { if (props.open) document.body.style.overflow = 'hidden' })
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.card {
  background: rgba(15,18,24,.96);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 16px;
}
.btn-primary {
  background: #8b5cf6;
  border-radius: 12px;
  padding: 10px 14px;
}
.btn-ghost {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px;
  padding: 8px 10px;
}
</style>
