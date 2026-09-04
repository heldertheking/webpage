import type { ReactNode } from 'react'
import { renderMarkdown as renderMarkdownWithTheme, type MarkdownTheme } from '../lib/markdown'

const TERMINAL_THEME: MarkdownTheme = {
  heading: ['text-base font-bold text-ink', 'text-sm font-bold text-ink', 'text-sm font-semibold text-ink-muted'],
  paragraph: 'text-ink-muted',
  bold: 'font-semibold text-ink',
  italic: '',
  code: 'rounded bg-surface-sunken px-1 py-0.5 text-xs text-accent-secondary',
  codeBlock: 'my-1 overflow-x-auto rounded-md bg-surface-sunken p-2 text-xs text-ink',
  list: 'ml-4 list-disc space-y-0.5 text-ink-muted',
  blockquote: 'border-l-2 border-edge pl-3 text-ink-muted italic',
  link: 'text-blue-600 underline underline-offset-2 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300',
  hr: 'my-2 border-edge',
}

/** Renders the bio/resume-style files the terminal's `cat` command reads, in the terminal's small mono aesthetic. */
export function renderMarkdown(source: string): ReactNode[] {
  return renderMarkdownWithTheme(source, TERMINAL_THEME)
}
