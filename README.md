# kacper.dev – strona-wizytówka

Onepage w **Astro 7 + Tailwind CSS v4**, hostowany na **Cloudflare Workers**. Treści edytuje się w panelu **Sanity Studio** pod `/admin`. Formularz kontaktowy wysyła maile przez **Resend**.

## Start lokalnie

```bash
npm install
npm run dev        # strona: http://localhost:4321, panel: http://localhost:4321/admin
npm run build      # produkcyjny build do dist/
npm run preview    # podgląd builda
```

PowerShell z błędem „running scripts is disabled”: raz `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` albo użyj cmd.

Do testowania wysyłki formularza lokalnie skopiuj `.dev.vars.example` do `.dev.vars` i wpisz klucz Resend.

## Panel administracyjny (Sanity Studio)

Panel `/admin` pozwala edytować bez kodu: nagłówek, usługi, kroki, cennik, FAQ, teksty kontaktu, opis w Google oraz dane firmy i logo. Bez `projectId` strona używa treści domyślnych z `src/data/site.ts`.

1. Projekt Sanity: `cu8f2gr3` (`sanity.project.mjs`), dataset `production`.
2. sanity.io/manage → projekt → **API → CORS origins**: `http://localhost:4321` z **Allow credentials** (później też adres produkcyjny).
3. `npm run dev` → http://localhost:4321/admin → otwórz „Strona główna” i „Dane firmy” → **Opublikuj**.
4. Pusty dokument? „⋯” obok „Opublikuj” → **Przywróć treści startowe** → Potwierdź → Opublikuj.
5. Poprzednie wersje: „⋯” w prawym górnym rogu dokumentu → historia → wybierz wersję → **Przywróć**.

Dostęp dla klienta: sanity.io/manage → **Members → Invite**, rola **Editor**.

Automatyczna publikacja na produkcji: Cloudflare → Workers & Pages → projekt → **Settings → Builds → Deploy Hooks** (gałąź `main`), a w Sanity **API → Webhooks** z tym URL-em, filtr `_type in ["stronaGlowna", "ustawienia"]`, metoda POST. Gdy Sanity jest niedostępne podczas buildu produkcyjnego, build się przerywa (poprzednia wersja zostaje online).

## Co uzupełnić przed publikacją

1. Dane firmy, teksty i ceny: w panelu `/admin` (albo domyślne w `src/data/site.ts`).
2. `astro.config.mjs` i `public/robots.txt`: docelowa domena (`SITE_URL`).
3. `wrangler.jsonc`: `CONTACT_TO` i `CONTACT_FROM` (adres w zweryfikowanej domenie w Resend).
4. `src/pages/polityka-prywatnosci.astro`: data aktualizacji, dostawca skrzynki e-mail. To szablon, sprawdź go pod kątem swojej działalności.
5. Logo: panel „Dane firmy” → Logo; favicon w `public/favicon.svg`.

## Wdrożenie (Cloudflare, bez CLI)

1. Wypchnij repo na GitHub.
2. Cloudflare → **Workers & Pages → Create → Import a repository**. Build command `npm run build`, deploy command `npx wrangler deploy`.
3. **Settings → Variables and Secrets → Add → Secret** `RESEND_API_KEY`.
4. **Settings → Domains & Routes** → domena.
5. Każdy push na `main` buduje i publikuje stronę.

Resend: konto na resend.com, weryfikacja domeny (DNS w Cloudflare), API key z *Sending access* jako sekret `RESEND_API_KEY`.

## Skille dla Claude

`.claude/skills/` – skille do rozwijania strony (źródła i commity: `.claude/skills/SOURCES.md`). Konektor MCP do dodania w ustawieniach Claude: **Astro Docs**, `https://mcp.docs.astro.build/mcp`.
