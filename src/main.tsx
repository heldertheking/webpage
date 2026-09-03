import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeLayout } from './theme/ThemeLayout.tsx'
import { ThemeProvider } from './theme/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ThemeLayout>
        <App />
      </ThemeLayout>
    </ThemeProvider>
  </StrictMode>,
)
