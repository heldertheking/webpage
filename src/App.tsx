import {lazy, Suspense, useState} from 'react'
import {AboutSection, ContactSection, HeroSection, HighlightSection, ProjectSection, StackSection, WorkExperienceSection} from './sections'
import {Header} from './components/Header'
import {HardwareStatusBadge} from './components/HardwareStatusBadge'
import {useTheme} from './theme/useTheme'

// Lazy-loaded: the terminal is a click-to-open extra, not needed for the
// initial page render, so keeping it out of the main bundle trims what has
// to download/parse/execute before the page is interactive (mobile especially).
const Terminal = lazy(() => import('./components/Terminal').then((m) => ({default: m.Terminal})))

function App() {
  const {isDark} = useTheme()
  const [terminalVisible, setTerminalVisible] = useState(false)
  const [terminalOpenSignal, setTerminalOpenSignal] = useState(0)
  // Terminal itself is only mounted after the first open, then - per its own
  // docs - stays mounted so its scrollback/history keep surviving minimizes.
  const [terminalLoaded, setTerminalLoaded] = useState(false)

  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 bg-ambient-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-ambient-circuit opacity-70" />

      <div className="relative">
        <Header
            terminalOpen={terminalVisible}
            onToggleTerminal={() => {
              setTerminalLoaded(true)
              setTerminalOpenSignal((s) => s + 1)
            }}
        />

        <main className="mx-auto max-w-6xl px-6 py-16">
          <HeroSection/>

          <section className="mb-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HardwareStatusBadge label={isDark ? 'cpu.temp' : 'Uptime'} value={isDark ? '52°C' : '99.98%'} tone="ok" />
            <HardwareStatusBadge label={isDark ? 'gpu.load' : 'Build'} value={isDark ? '18%' : 'Passing'} tone="primary" />
            <HardwareStatusBadge label={isDark ? 'net.link' : 'Response'} value={isDark ? '1.2ms' : '< 24h'} tone="secondary" />
            <HardwareStatusBadge label={isDark ? 'ride.mode' : 'Location'} value={isDark ? 'NIGHT' : 'Remote'} tone="warn" />
          </section>

          <AboutSection/>
          <WorkExperienceSection/>
          <ProjectSection/>
          <StackSection />
          <HighlightSection />
          <ContactSection />

          <footer className="mt-16 flex gap-4 border-t border-edge pt-6 text-sm text-ink-faint">
            <a href="/privacy-policy" className="underline underline-offset-2 italic hover:text-ink-muted">
              Privacy policy
            </a>
            <a href="/legal-notice" className="underline underline-offset-2 italic hover:text-ink-muted">
              Legal notice
            </a>
          </footer>
        </main>
      </div>

      {terminalLoaded && (
        <Suspense fallback={null}>
          <Terminal openSignal={terminalOpenSignal} onVisibleChange={setTerminalVisible}/>
        </Suspense>
      )}
    </div>
  )
}

export default App
