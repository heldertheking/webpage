import { motion } from 'framer-motion'
import { stackPersonal, stackProfessional } from '../data/content'
import { useTheme } from '../theme/useTheme'
import { SectionHeading } from './SectionHeading'

export function StackSection() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const stack = isDark ? stackPersonal : stackProfessional

  return (
    <section id="stack" className="mb-16">
      <SectionHeading
        eyebrow={isDark ? '// stack.log' : 'Stack'}
        title={isDark ? 'What I tinker with' : 'What I work with'}
      />

      <div className="flex flex-wrap gap-2">
        {stack.map((tech) => (
          <motion.span
            layout
            key={tech}
            className={`rounded-full border px-3 py-1.5 font-mono text-sm text-ink transition-theme duration-300 ${
              isDark
                ? 'border-accent-secondary/40 bg-surface-raised hover:border-accent-secondary hover:shadow-glow-secondary'
                : 'border-edge bg-surface-raised hover:border-edge-strong'
            }`}
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </section>
  )
}
