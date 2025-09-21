import type { AxiosResponse } from 'axios'
import axios from 'axios';

// helper que devuelve AxiosResponse tipado
function ok<T>(data: T, config: any = {}, status = 200, delay = 150): Promise<AxiosResponse<T>> {
  return new Promise((resolve) =>
    setTimeout(() =>
      resolve({ data, status, statusText: 'OK', headers: {}, config } as AxiosResponse<T>)
      , delay)
  )
}

// ---- overrides tipados ----
type PostType = typeof axios.post
const originalPost = axios.post.bind(axios) as PostType
  ; (axios.post as PostType) = (async (url: string, body?: any, cfg?: any) => {
    if (url.endsWith('/api/login')) {
      const { email } = body || {}
      const user = { id: 'u1', email, plan: 'elite', seats: 2 }
      const token = 'MOCK_TOKEN'
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
      return ok({ token, user }, cfg)
    }
    if (url.endsWith('/api/signup')) {
      const { email } = body || {}
      const user = { id: 'u_new', email, plan: 'pro', seats: 1 }
      const token = 'MOCK_TOKEN_NEW'
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
      return ok({ token, user }, cfg)
    }
    if (url.endsWith('/api/logout')) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      delete axios.defaults.headers.common['Authorization']
      return ok({ ok: true }, cfg)
    }
    // dentro del override de axios.post en devMock.ts
    if (url.endsWith('/api/checkout')) {
      // recogemos el planId que emite <Pricing @buy="openCheckout(planId)">
      const planId = (body && body.planId) ? String(body.planId) : 'pro'

      // lee el user actual (si no hay, crea uno básico)
      const raw = localStorage.getItem('auth_user')
      const current = raw ? JSON.parse(raw) : { id: 'u1', email: 'demo@user.com' }

      // mapeo simple: plan → plan + seats
      const map: Record<string, { plan: string; seats: number }> = {
        // mensuales/anuales (ejemplos)
        'starter': { plan: 'starter', seats: 1 },
        'starter-year': { plan: 'starter', seats: 1 },
        'pro': { plan: 'pro', seats: 1 },
        'pro-year': { plan: 'pro', seats: 1 },
        'elite': { plan: 'elite', seats: 1 },
        'elite-year': { plan: 'elite', seats: 1 },
        'elite-duo': { plan: 'elite', seats: 2 },
        'elite-duo-year': { plan: 'elite', seats: 2 },

        // lifetime (ejemplos)
        'lt-pro': { plan: 'lt-pro', seats: 1 },
        'lt-elite': { plan: 'lt-elite', seats: 1 },
        'lt-elite-duo': { plan: 'lt-elite-duo', seats: 2 },
      }

      const picked = map[planId] || { plan: 'pro', seats: 1 }
      const nextUser = { ...current, ...picked }

      // guarda el user con el nuevo plan/seats (así /account lo refleja)
      localStorage.setItem('auth_user', JSON.stringify(nextUser))

      // opcional: asegura el token
      if (!localStorage.getItem('auth_token')) {
        localStorage.setItem('auth_token', 'MOCK_TOKEN')
      }

      // redirigimos a la cuenta como antes
      return ok({ url: '/account' }, cfg)
    }

    return originalPost(url as any, body, cfg)
  }) as PostType

type GetType = typeof axios.get
const originalGet = axios.get.bind(axios) as GetType
  ; (axios.get as GetType) = (async (url: string, cfg?: any) => {
    if (url.endsWith('/api/me/entitlements')) {
      const userRaw = localStorage.getItem('auth_user')
      const user = userRaw ? JSON.parse(userRaw) : { plan: 'pro', seats: 1 }
      const entitlements = {
        plan: user.plan || 'pro',
        seats: user.seats ?? 1,
        symbols: user.plan?.includes('elite') ? 'unlimited' : (user.plan === 'pro' ? 100 : 5),
        alerts_per_month: user.plan?.includes('elite') ? 'unlimited' : (user.plan === 'pro' ? 300 : 20),
        webhooks: user.plan?.includes('elite') ? 10 : (user.plan === 'pro' ? 3 : 0),
        api: user.plan !== 'starter',
        latency: user.plan?.includes('elite') ? 'priority' : 'standard',
        confirmations: {
          main: true,
          abcd: user.plan !== 'starter',
          institutionalD: user.plan?.includes('elite') ? true : false,
          mtf: user.plan?.includes('elite') ? true : false,
          przScore: user.plan?.includes('elite') ? true : false,
        },
        copier: user.plan?.includes('elite') ? true : false,
      }
      return ok(entitlements, cfg)
    }
    return originalGet(url as any, cfg)
  }) as GetType
