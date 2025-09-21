<template>
    <footer class='border-t border-white/10 mt-20'>
        <div class='container py-10 flex flex-col md:flex-row items-center justify-between gap-4'>
            <div class='flex items-center gap-2'><img src='/logo.svg' class='h-6 w-6'
                    alt='logo' /><span class='text-slate-300'>© {{ new Date().getFullYear() }} AutoTrader Pro</span>
            </div>
            <div class='text-xs text-slate-400'>No es asesoramiento financiero. Operar implica riesgo.</div>
        </div>
    </footer>
</template>