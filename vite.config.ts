import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          '@babel/plugin-syntax-import-attributes',
        ],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.webp', 'robots.txt'],
      manifest: {
        name: 'Subs 4 Unlock',
        short_name: 'Subs4Unlock',
        description: 'Unlock Links with Social Subscriptions easily.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon.webp',
            sizes: '192x192',
            type: 'image/webp',
            purpose: 'any maskable'
          },
          {
            src: '/icon.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Caching strategy untuk performa offline
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://unpkg.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 tahun
              },
            },
          },
        ],
      },
    }),
    {
      name: 'generate-sitemap',
      buildStart() {
        console.log('🔄 Generating sitemap...');
        try {
          execSync('npm run generate-sitemap', { stdio: 'inherit' });
        } catch (error) {
          console.error('❌ Failed to generate sitemap:', error);
        }
      },
    },
  ],
  base: "/",
  build: {
    sourcemap: false,
  },
});