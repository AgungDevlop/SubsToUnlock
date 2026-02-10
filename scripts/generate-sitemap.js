import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Konfigurasi Domain
const DOMAIN = 'https://subs4unlock.com';

// Daftar Route Statis (Sesuai router Anda)
// KITA FILTER: Tidak menyertakan ':key' dan 'getlink'
const routes = [
  { path: '/', priority: '1.0' },
  { path: '/privacy-policy', priority: '0.8' },
  { path: '/about-us', priority: '0.8' },
  { path: '/contact', priority: '0.8' },
  { path: '/terms-and-conditions', priority: '0.8' },
];

const generateSitemap = () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const publicDir = path.resolve(__dirname, '../public');

  // Pastikan folder public ada
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map((route) => {
      return `
  <url>
    <loc>${DOMAIN}${route.path === '/' ? '' : route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log(`✅ Sitemap generated at: ${sitemapPath}`);
};

generateSitemap();