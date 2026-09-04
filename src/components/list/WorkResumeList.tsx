import {motion} from "framer-motion";
import {WorkExperience} from "../../data/content.ts";
import {ExternalLinkIcon} from "../icons.tsx";

export interface WorkResumeListProps {
    items: WorkExperience[];
}

export function WorkResumeList({items}: WorkResumeListProps) {
    if (items.length === 0) {
        return (
            <div className="p-5">
                No experience available.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {items.map((item) => (
                <motion.div
                    layout
                    key={`${item.organisation.name}-${item.title}`}
                    className="rounded-xl border border-edge bg-surface-raised p-4 shadow-panel transition-theme duration-300"
                >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="font-semibold text-ink">{item.title}</h3>
                        <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">
                    {item.period === 'current' ? 'Current' : item.period}
                  </span>
                    </div>
                    <a
                        href={item.organisation.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-accent-primary hover:underline"
                    >
                        {item.organisation.name}
                        <ExternalLinkIcon/>
                    </a>
                    {item.description && <p className="mt-1 text-sm text-ink-muted">{item.description}</p>}
                </motion.div>
            ))}
        </div>
    )
}
