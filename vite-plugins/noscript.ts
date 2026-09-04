import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {pathToFileURL} from 'node:url'
import ts from 'typescript'
import type {Plugin} from 'vite'
import {noscriptMeta} from './noscript-meta.ts'

interface ContentModule {
    whoami: Record<'personal' | 'professional', { text: string }>
    about: Record<'personal' | 'professional', { eyebrow: string; body: string }>
    projects: Array<{
        name: string
        description: string
        org?: { name: string; url?: string }
        url?: string
        state: string
    }>
    experiences: Array<{
        organisation: { name: string; url?: string }
        title: string
        description?: string
        period: string
    }>
    stack: Array<{ language: string; frameworks?: string[]; tools?: string[]; use: string }>
    socials: Array<{ name: string; url: string; color?: string }>
}

const ROOT_DIV = '<div id="root"></div>'

/**
 * Injects a `<noscript>` fallback into index.html containing the full text
 * content of the page. Most AI/LLM crawlers (GPTBot, ClaudeBot, CCBot,
 * PerplexityBot, ...) fetch raw HTML without running JavaScript, so without
 * this they only see an empty `<div id="root">` — this plugin gives them (and
 * real no-JS visitors) the same substantive content the React app renders,
 * built at build/dev time from `src/data/content.ts` plus `./noscript-meta.ts`
 * for the page copy that only lives in JSX.
 */
export function noscriptFallbackPlugin(): Plugin {
    let resolvedEnv: Record<string, string> = {}

    return {
        name: 'noscript-fallback',
        configResolved(config) {
            resolvedEnv = config.env
        },
        async transformIndexHtml(html) {
            const content = await loadContentModule(resolvedEnv)
            const block = buildNoscriptHtml(content)
            return html.replace(ROOT_DIV, `${ROOT_DIV}\n    ${block}`)
        },
    }
}

/** Replaces `import.meta.env.KEY` references with their resolved values, inlined as JSON literals. */
function inlineImportMetaEnv(source: string, env: Record<string, string>): string {
    return source.replace(/import\.meta\.env\.([A-Z0-9_]+)/g, (_match, key: string) => JSON.stringify(env[key] ?? ''))
}

/**
 * Loads `src/data/content.ts` as data. It can't be imported directly from
 * this Node-side plugin because it (transitively, via `src/config/env.ts`)
 * reads `import.meta.env`, which only exists inside Vite's client transform —
 * so instead we transpile it with the TypeScript compiler API, inline the env
 * values ourselves, and execute the result from a temp directory.
 */
async function loadContentModule(env: Record<string, string>): Promise<ContentModule> {
    const envSource = await fs.readFile(path.resolve(process.cwd(), 'src/config/env.ts'), 'utf-8')
    const contentSource = await fs.readFile(path.resolve(process.cwd(), 'src/data/content.ts'), 'utf-8')

    const envJs = inlineImportMetaEnv(envSource, env)
    const contentJs = ts
        .transpileModule(contentSource, {
            compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022},
            fileName: 'content.ts',
        })
        .outputText.replace(/from\s+['"]\.\.\/config\/env['"]/, "from './env.mjs'")

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'noscript-content-'))
    try {
        const envPath = path.join(tempDir, 'env.mjs')
        const contentPath = path.join(tempDir, 'content.mjs')
        await fs.writeFile(envPath, envJs, 'utf-8')
        await fs.writeFile(contentPath, contentJs, 'utf-8')
        return (await import(pathToFileURL(contentPath).href)) as ContentModule
    } finally {
        await fs.rm(tempDir, {recursive: true, force: true})
    }
}

function escapeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function inlineMarkdown(text: string): string {
    return escapeHtml(text)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}

