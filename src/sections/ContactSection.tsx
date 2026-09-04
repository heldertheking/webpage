import {useTheme} from '../theme/useTheme'
import {Section} from "../components/section/Section.tsx";
import {ContactForm} from "../components/contact/ContactForm.tsx";
import {SocialsColumn} from "../components/contact/Socials.tsx";


/**
 * The contact form on the left, a grid of social links on the right. The
 * social grid fills column-first (grid-flow-col) rather than row-first, so
 * adding a social in content.ts grows the grid downward before it grows
 * sideways.
 */
export function ContactSection() {
  const { isDark } = useTheme()

  return (
      <Section
          id="contact"
          title={isDark ? 'Send a transmission' : 'Get in touch'}
          eyebrow={isDark ? '// contact.log' : 'Contact'}
          className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]"
      >
        <ContactForm></ContactForm>
        <SocialsColumn></SocialsColumn>
      </Section>
  )
}
