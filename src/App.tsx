import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { ContactSection } from './components/ContactSection'
import { ExperienceSection } from './components/ExperienceSection'
import { Header } from './components/Header'
import { HardwareStatusBadge } from './components/HardwareStatusBadge'
import { HighlightSection } from './components/HighlightSection'
import { StackSection } from './components/StackSection'
import { TerminalWindow } from './components/TerminalWindow'
import { useTheme } from './theme/useTheme'

function App() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 bg-ambient-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-ambient-circuit opacity-70" />

      <div className="relative">
        <Header terminalOpen={terminalOpen} onToggleTerminal={() => setTerminalOpen((o) => !o)} />

        <AnimatePresence initial={false}>
          {terminalOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden border-b border-edge bg-surface-sunken/60"
            >
              <div className="mx-auto max-w-6xl px-6 py-4">
                <TerminalWindow
                  title={isDark ? 'workbench — zsh' : 'about.ts'}
                  lines={
                    isDark
                      ? [
                          { prompt: '$', text: 'whoami' },
                          { text: 'helder — software engineer in training, garage tinkerer', tone: 'ok' },
                          { prompt: '$', text: 'cat interests.log' },
                          { text: 'gaming · custom PCs · embedded (ESP32) · homelab', tone: 'muted' },
                        ]
                      : [
                          { prompt: '>', text: 'const engineer = {' },
                          { text: '  role: "Software Engineering Apprentice",', tone: 'muted' },
                          { text: '  languages: ["Java", "TypeScript", "Python"],', tone: 'muted' },
                          { text: '  frameworks: ["Spring Boot", "Next.js", "Angular", "React", "FastAPI"],', tone: 'muted' },
                          { text: '};', tone: 'default' },
                        ]
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="mx-auto max-w-6xl px-6 py-16">
          <section className="mb-16 max-w-2xl">
            <p
              className={`mb-3 font-mono text-xs uppercase tracking-[0.3em] ${
                isDark ? 'text-accent-primary' : 'text-accent-secondary'
              }`}
            >
              {isDark ? '// portfolio.exe' : 'Portfolio'}
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Building clean systems by day,
              <br />
              tuning neon rigs by night.
            </h1>
            <p className="text-lg text-ink-muted">
              {isDark
                ? 'Off the clock: gaming, custom PC builds, night motorcycle rides, and a homelab running proper GitOps.'
                : 'Software Engineering apprentice working across Java, TypeScript and Python — Spring Boot, Next.js, Angular, React and FastAPI.'}
            </p>
          </section>

          <section className="mb-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HardwareStatusBadge label={isDark ? 'cpu.temp' : 'Uptime'} value={isDark ? '52°C' : '99.98%'} tone="ok" />
            <HardwareStatusBadge label={isDark ? 'gpu.load' : 'Build'} value={isDark ? '18%' : 'Passing'} tone="primary" />
            <HardwareStatusBadge label={isDark ? 'net.link' : 'Response'} value={isDark ? '1.2ms' : '< 24h'} tone="secondary" />
            <HardwareStatusBadge label={isDark ? 'ride.mode' : 'Location'} value={isDark ? 'NIGHT' : 'Remote'} tone="warn" />
          </section>

          <ExperienceSection />
          <StackSection />
          <HighlightSection />
          <ContactSection />
        </main>
      </div>
    </div>
  )
}

export default App
