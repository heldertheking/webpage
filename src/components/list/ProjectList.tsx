import {motion} from "framer-motion";
import {ProjectItem} from "../../data/content.ts";
import {ExternalLinkIcon} from "../icons.tsx";

export interface ProjectListProps {
    items: ProjectItem[];
}

export function ProjectList({items}: ProjectListProps) {
    if (items.length === 0) {
        return (
            <div className="p-5">
                No projects available.
            </div>
        )
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {items.map((project) => (
                <motion.a
                    layout
                    key={project.name}
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col justify-between gap-3 rounded-xl border border-edge bg-surface-raised p-4 shadow-panel transition-theme duration-300 hover:border-accent-primary/60 hover:shadow-glow-primary"
                >
                    <div>
                        <div className="mb-1 flex items-center justify-between gap-2">
                            <h3 className="font-mono text-sm font-semibold text-ink">{project.name}</h3>
                            <span className="text-ink-faint transition-theme group-hover:text-accent-primary">
                    <ExternalLinkIcon/>
                  </span>
                        </div>
                        <p className="text-sm text-ink-muted">{project.description}</p>
                    </div>
                </motion.a>
            ))}
        </div>
    )
}
