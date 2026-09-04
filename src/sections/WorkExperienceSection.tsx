import {experiences} from '../data/content'
import {useTheme} from '../theme/useTheme'
import {WorkResumeList} from "../components/list/WorkResumeList.tsx";
import {Section} from "../components/section/Section.tsx";

/**
 * Job history reads as a professional CV, so it only makes sense on the
 * light/professional side of the toggle — dark mode's "personal" persona
 * skips it entirely rather than showing an empty section.
 */
export function WorkExperienceSection() {
  const { isDark } = useTheme()
  if (isDark) return null

  return (
      <Section
          id="work"
          className="mb-16"
          title="Where I work"
          eyebrow="Experience"
      >
        <WorkResumeList items={experiences}/>
      </Section>
  )
}
