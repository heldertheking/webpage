/** Splits a raw command line into tokens, honoring "double" and 'single' quotes. */
export function tokenizeCommandLine(input: string): string[] {
  const tokens: string[] = []
  const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g
  let match: RegExpExecArray | null

  while ((match = pattern.exec(input)) !== null) {
    tokens.push(match[1] ?? match[2] ?? match[3])
  }

  return tokens
}
