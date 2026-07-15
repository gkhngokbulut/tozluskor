// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import decapCmsOauth from 'astro-decap-cms-oauth';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [decapCmsOauth()],
});
