import type { ReactNode } from 'react'
import type { TerminalColor } from './types'

export const TERMINAL_COLORS: TerminalColor[] = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
]

const COLOR_CLASSES: Record<TerminalColor, string> = {
  red: 'text-red-600 dark:text-red-400',
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  blue: 'text-blue-600 dark:text-blue-400',
  magenta: 'text-fuchsia-600 dark:text-fuchsia-400',
  cyan: 'text-cyan-600 dark:text-cyan-400',
  white: 'text-ink',
  gray: 'text-ink-faint',
}

const LINK_CLASSES = 'underline decoration-dotted underline-offset-2 hover:text-accent-primary'

const COLOR_TAG_RE = new RegExp(`\\[(${TERMINAL_COLORS.join('|')})\\]([\\s\\S]*?)\\[/\\1\\]`, 'g')
const URL_RE = /https?:\/\/[^\s[\]]+/g

function linkify(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let i = 0

  for (const match of text.matchAll(URL_RE)) {
    const start = match.index ?? 0
    if (start > last) nodes.push(text.slice(last, start))
    nodes.push(
      <a key={`${keyPrefix}-link-${i}`} href={match[0]} target="_blank" rel="noreferrer" className={LINK_CLASSES}>
        {match[0]}
      </a>,
    )
    last = start + match[0].length
    i += 1
  }

  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/**
 * Renders terminal output text: `[color]...[/color]` spans (the 8 predefined
 * terminal colors) plus automatic hyperlinking of bare URLs, whether inside
 * or outside a color span.
 */
export function renderTerminalText(text: string, keyPrefix = 'line'): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let i = 0

  for (const match of text.matchAll(COLOR_TAG_RE)) {
    const start = match.index ?? 0
    if (start > last) nodes.push(...linkify(text.slice(last, start), `${keyPrefix}-${i}-pre`))

    const color = match[1] as TerminalColor
    nodes.push(
      <span key={`${keyPrefix}-${i}`} className={COLOR_CLASSES[color]}>
        {linkify(match[2], `${keyPrefix}-${i}-in`)}
      </span>,
    )

    last = start + match[0].length
    i += 1
  }

  if (last < text.length) nodes.push(...linkify(text.slice(last), `${keyPrefix}-tail`))
  return nodes
}
