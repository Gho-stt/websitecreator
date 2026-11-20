// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import { sanityProject } from './sanity.project.mjs';

// Zmień na docelową domenę przed publikacją (używane w sitemap, canonical i OG).
const SITE_URL = 'https://twojadomena.pl';

// Panel /admin (Sanity Studio) włącza się dopiero po wpisaniu projectId w sanity.project.mjs
const cms = sanityProject.projectId
  ? [
      sanity({
        projectId: sanityProject.projectId,
        dataset: sanityProject.dataset,
        apiVersion: sanityProject.apiVersion,
        useCdn: false,
        studioBasePath: '/admin',
      }),
      react(),
    ]
  : [];

export default defineConfig({
  site: SITE_URL,
  // Strony są statyczne; tylko /api/contact działa na żądanie (Cloudflare Worker).
  output: 'static',
  adapter: cloudflare({ imageService: 'compile' }),
  session: false,
  integrations: [...cms, sitemap({ filter: (page) => !page.includes('/admin') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
