import {useTheme} from '../../theme/useTheme'

interface SectionHeadingProps {
    eyebrow: string
    title: string
    subtitle: string
    h1: boolean
}

export function SectionHeading({eyebrow, title, subtitle, h1}: SectionHeadingProps) {
    const {isDark} = useTheme()

  return (
    <div className="mb-6">
      <p
        className={`mb-2 font-mono text-xs uppercase tracking-[0.3em] ${
          isDark ? 'text-accent-primary' : 'text-accent-secondary'
        }`}
      >
        {eyebrow}
      </p>
        {h1
            ? <h1 className="mb-1 text-4xl font-bold tracking-tight text-ink sm:text-5xl">{title}</h1>
            : <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
        }
        {subtitle && subtitle.length > 0 && (
            <p className="text-lg text-ink-muted">{subtitle}</p>
        )}
    </div>
  )
}
