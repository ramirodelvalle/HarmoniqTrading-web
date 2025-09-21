import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Account from '@/pages/Account.vue'
import Auth from '@/pages/Auth.vue'
import { useAuth } from '@/composables/useAuth'
import AcceptInvite from '@/pages/AcceptInvite.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/auth', component: Auth },
    { path: '/account', component: Account, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', component: { template: '<section class="container py-16"><h1 class="text-2xl font-bold">404</h1><p class="text-slate-400">Página no encontrada.</p></section>' } },
    { path: '/accept', component: AcceptInvite },
  ],
  scrollBehavior(){ return { top: 0 } }
})

router.beforeEach((to) => {
  const { token } = useAuth()
  if (to.meta.requiresAuth && !token.value) {
    const next = encodeURIComponent(to.fullPath)
    return `/auth?next=${next}`
  }
  return true
})

export default router
