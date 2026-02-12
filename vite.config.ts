import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";
import fs from "fs";

const baseURL = "https://subs4unlock.com";

const pages = [
  {
    path: "",
    title: "Subs 4 Unlock - Unlock Links with Social Subscriptions",
    desc: "Easily unlock links with Subs 4 Unlock! Use Sub to Unlock, Subs 2 Unlock, or Sub Unlock Link for secure access via YouTube, WhatsApp, and more.",
  },
  {
    path: "privacy-policy",
    title: "Privacy Policy | Subs 4 Unlock",
    desc: "Privacy Policy for Subs 4 Unlock. Learn how we handle your data and privacy.",
  },
  {
    path: "about-us",
    title: "About Us | Subs 4 Unlock",
    desc: "Learn more about Subs 4 Unlock and our mission to help creators monetize content.",
  },
  {
    path: "contact",
    title: "Contact Us | Subs 4 Unlock",
    desc: "Get in touch with the Subs 4 Unlock team for support or inquiries.",
  },
  {
    path: "terms-and-conditions",
    title: "Terms and Conditions | Subs 4 Unlock",
    desc: "Terms and Conditions for using Subs 4 Unlock services.",
  },
  {
    path: "getlink",
    title: "Get Link | Subs 4 Unlock",
    desc: "Proceed to your destination link securely with Subs 4 Unlock.",
  }
];

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
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,json}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [
          /^\/sitemap\.xml$/,
          /^\/robots\.txt$/,
          /^\/.*\/index\.html$/ 
        ],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://unpkg.com' || url.origin === 'https://cdn.fluidplayer.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 
              },
            },
          },
        ],
      },
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
    }),
    {
      name: 'static-site-generator',
      closeBundle: async () => {
        const outDir = resolve(__dirname, 'dist');
        if (!fs.existsSync(outDir)) return;

        const template = fs.readFileSync(resolve(outDir, 'index.html'), 'utf-8');

        pages.forEach(page => {
          let html = template;
          const fullURL = page.path ? `${baseURL}/${page.path}` : baseURL;
          
          html = html.replace(/<!--__SEO_TITLE__-->/g, page.title)
                     .replace(/<!--__SEO_DESCRIPTION__-->/g, page.desc)
                     .replace(/<!--__SEO_URL__-->/g, fullURL);

          if (page.path === "") {
            fs.writeFileSync(resolve(outDir, 'index.html'), html);
          } else {
            const routeDir = resolve(outDir, page.path);
            if (!fs.existsSync(routeDir)) fs.mkdirSync(routeDir, { recursive: true });
            fs.writeFileSync(resolve(routeDir, 'index.html'), html);
          }
        });

        fs.writeFileSync(resolve(outDir, '404.html'), template);

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseURL}${page.path ? '/' + page.path : ''}</loc>
    <changefreq>${page.path === "" ? "daily" : "weekly"}</changefreq>
    <priority>${page.path === "" ? "1.0" : "0.8"}</priority>
  </url>`).join('')}
</urlset>`;

        fs.writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap);
      }
    }
  ],
  base: "/",
  build: {
    sourcemap: false,
  },
});