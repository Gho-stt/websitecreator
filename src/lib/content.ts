import { createClient } from '@sanity/client';
import { sanityProject } from '../../sanity.project.mjs';
import { defaultHome, defaultSettings, type HomeContent, type Settings } from '../data/site';

export const sanityEnabled = Boolean(sanityProject.projectId);

const client = sanityEnabled
  ? createClient({
      projectId: sanityProject.projectId,
      dataset: sanityProject.dataset,
      apiVersion: sanityProject.apiVersion,
      useCdn: false, // świeże dane przy buildzie i w trybie dev
      perspective: 'published', // tylko opublikowane zmiany, bez szkiców
    })
  : null;

const QUERY = `{
  "home": *[_id == "stronaGlowna"][0]{hero, services, process, pricing, faq, contact, seo},
  "settings": *[_id == "ustawienia"][0]{brand, logoInitials, owner, companyName, nip, address, city, email, phone, "logoUrl": logo.asset->url}
}`;

const isEmpty = (v: unknown) =>
  v === null || v === undefined || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);

/** Nakłada wartości z Sanity na domyślne; puste pola z panelu nie kasują treści. */
function merge<T>(base: T, over: unknown): T {
  if (isEmpty(over)) return base;
  if (Array.isArray(base) || typeof base !== 'object' || base === null) return over as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over as Record<string, unknown>)) {
    if (k.startsWith('_')) continue;
    out[k] = k in out ? merge(out[k], v) : isEmpty(v) ? undefined : v;
  }
  return out as T;
}

export type Content = { home: HomeContent; settings: Settings };

/**
 * Treść strony. Bez Sanity → wartości domyślne.
 * Błąd pobierania: w dev ostrzeżenie i wartości domyślne; przy buildzie produkcyjnym
 * build się przerywa, żeby nie opublikować domyślnych tekstów zamiast treści klienta.
 */
export async function getContent(): Promise<Content> {
  if (!client) return { home: defaultHome, settings: defaultSettings };
  try {
    const data = await client.fetch<{ home: unknown; settings: unknown }>(QUERY);
    return { home: merge(defaultHome, data?.home), settings: merge(defaultSettings, data?.settings) };
  } catch (err) {
    if (import.meta.env.PROD) throw new Error(`Nie udało się pobrać treści z Sanity: ${err}`);
    console.warn('[sanity] używam treści domyślnych:', err);
    return { home: defaultHome, settings: defaultSettings };
  }
}
