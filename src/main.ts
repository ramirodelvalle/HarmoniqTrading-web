// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

if (import.meta.env.DEV) {
  // Mock de API en desarrollo
  await import('@/mocks/devMock')
}

createApp(App).use(router).mount('#app')
