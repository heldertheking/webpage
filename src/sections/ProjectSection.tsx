import {projects} from '../data/content'
import {useTheme} from '../theme/useTheme'
import {ProjectList} from "../components/list/ProjectList.tsx";
import {Section} from "../components/section/Section.tsx";

/**
 * Personal/portfolio builds — shown in both themes, since `projects` no
 * longer distinguishes "work" vs "personal" (see WorkExperienceSection for
 * the light-mode-only job history that used to live here).
 */
export function ProjectSection() {
  const { isDark } = useTheme()

  return (
      <Section
          id="projects"
          className="mb-16"
          title={isDark ? 'Personal projects' : 'Projects'}
          eyebrow={isDark ? '// projects.log' : 'Projects'}
      >
        <ProjectList items={projects}/>
      </Section>
  )
}
