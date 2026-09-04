import { createContext } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  /** Set while a theme change has been requested but not yet committed — see `resolveTransition`. */
  pendingTheme: Theme | null
  /** Commits `pendingTheme` to `theme`. Called once the covering wipe animation has fully painted over the screen, so the swap is invisible. */
  resolveTransition: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
