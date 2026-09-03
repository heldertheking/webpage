import { env } from '../config/env'

export type ProjectCategory = 'work' | 'personal' | 'highlight'

export interface ProjectItem {
    name: string
    category: ProjectCategory
    description: string
    org?: string
    period?: string
    url?: string
    /** Highlight items only: render the live Portainer/infra badges under this card. */
    liveInfra?: boolean
}

// Everything I do lives in this one list, tagged by category:
// - "work"      -> shown in light mode (Experience section)
// - "personal"  -> shown in dark mode (Experience section)
// - "highlight" -> always shown, in both themes (Highlight section)
export const projects: ProjectItem[] = [
    {
        name: 'Software Engineering Apprentice',
        category: 'work',
        org: 'Intuitive Collaboration',
        period: 'Current',
        url: 'https://www.intuitive-collaboration.com/',
        description: 'Learning the trade on real production work across the stack.',
    },
    {
        name: 'Homelab & GitOps',
        category: 'highlight',
        description:
            'A personal server run like production: everything from bare metal up is deployed and tracked through a GitOps pipeline, not clicked together by hand.',
        url: 'https://github.com/heldertheking/homelab',
        liveInfra: true,
    },
    {
        name: 'ESP32 Embedded Build',
        category: 'personal',
        description: 'Link one of your embedded / ESP32 projects here.',
        url: 'https://github.com/heldertheking/your-esp32-project',
    },
    {
        name: 'Rust or Go Service',
        category: 'personal',
        description: 'Link a Rust or Go service here.',
        url: 'https://github.com/heldertheking/your-service',
    },
]

export const stackProfessional = [
    'Java',
    'Spring Boot',
    'TypeScript',
    'Next.js',
    'Angular',
    'React',
    'Python',
    'FastAPI',
]

export const stackPersonal = [
    'Java',
    'Spring Boot',
    'TypeScript',
    'Angular',
    'C/C#/C++',
    'Rust', 'Go',
    'ESP32 / Embedded',
    'Game Dev',
]

export interface Social {
    name: string
    url: string
    // URL to an SVG, rendered as a CSS mask so it inherits the site's ink
    // color — swap in whatever icon source you like as long as it's an SVG.
    icon: string
}

const SIMPLE_ICONS = 'https://cdn.jsdelivr.net/npm/simple-icons@13/icons'

export const socials: Social[] = [
    {
        name: 'GitHub',
        url: `https://github.com/${env.username}`,
        icon: `${SIMPLE_ICONS}/github.svg`,
    },
    {
        name: 'Discord',
        url: 'https://discord.com/users/540189546227302410',
        icon: `${SIMPLE_ICONS}/discord.svg`,
    },
    {
        name: 'Instagram',
        url: `https://www.instagram.com/${env.username}`,
        icon: `${SIMPLE_ICONS}/instagram.svg`,
    },
    {
        name: 'Youtube',
        url: 'https://www.youtube.com/@htk3390',
        icon: `${SIMPLE_ICONS}/youtube.svg`,
    },
    {
        name: 'Reddit',
        url: 'https://www.reddit.com/user/heldertheking/',
        icon: `${SIMPLE_ICONS}/reddit.svg`,
    }
]