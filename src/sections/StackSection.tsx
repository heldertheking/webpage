import {useTheme} from '../theme/useTheme'
import {Section} from "../components/section/Section.tsx";
import {LanguageTree} from "../components/stack/LanguageTree.tsx";
import {stack} from "../data/content.ts";

export function StackSection() {
    const {isDark} = useTheme()
    const uses = isDark ? ['general', 'personal'] : ['general', 'professional'];

    const languages = stack.filter((pl) => uses.includes(pl.use));

    return (
        <Section
            id="stack"
            title={isDark ? 'What I tinker with' : 'What I work with'}
            eyebrow={isDark ? '// stack.log' : 'Stack'}
            className="flex flex-col gap-3"
        >
            <LanguageTree languages={languages}/>
        </Section>
    )
}
