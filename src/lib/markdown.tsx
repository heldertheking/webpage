import type { ReactNode } from 'react'

export interface MarkdownTheme {
  /** Classes for `#`, `##`, `###` headings, in that order. */
  heading: [string, string, string]
  paragraph: string
  bold: string
  italic: string
  code: string
  codeBlock: string
  list: string
  blockquote: string
  link: string
  hr: string
}

const INLINE_RE = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g

function renderInline(text: string, theme: MarkdownTheme, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let i = 0

  for (const match of text.matchAll(INLINE_RE)) {
    const start = match.index ?? 0
    if (start > last) nodes.push(text.slice(last, start))

    const [, code, bold, italic, linkText, linkHref] = match
    if (code !== undefined) {
      nodes.push(
        <code key={`${keyPrefix}-${i}`} className={theme.code}>
          {code}
        </code>,
      )
    } else if (bold !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-${i}`} className={theme.bold}>
          {bold}
        </strong>,
      )
    } else if (italic !== undefined) {
      nodes.push(
        <em key={`${keyPrefix}-${i}`} className={theme.italic}>
          {italic}
        </em>,
      )
    } else if (linkText !== undefined) {
      nodes.push(
        <a key={`${keyPrefix}-${i}`} href={linkHref} target="_blank" rel="noreferrer" className={theme.link}>
          {linkText}
        </a>,
      )
    }

    last = start + match[0].length
    i += 1
  }

  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/**
 * A deliberately small markdown renderer: headings, bold/italic, inline
 * code, links, fenced code blocks, bullet lists, blockquotes and rules —
 * not a CommonMark implementation. Styling is fully driven by `theme`, so
 * the same parser can render both the terminal's `cat`-able files (see
 * `terminal/markdown.tsx`) and regular prose sections (see
 * `components/markdown/Markdown.tsx`).
 */
export function renderMarkdown(source: string, theme: MarkdownTheme): ReactNode[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let listBuffer: string[] = []
  let i = 0

  function flushList() {
    if (listBuffer.length === 0) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className={theme.list}>
        {listBuffer.map((item, idx) => (
          <li key={idx}>{renderInline(item, theme, `li-${blocks.length}-${idx}`)}</li>
        ))}
      </ul>,
    )
    listBuffer = []
  }

  while (i < lines.length) {
    const line = lines[i]

    if (/^```/.test(line)) {
      flushList()
      const codeLines: string[] = []
      i += 1
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i])
        i += 1
      }
      i += 1
      blocks.push(
        <pre key={`code-${blocks.length}`} className={theme.codeBlock}>
          <code>{codeLines.join('\n')}</code>
        </pre>,
      )
      continue
    }

    const heading = /^(#{1,3})\s+(.*)/.exec(line)
    if (heading) {
      flushList()
      const level = heading[1].length
      blocks.push(
        <p key={`h-${blocks.length}`} className={`${theme.heading[level - 1]} mt-2 first:mt-0`}>
          {renderInline(heading[2], theme, `h-${blocks.length}`)}
        </p>,
      )
      i += 1
      continue
    }

    if (/^\s*[-*]\s+/.test(line)) {
      listBuffer.push(line.replace(/^\s*[-*]\s+/, ''))
      i += 1
      continue
    }

    if (/^\s*>\s?/.test(line)) {
      flushList()
      blocks.push(
        <p key={`bq-${blocks.length}`} className={theme.blockquote}>
          {renderInline(line.replace(/^\s*>\s?/, ''), theme, `bq-${blocks.length}`)}
        </p>,
      )
      i += 1
      continue
    }

    if (/^\s*(---|\*\*\*)\s*$/.test(line)) {
      flushList()
      blocks.push(<hr key={`hr-${blocks.length}`} className={theme.hr} />)
      i += 1
      continue
    }

    if (line.trim() === '') {
      flushList()
      i += 1
      continue
    }

    flushList()
    blocks.push(
      <p key={`p-${blocks.length}`} className={theme.paragraph}>
        {renderInline(line, theme, `p-${blocks.length}`)}
      </p>,
    )
    i += 1
  }

  flushList()
  return blocks
}
