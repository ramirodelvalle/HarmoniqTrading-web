<script setup lang="ts">
// Minimal animated candlestick + BAT overlay (Canvas-only)
// Same style, price path draws an "M" and AFTER D it goes UP (bullish)

import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement|null>(null)
const dpr = Math.max(1, window.devicePixelRatio || 1)

// Candles that form an M path: X -> A -> B -> C -> D, then **bullish** continuation
type Candle = { o:number, h:number, l:number, c:number }
const candles: Candle[] = (() => {
  const seq: Candle[] = []
  const add = (o:number, h:number, l:number, c:number) => seq.push({o,h,l,c})

  // M shape levels
  const X = 50
  const A = 100
  const B = 75
  const C = 95
  const D = 55

  // steps per leg
  const warm = 8, sXA = 14, sAB = 12, sBC = 12, sCD = 16, sAfter = 18

  const path = [
    { to: X,    steps: warm }, // warm-up into X
    { to: A,    steps: sXA  }, // X -> A (up)
    { to: B,    steps: sAB  }, // A -> B (down)
    { to: C,    steps: sBC  }, // B -> C (up)
    { to: D,    steps: sCD  }, // C -> D (sharp down)
    { to: 110,  steps: sAfter } // bullish continuation after D
  ]

  let last = X - 2
  for (const seg of path) {
    for (let i=0;i<seg.steps;i++) {
      const t = (i+1)/seg.steps
      const v = last + (seg.to - last) * (0.5 - 0.5*Math.cos(Math.PI*t)) // ease
      const bodyTop = Math.max(last, v)
      const bodyBot = Math.min(last, v)
      const wickHigh = bodyTop + Math.random()*1.8
      const wickLow  = bodyBot - Math.random()*1.8
      add(last, wickHigh, wickLow, v)
      last = v
    }
  }
  return seq
})()

// Indices for X, A, B, C, D (based on steps above)
const idxX = 8
const idxA = idxX + 14
const idxB = idxA + 12
const idxC = idxB + 12
const idxD = idxC + 16

let frameId = 0
let progress = 0 // how many candles drawn
const speed = 1   // candles per frame (increase for faster)

