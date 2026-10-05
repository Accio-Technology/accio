// NOTE: Astro does not resolve tsconfig path aliases while loading this file
// (withastro/astro#17418), so the config imports use relative paths on purpose.
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { site } from './src/config/site.ts';

export default defineConfig({
  // Used for canonical URLs, sitemaps, and dev-server URLs.
  site: site.domain,
  adapter: cloudflare(),
});
