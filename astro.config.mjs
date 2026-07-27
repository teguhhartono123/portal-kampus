import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    runtime: { mode: 'complete' },
    platformProxy: {
      enabled: true,
      persistTo: '.wrangler/state/v3'
    }
  }),
  site: 'https://stityamal.ac.id',
  integrations: [
    sitemap()
  ],
  // 🟢 BERDIRI TEGAK DI SINI: Saklar pemaksa render sitemap di lingkungan server cloud!
  experimental: {
    prerenderSitemap: true
  },
  vite: {
    ssr: {
      external: ['cloudflare:workers'],
    },
  },
});
