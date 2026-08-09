// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://{{LIGHTING_DOMAIN}}',
  integrations: [sitemap()],
  adapter: cloudflare({
    prerenderEnvironment: 'node'
  })
});
