import { Markdown } from '../components/markdown/Markdown'
import dataSafetyRaw from '../assets/data-safety.md?raw'
import useMarkdownFile from '../hooks/useMarkdownFile'
import { useTheme } from '../theme/useTheme'

export function DataSafetyPage() {
  const { isDark } = useTheme()
  const { data, content } = useMarkdownFile(dataSafetyRaw)
  const lastUpdated = new Date(data.lastUpdated).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-ambient-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-ambient-circuit opacity-70" />

      <header className="relative sticky top-0 z-40 border-b border-edge bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-md border font-mono text-sm font-bold ${
              isDark ? 'border-accent-primary/50 bg-surface-sunken text-accent-primary' : 'border-edge-strong bg-surface-sunken text-ink'
            }`}
          >
            H
          </span>
          <a
            href="/"
            className="text-sm font-medium text-accent-primary underline underline-offset-2 italic hover:brightness-110"
          >
            ← Back to heldertheking.com
          </a>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-6 py-16">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-faint">Data safety</p>
        <h1 className="mb-2 text-3xl font-bold text-ink">{data.title}</h1>
        <p className="mb-12 text-sm text-ink-muted">Last updated {lastUpdated}</p>

        <Markdown source={content} />
      </main>
    </div>
  )
}
