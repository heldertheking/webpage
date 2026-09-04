import {AnimatePresence, motion, useDragControls, useMotionValue} from 'framer-motion'
import {type FormEvent, type KeyboardEvent, useEffect, useRef, useState} from 'react'
import {renderTerminalText} from '../terminal/colorText'
import {terminalCommands} from '../terminal/commands'
import {renderMarkdown} from '../terminal/markdown'
import {tokenizeCommandLine} from '../terminal/parseInput'
import type {TerminalCommandResult, TerminalRuntime} from '../terminal/types'
import {useTheme} from '../theme/useTheme'

interface TerminalEntry {
    id: number
    role: 'input' | 'output'
    kind?: 'text' | 'markdown'
    text: string
}

interface TerminalProps {
    /** Bumped by the header button — every change re-opens the terminal, centered. */
    openSignal: number
    onVisibleChange?: (visible: boolean) => void
}

function welcomeEntries(isDark: boolean): TerminalEntry[] {
    return [
        {
            id: -2,
            role: 'output',
            text: isDark
                ? 'root@workbench:~$ interactive shell ready.'
                : 'Software Engineering Apprentice — interactive console.',
        },
        {
            id: -1,
            role: 'output',
            text: 'Type [cyan]help[/cyan] to see available commands.',
        },
    ]
}

/**
 * A floating, draggable terminal window. Mounted once at the app root and
 * kept alive permanently — minimizing only hides it (scrollback and command
 * history survive), closing hides it *and* resets it back to a blank shell.
 */
