import { create } from 'zustand'

interface AuthState {
  token: string | null
  rol: string | null
  username: string | null
  id_estudiante: number | null
  setAuth: (token: string, rol: string, username: string, id_estudiante: number | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  rol: localStorage.getItem('rol'),
  username: localStorage.getItem('username'),
  id_estudiante: localStorage.getItem('id_estudiante') ? Number(localStorage.getItem('id_estudiante')) : null,

  setAuth: (token, rol, username,id_estudiante) => {
    localStorage.setItem('token', token)
    localStorage.setItem('rol', rol)
    localStorage.setItem('username', username)
    if (id_estudiante) localStorage.setItem('id_estudiante', String(id_estudiante))
      set({ token, rol, username, id_estudiante })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('username')
    localStorage.removeItem('id_estudiante')
    set({ token: null, rol: null, username: null, id_estudiante: null })
  },
}))
