import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTheme } from './useTheme'

/**
 * Wraps the app in a shared LayoutGroup so components that resize/reposition
 * across the light/dark redesign (Header nav, badges) animate their layout
 * shift instead of snapping, and plays a radial "wipe" in the incoming
 * theme's surface color, originating from wherever the toggle was clicked
 * (see ThemeToggle), so the switch reads as one continuous motion rather
 * than a hard cut.
 */
export function ThemeLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const [wipeId, setWipeId] = useState<number | null>(null)
  // Compares against the last *seen* theme rather than latching on first
  // render, so React 18 StrictMode's dev-only double-invoke of this effect
  // (mount -> cleanup -> mount) can't trick it into firing a spurious wipe
  // on initial load — both invocations see the same, unchanged theme.
  const prevThemeRef = useRef(theme)

  useEffect(() => {
    if (prevThemeRef.current !== theme) {
      setWipeId(Date.now())
    }
    prevThemeRef.current = theme
  }, [theme])

  return (
    <LayoutGroup>
      <div className="relative min-h-screen bg-surface transition-theme duration-500">
        {children}

        <AnimatePresence>
          {wipeId !== null && (
            <motion.div
              key={wipeId}
              aria-hidden
              className="pointer-events-none fixed inset-0 z-[9999] bg-surface"
              initial={{
                clipPath: 'circle(0% at var(--theme-origin-x, 50%) var(--theme-origin-y, 50%))',
              }}
              animate={{
                clipPath: 'circle(150% at var(--theme-origin-x, 50%) var(--theme-origin-y, 50%))',
              }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
              // The reveal only needs to play once; once it has fully covered
              // the viewport (which now matches the page underneath, already
              // re-themed) it clears itself so it never blocks interaction.
              onAnimationComplete={() => setWipeId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}
