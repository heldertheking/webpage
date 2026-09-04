import { motion } from 'framer-motion'
import { useTheme } from './useTheme'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const originX = ((rect.left + rect.width / 2) / window.innerWidth) * 100
    const originY = ((rect.top + rect.height / 2) / window.innerHeight) * 100
    document.documentElement.style.setProperty('--theme-origin-x', `${originX}%`)
    document.documentElement.style.setProperty('--theme-origin-y', `${originY}%`)
    toggleTheme()
    // Without this the button keeps focus after a click, and `group-focus-within`
    // below keeps the tooltip pinned open until something else steals focus.
    event.currentTarget.blur()
  }

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isDark}
        aria-describedby="theme-toggle-tooltip"
        aria-label={isDark ? 'Switch to professional mode' : 'Switch to personal mode'}
        className="relative flex h-9 w-16 items-center rounded-full border border-edge bg-surface-sunken px-1 transition-theme duration-300 hover:border-edge-strong dark:shadow-glow-primary"
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-raised text-xs shadow-panel"
          style={{ marginLeft: isDark ? 'calc(100% - 1.75rem)' : 0 }}
        >
          {isDark ? (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-accent-primary drop-shadow-[0_0_4px_rgb(var(--color-accent-primary)/0.8)]"
            >
              <path d="M6.5 7h11A4.5 4.5 0 0 1 22 11.5c0 1.93-1.08 3.5-2.6 3.5-.86 0-1.46-.42-2.03-1.1L16.2 12.6H7.8l-1.17 1.3C6.06 14.58 5.46 15 4.6 15 3.08 15 2 13.43 2 11.5A4.5 4.5 0 0 1 6.5 7Z" />
              <circle cx="8" cy="11" r="1.1" fill="rgb(var(--color-surface-raised))" />
              <circle cx="17" cy="10.3" r="0.9" fill="rgb(var(--color-surface-raised))" />
              <circle cx="15.3" cy="12" r="0.9" fill="rgb(var(--color-surface-raised))" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-accent-secondary">
              <rect x="9" y="3.4" width="6" height="3.6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="3.4" y="7.4" width="17.2" height="12.2" rx="2.2" />
              <rect x="3.4" y="12.6" width="17.2" height="1.8" fill="rgb(var(--color-surface-raised))" />
            </svg>
          )}
        </motion.span>
      </button>

      <div
        id="theme-toggle-tooltip"
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-max origin-top-right scale-95 whitespace-nowrap rounded-lg border border-edge bg-surface-raised px-2.5 py-1.5 opacity-0 shadow-panel-lg transition-theme duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100"
      >
        <p className="text-xs font-medium text-ink">{isDark ? 'Switch to day mode' : 'Switch to night mode'}</p>
      </div>
    </div>
  )
}
