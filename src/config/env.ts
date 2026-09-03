// Single place that reads import.meta.env — components import from here
// instead of touching import.meta.env directly.
export const env = {
  portainerStatusEndpoint: import.meta.env.VITE_PORTAINER_STATUS_ENDPOINT ?? '',
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT ?? '',
  username: import.meta.env.VITE_SOCIALS_USERNAME ?? '',
}
