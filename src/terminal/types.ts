// The 8 predefined terminal colors. Convention for command authors:
// red = error, yellow = warn, green = ok/success, blue = link,
// cyan = info/command-names, magenta = note, white = default, gray = muted.
export type TerminalColor = 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray'

export interface TerminalOutputLine {
  /** 'text' (default): parses `[color]...[/color]` spans + autolinks URLs. 'markdown': full markdown render. */
  kind?: 'text' | 'markdown'
  text: string
}

export type TerminalCommandResult = void | string | TerminalOutputLine | Array<string | TerminalOutputLine>

export interface TerminalRuntime {
  /** Wipes the visible scrollback. Used by the built-in `clear` command. */
  clear: () => void
  /** Every registered command, e.g. so `help` can list them. */
  commands: TerminalCommand[]
  /** If the terminal is in dark mode */
  isDark: boolean
}

export interface TerminalCommand {
  command: string
  /** Shown by `help`. */
  description: string
  /** Shown when the command is used wrong, e.g. a missing argument. */
  help: string
  delegate: (args: string[], runtime: TerminalRuntime) => TerminalCommandResult | Promise<TerminalCommandResult>
}
