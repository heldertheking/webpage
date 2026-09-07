import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { noscriptFallbackPlugin } from './vite-plugins/noscript.ts'
import { cspHashPlugin } from './vite-plugins/csp-hash.ts'

export default defineConfig({
  plugins: [react(), noscriptFallbackPlugin(), cspHashPlugin()],
  build: {
    // Matches tsconfig's ES2022 target — avoids esbuild emitting legacy
    // helpers/polyfill-shaped code for browsers this app never targets.
    target: 'es2022',
  },
})
