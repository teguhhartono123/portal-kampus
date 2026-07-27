import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap'; // 🟢 1. SUNTIK IMPORT SITEMAP GAIB

// Ensure the server outputs pages dynamically on every click
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    // Disable default page overrides to prevent routing clashes
    runtime: { mode: 'complete' },
    // 🔗 LINK ASTRO DIRECTLY TO YOUR LOCAL WRANGLER D1 STORAGE BOX
    platformProxy: {
      enabled: true,
      persistTo: '.wrangler/state/v3'
    }
  }),
  site: 'https://stityamal.ac.id', // 🟢 2. KUNCI IDENTITAS DOMAIN UTAMA KAMPUS
  integrations: [
    sitemap() // 🟢 3. AKTIFKAN AUTOMATED XML MAPS GENERATOR
  ],
  vite: {
    ssr: {
      external: ['cloudflare:workers'],
    },
  },
});
