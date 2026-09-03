export function ExternalLinkIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
      <path d="M14 3a1 1 0 1 0 0 2h3.586l-9.293 9.293a1 1 0 1 0 1.414 1.414L19 6.414V10a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-6Z" />
      <path d="M5 5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 1 0-2 0v5H5V7h5a1 1 0 0 0 0-2H5Z" />
    </svg>
  )
}

/**
 * Renders an external SVG (e.g. a Simple Icons URL) as a CSS mask instead of
 * an <img>, so the icon inherits `currentColor` and themes/hovers like the
 * rest of the site's icon treatment instead of staying a fixed brand color.
 */
export function SocialIcon({ icon, className = 'h-5 w-5' }: { icon: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url("${icon}")`,
        WebkitMaskImage: `url("${icon}")`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  )
}
