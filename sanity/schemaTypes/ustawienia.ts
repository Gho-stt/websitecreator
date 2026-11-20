import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons/Cog';
import { defaultSettings } from '../../src/data/site';

export const ustawienia = defineType({
  name: 'ustawienia',
  title: 'Dane firmy',
  type: 'document',
  icon: CogIcon,
  initialValue: { ...defaultSettings },
  groups: [
    { name: 'marka', title: 'Marka', default: true },
    { name: 'kontakt', title: 'Kontakt' },
    { name: 'firma', title: 'Dane do faktur i RODO' },
  ],
  fields: [
    defineField({ name: 'brand', title: 'Nazwa marki', type: 'string', group: 'marka', description: 'Wyświetlana obok logo w nagłówku.', validation: (r) => r.required().max(40) }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', group: 'marka', description: 'Najlepiej kwadratowe, PNG lub SVG. Gdy puste, wyświetlane są inicjały.', options: { accept: 'image/png,image/svg+xml,image/webp' } }),
    defineField({ name: 'logoInitials', title: 'Inicjały w logo', type: 'string', group: 'marka', description: 'Używane, gdy nie ma wgranego logo (maks. 3 znaki).', validation: (r) => r.max(3) }),
    defineField({ name: 'owner', title: 'Imię i nazwisko', type: 'string', group: 'marka', validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'E-mail', type: 'string', group: 'kontakt', validation: (r) => r.required().email() }),
    defineField({ name: 'phone', title: 'Telefon', type: 'string', group: 'kontakt', description: 'Np. +48 600 100 200', validation: (r) => r.required().regex(/^[+0-9 ()-]{9,20}$/, { name: 'telefon' }) }),
    defineField({ name: 'city', title: 'Miasto', type: 'string', group: 'kontakt' }),
    defineField({ name: 'companyName', title: 'Pełna nazwa firmy', type: 'string', group: 'firma', description: 'Pojawia się w zgodzie RODO i polityce prywatności.' }),
    defineField({ name: 'nip', title: 'NIP', type: 'string', group: 'firma' }),
    defineField({ name: 'address', title: 'Adres firmy', type: 'string', group: 'firma' }),
  ],
  preview: { prepare: () => ({ title: 'Dane firmy' }) },
});
