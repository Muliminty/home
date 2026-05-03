import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://muliminty.github.io',
  base: '/home/',
  output: 'static',
  integrations: [react()],
  prefetch: {
    defaultStrategy: 'hover',
  },
});
