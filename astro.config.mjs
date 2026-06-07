import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // Ensure the server outputs pages dynamically on every click
  output: 'server',
  
  adapter: cloudflare({
    // Disable default page overrides to prevent routing clashes
    runtime: { mode: 'complete' },
    
    // 🚀 LINK ASTRO DIRECTLY TO YOUR LOCAL WRANGLER D1 STORAGE BOX
    platformProxy: {
      enabled: true,
      persistTo: '.wrangler/state/v3'
    }
  }),

  vite: {
    ssr: {
      external: ['cloudflare:workers'],
    },
  },
});
