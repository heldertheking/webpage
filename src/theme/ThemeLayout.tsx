import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useTheme } from './useTheme'

/**
 * Wraps the app in a shared LayoutGroup so components that resize/reposition
 * across the light/dark redesign (Header nav, badges) animate their layout
 * shift instead of snapping, and plays a radial "wipe" in the incoming
 * theme's surface color, originating from wherever the toggle was clicked
 * (see ThemeToggle).
 *
 * The wipe fully covers the viewport *before* the real theme is committed
 * (see `resolveTransition` in ThemeProvider): while it's growing, the page
 * underneath still holds its old colors untouched, and the disc itself is
 * pinned to the incoming theme's palette via its own `data-theme` override
 * — so the swap only becomes visible once the screen is entirely covered,
 * instead of the rest of the page cross-fading mid-wipe.
 */
export function ThemeLayout({ children }: { children: ReactNode }) {
  const { pendingTheme, resolveTransition } = useTheme()

  return (
    <LayoutGroup>
      <div className="relative min-h-screen bg-surface transition-theme duration-500">
        {children}

        <AnimatePresence>
          {pendingTheme && (
            <motion.div
              key="theme-wipe"
              aria-hidden
              data-theme={pendingTheme}
              className="pointer-events-none fixed inset-0 z-[9999] bg-surface"
              initial={{
                clipPath: 'circle(0% at var(--theme-origin-x, 50%) var(--theme-origin-y, 50%))',
              }}
              animate={{
                clipPath: 'circle(150% at var(--theme-origin-x, 50%) var(--theme-origin-y, 50%))',
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
              // Fully covered at this point — safe to commit the real theme
              // now. Clearing `pendingTheme` unmounts this element, which
              // plays the `exit` fade above to reveal the (already-switched)
              // page underneath.
              onAnimationComplete={() => resolveTransition()}
            />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}
