import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'

const PLACEHOLDER = '__INLINE_SCRIPT_CSP_HASHES__'

const SCRIPT_TAG_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi

/** Whether a `<script ...>` tag (given its raw attribute string) executes as JS and therefore needs a CSP hash - external (`src=`) scripts and non-executable types like `application/ld+json` are excluded. */
function isInlineExecutableScript(attrs: string): boolean {
    if (/\bsrc\s*=/i.test(attrs)) return false
    const typeMatch = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attrs)
    if (!typeMatch) return true
    return ['module', 'text/javascript', 'application/javascript'].includes(typeMatch[1].toLowerCase())
}

/**
 * Computes CSP `script-src` hash sources for every inline executable
 * `<script>` in the *final* built `index.html` (after all other
 * transforms), and substitutes them into `_headers`' `__INLINE_SCRIPT_CSP_HASHES__`
 * placeholder at write time. This is done from the built output rather than
 * the source file so the hash always matches whatever bytes this specific
 * build actually ships - including whatever line-ending normalization the
 * build machine's filesystem/git checkout applies, which otherwise silently
 * invalidates a hand-computed hash between environments.
 */
export function cspHashPlugin(): Plugin {
    let hashes: string[] = []

    return {
        name: 'csp-hash',
        transformIndexHtml: {
            order: 'post',
            handler(html) {
                const seen = new Set<string>()
                for (const [, attrs, content] of html.matchAll(SCRIPT_TAG_RE)) {
                    if (!isInlineExecutableScript(attrs) || !content.trim()) continue
                    seen.add(`'sha256-${crypto.createHash('sha256').update(content, 'utf-8').digest('base64')}'`)
                }
                if (seen.size === 0) {
                    throw new Error('csp-hash: no inline executable <script> found in built index.html - update _headers CSP by hand if this is expected')
                }
                hashes = [...seen]
            },
        },
        async writeBundle(options) {
            const outDir = options.dir ?? 'dist'
            const headersPath = path.join(outDir, '_headers')
            const raw = await fs.readFile(headersPath, 'utf-8')
            if (!raw.includes(PLACEHOLDER)) {
                throw new Error(`csp-hash: "${PLACEHOLDER}" placeholder not found in _headers - did it get edited to a literal hash again?`)
            }
            await fs.writeFile(headersPath, raw.replaceAll(PLACEHOLDER, hashes.join(' ')), 'utf-8')
        },
    }
}
