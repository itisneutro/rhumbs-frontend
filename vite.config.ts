import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const rhumbsCertKey = path.resolve(import.meta.dirname, 'cert.key')
const rhumbsCertCrt = path.resolve(import.meta.dirname, 'cert.crt')

const rhumbsHttps =
  fs.existsSync(rhumbsCertKey) && fs.existsSync(rhumbsCertCrt)
    ? {
        key: fs.readFileSync(rhumbsCertKey),
        cert: fs.readFileSync(rhumbsCertCrt),
      }
    : undefined

export default defineConfig(({ command, isPreview }) => {
  const rhumbsBase = command === 'build' || isPreview ? '/rhumbs-frontend/' : '/'

  return {
    base: rhumbsBase,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: 'Румбы ветра',
          short_name: 'Румбы',
          lang: 'ru',
          start_url: rhumbsBase,
          scope: rhumbsBase,
          display: 'standalone',
          orientation: 'portrait-primary',
          theme_color: '#BF2828',
          background_color: '#FFFFFF',
          icons: [
            {
              src: 'rhumbs-icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'rhumbs-icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'rhumbs-icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{html,js,css,svg,png,jpg,woff2,ttf}'],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api/, /^\/minio/],
        },
      }),
    ],
    server: {
      watch: {
        usePolling: true,
      },
      host: true,
      strictPort: true,
      port: 5173,
      https: rhumbsHttps,
      proxy: {
        '/api': 'http://localhost:3000',
        '/minio': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          rewrite: (rhumbsPath) => rhumbsPath.replace(/^\/minio/, ''),
        },
      },
    },
  }
})
