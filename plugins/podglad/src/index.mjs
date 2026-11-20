// Wtyczka EmDash: podgląd strony na żywo w panelu.
// Część serwerowa nic nie robi poza zgłoszeniem strony panelu i modułu React (src/admin.tsx).
import { definePlugin } from 'emdash';

const ID = 'podglad';
const VERSION = '0.1.0';
const ADMIN_ENTRY = '@kacper/emdash-podglad/admin';
const ADMIN_PAGES = [{ path: '/', label: 'Podgląd strony', icon: 'eye', group: 'Strona główna' }];

/** Deskryptor do astro.config.mjs → emdash({ plugins: [podglad()] }) */
export function podglad() {
  return {
    id: ID,
    version: VERSION,
    format: 'native',
    entrypoint: '@kacper/emdash-podglad',
    adminEntry: ADMIN_ENTRY,
    adminPages: ADMIN_PAGES,
    options: {},
    capabilities: [],
  };
}

export function createPlugin() {
  return definePlugin({
    id: ID,
    version: VERSION,
    capabilities: [],
    admin: { entry: ADMIN_ENTRY, pages: ADMIN_PAGES },
  });
}

export default createPlugin;
