# kacper.dev – strona-wizytówka

Onepage w **Astro 7 + Tailwind CSS v4** z panelem **EmDash** (CMS dla Astro od Cloudflare), hostowany na **Cloudflare Workers** z bazą **D1** i plikami w **R2**. Wszystko na jednym koncie Cloudflare, bez zewnętrznych usług (poza Resend do wysyłki maili z formularza).

## Start lokalnie

```bash
npm install
npm run dev        # strona: http://localhost:4321, panel: http://localhost:4321/_emdash/admin
npm run build      # produkcyjny build do dist/
npm run preview    # podgląd builda
```

PowerShell z błędem „running scripts is disabled”: raz `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` albo użyj cmd.

Do testowania wysyłki formularza lokalnie skopiuj `.dev.vars.example` do `.dev.vars` i wpisz klucz Resend.

## Panel administracyjny (EmDash)

Panel: **http://localhost:4321/_emdash/admin** (po polsku). Model treści i teksty startowe są w `seed/seed.json`:

- **Strona główna** → Teksty sekcji, Usługi, Jak pracuję, Cennik, FAQ
- **Ustawienia** → Dane firmy (marka, logo, kontakt, NIP, adres)

Kolejność usług, kroków, pakietów i pytań ustala pole „Kolejność” (mniejsza liczba = wyżej).

### Pierwsze uruchomienie lokalnie
1. `npm run dev` i otwórz http://localhost:4321/_emdash/admin – kreator: tytuł, **Przykładowa treść** (to teksty Twojej strony z `seed/seed.json`), konto administratora (Google, gdy skonfigurowany, albo klucz dostępu).
2. Szybciej, bez kreatora i logowania: http://localhost:4321/_emdash/api/setup/dev-bypass (konto testowe `dev@emdash.local`, tylko w trybie dev).

### Edycja na stronie (podgląd na żywo)
1. Będąc zalogowanym w panelu, wejdź na stronę i kliknij **„Edytuj”** (przycisk w rogu).
2. Na dole pojawi się pasek – włącz **„Tryb edycji”**.
3. Kliknij dowolny tekst (tytuł, opis, cenę, pytanie w FAQ) i pisz bezpośrednio na stronie. Zmiana zapisuje się jako szkic („Nieopublikowane zmiany”).
4. Kliknij **„Opublikuj”** na pasku – odwiedzający widzą zmianę od razu.

Listę „Co zawiera” w pakietach, ikony usług, kolejność i logo zmienia się w panelu (ikona strzałki na pasku otwiera wpis w panelu). Każdy wpis ma historię wersji („Wersje” w panelu bocznym edytora).

### Podgląd strony w panelu
Własna wtyczka `plugins/podglad` (instalowana jako `@kacper/emdash-podglad`) dodaje:
- **Strona główna → Podgląd strony**: cała strona w widoku Komputer / Tablet / Telefon, przełącznik **Szkic** (zapisane, nieopublikowane zmiany) / **Opublikowana**. W szkicu można włączyć „Tryb edycji” i poprawiać teksty bezpośrednio w podglądzie.
- **„Podgląd na stronie”** w bocznym pasku edytora każdego wpisu: widok telefonu przewinięty do edytowanego elementu (podświetlony), odświeżany po każdym zapisie.

### Jak działa szybkość
Strony renderują się z bazy D1 i są cache'owane na krawędzi Cloudflare (`routeRules` w `astro.config.mjs`). EmDash czyści cache automatycznie po każdej publikacji, więc zmiany widać w kilka sekund, a odwiedzający dostają gotową stronę z cache.

### Logowanie
Ekran logowania oferuje: **Google**, **link na e-mail** (jednorazowy, ważny 15 min) oraz klucz dostępu (passkey). Konta tworzy się tylko przez zaproszenie: panel → **Użytkownicy → Zaproś**, e-mail klienta i rola redaktora. Klient loguje się Google z tym samym adresem albo linkiem na e-mail. Obcy z kontem Google nie założą konta.

Lokalnie (`npm run dev`) maile nie są wysyłane – link logowania pojawia się w terminalu (`📧 [dev-email]`).

