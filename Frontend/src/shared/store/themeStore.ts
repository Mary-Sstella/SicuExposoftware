import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: localStorage.getItem('theme') === 'dark',
  toggleTheme: () => {
    const next = !get().isDark
    localStorage.setItem('theme', next ? 'dark' : 'light')
    set({ isDark: next })
  },
}))
