# kacper.dev – onepage wizytówka

Strona-wizytówka freelancera robiącego strony www. Onepage + polityka prywatności + strona podziękowania + 404.

## Stack (przypięte wersje)
- astro 7.4.8 (output: server) + @astrojs/cloudflare 14.4.6, route cache `cacheCloudflare()` z `routeRules`
- tailwindcss 4.3.5 przez @tailwindcss/vite 4.3.5 – **konfiguracja wyłącznie w CSS (`@theme`, `@utility`) w `src/styles/global.css`**. Nie twórz `tailwind.config.js`, nie używaj `@astrojs/tailwind` ani `tailwindcss init` (to v3). Własne klasy przez `@utility`, nie `@layer components`.
- fonty @fontsource-variable/* 5.3.0 (self-hosted, RODO)
- wrangler 4.159.0 (dev), Node 22.16+
- CMS: emdash 1.5.0 + @emdash-cms/cloudflare 1.5.0 (D1 `DB`, R2 `MEDIA`, Durable Object `EmDashRoom`, cron), @astrojs/react 7.1.5, react 19.3.1. Panel `/_emdash/admin`, polski (`admin.locales`), `toolbar: 'client'` (pasek edycji nie psuje cache).
- Dokumentacja EmDash: repo `emdash-cms/emdash`, katalog `docs/src/content/docs` (preview, querying-content, route-caching, seed-files, field-types).

## Tokeny designu
W `@theme` w `src/styles/global.css`: kolory `bg, band, surface, surface-2, line, line-strong, ink, body, soft, muted, accent (#c6f432), accent-hover, danger`; fonty `display` (Bricolage Grotesque), `sans` (Manrope), `mono` (JetBrains Mono); `max-w-page` = 1200px; `rounded-card`, `rounded-card-lg`. Klasy: `eyebrow`, `section-title`, `btn-primary`, `btn-ghost`, `field`. Animacje: `.hero-in`, `.term-line`, `[data-reveal]` + `src/components/Motion.astro`, `.step-bar`, marquee. Ton i zasady marki: skill `.claude/skills/marka-klienta`.

## Struktura
- `seed/seed.json` – model treści EmDash (kolekcje `strona`, `uslugi`, `kroki`, `pakiety`, `faq`, `dane_firmy`) + treści startowe. Pola snake_case, `kolejnosc` do sortowania, `routable: false`.
- `src/data/site.ts` – typy i treści DOMYŚLNE (fallback, gdy panel nie jest skonfigurowany)
- `src/lib/content.ts` – `getContent()`: `getEmDashEntry`/`getEmDashCollection` → kształt `HomeContent`, adnotacje `edit` i `cacheHints`; helper `ed(edit, 'pole')` do spreadu atrybutów edycji wizualnej
- Strony ustawiają `Astro.cache.set(cacheHint)`; nowa strona = wpis w `routeRules`
- Edycja wizualna: `{...ed(item.edit, 'pole')}` na elemencie z samym tekstem (string/text). Nie na listach złożonych z wielu elementów.
- `src/worker.ts`, `src/live.config.ts` – boilerplate EmDash (nie zmieniać)
- `plugins/podglad` – natywna wtyczka EmDash (zależność `file:`): `src/index.mjs` (deskryptor + `createPlugin`), `src/admin.tsx` (React: `pages['/']` pełny podgląd, `contentEditorPanels` mini-podgląd). Bez Kumo – style inline. Podgląd szkicu = iframe `/?_edit=1` + ciasteczko `emdash-edit-mode`. Mapowanie kolekcja → sekcja w `SECTION`.
- `src/pages/api/contact.ts` – formularz → Resend, honeypot `website`
- Nowe pole: kolekcja w `seed/seed.json` (lub panel → Typy treści), mapowanie w `content.ts`, typ w `site.ts`

## Zasady pracy
- Po zmianach: `npm run build`, sprawdź mobile (390px) i desktop (1440px), Lighthouse ≥ 95, axe bez błędów.
- Unikaj generycznego wyglądu AI (Inter, fioletowe gradienty, emoji). Skille: `frontend-design`, `impeccable`, `tailwind-design-system`.
- Teksty po polsku; copy: `copywriting` / `copy-editing`; SEO: `seo-audit`, `schema`, `ai-seo`.
- Wdrożenie tylko przez integrację Git w Cloudflare (push → build). Nie wklejaj tokenów do rozmowy.

## MCP do dodania jako konektor
- Astro Docs: `https://mcp.docs.astro.build/mcp`
