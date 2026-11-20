# kacper.dev – onepage wizytówka

Strona-wizytówka freelancera robiącego strony www. Onepage + polityka prywatności + strona podziękowania + 404.

## Stack (przypięte wersje)
- astro 7.4.8 (output: static) + @astrojs/cloudflare 14.4.6 (tylko `/api/contact` działa na żądanie)
- tailwindcss 4.3.5 przez @tailwindcss/vite 4.3.5 – **konfiguracja wyłącznie w CSS (`@theme`, `@utility`) w `src/styles/global.css`**. Nie twórz `tailwind.config.js`, nie używaj `@astrojs/tailwind` ani `tailwindcss init` (to v3). Własne klasy przez `@utility`, nie `@layer components`.
- @astrojs/sitemap 3.7.4, fonty @fontsource-variable/* 5.3.0 (self-hosted, RODO)
- wrangler 4.159.0 (dev), Node 22
- `session: false`, `imageService: 'compile'` – bez KV i bindingu Images
- CMS: sanity 6.22.0 + @sanity/astro 3.6.1 (Studio pod `/admin`, hash routing), @astrojs/react 7.1.5, react 19.3.1, @sanity/client 8.15.0, @sanity/locale-pl-pl. Ikony `@sanity/icons` v5 importuj ze ścieżek (`@sanity/icons/Home`), nie z głównego wejścia.

## Tokeny designu
W `@theme` w `src/styles/global.css`: kolory `bg, band, surface, surface-2, line, line-strong, ink, body, soft, muted, accent (#c6f432), accent-hover, danger`; fonty `display` (Bricolage Grotesque), `sans` (Manrope), `mono` (JetBrains Mono); `max-w-page` = 1200px; `rounded-card`, `rounded-card-lg`. Klasy: `eyebrow`, `section-title`, `btn-primary`, `btn-ghost`, `field`. Animacje: `.hero-in`, `.term-line`, `[data-reveal]` + `src/components/Motion.astro`, `.step-bar`, marquee. Ton i zasady marki: skill `.claude/skills/marka-klienta`.

## Struktura
- `src/data/site.ts` – typy treści i treści DOMYŚLNE (fallback + wartości startowe w panelu)
- `src/lib/content.ts` – `getContent()`: singletony `stronaGlowna` i `ustawienia` z Sanity nałożone na domyślne; każda strona woła go raz i przekazuje dane przez propsy
- `sanity.project.mjs` – projectId/dataset (puste projectId = brak panelu); `sanity.config.ts`, `sanity/schemaTypes/*`, `sanity/actions/restoreDefaults.tsx`
- `src/pages/api/contact.ts` – formularz → Resend (`RESEND_API_KEY` sekret, `CONTACT_TO`/`CONTACT_FROM` w `wrangler.jsonc`), honeypot `website`, JSON dla fetch / redirect 303 bez JS
- Nowe pole treści: typ + wartość domyślna w `site.ts`, schemat w `sanity/schemaTypes`, zapytanie w `content.ts`, potem `npx sanity schema validate`

## Zasady pracy
- Po zmianach: `npm run build`, sprawdź mobile (390px) i desktop (1440px), Lighthouse ≥ 95, axe bez błędów.
- Unikaj generycznego wyglądu AI (Inter, fioletowe gradienty, emoji). Skille: `frontend-design`, `impeccable`, `tailwind-design-system`.
- Teksty po polsku; copy: `copywriting` / `copy-editing`; SEO: `seo-audit`, `schema`, `ai-seo`.
- Wdrożenie tylko przez integrację Git w Cloudflare (push → build). Nie wklejaj tokenów do rozmowy.

## MCP do dodania jako konektor
- Astro Docs: `https://mcp.docs.astro.build/mcp`
