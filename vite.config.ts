import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/minio': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (rhumbsPath) => rhumbsPath.replace(/^\/minio/, ''),
      },
    },
  },
})
