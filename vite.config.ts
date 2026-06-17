import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

function resolveBasePath() {
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH.endsWith('/') ? process.env.VITE_BASE_PATH : `${process.env.VITE_BASE_PATH}/`
  }

  if (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY) {
    const repositoryName = process.env.GITHUB_REPOSITORY.split('/')[1]
    return repositoryName.endsWith('.github.io') ? '/' : `/${repositoryName}/`
  }

  return '/'
}

const basePath = resolveBasePath()

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa.svg', 'pwa-maskable.svg'],
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        id: basePath,
        name: '垚总加油站',
        short_name: '垚总加油站',
        description: '不催你，只是陪你慢慢回血。',
        theme_color: '#FFD86B',
        background_color: '#FFFDF7',
        display: 'standalone',
        start_url: basePath,
        scope: basePath,
        categories: ['lifestyle'],
        icons: [
          {
            src: `${basePath}pwa.svg`,
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: `${basePath}pwa-maskable.svg`,
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
