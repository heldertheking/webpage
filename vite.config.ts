import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { noscriptFallbackPlugin } from './vite-plugins/noscript.ts'

export default defineConfig({
  plugins: [react(), noscriptFallbackPlugin()],
})
