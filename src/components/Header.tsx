import {motion} from 'framer-motion'
import {useTheme} from '../theme/useTheme'
import {ThemeToggle} from '../theme/ThemeToggle'
import {HardwareStatusBadge} from './HardwareStatusBadge'

const NAV_ITEMS = ['Work', 'Stack', 'Highlights', 'Contact']

interface HeaderProps {
    terminalOpen: boolean
    onToggleTerminal: () => void
}

export function Header({terminalOpen, onToggleTerminal}: HeaderProps) {
    const {theme} = useTheme()
    const isDark = theme === 'dark'

    enum Status {
        WORKING = "Status.WORKING",
        ONLINE = "Status.ONLINE",
        OFFLINE = "Status.OFFLINE"
    }

    // User-friendly display text for Light mode
    const DisplayText: Record<Status, string> = {
        [Status.WORKING]: "On the Clock",
        [Status.ONLINE]: "Available",
        [Status.OFFLINE]: "Away"
    };

    // Evaluates directly for "today" / current time
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();

    const t7am = 7 * 60;   // 07:00
    const t12pm = 12 * 60; // 12:00
    const t1pm = 13 * 60;  // 13:00
    const t5pm = 17 * 60;  // 17:00
    const t10pm = 22 * 60; // 22:00

    const activeStatus: Status =
        (totalMinutes >= t10pm || totalMinutes < t7am)
            ? Status.OFFLINE
            : ((totalMinutes >= t7am && totalMinutes < t12pm) || (totalMinutes >= t1pm && totalMinutes < t5pm))
                ? Status.WORKING
                : Status.ONLINE;

    // Result output
    const hardwareStatusBadgeText = isDark
        ? activeStatus
        : DisplayText[activeStatus];

    // Matrix mapping for badge tone:
    // "ok"      -> light + working | dark + online
    // "warn"    -> offline
    // "primary" -> light + online  | dark + working
    const hardwareStatusBadgeTone = (() => {
        if (activeStatus === Status.OFFLINE) return "warn";

        if (isDark) {
            return activeStatus === Status.ONLINE ? "ok" : "secondary";
        } else {
            return activeStatus === Status.WORKING ? "ok" : "secondary";
        }
    })();

    return (
        <motion.header
            layout
            className="sticky top-0 z-40 border-b border-edge bg-surface/80 backdrop-blur-md transition-theme duration-300"
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
                <div className="flex items-center gap-3">
          <span
              className={`flex h-8 w-8 items-center justify-center rounded-md border font-mono text-sm font-bold transition-theme duration-300 ${
                  isDark
                      ? 'border-accent-primary/50 bg-surface-sunken text-accent-primary shadow-glow-primary'
                      : 'border-edge-strong bg-surface-sunken text-ink'
              }`}
          >
            H
          </span>
                    <div className="flex flex-col leading-none">
            <span className="font-mono text-sm font-semibold tracking-tight text-ink">
              Helder Oliveira
            </span>
                        <span
                            className={`text-[11px] uppercase tracking-widest ${
                                isDark ? 'text-accent-secondary' : 'text-ink-muted'
                            }`}
                        >
              {isDark ? 'root@workbench' : 'Software Engineer (Apprentice)'}
            </span>
                    </div>
                </div>

                <nav className="hidden items-center gap-1 md:flex">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className={`rounded-md px-3 py-1.5 font-mono text-sm text-ink-muted transition-theme duration-200 hover:text-ink ${
                                isDark ? 'hover:shadow-glow-primary hover:text-accent-primary' : 'hover:bg-surface-sunken'
                            }`}
                        >
                            {isDark ? `./${item.toLowerCase()}` : item}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:block">
                        <HardwareStatusBadge
                            label={isDark ? 'sys.status' : 'Availability'}
                            value={hardwareStatusBadgeText}
                            tone={hardwareStatusBadgeTone}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onToggleTerminal}
                        aria-pressed={terminalOpen}
                        aria-label={terminalOpen ? 'Close terminal' : 'Open terminal'}
                        title="Terminal (more to come)"
                        className={`flex h-9 w-9 items-center justify-center rounded-md border font-mono text-xs font-bold transition-theme duration-200 ${
                            terminalOpen
                                ? isDark
                                    ? 'border-accent-primary bg-surface-sunken text-accent-primary shadow-glow-primary'
                                    : 'border-ink bg-surface-sunken text-ink'
                                : 'border-edge bg-surface-sunken text-ink-muted hover:border-edge-strong hover:text-ink'
                        }`}
                    >
                        &gt;_
                    </button>

                    <ThemeToggle/>
                </div>
            </div>
        </motion.header>
    )
}
