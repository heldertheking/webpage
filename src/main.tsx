import { StrictMode, Suspense, lazy, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeLayout } from './theme/ThemeLayout.tsx'
import { ThemeProvider } from './theme/ThemeProvider.tsx'

// No router: the site is one page of in-page anchors plus a couple of extra
// static routes, so a plain pathname check covers it without pulling in
// react-router. Cloudflare Pages' SPA fallback makes a direct GET to any of
// these paths serve this same index.html.
const path = window.location.pathname.replace(/\/+$/, '')

// Lazy-loaded: these are low-traffic secondary pages (and pull in the
// markdown renderer), so the homepage - the overwhelming majority of visits -
// doesn't have to download their code at all. `App` stays a static import
// since it's what most visitors get; that keeps the common path exactly as
// fast to first render as before this split.
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage.tsx').then((m) => ({ default: m.PrivacyPolicyPage })),
)
const LegalNoticePage = lazy(() =>
  import('./pages/LegalNoticePage.tsx').then((m) => ({ default: m.LegalNoticePage })),
)

interface RouteConfig {
  render: () => ReactNode
  title: string
  description: string
  /** '/data-safety' points here rather than at itself - it's just a legacy alias for the same content, and canonicalizing it avoids splitting search ranking signal between two URLs for one page. */
  canonicalPath: string
}

const ROUTES: Record<string, RouteConfig> = {
  '/privacy-policy': {
    render: () => <PrivacyPolicyPage />,
    title: 'Privacy Policy — Hélder Oliveira',
    description:
      'How heldertheking.com handles your data: no tracking cookies, a single localStorage key for your theme preference, cookieless analytics, and what happens to contact form submissions.',
    canonicalPath: '/privacy-policy',
  },
  '/data-safety': {
    render: () => <PrivacyPolicyPage />,
    title: 'Privacy Policy — Hélder Oliveira',
    description:
      'How heldertheking.com handles your data: no tracking cookies, a single localStorage key for your theme preference, cookieless analytics, and what happens to contact form submissions.',
    canonicalPath: '/privacy-policy',
  },
  '/legal-notice': {
    render: () => <LegalNoticePage />,
    title: 'Legal Notice — Hélder Oliveira',
    description: 'Legal notice (Impressum) for heldertheking.com: website operator and contact information.',
    canonicalPath: '/legal-notice',
  },
}

const route = ROUTES[path]

// index.html's <title>, meta description, canonical link, and Open
// Graph/Twitter tags are written for the homepage - this app has no
// server-side rendering, so any other route has to correct them itself once
// it knows which page it is. Google's crawler executes JS and picks this up
// fine for indexing/search snippets; non-JS clients (social link-preview
// bots) will still show the homepage's metadata for these routes, which is
// an acceptable trade-off for two rarely-shared legal pages.
if (route) {
  document.title = route.title
  const canonicalUrl = `https://heldertheking.com${route.canonicalPath}`
  document.querySelector('meta[name="description"]')?.setAttribute('content', route.description)
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', route.title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', route.description)
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl)
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', route.title)
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', route.description)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ThemeLayout>
        <Suspense fallback={null}>{route ? route.render() : <App />}</Suspense>
      </ThemeLayout>
    </ThemeProvider>
  </StrictMode>,
)
