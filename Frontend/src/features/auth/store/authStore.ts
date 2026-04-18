import { create } from 'zustand'

interface AuthState {
  token: string | null
  rol: string | null
  username: string | null
  setAuth: (token: string, rol: string, username: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  rol: localStorage.getItem('rol'),
  username: localStorage.getItem('username'),

  setAuth: (token, rol, username) => {
    localStorage.setItem('token', token)
    localStorage.setItem('rol', rol)
    localStorage.setItem('username', username)
    set({ token, rol, username })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('username')
    set({ token: null, rol: null, username: null })
  },
}))
