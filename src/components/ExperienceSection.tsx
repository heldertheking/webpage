import { motion } from 'framer-motion'
import { projects } from '../data/content'
import { useTheme } from '../theme/useTheme'
import { ExternalLinkIcon } from './icons'
import { SectionHeading } from './SectionHeading'

/**
 * Light mode reads as a minimal CV: where the work actually happens.
 * Dark mode swaps the same card layout for personal projects, since that's
 * the side of the work nobody's paying for. Both pull from the same
 * `projects` list in content.ts, filtered by category.
 */
export function ExperienceSection() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const items = projects.filter((p) => p.category === (isDark ? 'personal' : 'work'))

  return (
    <section id="work" className="mb-16">
      <SectionHeading
        eyebrow={isDark ? '// projects.log' : 'Experience'}
        title={isDark ? 'Personal projects' : 'Where I work'}
      />

      {isDark ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((project) => (
            <motion.a
              layout
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between gap-3 rounded-xl border border-edge bg-surface-raised p-4 shadow-panel transition-theme duration-300 hover:border-accent-primary/60 hover:shadow-glow-primary"
            >
              <div>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="font-mono text-sm font-semibold text-ink">{project.name}</h3>
                  <span className="text-ink-faint transition-theme group-hover:text-accent-primary">
                    <ExternalLinkIcon />
                  </span>
                </div>
                <p className="text-sm text-ink-muted">{project.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <motion.div
              layout
              key={item.name}
              className="rounded-xl border border-edge bg-surface-raised p-4 shadow-panel transition-theme duration-300"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold text-ink">{item.name}</h3>
                {item.period && (
                  <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">
                    {item.period}
                  </span>
                )}
              </div>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent-primary hover:underline"
                >
                  {item.org}
                  <ExternalLinkIcon />
                </a>
              ) : (
                item.org && <p className="text-sm font-medium text-ink-muted">{item.org}</p>
              )}
              <p className="mt-1 text-sm text-ink-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
