<template>
  <section class="container py-20 text-center">
    <div class="card p-10 bg-gradient-to-br from-slate-900/80 to-brand/10 border border-brand/30">
      <h3 class="text-2xl md:text-3xl font-bold">¿Listo para operar con ventaja?</h3>
      <p class="text-slate-300 mt-3 max-w-lg mx-auto">
        Empezá con 7 días de prueba. Si los patrones no te impresionan, te devolvemos el dinero.
      </p>
      <div class="mt-8 flex justify-center gap-4 flex-wrap">
        <button class="btn-primary text-base px-8 py-3.5" @click="$emit('buy', 'pro')">
          Empezar prueba — desde $17/mes
        </button>
        <a href="#features" class="btn-ghost text-base px-8 py-3.5">Ver características</a>
      </div>
      <p class="mt-4 text-xs text-slate-400">Sin tarjeta de crédito para la prueba · Cancelá cuando quieras</p>
    </div>
  </section>
</template>