/** A small line-based markdown-to-HTML pass, mirroring `src/lib/markdown.tsx`'s feature set (headings, bold/italic, code, links, bullet lists) without depending on React. */
function markdownToHtml(source: string): string {
    const lines = source.replace(/\r\n/g, '\n').split('\n')
    const blocks: string[] = []
    let listBuffer: string[] = []

    const flushList = () => {
        if (listBuffer.length === 0) return
        blocks.push(`<ul>${listBuffer.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`)
        listBuffer = []
    }

    for (const line of lines) {
        const heading = /^(#{1,3})\s+(.*)/.exec(line)
        if (heading) {
            flushList()
            const level = heading[1].length + 2 // keep nested below the page's h1/h2
            blocks.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`)
            continue
        }

        if (/^\s*[-*]\s+/.test(line)) {
            listBuffer.push(line.replace(/^\s*[-*]\s+/, ''))
            continue
        }

        if (line.trim() === '') {
            flushList()
            continue
        }

        flushList()
        blocks.push(`<p>${inlineMarkdown(line)}</p>`)
    }

    flushList()
    return blocks.join('\n')
}

function buildNoscriptHtml(content: ContentModule): string {
    const {whoami, about, projects, experiences, stack, socials} = content
    const meta = noscriptMeta

    const projectItems = projects
        .map((p) => {
            const org = p.org ? ` (${escapeHtml(p.org.name)})` : ''
            const link = p.url ? ` — <a href="${escapeHtml(p.url)}">${escapeHtml(p.url)}</a>` : ''
            return `<li><strong>${escapeHtml(p.name)}</strong>${org} [${escapeHtml(p.state)}]: ${escapeHtml(p.description)}${link}</li>`
        })
        .join('\n')

    const experienceItems =
        experiences
            .map((e) => {
                const period = e.period === 'current' ? 'Current' : escapeHtml(e.period)
                const desc = e.description ? ` — ${escapeHtml(e.description)}` : ''
                const org = e.organisation.url
                    ? `<a href="${escapeHtml(e.organisation.url)}">${escapeHtml(e.organisation.name)}</a>`
                    : escapeHtml(e.organisation.name)
                return `<li><strong>${escapeHtml(e.title)}</strong> at ${org} (${period})${desc}</li>`
            })
            .join('\n') || '<li>None listed.</li>'

    const stackItems = stack
        .map((s) => {
            const parts = [
                s.frameworks?.length ? `frameworks: ${s.frameworks.join(', ')}` : '',
                s.tools?.length ? `tools: ${s.tools.join(', ')}` : '',
            ].filter(Boolean)
            const extra = parts.length ? ` — ${escapeHtml(parts.join('; '))}` : ''
            return `<li><strong>${escapeHtml(s.language)}</strong> (${escapeHtml(s.use)})${extra}</li>`
        })
        .join('\n')

    const socialItems = socials.map((s) => `<li><a href="${escapeHtml(s.url)}">${escapeHtml(s.name)}</a></li>`).join('\n')

    const sectionLinks = meta.sections
        .map((s) => `<a href="${meta.siteUrl}#${s.anchor}">${escapeHtml(s.label)}</a>`)
        .join(', ')

    return `<noscript>
<div id="noscript-fallback" lang="en" style="max-width:42rem;margin:0 auto;padding:2rem 1.25rem;font-family:system-ui,sans-serif;line-height:1.6;">
  <h1>${escapeHtml(meta.siteName)} — ${escapeHtml(meta.tagline)}</h1>
  <p>This is a JavaScript-rendered single-page portfolio. You're seeing a plain-text fallback because JavaScript didn't run — a machine-readable summary is also published at <a href="/llms.txt">/llms.txt</a>.</p>
  <p><strong>${escapeHtml(meta.handleFallback)}</strong> — Software Engineering Apprentice at <a href="${escapeHtml(meta.org.url)}">${escapeHtml(meta.org.name)}</a>.</p>

  <h2>Introduction</h2>
  <p>${escapeHtml(meta.intro.professional)}</p>
  <p>${escapeHtml(whoami.professional.text)}</p>
  <p><em>Personal side:</em> ${escapeHtml(meta.intro.personal)} ${escapeHtml(whoami.personal.text)}</p>

  <h2>About</h2>
  <h3>Professional (${escapeHtml(about.professional.eyebrow)})</h3>
  ${markdownToHtml(about.professional.body)}
  <h3>Personal (${escapeHtml(about.personal.eyebrow)})</h3>
  ${markdownToHtml(about.personal.body)}

  <h2>Work Experience</h2>
  <p>${escapeHtml(meta.workExperienceNote)}</p>
  <ul>
  ${experienceItems}
  </ul>

  <h2>Projects</h2>
  <ul>
  ${projectItems}
  </ul>

  <h2>Stack</h2>
  <ul>
  ${stackItems}
  </ul>
  <p>${escapeHtml(meta.highlightsNote)}</p>

  <h2>Contact &amp; Socials</h2>
  <p>A contact form is available on the live site. Direct links:</p>
  <ul>
  ${socialItems}
  </ul>

  <h2>Page sections</h2>
  <p>${sectionLinks}</p>
</div>
</noscript>`
}
