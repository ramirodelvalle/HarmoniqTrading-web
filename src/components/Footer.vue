<template>
  <footer class="border-t border-white/10 mt-20">
    <div class="container py-10">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-2">
          <img src="/logo.svg" class="h-6 w-6" alt="logo" />
          <span class="text-slate-300 font-semibold">Harmonic Sniper</span>
        </div>

        <nav class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
          <a href="#features" class="hover:text-white transition-colors">Características</a>
          <a href="#pricing" class="hover:text-white transition-colors">Precios</a>
          <a href="#faq" class="hover:text-white transition-colors">FAQ</a>
          <a href="#contact" class="hover:text-white transition-colors">Contacto</a>
          <a href="mailto:support@harmonicsniper.com" class="hover:text-white transition-colors">support@harmonicsniper.com</a>
        </nav>

        <div class="text-xs text-slate-500 text-center md:text-right">
          <p>© {{ new Date().getFullYear() }} Harmonic Sniper. Todos los derechos reservados.</p>
          <p class="mt-1">No es asesoramiento financiero. Operar implica riesgo.</p>
        </div>
      </div>
    </div>
  </footer>
</template>
