import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { noscriptFallbackPlugin } from './vite-plugins/noscript.ts'
import { cspHashPlugin } from './vite-plugins/csp-hash.ts'

export default defineConfig({
  plugins: [react(), noscriptFallbackPlugin(), cspHashPlugin()],
  build: {
    // Matches tsconfig's ES2022 target - avoids esbuild emitting legacy
    // helpers/polyfill-shaped code for browsers this app never targets.
    target: 'es2022',
    rollupOptions: {
      output: {
        // Split vendor deps out from app code, which changes on every
        // deploy - these rarely change, so with the immutable long-lived
        // cache on /assets/* (see public/_headers), returning visitors'
        // browsers can reuse these chunks across deploys instead of
        // re-downloading them.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
            return 'vendor-motion'
          }
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler')) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})