export function Terminal({openSignal, onVisibleChange}: TerminalProps) {
    const {isDark} = useTheme()

    const [visible, setVisible] = useState(false)
    const [entries, setEntries] = useState<TerminalEntry[]>(() => welcomeEntries(isDark))
    const [inputValue, setInputValue] = useState('')
    const [commandHistory, setCommandHistory] = useState<string[]>([])
    const [historyCursor, setHistoryCursor] = useState<number | null>(null)

    const nextId = useRef(0)
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const dragControls = useDragControls()
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const prevOpenSignal = useRef(openSignal)

    useEffect(() => {
        if (openSignal === prevOpenSignal.current) return
        prevOpenSignal.current = openSignal
        x.set(0)
        y.set(0)
        setVisible(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openSignal])

    useEffect(() => {
        onVisibleChange?.(visible)
    }, [visible, onVisibleChange])

    useEffect(() => {
        if (visible) inputRef.current?.focus()
    }, [visible])

    useEffect(() => {
        scrollRef.current?.scrollTo({top: scrollRef.current.scrollHeight})
    }, [entries])

    function addEntry(entry: Omit<TerminalEntry, 'id'>) {
        nextId.current += 1
        setEntries((prev) => [...prev, {id: nextId.current, ...entry}])
    }

    function appendResult(result: TerminalCommandResult) {
        if (result === undefined) return
        const list = Array.isArray(result) ? result : [result]
        for (const item of list) {
            if (typeof item === 'string') addEntry({role: 'output', text: item})
            else addEntry({role: 'output', kind: item.kind, text: item.text})
        }
    }

    const runtime: TerminalRuntime = {
        clear: () => setEntries([]),
        commands: terminalCommands,
        isDark
    }

    async function runCommand(raw: string) {
        const trimmed = raw.trim()
        addEntry({role: 'input', text: trimmed})
        if (!trimmed) return

        const [name, ...args] = tokenizeCommandLine(trimmed)
        const command = terminalCommands.find((c) => c.command.toLowerCase() === name.toLowerCase())

        if (!command) {
            addEntry({role: 'output', text: `[red]command not found:[/red] ${name} — try [cyan]help[/cyan]`})
            return
        }

        try {
            const result = await command.delegate(args, runtime)
            appendResult(result)
        } catch (err) {
            addEntry({
                role: 'output',
                text: `[red]${command.command}: ${err instanceof Error ? err.message : 'something went wrong'}[/red]`,
            })
        }
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault()
        const value = inputValue
        setInputValue('')
        setHistoryCursor(null)
        if (value.trim()) setCommandHistory((prev) => [...prev, value.trim()])
        void runCommand(value)
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'ArrowUp') {
            event.preventDefault()
            if (commandHistory.length === 0) return
            const nextCursor = historyCursor === null ? commandHistory.length - 1 : Math.max(0, historyCursor - 1)
            setHistoryCursor(nextCursor)
            setInputValue(commandHistory[nextCursor])
        } else if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (historyCursor === null) return
            const nextCursor = historyCursor + 1
            if (nextCursor >= commandHistory.length) {
                setHistoryCursor(null)
                setInputValue('')
            } else {
                setHistoryCursor(nextCursor)
                setInputValue(commandHistory[nextCursor])
            }
        }
    }

    function handleMinimize() {
        setVisible(false)
    }

    function handleClose() {
        setVisible(false)
        setEntries(welcomeEntries(isDark))
        setCommandHistory([])
        setHistoryCursor(null)
        setInputValue('')
        x.set(0)
        y.set(0)
    }

    const prompt = isDark ? '$' : '>'
    const promptClass = isDark ? 'text-accent-primary' : 'text-accent-secondary'

    return (
        <div ref={overlayRef} className="pointer-events-none fixed inset-0 z-[60]">
            <AnimatePresence>
                {visible && (
                    <div className="flex h-full w-full items-center justify-center p-4">
                        <motion.div
                            drag
                            dragControls={dragControls}
                            dragListener={false}
                            dragConstraints={overlayRef}
                            dragElastic={0.05}
                            dragMomentum={false}
                            style={{x, y}}
                            initial={{opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.95}}
                            transition={{duration: 0.15}}
                            className="pointer-events-auto flex h-[28rem] max-h-[80vh] w-[36rem] max-w-[92vw] flex-col overflow-hidden rounded-xl border border-edge bg-surface-raised shadow-panel-lg transition-theme duration-300"
                            role="dialog"
                            aria-label="Terminal"
                        >
                            <div
                                onPointerDown={(e) => dragControls.start(e)}
                                className="flex cursor-grab items-center gap-2 border-b border-edge bg-surface-sunken px-4 py-2.5 transition-theme duration-300 active:cursor-grabbing"
                            >
                                <button
                                    type="button"
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={handleClose}
                                    aria-label="Close terminal"
                                    title="Close (resets the terminal)"
                                    className={`h-2.5 w-2.5 rounded-full bg-accent-warn transition hover:brightness-125 ${isDark ? 'shadow-glow-warn' : ''}`}
                                />
                                <button
                                    type="button"
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={handleMinimize}
                                    aria-label="Minimize terminal"
                                    title="Minimize"
                                    className={`h-2.5 w-2.5 rounded-full bg-accent-ok transition hover:brightness-125 ${isDark ? 'shadow-glow-ok' : ''}`}
                                />
                                <span
                                    className={`h-2.5 w-2.5 rounded-full bg-accent-secondary ${isDark ? 'shadow-glow-secondary' : ''}`}/>
                                <span className="ml-2 select-none font-mono text-xs text-ink-muted">
                  {isDark ? 'workbench — zsh' : 'console.ts'}
                </span>
                            </div>

                            <div ref={scrollRef}
                                 className="flex-1 overflow-y-auto px-4 py-3 font-mono text-sm leading-relaxed">
                                {entries.map((entry) => (
                                    <div key={entry.id} className="mb-1">
                                        {entry.role === 'input' ? (
                                            <div className="flex gap-2">
                                                <span className={promptClass}>{prompt}</span>
                                                <span className="whitespace-pre-wrap text-ink">{entry.text}</span>
                                            </div>
                                        ) : entry.kind === 'markdown' ? (
                                            <div className="space-y-1">{renderMarkdown(entry.text)}</div>
                                        ) : (
                                            <div
                                                className="whitespace-pre-wrap">{renderTerminalText(entry.text, `e${entry.id}`)}</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit}
                                  className="flex items-center gap-2 border-t border-edge/60 px-4 py-2.5">
                                <span className={promptClass}>{prompt}</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="type `help`"
                                    autoComplete="off"
                                    spellCheck={false}
                                    className="w-full bg-transparent text-ink placeholder:text-ink-faint focus:outline-none"
                                />
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
