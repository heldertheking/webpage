import {about} from '../data/content'
import {useTheme} from '../theme/useTheme'
import {Section} from '../components/section/Section.tsx'
import {Markdown} from '../components/markdown/Markdown.tsx'

export function AboutSection() {
    const {isDark} = useTheme()
    const copy = about[isDark ? 'personal' : 'professional']

    return (
        <Section
            id="about"
            title="About me"
            eyebrow={copy.eyebrow}
            className="max-w-3xl"
        >
            <Markdown source={copy.body}/>
        </Section>
    )
}
