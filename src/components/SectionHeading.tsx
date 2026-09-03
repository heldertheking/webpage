import { useTheme } from '../theme/useTheme'

interface SectionHeadingProps {
  eyebrow: string
  title: string
}

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="mb-6">
      <p
        className={`mb-2 font-mono text-xs uppercase tracking-[0.3em] ${
          isDark ? 'text-accent-primary' : 'text-accent-secondary'
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
    </div>
  )
}
