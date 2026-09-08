import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DataSafetyPage } from './pages/DataSafetyPage.tsx'
import { ThemeLayout } from './theme/ThemeLayout.tsx'
import { ThemeProvider } from './theme/ThemeProvider.tsx'

// No router: the site is one page of in-page anchors plus this one extra
// static route, so a plain pathname check covers it without pulling in
// react-router. Cloudflare Pages' `_redirects` SPA fallback makes a direct
// GET to /data-safety serve this same index.html.
const isDataSafetyPage = window.location.pathname.replace(/\/+$/, '') === '/data-safety'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ThemeLayout>
        {isDataSafetyPage ? <DataSafetyPage /> : <App />}
      </ThemeLayout>
    </ThemeProvider>
  </StrictMode>,
)
