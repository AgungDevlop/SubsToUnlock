import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process";

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
    {
      name: 'generate-sitemap',
      // Gunakan hook 'buildStart' agar sitemap dibuat sebelum proses bundling dimulai
      buildStart() {
        console.log('🔄 Generating sitemap...');
        try {
          // Memanggil script yang kita buat di langkah 1 via npm
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