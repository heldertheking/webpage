import {env} from '../config/env'

export interface Whoami {
    text: string
}

export const whoami: Record<'personal' | 'professional', Whoami> = {
    personal: {
        text: 'I’m a builder at heart, dividing my time between managing a self-hosted Docker homelab and writing ESP32 firmware to decode CAN bus telemetry from my motorcycle. When I’m away from the terminal, you’ll usually find me out on a night ride or tweaking a custom PC build.'
    },
    professional: {
        text: 'I am a Software Engineering Apprentice specializing in full-stack web applications built with Java, Spring Boot, TypeScript, and Angular. Beyond enterprise software, I architect self-hosted Docker infrastructure and engineer embedded ESP32 systems for real-time vehicle telemetry.'
    }
}

export interface AboutCopy {
    eyebrow: string
    /** Markdown — rendered via components/markdown/Markdown.tsx. */
    body: string
}

// "personal" shows in dark mode, "professional" in light mode — same split as `projects` below.
export const about: Record<'personal' | 'professional', AboutCopy> = {
    personal: {
        eyebrow: '// whoami',
        body: `I'm a builder at heart—whether that means turning wrenches, sniffing vehicle bus traffic, or deploying container stacks.

My homelab is my ongoing technical playground. I built a complete home infrastructure from scratch using Docker and Portainer, treating it like a production cluster while tackling fresh challenges in networking, container orchestration, and self-hosting.

My primary physical computing project bridges my passion for motorcycles and code: engineering a custom motorcycle dashboard built on an ESP32. I'm writing custom firmware to interface directly with physical sensors and tap straight into the bike's CAN bus and K-line protocols to process live diagnostic telemetry on the fly.

When I'm not analyzing raw ECU frames or managing container stacks, you can find me tweaking a custom PC build or out clearing my head on a night ride.

## // CURRENT_THREADS

* \`[sys.ops]\` Homelab Stack — self-hosted Docker & Portainer ecosystem built from scratch
* \`[hw.build]\` ESP32 Moto Dash — custom ECU telemetry via direct sensors, CAN bus & K-line
* \`[dev.stack]\` Java, Spring Boot, TypeScript, Angular, ESP32 / Embedded Systems
* \`[sys.idle]\` Night motorcycle rides & hardware modding`,
    },
    professional: {
        eyebrow: 'About',
        body: `I am a Software Engineering Apprentice specializing in full-stack development and embedded integration, currently gaining hands-on production experience at Intuitive Collaboration. My daily responsibilities center on architecting robust backend systems using Java and Spring Boot alongside modular frontend applications in TypeScript and Angular.

Beyond web development, I apply strict engineering principles to self-hosted infrastructure and custom automotive hardware. I built and manage a complete homelab ecosystem from scratch using Docker and Portainer. Additionally, I am designing an embedded motorcycle dashboard powered by an ESP32 microcontroller, interfacing directly with vehicle sensors, CAN bus, and K-line diagnostic protocols to decode real-time telemetry and engine metrics.

* **Backend & Full-Stack:** Java, Spring Boot, RESTful APIs, TypeScript, Angular
* **Infrastructure & DevOps:** Docker, Portainer, Network Architecture, Container Security
* **Embedded Systems & Hardware:** ESP32 Microcontrollers, Automotive Protocols (CAN Bus, K-Line), Direct Sensor Interfacing`,
    },
}

export interface Organisation {
    name: string
    url?: string
}

export interface ProjectItem {
    name: string
    description: string
    org?: Organisation
    url?: string
    state: 'UNDEFINED' | 'ONGOING' | 'PROTOTYPE' | 'COMPLETED' | 'CLOSED'
    highlight?: boolean
}

export const projects: ProjectItem[] = [
    {
        name: 'Homelab',
        description: 'Personal home server infrastructure',
        url: 'https://github.com/heldertheking/infrastructure',
        state: 'ONGOING',
        highlight: true,
    },
    {
        name: 'Kirche Felsengrund Webpage',
        description: 'React remake of the webpage for Kirche Felsengrund in Oetwil am See.',
        org: {
            name: 'Kirche Felsengrund',
            url: 'https://www.kirche-felsengrund.ch/'
        },
        url: 'https://www.kirche-felsengrund.ch/', // TODO: If allowed, link to source code
        state: "ONGOING",
        highlight: false //TODO: Change to true once webpage v2.0 is done
    },
    {
        name: 'CubeJS',
        description: 'A simple animated cube made with Javascript.',
        org:  {
            name: 'Exobyte Core'
        },
        url: 'https://github.com/ExoByte-Core/cube.js',
        state: 'COMPLETED'
    },
    {
        name: 'Java Rendering Engine',
        description: '3D rendering engine written in java with STL import support',
        url: 'https://github.com/heldertheking/Java-Rendering-Engine',
        state: 'UNDEFINED',
    }
]

export interface WorkExperience {
    organisation: Organisation
    title: string // Job Title
    description?: string // Possible short description of work
    period: 'current' | string
}

export const experiences: WorkExperience[] = [
    {
        organisation: {
            name: 'Intuitive Collaboration',
            url: 'https://www.intuitive-collaboration.com/'
        },
        title: 'Software Engineering Apprentice',
        description: 'Apprenticeship and development of Hospital-Pool.ch',
        period: 'current',
    }
]

export interface StackDetails {
    language: string
    frameworks?: string[]
    tools?: string[]
    use: 'personal' | 'professional' | 'general'
}

export const stack: StackDetails[] = [
    {
        language: 'java',
        frameworks: ['Spring Boot'],
        tools: ['Gradle', 'Maven'],
        use: "general",
    },
    {
        language: 'Typescript',
        frameworks: ['Next.js', 'Express', 'React'],
        use: "personal",
    },
    {
        language: 'Typescript',
        frameworks: ['Angular'],
        tools: ['Nx'],
        use: "professional",
    },
    {
        language: 'Python',
        frameworks: ['FastAPI', 'Flask', 'CustomTkinter', 'QT'],
        use: "personal"
    },
    {
        language: 'C/C#/C++',
        frameworks: ['Unity', 'Unreal Engine', 'ESP32 / Embedded'],
        use: 'personal'
    }
]

export interface Social {
    name: string
    url: string
    // URL to an SVG, rendered as a CSS mask so it inherits the site's ink
    // color — swap in whatever icon source you like as long as it's an SVG.
    icon: string
    /** Hex color (e.g. "#5865F2") used for the border/text/glow on hover. Falls back to the site accent when omitted. */
    color?: string
}

const SIMPLE_ICONS = 'https://cdn.jsdelivr.net/npm/simple-icons@13/icons'

export const socials: Social[] = [
    {
        name: 'GitHub',
        url: `https://github.com/${env.username}`,
        icon: `${SIMPLE_ICONS}/github.svg`,
        color: '#181717',
    },
    {
        name: 'Discord',
        url: 'https://discord.com/users/540189546227302410',
        icon: `${SIMPLE_ICONS}/discord.svg`,
        color: '#5865F2',
    },
    {
        name: 'Instagram',
        url: `https://www.instagram.com/${env.username}`,
        icon: `${SIMPLE_ICONS}/instagram.svg`,
        color: '#E4405F',
    },
    {
        name: 'Youtube',
        url: 'https://www.youtube.com/@htk3390',
        icon: `${SIMPLE_ICONS}/youtube.svg`,
        color: '#FF0000',
    },
    {
        name: 'Reddit',
        url: 'https://www.reddit.com/user/heldertheking/',
        icon: `${SIMPLE_ICONS}/reddit.svg`,
        color: '#FF4500',
    }
]

