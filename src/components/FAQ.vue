<template>
  <section id="faq" class="container py-24">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold">Preguntas frecuentes</h2>
    </div>

    <div class="max-w-3xl mx-auto space-y-4">
      <details class="card p-6 group">
        <summary class="font-semibold cursor-pointer list-none flex items-center justify-between">
          ¿Con qué broker funciona?
          <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-slate-300 mt-3 text-sm">Funciona con cualquier broker que soporte MetaTrader 4. No importa si es ECN, STP o Market Maker. Si tu broker tiene MT4, el escáner funciona.</p>
      </details>

      <details class="card p-6 group">
        <summary class="font-semibold cursor-pointer list-none flex items-center justify-between">
          ¿Qué mercados puede escanear?
          <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-slate-300 mt-3 text-sm">Principalmente Forex (todos los pares mayores, menores y exóticos disponibles en tu broker). También puede escanear índices, metales como el Oro (XAUUSD) y cualquier símbolo disponible en tu MT4.</p>
      </details>

      <details class="card p-6 group">
        <summary class="font-semibold cursor-pointer list-none flex items-center justify-between">
          ¿Requiere que la PC esté encendida?
          <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-slate-300 mt-3 text-sm">Sí, el escáner corre sobre MetaTrader 4. Para no perder alertas cuando cerrás la PC, podés usar un VPS (servidor virtual). Hay opciones desde $5/mes y muchos brokers lo ofrecen gratis.</p>
      </details>

      <details class="card p-6 group">
        <summary class="font-semibold cursor-pointer list-none flex items-center justify-between">
          ¿Garantiza ganancias?
          <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-slate-300 mt-3 text-sm">No. Ninguna herramienta de trading puede garantizar resultados. Harmonic Sniper detecta patrones con alta precisión, pero el mercado siempre tiene su propio criterio. Gestioná siempre el riesgo.</p>
      </details>

      <details class="card p-6 group">
        <summary class="font-semibold cursor-pointer list-none flex items-center justify-between">
          ¿Puedo cancelar cuando quiera?
          <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-slate-300 mt-3 text-sm">Sí, los planes mensuales y anuales son sin contrato de permanencia. Cancelás cuando quieras desde tu panel y no se te cobra el siguiente período.</p>
      </details>

      <details class="card p-6 group">
        <summary class="font-semibold cursor-pointer list-none flex items-center justify-between">
          ¿Qué pasa si el escáner no me convence?
          <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-slate-300 mt-3 text-sm">Tenés 7 días de prueba y 14 días de garantía de devolución en los planes Pro, Elite y Lifetime. Si no cumplió tus expectativas, te devolvemos el dinero sin vueltas.</p>
      </details>

      <details class="card p-6 group">
        <summary class="font-semibold cursor-pointer list-none flex items-center justify-between">
          ¿Necesito saber programar para usarlo?
          <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-slate-300 mt-3 text-sm">Para nada. La instalación es copiar un archivo en una carpeta y abrirlo desde MT4. El panel de configuración es visual. Si sabés abrir MetaTrader, podés usar Harmonic Sniper.</p>
      </details>
    </div>
  </section>
</template>
