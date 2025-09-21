import { ref, computed } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

type User = { id: string; email: string; plan?: string; seats?: number; [k: string]: any }

const token = ref<string | null>(localStorage.getItem('auth_token'))
const user  = ref<User | null>(JSON.parse(localStorage.getItem('auth_user') || 'null'))

if (token.value) axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

export function useAuth() {
  const isAuthed = computed(() => !!token.value)

  function setSession(newToken: string, newUser: User, remember = true) {
    token.value = newToken
    user.value = newUser
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    if (remember) {
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('auth_user', JSON.stringify(newUser))
    }
  }

  function clearSession() {
    token.value = null
    user.value = null
    delete axios.defaults.headers.common['Authorization']
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  async function login(email: string, password: string, remember = true) {
    const { data } = await axios.post(`${API_BASE}/api/login`, { email, password })
    setSession(data.token, data.user, remember)
    return data.user as User
  }

  async function signup(email: string, password: string) {
    const { data } = await axios.post(`${API_BASE}/api/signup`, { email, password })
    if (data?.token && data?.user) setSession(data.token, data.user, true)
    return data
  }

  async function logout() {
    try { await axios.post(`${API_BASE}/api/logout`) } catch {}
    clearSession()
  }

  return { token, user, isAuthed, login, signup, logout, setSession, clearSession, API_BASE }
}
