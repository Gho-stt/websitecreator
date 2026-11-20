import { getEmDashCollection, getEmDashEntry } from 'emdash';
import { defaultHome, defaultSettings, type Edit, type HomeContent, type ServiceIcon, type Settings } from '../data/site';

/** Pusty obiekt zamiast brakującej adnotacji – bezpieczny do {...spread}. */
export const ed = (edit: Edit | undefined, field?: string): Record<string, string> =>
  (field ? edit?.[field] : edit) ?? {};

const or = (v: unknown, fallback: string) => (typeof v === 'string' && v.trim() ? v : fallback);

export type Content = { home: HomeContent; settings: Settings; cacheHints: unknown[] };

/**
 * Treść strony z EmDash, nałożona na treści domyślne (src/data/site.ts).
 * Przed ukończeniem konfiguracji panelu zapytania zwracają puste wyniki – wtedy działają wartości domyślne.
 */
export async function getContent(): Promise<Content> {
  const sorted = { orderBy: { kolejnosc: 'asc' as const } };
  const [strona, firma, uslugi, kroki, pakiety, faq] = await Promise.all([
    getEmDashEntry('strona', 'strona-glowna'),
    getEmDashEntry('dane_firmy', 'dane-firmy'),
    getEmDashCollection('uslugi', sorted),
    getEmDashCollection('kroki', sorted),
    getEmDashCollection('pakiety', sorted),
    getEmDashCollection('faq', sorted),
  ]);

  const t = (strona.entry?.data ?? {}) as Record<string, any>;
  const f = (firma.entry?.data ?? {}) as Record<string, any>;
  const d = defaultHome;

  const home: HomeContent = {
    hero: {
      eyebrow: or(t.hero_nadtytul, d.hero.eyebrow),
      title: or(t.hero_tytul, d.hero.title),
      lead: or(t.hero_opis, d.hero.lead),
      ctaPrimary: or(t.hero_przycisk, d.hero.ctaPrimary),
      ctaSecondary: or(t.hero_przycisk_2, d.hero.ctaSecondary),
    },
    services: {
      title: or(t.uslugi_tytul, d.services.title),
      items: uslugi.entries.length
        ? uslugi.entries.map((e: any) => ({ title: e.data.tytul, text: e.data.opis, icon: e.data.ikona as ServiceIcon, edit: e.edit }))
        : d.services.items,
    },
    process: {
      title: or(t.proces_tytul, d.process.title),
      steps: kroki.entries.length ? kroki.entries.map((e: any) => ({ title: e.data.tytul, text: e.data.opis, edit: e.edit })) : d.process.steps,
    },
    pricing: {
      title: or(t.cennik_tytul, d.pricing.title),
      intro: typeof t.cennik_opis === 'string' ? t.cennik_opis : d.pricing.intro,
      note: typeof t.cennik_dopisek === 'string' ? t.cennik_dopisek : d.pricing.note,
      packages: pakiety.entries.length
        ? pakiety.entries.map((e: any) => ({
            name: e.data.nazwa,
            lead: e.data.opis,
            price: e.data.cena,
            features: String(e.data.cechy ?? '').split('\n').map((x) => x.trim()).filter(Boolean),
            featured: Boolean(e.data.wyrozniony),
            edit: e.edit,
          }))
        : d.pricing.packages,
    },
    faq: {
      title: or(t.faq_tytul, d.faq.title),
      items: faq.entries.length ? faq.entries.map((e: any) => ({ q: e.data.pytanie, a: e.data.odpowiedz, edit: e.edit })) : d.faq.items,
    },
    contact: {
      title: or(t.kontakt_tytul, d.contact.title),
      intro: or(t.kontakt_opis, d.contact.intro),
      area: or(t.kontakt_obszar, d.contact.area),
    },
    seo: { title: or(t.seo_tytul, d.seo.title), description: or(t.seo_opis, d.seo.description) },
    edit: strona.entry?.edit,
  };

  const logo = f.logo as { src?: string; meta?: { storageKey?: string } } | undefined;
  const settings: Settings = {
    brand: or(f.marka, defaultSettings.brand),
    logoInitials: or(f.inicjaly, defaultSettings.logoInitials),
    logoUrl: logo?.src ?? (logo?.meta?.storageKey ? `/_emdash/api/media/file/${logo.meta.storageKey}` : undefined),
    owner: or(f.wlasciciel, defaultSettings.owner),
    companyName: or(f.nazwa_firmy, defaultSettings.companyName),
    nip: or(f.nip, defaultSettings.nip),
    address: or(f.adres, defaultSettings.address),
    city: or(f.miasto, defaultSettings.city),
    email: or(f.email, defaultSettings.email),
    phone: or(f.telefon, defaultSettings.phone),
    edit: firma.entry?.edit,
  };

  const cacheHints = [strona, firma, uslugi, kroki, pakiety, faq].map((r: any) => r.cacheHint).filter(Boolean);
  return { home, settings, cacheHints };
}
