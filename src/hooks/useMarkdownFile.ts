export interface Markdown {
    data: Record<string, string>
    content: string
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

/**
 * Splits a leading `key: value` frontmatter block off a markdown string.
 * Deliberately not a YAML parser - every frontmatter value used across this
 * site's markdown files is a single-line string, so pulling in a full YAML
 * engine (as gray-matter/js-yaml would) isn't worth the bundle size.
 */
export default function useMarkdownFile(rawContent: string): Markdown {
    const match = FRONTMATTER_RE.exec(rawContent)
    if (!match) return {data: {}, content: rawContent}

    const data: Record<string, string> = {}
    for (const line of match[1].split(/\r?\n/)) {
        const separator = line.indexOf(':')
        if (separator === -1) continue
        const key = line.slice(0, separator).trim()
        data[key] = line.slice(separator + 1).trim().replace(/^["']|["']$/g, '')
    }

    return {data, content: match[2]}
}
