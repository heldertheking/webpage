/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_ENDPOINT?: string
  readonly VITE_PORTAINER_STATUS_ENDPOINT?: string
  readonly VITE_SOCIALS_USERNAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
