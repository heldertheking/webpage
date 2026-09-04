/**
 * Page copy that exists only inline in JSX — Header, HeroSection,
 * WorkExperienceSection, ContactSection — rather than in `src/data/content.ts`.
 * The noscript-fallback plugin (`./noscript.ts`) combines this with the real
 * content.ts data to build a text-only version of the page for clients that
 * don't execute JavaScript (most AI/crawler bots included). If that JSX copy
 * changes, update it here too.
 */
export const noscriptMeta = {
    siteName: 'Helder Oliveira',
    tagline: 'Software Engineer & Builder',
    handleFallback: 'heldertheking',
    org: {name: 'Intuitive Collaboration', url: 'https://www.intuitive-collaboration.com/'},
    siteUrl: 'https://heldertheking.com/',
    intro: {
        personal: 'Off the clock: gaming, custom PC builds, night motorcycle rides, and a homelab running proper GitOps.',
        professional: 'Software Engineering apprentice working across Java and TypeScript with Spring Boot and Angular.',
    },
    sections: [
        {label: 'About', anchor: 'about'},
        {label: 'Work Experience', anchor: 'work'},
        {label: 'Projects', anchor: 'projects'},
        {label: 'Stack', anchor: 'stack'},
        {label: 'Highlights', anchor: 'highlights'},
        {label: 'Contact', anchor: 'contact'},
    ],
    highlightsNote:
        'The Highlights section on the live site shows real-time homelab/cluster status fetched client-side, so current numbers require JavaScript to display.',
    workExperienceNote:
        'Job history is shown in the professional persona of the live site; the personal persona skips it.',
}
