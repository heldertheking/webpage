import { motion } from 'framer-motion'
import { useTheme } from '../theme/useTheme'

export type Tone = 'ok' | 'warn' | 'primary' | 'secondary'

const TONE_TEXT: Record<Tone, string> = {
  ok: 'text-accent-ok',
  warn: 'text-accent-warn',
  primary: 'text-accent-primary',
  secondary: 'text-accent-secondary',
}

const TONE_BG: Record<Tone, string> = {
  ok: 'bg-accent-ok',
  warn: 'bg-accent-warn',
  primary: 'bg-accent-primary',
  secondary: 'bg-accent-secondary',
}

const TONE_VAR: Record<Tone, string> = {
  ok: '--color-accent-ok',
  warn: '--color-accent-warn',
  primary: '--color-accent-primary',
  secondary: '--color-accent-secondary',
}

interface HardwareStatusBadgeProps {
  label: string
  value: string
  tone?: Tone
}

/**
 * Light mode reads as a clean engineering LED indicator (Stripe/Vercel status
 * pill); dark mode reads as a workbench gauge with a pulsing neon halo. Same
 * markup, same props — only the token classes below branch on theme.
 */
export function HardwareStatusBadge({ label, value, tone = 'ok' }: HardwareStatusBadgeProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.div
      layout
      className="group flex items-center gap-2.5 rounded-lg border border-edge bg-surface-raised px-3 py-2 shadow-panel transition-theme duration-300"
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span
          className={`absolute inset-0 rounded-full ${TONE_BG[tone]} ${
            isDark ? 'animate-pulse-glow' : ''
          }`}
        />
        {isDark && (
          <span className={`absolute -inset-1.5 rounded-full blur-sm ${TONE_BG[tone]} opacity-40 animate-pulse-glow`} />
        )}
      </span>

      <div className="flex flex-col leading-none">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
          {label}
        </span>
        <span
          className={`font-mono text-sm font-medium tracking-tight ${TONE_TEXT[tone]}`}
          style={isDark ? { textShadow: `0 0 10px rgb(var(${TONE_VAR[tone]}) / 0.65)` } : undefined}
        >
          {value}
        </span>
      </div>
    </motion.div>
  )
}
