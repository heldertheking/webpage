import {Section} from "../components/section/Section.tsx";
import {useTheme} from "../theme/useTheme.ts";
import {env} from "../config/env.ts";
import {whoami} from "../assets/content.ts";


export function HeroSection() {
    const {isDark} = useTheme()

    const name = isDark ? env.username : 'Hélder Oliveira'

    const subtitle = isDark
        ? 'Off the clock: gaming, custom PC builds, night motorcycle rides, and a homelab running proper GitOps.'
        : 'Software Engineering apprentice working across Java and TypeScript with Spring Boot and Angular'

    const text = whoami[isDark ? 'personal' : 'professional'].text

    const cta = isDark
        ? 'Checkout my projects'
        : 'Learn more about me'

    return (
        <Section
            id="hero"
            title={name}
            subtitle={subtitle}
            eyebrow={isDark ? '// hero.md' : 'Introduction'}
            h1={true}
            className="mb-12 max-w-3xl"
        >
            <p className="text-lg text-ink-muted">{text}</p><br/>
            <p className="text-lg text-ink-muted">{cta} <a className="text-accent-primary underline underline-offset-2 italic hover:brightness-110" href={isDark ? '#projects' : '#about'}>here</a></p>
        </Section>
    )
}