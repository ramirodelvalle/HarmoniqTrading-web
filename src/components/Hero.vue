<template>
  <section class="relative overflow-hidden">
    <!-- Fondo gradiente -->
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(91,108,255,0.25),transparent_60%)]"></div>

    <div class="container py-20 md:py-28 text-center">
      <!-- Badge -->
      <span class="badge">Escáner de Patrones Armónicos · MetaTrader 4 · Forex</span>

      <!-- Headline -->
      <h1 class="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
        Detectá patrones armónicos<br class="hidden md:block" />
        antes de que el precio llegue al punto&nbsp;D
      </h1>

      <!-- Subheadline -->
      <p class="mt-5 text-slate-300 text-lg max-w-2xl mx-auto">
        Harmonic Sniper escanea Bat, Gartley, Cypher, Butterfly, Crab y Shark en tiempo real.
        Te marca la entrada exacta, el SL y los TPs. Vos solo tomás la decisión.
      </p>

      <!-- CTAs -->
      <div class="mt-8 flex items-center justify-center gap-4 flex-wrap">
        <a href="#pricing" class="btn-primary text-base px-7 py-3.5">Ver planes y precios</a>
        <a href="#how" class="btn-ghost text-base px-7 py-3.5">Ver cómo funciona</a>
      </div>

      <!-- Social proof mínima -->
      <p class="mt-5 text-sm text-slate-400">
        ✓ Solo para MT4 &nbsp;·&nbsp; ✓ Funciona con cualquier broker Forex &nbsp;·&nbsp; ✓ Sin necesidad de programar
      </p>

      <!-- Cards de valor -->
      <div class="mt-14 grid md:grid-cols-3 gap-6 text-left">
        <div class="card p-6">
          <div class="text-2xl mb-2">🎯</div>
          <h3 class="font-semibold text-white">Detección precisa en punto D</h3>
          <p class="text-slate-300 mt-2 text-sm">El escáner identifica la zona de reversión potencial (PRZ) con Fibonacci y te avisa cuando el precio llega al nivel exacto de entrada.</p>
        </div>
        <div class="card p-6">
          <div class="text-2xl mb-2">⚡</div>
          <h3 class="font-semibold text-white">6 patrones, tiempo real</h3>
          <p class="text-slate-300 mt-2 text-sm">Bat, Gartley, Cypher, Butterfly, Crab y Shark. En todos los pares y timeframes. Sin repainting, sin falsas señales por historial.</p>
        </div>
        <div class="card p-6">
          <div class="text-2xl mb-2">📐</div>
          <h3 class="font-semibold text-white">SL y TP calculados solos</h3>
          <p class="text-slate-300 mt-2 text-sm">Cada patrón detectado viene con stop loss, take profit 1 y take profit 2 precalculados. Gestión de riesgo integrada, sin hacer nada a mano.</p>
        </div>
      </div>
    </div>
  </section>
</template>
