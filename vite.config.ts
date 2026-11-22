import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// Link previews (WhatsApp, X, Facebook) need absolute URLs, so these tags are
// only added when VITE_SITE_URL (e.g. https://likita24.com) is set at build time.
function socialPreviewTags(siteUrl: string | undefined): Plugin {
  return {
    name: 'social-preview-tags',
    transformIndexHtml() {
      if (!siteUrl) return []
      const base = siteUrl.replace(/\/+$/, '')
      return [
        { tag: 'meta', attrs: { property: 'og:url', content: `${base}/` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: `${base}/og-image.png` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${base}/og-image.png` }, injectTo: 'head' },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    socialPreviewTags(loadEnv(mode, process.cwd()).VITE_SITE_URL),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'favicon-64x64.png', 'apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'Likita24',
        short_name: 'Likita24',
        description: 'See a doctor online, any time: book appointments, chat and video-consult with qualified doctors.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#636AE8',
        categories: ['health', 'medical'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Only the app shell (JS/CSS/HTML/icons) is cached. API calls, sockets and
        // video traffic always go to the network so patient data is never stale.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/socket\.io/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@features': path.resolve(__dirname, './src/features'),
    },
  },
}))
