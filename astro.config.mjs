// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import { cacheCloudflare } from '@astrojs/cloudflare/cache';
import react from '@astrojs/react';
import emdash from 'emdash/astro';
import { d1, r2 } from '@emdash-cms/cloudflare';
import { cloudflareEmail } from '@emdash-cms/cloudflare/plugins';
import { google } from 'emdash/auth/providers/google';

// W `astro dev` maile (link logowania, zaproszenia) trafiają do terminala – nic nie jest wysyłane.
const isDev = process.argv.includes('dev');

// Zmień na docelową domenę przed publikacją (canonical i OG).
const SITE_URL = 'https://twojadomena.pl';

// Strony renderowane na żądanie z treści w D1 i cache'owane na krawędzi Cloudflare.
// EmDash czyści cache po każdej publikacji (tagi = nazwy kolekcji), więc zmiany są widoczne od razu.
const cached = { maxAge: 86_400, swr: 604_800, tags: ['strona', 'uslugi', 'kroki', 'pakiety', 'faq', 'dane_firmy', 'emdash:settings', 'all'] };

export default defineConfig({
  site: SITE_URL,
  output: 'server',
  adapter: cloudflare(),
  cache: { provider: cacheCloudflare() },
  routeRules: {
    '/': cached,
    '/polityka-prywatnosci': cached,
    '/dziekuje': cached,
  },
  integrations: [
    react(),
    emdash({
      database: d1({ binding: 'DB', session: 'auto' }),
      storage: r2({ binding: 'MEDIA' }),
      // Pasek edycji na stronie ładowany po stronie klienta – nie psuje cache dla zwykłych odwiedzających
      toolbar: 'client',
      // Logowanie: Google + jednorazowy link na e-mail (klucz dostępu nadal działa jako opcja).
      // Dane klienta OAuth: EMDASH_OAUTH_GOOGLE_CLIENT_ID / EMDASH_OAUTH_GOOGLE_CLIENT_SECRET
      // (lokalnie w .dev.vars, na Cloudflare jako sekrety).
      authProviders: [google()],
      // Wysyłka maili przez Cloudflare Email Sending (binding EMAIL w wrangler.jsonc) – bez zewnętrznego konta.
      plugins: isDev
        ? []
        : [
            cloudflareEmail({
              from: { email: 'panel@twojadomena.pl', name: 'kacper.dev – panel' },
              replyTo: 'kontakt@twojadomena.pl',
            }),
          ],
      admin: {
        locales: ['pl'],
        hiddenNavItems: ['comments', 'menus', 'redirects', 'widgets', 'sections', 'bylines', 'import', 'calendar'],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  devToolbar: { enabled: false },
});
