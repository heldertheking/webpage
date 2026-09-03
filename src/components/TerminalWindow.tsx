import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useTheme } from '../theme/useTheme'

interface TerminalLine {
  prompt?: string
  text: string
  tone?: 'default' | 'ok' | 'warn' | 'muted'
}

interface TerminalWindowProps {
  title: string
  lines: TerminalLine[]
  children?: ReactNode
}

const LINE_TONE: Record<NonNullable<TerminalLine['tone']>, string> = {
  default: 'text-ink',
  ok: 'text-accent-ok',
  warn: 'text-accent-warn',
  muted: 'text-ink-muted',
}

/**
 * Light mode: a clean bordered code card, like a Stripe docs snippet.
 * Dark mode: a workbench terminal — scanline sweep, neon window dots,
 * cyan/magenta glow bleeding from the border.
 */
export function TerminalWindow({ title, lines, children }: TerminalWindowProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-xl border border-edge bg-surface-raised shadow-panel transition-theme duration-300 dark:shadow-panel-lg"
    >
      {isDark && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent-primary/10 to-transparent"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="relative flex items-center gap-2 border-b border-edge bg-surface-sunken px-4 py-2.5 transition-theme duration-300">
        <span className={`h-2.5 w-2.5 rounded-full bg-accent-warn ${isDark ? 'shadow-glow-warn' : ''}`} />
        <span className={`h-2.5 w-2.5 rounded-full bg-accent-ok ${isDark ? 'shadow-glow-ok' : ''}`} />
        <span className={`h-2.5 w-2.5 rounded-full bg-accent-secondary ${isDark ? 'shadow-glow-secondary' : ''}`} />
        <span className="ml-2 font-mono text-xs text-ink-muted">{title}</span>
      </div>

      <div className="relative px-4 py-4 font-mono text-sm leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2">
            {line.prompt !== undefined && (
              <span className={isDark ? 'text-accent-primary' : 'text-accent-secondary'}>
                {line.prompt}
              </span>
            )}
            <span className={LINE_TONE[line.tone ?? 'default']}>{line.text}</span>
          </div>
        ))}
        {children}

        <div className="mt-2 flex items-center gap-2 border-t border-edge/60 pt-2">
          <span className={isDark ? 'text-accent-primary' : 'text-accent-secondary'}>
            {isDark ? '$' : '>'}
          </span>
          <input
            type="text"
            disabled
            placeholder="interactive shell — coming soon"
            className="w-full cursor-not-allowed bg-transparent text-ink-faint placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      {isDark && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px bg-accent-primary/40 shadow-glow-primary"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}
