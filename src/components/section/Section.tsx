import {SectionHeading} from './SectionHeading'
import {ReactNode} from "react";

export interface SectionProps {
    id: string
    title: string
    subtitle?: string
    eyebrow: string
    className: string
    h1?: boolean
    children: ReactNode
}

export function Section({id, title, subtitle = '', eyebrow, className = '', h1 = false, children}: SectionProps) {
    return (
        <section id={id} className="mb-16">
            <SectionHeading eyebrow={eyebrow} title={title} h1={h1} subtitle={subtitle}/>

            <div className={className}>
                {children}
            </div>
        </section>
    )
}
