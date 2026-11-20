---
name: marka-klienta
description: Marka kacper.dev (Kacper Bukalak, strony internetowe) – kolory, fonty, ton komunikacji i dane firmy. Użyj przy każdej zmianie wyglądu lub tekstów na tej stronie.
---

# Marka: kacper.dev

## Kim jest marka
Freelancer z Polski, który projektuje i koduje strony internetowe dla małych firm i freelancerów (wizytówki, strony firmowe, sklepy). Obietnica: „Ty akceptujesz, ja robię resztę”.

## Ton komunikacji
- Po polsku, na „Ty”, konkretnie i spokojnie. Krótkie zdania.
- Mówimy o efekcie dla klienta (klienci, zapytania, czas), nie o technologii.
- Bez korpomowy („kompleksowe rozwiązania”, „synergia”), bez wykrzykników i emoji.
- Liczby i terminy podajemy uczciwie, jako „od” / „około”.

## Wygląd
Ciemny, techniczny, jeden mocny akcent. Tokeny są w `src/styles/global.css` (`@theme`):

| token | wartość | użycie |
|---|---|---|
| bg | #0e0f11 | tło strony |
| band | #121316 | tło sekcji wyróżnionych (cennik, kontakt) |
| surface / surface-2 | #16181c / #1a1c21 | karty |
| line / line-strong | #23252b / #3a3d45 | obramowania |
| ink | #f4f5f7 | nagłówki |
| body / soft / muted | #e8e9ec / #c9cbd1 / #9a9ea8 | tekst |
| accent | #c6f432 | CTA, wyróżnienia (tekst na akcencie zawsze #0e0f11) |

Fonty (lokalnie przez Fontsource, bez Google Fonts):
- nagłówki: Bricolage Grotesque Variable (700–800, ciasny tracking),
- tekst: Manrope Variable,
- akcenty „kodowe” (etykiety sekcji `01 / usługi`, terminal): JetBrains Mono Variable.

Zasady: nie używaj Inter, fioletowych gradientów ani emoji. Jeden akcent kolorystyczny na ekran. Kontrast tekstu min. 4.5:1. Linki w tekście ciągłym podkreślone. Animacje zawsze z obsługą `prefers-reduced-motion`.

## Dane firmy
Domyślne dane i teksty są w `src/data/site.ts`; po skonfigurowaniu CMS nadpisuje je panel. Pola w [NAWIASACH] to placeholdery. Nie wpisuj danych firmy na sztywno w komponentach.
