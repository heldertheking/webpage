import {about, projects, socials, whoami} from '../data/content'
import type { TerminalCommand, TerminalOutputLine, TerminalRuntime } from './types'

function jsonFile(value: unknown): TerminalOutputLine {
  return { kind: 'markdown', text: '```json\n' + JSON.stringify(value, null, 2) + '\n```' }
}

function csvFile(headers: string[], rows: string[][]): TerminalOutputLine {
  const escape = (cell: string) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell)
  const lines = [headers, ...rows].map((row) => row.map(escape).join(','))
  return { kind: 'markdown', text: '```csv\n' + lines.join('\n') + '\n```' }
}

/**
 * Files `cat`/`ls` can see — generated on the fly from content.ts (nothing
 * is fetched from `public/`), so they can never drift from the real site
 * content. Add an entry here to make a new file `cat`-able.
 */
const VIRTUAL_FILES: Record<string, { describe: string; render: (runtime: TerminalRuntime) => TerminalOutputLine }> = {
  'about.md': {
    describe: 'About me, in markdown',
    render: (runtime) => ({ kind: 'markdown', text: about[runtime.isDark ? 'personal' : 'professional'].body }),
  },
  'socials.json': {
    describe: 'Social links, as JSON',
    render: () => jsonFile(socials.map(({ name, url }) => ({ name, url }))),
  },
  'projects.csv': {
    describe: 'Projects, as CSV',
    render: () =>
      csvFile(
        ['name', 'description', 'org', 'url', 'state', 'highlight'],
        projects.map((p) => [p.name, p.description, p.org?.name ?? '', p.url ?? '', p.state, String(!!p.highlight)]),
      ),
  },
}

export const terminalCommands: TerminalCommand[] = [
  {
    command: 'help',
    description: 'List available commands',
    help: 'Usage: help',
    delegate: (_args, runtime) => [
      ...runtime.commands.map((c) => `[cyan]${c.command}[/cyan] — ${c.description}`),
      `[magenta]note:[/magenta] try [cyan]ls[/cyan] for files readable with [cyan]cat[/cyan]`,
    ],
  },
  {
    command: 'clear',
    description: 'Clear the terminal scrollback',
    help: 'Usage: clear',
    delegate: (_args, runtime) => {
      runtime.clear()
    },
  },
  {
    command: 'echo',
    description: 'Print text back to the terminal',
    help: 'Usage: echo <text>',
    delegate: (args) => (args.length > 0 ? args.join(' ') : ' '),
  },
  {
    command: 'whoami',
    description: 'Print short bio',
    help: 'Usage: whoami',
    delegate: (_args, runtime) => (runtime.isDark ? whoami.personal : whoami.professional).text,
  },
  {
    command: 'date',
    description: 'Print the current date and time',
    help: 'Usage: date',
    delegate: () => new Date().toString(),
  },
  {
    command: 'socials',
    description: 'Lists socials or opens social if platform provided',
    help: 'Usage: socials <platform>',
    delegate: (args) => {
      if (!args || args.length == 0) {
        return socials.map((s) => `${s.name}: [blue]${s.url}[/blue]`);
      }

      const platform = args[0];
      const social = socials.find(social => social.name === platform);
      if (!social) {
        return `[red]Invalid platform name \"${platform}\"[/red]`;
      }
      window.open(social.url, '_blank')!.focus();
      return '[cyan]Opened link in new tab[/cyan]';
    },
  },
  {
    command: 'ls',
    description: 'List files readable with `cat`',
    help: 'Usage: ls',
    delegate: () => Object.entries(VIRTUAL_FILES).map(([name, file]) => `[cyan]${name}[/cyan] — ${file.describe}`),
  },
  {
    command: 'cat',
    description: 'Read a file (try: cat about.md)',
    help: 'Usage: cat <file>',
    delegate: (args, runtime) => {
      const [file] = args
      if (!file) return '[red]cat: missing file operand[/red]'
      const virtualFile = VIRTUAL_FILES[file]
      if (!virtualFile) return `[red]cat: ${file}: no such file[/red] — try [cyan]ls[/cyan]`
      return virtualFile.render(runtime)
    },
  },
]
