import { renderMarkdown, type MarkdownTheme } from '../../lib/markdown'

const PROSE_THEME: MarkdownTheme = {
  heading: ['text-xl font-bold text-ink', 'text-lg font-semibold text-ink', 'text-base font-semibold text-ink-muted'],
  paragraph: 'text-ink-muted leading-relaxed',
  bold: 'font-semibold text-ink',
  italic: 'italic',
  code: 'rounded bg-surface-sunken px-1.5 py-0.5 text-sm text-accent-secondary',
  codeBlock: 'overflow-x-auto rounded-lg bg-surface-sunken p-3 text-sm text-ink',
  list: 'ml-5 list-disc space-y-1.5 text-ink-muted',
  blockquote: 'border-l-2 border-edge pl-4 text-ink-muted italic',
  link: 'text-accent-primary underline underline-offset-2 hover:brightness-110',
  hr: 'my-4 border-edge',
}

export interface MarkdownProps {
  source: string
  className?: string
}

/** Renders a markdown string in the site's regular prose styling (see `PROSE_THEME`) — used for longer, content-managed copy like the About section. */
export function Markdown({ source, className = '' }: MarkdownProps) {
  return <div className={`space-y-3 ${className}`}>{renderMarkdown(source, PROSE_THEME)}</div>
}
