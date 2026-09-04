import {projects} from '../data/content'
import {usePortainerStatus} from '../hooks/usePortainerStatus'
import {useTheme} from "../theme/useTheme.ts";
import {Section} from "../components/section/Section.tsx";
import {HardwareStatusBadge, Tone} from "../components/HardwareStatusBadge.tsx";
import {ExternalLinkIcon} from "../components/icons.tsx";

/**
 * Highlights are the things worth calling out regardless of which side of
 * the theme toggle someone lands on — content and copy here never branch on
 * theme, only the design tokens do. Driven by `projects` (highlight: true)
 * in content.ts, so adding another highlight is a data change, not a
 * component change.
 */
export function HighlightSection() {
    const highlights = projects.filter((p) => p.highlight)
    const portainer = usePortainerStatus()
    const { isDark } = useTheme()

    const statusValue =
        portainer.phase === 'ready'
            ? portainer.data.status
                ? 'Online'
                : 'Offline'
            : portainer.phase === 'error'
                ? 'Unknown'
                : 'Checking…'
    const statusTone: Tone =
        portainer.phase === 'ready' ? (portainer.data.status ? 'ok' : 'warn') : 'secondary'
    const nodeValue = portainer.phase === 'ready' ? String(portainer.data.nodeCount) : '—'
    const stackValue = portainer.phase === 'ready' ? String(portainer.data.stackCount) : '—'

    return (
        <Section
            id="highlights"
            title="Always running"
            eyebrow={isDark ? "// Highlight.log" : "Highlight"}
            className="flex flex-col gap-4"
        >
            {highlights.map((item) => (
                <div
                    key={item.name}
                    className="rounded-xl border border-edge bg-surface-raised p-5 shadow-panel transition-theme duration-300"
                >
                    <div className="mb-1 flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-ink">{item.name}</h3>
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-ink-faint transition-theme hover:text-accent-primary"
                            >
                                <ExternalLinkIcon/>
                            </a>
                        )}
                    </div>
                    <p className="mb-4 max-w-2xl text-sm text-ink-muted">{item.description}</p>

                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                        <HardwareStatusBadge label="Cluster" value={statusValue} tone={statusTone}/>
                        <HardwareStatusBadge label="Nodes" value={nodeValue} tone="primary"/>
                        <HardwareStatusBadge label="Stacks" value={stackValue} tone="secondary"/>
                        <HardwareStatusBadge label="Deploys" value="GitOps" tone="primary"/>
                    </div>
                </div>
            ))}
        </Section>
    )
}
