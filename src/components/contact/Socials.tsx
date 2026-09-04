import type {CSSProperties} from "react";
import {socials} from "../../data/content";
import {SocialIcon} from "../icons.tsx";

interface SocialTileStyle extends CSSProperties {
    '--social-color'?: string
}

export function SocialsColumn() {
    return (
        socials.length > 0 && (
            <div className="flex flex-col items-center gap-3">
                <div
                    className="flex flex-1 items-center justify-center rounded-xl border border-edge bg-surface-raised p-5 shadow-panel transition-theme duration-300">
                    <div className="grid grid-flow-col grid-rows-5 gap-2.5">
                        {socials.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                title={social.name}
                                aria-label={social.name}
                                style={social.color ? ({'--social-color': social.color} as SocialTileStyle) : undefined}
                                className="social-tile group flex h-14 w-14 items-center justify-center rounded-lg border border-edge bg-surface text-ink-muted transition-theme duration-200"
                            >
                                <SocialIcon icon={social.icon}/>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        )
    )
}