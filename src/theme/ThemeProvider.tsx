import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './context'

const STORAGE_KEY = 'theme'

function readInitialTheme(): Theme {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.dataset.theme
    if (attr === 'light' || attr === 'dark') return attr
  }
  return 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme)
  // A theme change first lands here rather than in `theme` directly, so the
  // wipe overlay (ThemeLayout) has a chance to fully cover the screen before
  // `resolveTransition` commits it — see that component for the choreography.
  const [pendingTheme, setPendingTheme] = useState<Theme | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = useCallback((next: Theme) => setPendingTheme(next), [])
  const toggleTheme = useCallback(() => {
    setPendingTheme((current) => {
      const base = current ?? theme
      return base === 'light' ? 'dark' : 'light'
    })
  }, [theme])

  const resolveTransition = useCallback(() => {
    setPendingTheme((pending) => {
      if (!pending) return null
      // Suspend theme-driven color transitions and flip the DOM attribute
      // synchronously, in that order, so the swap happens instantly
      // (invisibly, behind the wipe) instead of animating. Setting the
      // attribute here too — not just via the effect below — guarantees it
      // lands before the lock is lifted; that effect runs async and can't
      // make that guarantee on its own.
      document.documentElement.classList.add('theme-transition-lock')
      document.documentElement.dataset.theme = pending
      setThemeState(pending)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.classList.remove('theme-transition-lock')
        })
      })
      return null
    })
  }, [])

  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', toggleTheme, setTheme, pendingTheme, resolveTransition }),
    [theme, toggleTheme, setTheme, pendingTheme, resolveTransition],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
