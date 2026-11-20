import { defineArrayMember, defineField, defineType } from 'sanity';
// @sanity/icons v5: każda ikona z własnej ścieżki
import { HomeIcon } from '@sanity/icons/Home';
import { ComponentIcon } from '@sanity/icons/Component';
import { TagIcon } from '@sanity/icons/Tag';
import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { EnvelopeIcon } from '@sanity/icons/Envelope';
import { ListIcon } from '@sanity/icons/List';
import { defaultHome, serviceIcons } from '../../src/data/site';

const text = (name: string, title: string, opts: { rows?: number; max?: number; description?: string } = {}) =>
  defineField({
    name,
    title,
    type: opts.rows ? 'text' : 'string',
    ...(opts.rows ? { rows: opts.rows } : {}),
    description: opts.description,
    validation: (r) => (opts.max ? r.required().max(opts.max) : r.required()),
  });

export const stronaGlowna = defineType({
  name: 'stronaGlowna',
  title: 'Strona główna',
  type: 'document',
  icon: HomeIcon,
  initialValue: JSON.parse(JSON.stringify(defaultHome)),
  groups: [
    { name: 'hero', title: 'Nagłówek', icon: HomeIcon, default: true },
    { name: 'uslugi', title: 'Usługi', icon: ComponentIcon },
    { name: 'proces', title: 'Jak pracuję', icon: ListIcon },
    { name: 'cennik', title: 'Cennik', icon: TagIcon },
    { name: 'faq', title: 'FAQ', icon: HelpCircleIcon },
    { name: 'kontakt', title: 'Kontakt', icon: EnvelopeIcon },
    { name: 'seo', title: 'Google (SEO)' },
  ],
  fields: [
    defineField({
      name: 'hero', title: 'Nagłówek strony', type: 'object', group: 'hero',
      options: { collapsible: false },
      fields: [
        text('eyebrow', 'Mały napis nad tytułem', { max: 60 }),
        text('title', 'Główny tytuł', { rows: 2, max: 90, description: 'Najważniejsze zdanie na stronie. Najlepiej do 70 znaków.' }),
        text('lead', 'Opis pod tytułem', { rows: 4, max: 280 }),
        text('ctaPrimary', 'Tekst głównego przycisku', { max: 30 }),
        text('ctaSecondary', 'Tekst drugiego przycisku', { max: 30 }),
      ],
    }),
    defineField({
      name: 'services', title: 'Sekcja: Usługi', type: 'object', group: 'uslugi',
      options: { collapsible: false },
      fields: [
        text('title', 'Tytuł sekcji', { rows: 2, max: 90 }),
        defineField({
          name: 'items', title: 'Usługi', type: 'array', validation: (r) => r.min(1).max(8),
          description: 'Przeciągaj, żeby zmienić kolejność.',
          of: [defineArrayMember({
            type: 'object', name: 'usluga', title: 'Usługa',
            fields: [
              text('title', 'Nazwa usługi', { max: 40 }),
              text('text', 'Krótki opis', { rows: 3, max: 160 }),
              defineField({
                name: 'icon', title: 'Ikona', type: 'string', initialValue: 'okno',
                options: { list: Object.entries(serviceIcons).map(([value, i]) => ({ value, title: i.label })), layout: 'radio' },
              }),
            ],
            preview: { select: { title: 'title', subtitle: 'text' } },
          })],
        }),
      ],
    }),
    defineField({
      name: 'process', title: 'Sekcja: Jak pracuję', type: 'object', group: 'proces',
      options: { collapsible: false },
      fields: [
        text('title', 'Tytuł sekcji', { rows: 2, max: 90 }),
        defineField({
          name: 'steps', title: 'Kroki', type: 'array', validation: (r) => r.min(2).max(6),
          of: [defineArrayMember({
            type: 'object', name: 'krok', title: 'Krok',
            fields: [text('title', 'Nazwa kroku', { max: 30 }), text('text', 'Opis', { rows: 3, max: 180 })],
            preview: { select: { title: 'title', subtitle: 'text' } },
          })],
        }),
      ],
    }),
    defineField({
      name: 'pricing', title: 'Sekcja: Cennik', type: 'object', group: 'cennik',
      options: { collapsible: false },
      fields: [
        text('title', 'Tytuł sekcji', { max: 80 }),
        text('intro', 'Opis pod tytułem', { rows: 3, max: 240 }),
        defineField({
          name: 'packages', title: 'Pakiety', type: 'array', validation: (r) => r.min(1).max(4),
          of: [defineArrayMember({
            type: 'object', name: 'pakiet', title: 'Pakiet',
            fields: [
              text('name', 'Nazwa pakietu', { max: 30 }),
              text('lead', 'Jedno zdanie opisu', { max: 60 }),
              text('price', 'Cena (od)', { max: 20, description: 'Np. „1 500 zł”. Słowo „od” dodaje się automatycznie.' }),
              defineField({ name: 'features', title: 'Co zawiera', type: 'array', of: [{ type: 'string' }], validation: (r) => r.min(1).max(8) }),
              defineField({ name: 'featured', title: 'Wyróżnij jako „najczęściej wybierany”', type: 'boolean', initialValue: false }),
            ],
            preview: {
              select: { title: 'name', price: 'price', featured: 'featured' },
              prepare: ({ title, price, featured }) => ({ title: `${title}${featured ? ' ★' : ''}`, subtitle: `od ${price}` }),
            },
          })],
        }),
        text('note', 'Dopisek pod cennikiem', { rows: 2, max: 200 }),
      ],
    }),
    defineField({
      name: 'faq', title: 'Sekcja: FAQ', type: 'object', group: 'faq',
      options: { collapsible: false },
      fields: [
        text('title', 'Tytuł sekcji', { max: 60 }),
        defineField({
          name: 'items', title: 'Pytania i odpowiedzi', type: 'array', validation: (r) => r.max(12),
          of: [defineArrayMember({
            type: 'object', name: 'pytanie', title: 'Pytanie',
            fields: [text('q', 'Pytanie', { max: 120 }), text('a', 'Odpowiedź', { rows: 4, max: 600 })],
            preview: { select: { title: 'q', subtitle: 'a' } },
          })],
        }),
      ],
    }),
    defineField({
      name: 'contact', title: 'Sekcja: Kontakt', type: 'object', group: 'kontakt',
      description: 'E-mail i telefon zmienisz w „Dane firmy”.',
      options: { collapsible: false },
      fields: [
        text('title', 'Tytuł sekcji', { rows: 2, max: 80 }),
        text('intro', 'Opis pod tytułem', { rows: 3, max: 200 }),
        text('area', 'Obszar działania (po nazwie miasta)', { max: 60 }),
      ],
    }),
    defineField({
      name: 'seo', title: 'Wygląd w Google', type: 'object', group: 'seo',
      options: { collapsible: false },
      fields: [
        text('title', 'Tytuł w wynikach wyszukiwania', { max: 65, description: 'Do 60 znaków, żeby Google go nie uciął.' }),
        text('description', 'Opis w wynikach wyszukiwania', { rows: 3, max: 170, description: '120–160 znaków.' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Strona główna' }) },
});
