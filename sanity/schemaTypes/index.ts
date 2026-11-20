import { ustawienia } from './ustawienia';
import { stronaGlowna } from './stronaGlowna';

export const schemaTypes = [stronaGlowna, ustawienia];

/** Dokumenty występujące tylko raz (bez tworzenia nowych i usuwania). */
export const singletons = [
  { type: 'stronaGlowna', title: 'Strona główna' },
  { type: 'ustawienia', title: 'Dane firmy' },
] as const;