function draw() {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!
  const W = canvas.clientWidth * dpr
  const H = canvas.clientHeight * dpr

  // resize backing store for crisp drawing
  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W
    canvas.height = H
  }

  // clear
  ctx.clearRect(0,0,W,H)

  // padding
  const left = 40, right = 20, top = 20, bottom = 30
  const plotW = W - left - right
  const plotH = H - top - bottom

  // visible subset
  const n = Math.min(progress, candles.length)
  const view = candles.slice(0, Math.max(n, 1))

  // scale
  const hi = Math.max(...view.map(c=>c.h))
  const lo = Math.min(...view.map(c=>c.l))
  const pad = (hi - lo) * 0.15 + 2
  const maxY = hi + pad
  const minY = lo - pad
  const y = (price:number) => top + (maxY - price) / (maxY - minY) * plotH

  const colUp = '#52d1a5'
  const colDn = '#ef6b6b'
  const colWick = 'rgba(255,255,255,.85)'
  const batColor = '#7B61FF'  // violet
  const textColor = 'rgba(255,255,255,.9)'

  // grid
  ctx.strokeStyle = 'rgba(255,255,255,.06)'
  ctx.lineWidth = 1
  for (let i=0;i<=5;i++){
    const gy = top + (plotH/5)*i
    ctx.beginPath(); ctx.moveTo(left, gy); ctx.lineTo(W-right, gy); ctx.stroke()
  }

  // draw candles
  const gap = Math.max(2, Math.floor(plotW / Math.max(60, view.length)))
  const bw  = Math.max(3, gap*0.6)
  view.forEach((c, i) => {
    const cx = left + i*gap + gap*0.5

    // wick
    ctx.strokeStyle = colWick
    ctx.beginPath()
    ctx.moveTo(cx, y(c.h))
    ctx.lineTo(cx, y(c.l))
    ctx.stroke()

    // body
    const up = c.c >= c.o
    ctx.fillStyle = up ? colUp : colDn
    const bodyTop = y(Math.max(c.o, c.c))
    const bodyBot = y(Math.min(c.o, c.c))
    ctx.fillRect(Math.round(cx - bw/2), Math.round(bodyTop), Math.round(bw), Math.max(1, Math.round(bodyBot - bodyTop)))
  })

  // draw BAT overlay + guides
  const pts: {label:string, idx:number}[] = [
    {label:'X', idx: idxX},
    {label:'A', idx: idxA},
    {label:'B', idx: idxB},
    {label:'C', idx: idxC},
    {label:'D', idx: idxD},
  ]
  const visiblePts = pts.filter(p => p.idx < n)
  if (visiblePts.length) {
    ctx.lineWidth = 2
    ctx.strokeStyle = batColor
    ctx.fillStyle = batColor

    // polyline X-A-B-C-D
    ctx.beginPath()
    visiblePts.forEach((p, k) => {
      const i = p.idx
      const cx = left + i*gap + gap*0.5
      const price = candles[i].c
      const cy = y(price)
      if (k === 0) ctx.moveTo(cx, cy)
      else ctx.lineTo(cx, cy)
    })
    ctx.stroke()

    // --- NEW: dashed guides X->B and B->D ---
    ctx.save()
    ctx.setLineDash([6,6])
    ctx.lineWidth = 1.5
    ctx.strokeStyle = 'rgba(123,97,255,.65)' // softer violet
    // X -> B (when B is visible)
    if (idxB < n) {
      const cxX = left + idxX*gap + gap*0.5
      const cyX = y(candles[idxX].c)
      const cxB = left + idxB*gap + gap*0.5
      const cyB = y(candles[idxB].c)
      ctx.beginPath()
      ctx.moveTo(cxX, cyX)
      ctx.lineTo(cxB, cyB)
      ctx.stroke()
    }
    // B -> D (when D is visible)
    if (idxD < n) {
      const cxB = left + idxB*gap + gap*0.5
      const cyB = y(candles[idxB].c)
      const cxD = left + idxD*gap + gap*0.5
      const cyD = y(candles[idxD].c)
      ctx.beginPath()
      ctx.moveTo(cxB, cyB)
      ctx.lineTo(cxD, cyD)
      ctx.stroke()
    }
    ctx.restore()
    // --- END NEW ---

    // labels and markers
    ctx.font = `${12*dpr}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial`
    visiblePts.forEach(p => {
      const i = p.idx
      const cx = left + i*gap + gap*0.5
      const price = candles[i].c
      const cy = y(price)
      // marker
      ctx.beginPath()
      ctx.arc(cx, cy, 4, 0, Math.PI*2)
      ctx.fill()
      // label
      ctx.fillStyle = textColor
      ctx.fillText(p.label, cx + 6, cy - 6)
      ctx.fillStyle = batColor
    })

    // highlight PRZ (D area)
    if (idxD < n) {
      const cxD = left + idxD*gap + gap*0.5
      ctx.strokeStyle = 'rgba(123,97,255,.35)'
      ctx.setLineDash([6,6])
      ctx.beginPath()
      ctx.moveTo(cxD, top)
      ctx.lineTo(cxD, top+plotH)
      ctx.stroke()
      ctx.setLineDash([])
      // etiqueta
      ctx.fillStyle = textColor
      ctx.fillText('Zona potencial de reversión (D)', cxD + 8, top + 16)
    }
  }

  // axes
  ctx.fillStyle = textColor
  ctx.fillText('Precio', 8, top + 12)

  // caption
  ctx.fillStyle = 'rgba(255,255,255,.75)'
  ctx.font = `${12*dpr}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial`
  ctx.fillText('Patrón BAT (demo visual) — Tras D, el precio rebota y acelera al alza', left, H - 8)

  // advance
  progress = Math.min(candles.length, progress + speed)
  frameId = requestAnimationFrame(draw)
}

onMounted(() => {
  frameId = requestAnimationFrame(draw)
  const onResize = () => { /* re-render on next frame */ }
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => cancelAnimationFrame(frameId))
</script>

<template>
  <section class="container py-10">
    <h2 class="text-2xl md:text-3xl font-bold mb-4">Ejemplo — Patrón BAT animado</h2>
    <p class="text-slate-300 mb-4">
      El patrón se dibuja en las velas, marca X–A–B–C–D, y tras D continúa al alza (demo).
    </p>
    <div class="card p-3">
      <canvas ref="canvasRef" class="w-full h-[360px] block"></canvas>
    </div>
  </section>
</template>