#### Google – jednorazowa konfiguracja (ok. 10 min)
1. https://console.cloud.google.com → nowy projekt, np. `kacper-dev-panel`.
2. **Google Auth Platform → Branding**: nazwa aplikacji (`kacper.dev – panel`), e-mail kontaktowy. **Audience**: *External*, potem **Publish app** (podstawowe uprawnienia e-mail/profil nie wymagają weryfikacji przez Google).
3. **Clients → Create client → Web application**. *Authorized redirect URIs*:
   - `http://localhost:4321/_emdash/api/auth/oauth/google/callback`
   - `https://twojadomena.pl/_emdash/api/auth/oauth/google/callback`
4. Skopiuj **Client ID** i **Client secret**:
   - lokalnie: do `.dev.vars` (wzór w `.dev.vars.example`), restart `npm run dev`,
   - na Cloudflare: **Settings → Variables and Secrets** → sekrety `EMDASH_OAUTH_GOOGLE_CLIENT_ID` i `EMDASH_OAUTH_GOOGLE_CLIENT_SECRET`.

#### Link na e-mail na produkcji (Cloudflare Email Sending)
1. Domena musi być w Cloudflare (DNS). Cloudflare → **Email → Email Sending** → dodaj domenę i zweryfikuj nadawcę `panel@twojadomena.pl` (adres ustawiony w `astro.config.mjs` → `cloudflareEmail`).
2. Binding `EMAIL` jest już w `wrangler.jsonc`. Po wdrożeniu: panel → **Ustawienia → E-mail → Wyślij testowy e-mail**.

## Co uzupełnić przed publikacją

1. Dane firmy, teksty i ceny: w panelu (domyślne w `src/data/site.ts` → `seed/seed.json`).
2. `astro.config.mjs` i `public/robots.txt`: docelowa domena (`SITE_URL`).
3. `wrangler.jsonc`: `CONTACT_TO` i `CONTACT_FROM` (adres w zweryfikowanej domenie w Resend).
4. `src/pages/polityka-prywatnosci.astro`: data aktualizacji, dostawca skrzynki e-mail. To szablon, sprawdź go pod kątem swojej działalności.
5. Logo: panel „Dane firmy” → Logo; favicon w `public/favicon.svg`.
6. `src/pages/polityka-prywatnosci.astro`: Cloudflare jest teraz też miejscem przechowywania treści panelu.

## Wdrożenie (Cloudflare, bez CLI)

1. Wypchnij repo na GitHub.
2. Cloudflare → **Storage & Databases → D1 → Create**: nazwa `kacper-dev`, lokalizacja **Western Europe (EU)**. Skopiuj `database_id` do `wrangler.jsonc` (`d1_databases`).
3. Cloudflare → **R2 → Create bucket**: `kacper-dev-media` (lokalizacja EU).
4. Cloudflare → **Workers & Pages → Create → Import a repository**. Build command `npm run build`, deploy command `npx wrangler deploy`.
5. **Settings → Variables and Secrets** → sekret `RESEND_API_KEY`.
6. **Settings → Domains & Routes** → domena. Wejdź na `https://twojadomena.pl/_emdash/admin` → kreator konfiguracji (nazwa, konto administratora, klucz dostępu).
7. Każdy push na `main` buduje i publikuje stronę. Zmiany treści z panelu nie wymagają wdrożenia.

Plan Workers Paid (ok. 5 $/mies.) zalecany dla strony komercyjnej. Kopie zapasowe: panel → Ustawienia (eksport JSON) + D1 Time Travel (przywracanie do 30 dni wstecz).

Resend: konto na resend.com, weryfikacja domeny (DNS w Cloudflare), API key z *Sending access* jako sekret `RESEND_API_KEY`.

## Skille dla Claude

Skille do rozwijania strony instaluje się do `.claude/skills/` poleceniem:

```bash
npm run skills:install
```

Skrypt `scripts/install-skills.mjs` pobiera je z GitHuba w przypiętych, przejrzanych wersjach i dodaje własny skill marki z `claude-skills/marka-klienta`. Folder `.claude/skills` nie jest w repo, żeby skille nie mieszały się z kodem. Lista źródeł po instalacji: `.claude/skills/SOURCES.md`.

Konektor MCP do dodania w ustawieniach Claude: **Astro Docs**, `https://mcp.docs.astro.build/mcp`.
