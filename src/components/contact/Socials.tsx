import type {CSSProperties} from "react";
import {socials} from "../../assets/content";
import {SocialIcon} from "../icons.tsx";
import {useTheme} from "../../theme/useTheme.ts";

interface SocialTileStyle extends CSSProperties {
    '--social-color'?: string
}

export function SocialsColumn() {
    const {isDark} = useTheme();

    return (
        socials.length > 0 && (
            <div className="flex flex-col items-center gap-3">
                <div
                    className="flex flex-1 items-center justify-center rounded-xl border border-edge bg-surface-raised p-3 shadow-panel transition-theme duration-300 lg:p-5">
                    <div className="grid grid-flow-row grid-cols-5 gap-2 lg:grid-flow-col lg:grid-cols-none lg:grid-rows-5 lg:gap-2.5">
                        {socials.map((social) => {
                            const color = (isDark && social.darkColor) || social.color;
                            return (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={social.name}
                                    aria-label={social.name}
                                    style={color ? ({'--social-color': color} as SocialTileStyle) : undefined}
                                    className="social-tile group flex h-12 w-12 items-center justify-center rounded-lg border border-edge bg-surface text-ink-muted transition-theme duration-200 lg:h-14 lg:w-14"
                                >
                                    <SocialIcon icon={social.icon}/>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    )
}