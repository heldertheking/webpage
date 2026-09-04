import {useState} from 'react'
import {AboutSection, ContactSection, HeroSection, HighlightSection, ProjectSection, StackSection, WorkExperienceSection} from './sections'
import {Header} from './components/Header'
import {HardwareStatusBadge} from './components/HardwareStatusBadge'
import {Terminal} from './components/Terminal'
import {useTheme} from './theme/useTheme'

function App() {
  const {isDark} = useTheme()
  const [terminalVisible, setTerminalVisible] = useState(false)
  const [terminalOpenSignal, setTerminalOpenSignal] = useState(0)

  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 bg-ambient-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-ambient-circuit opacity-70" />

      <div className="relative">
        <Header
            terminalOpen={terminalVisible}
            onToggleTerminal={() => setTerminalOpenSignal((s) => s + 1)}
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
        </main>
      </div>

      <Terminal openSignal={terminalOpenSignal} onVisibleChange={setTerminalVisible}/>
    </div>
  )
}

export default App
