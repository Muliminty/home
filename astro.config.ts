import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://muliminty.site',
  output: 'static',
  integrations: [react(), sitemap()],
  prefetch: {
    defaultStrategy: 'hover',
  },
  vite: {
    optimizeDeps: {
      exclude: ['archive'],
    },
    server: {
      fs: {
        deny: ['archive'],
      },
    },
  },
});
