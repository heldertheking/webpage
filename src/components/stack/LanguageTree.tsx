import {motion} from "framer-motion";
import {StackDetails} from "../../data/content.ts";
import {useTheme} from "../../theme/useTheme";

export interface LanguageTreeProps {
    languages: StackDetails[];
}

type StackUse = StackDetails['use']

interface LanguageNode {
    language: string;
    frameworks: { name: string; use: StackUse }[];
    tools: string[];
}

const USE_LABEL: Record<StackUse, string> = {
    professional: 'work',
    personal: 'side project',
    general: 'general',
}

function groupByLanguage(languages: StackDetails[]): LanguageNode[] {
    const byName = new Map<string, LanguageNode>();

    for (const lang of languages) {
        const key = lang.language.toLowerCase();
        const node = byName.get(key) ?? {language: lang.language, frameworks: [], tools: []};

        for (const framework of lang.frameworks ?? []) {
            if (!node.frameworks.some((f) => f.name === framework)) {
                node.frameworks.push({name: framework, use: lang.use});
            }
        }

        for (const tool of lang.tools ?? []) {
            if (!node.tools.includes(tool)) node.tools.push(tool);
        }

        byName.set(key, node);
    }

    return [...byName.values()];
}

export function LanguageTree({languages}: LanguageTreeProps) {
    const {isDark} = useTheme()
    const nodes = groupByLanguage(languages);

    if (nodes.length === 0) {
        return (
            <div className="p-5">
                No languages available.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-5">
            {nodes.map((node) => (
                <div key={node.language} className="flex flex-wrap items-start gap-x-3 gap-y-2">
                    <motion.span
                        layout
                        className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-sm font-semibold text-ink transition-theme duration-300 ${
                            isDark
                                ? 'border-accent-primary/60 bg-surface-raised shadow-glow-primary'
                                : 'border-edge-strong bg-surface-raised'
                        }`}
                    >
                        {node.language}
                    </motion.span>

                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2 pl-1">
                            {node.frameworks.map((framework) => (
                                <div key={framework.name} className="flex items-center">
                                    <span
                                        aria-hidden="true"
                                        className={`mr-1.5 h-px w-3 shrink-0 ${
                                            isDark ? 'bg-accent-secondary/40' : 'bg-edge'
                                        }`}
                                    />
                                    <motion.span
                                        layout
                                        title={USE_LABEL[framework.use]}
                                        className={`rounded-full border px-2.5 py-1 font-mono text-xs text-ink-muted transition-theme duration-300 ${
                                            isDark
                                                ? 'border-accent-secondary/30 bg-surface-raised hover:border-accent-secondary hover:text-ink hover:shadow-glow-secondary'
                                                : 'border-edge bg-surface-raised hover:border-edge-strong hover:text-ink'
                                        }`}
                                    >
                                        {framework.name}
                                    </motion.span>
                                </div>
                            ))}
                        </div>

                        {node.tools.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pl-1">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                                    tools:
                                </span>
                                {node.tools.map((tool) => (
                                    <span
                                        key={tool}
                                        className="rounded border border-dashed border-edge px-1.5 py-0.5 font-mono text-[11px] text-ink-faint"
                                    >
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
