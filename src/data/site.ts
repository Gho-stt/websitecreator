/**
 * Domyślne treści strony.
 * - Gdy Sanity jest skonfigurowane, treści z panelu /admin nadpisują te wartości.
 * - Te same wartości są startowymi wartościami formularzy w panelu.
 * Pola w [NAWIASACH] to placeholdery do uzupełnienia.
 */

export type ServiceIcon = 'okno' | 'siatka' | 'koszyk' | 'lupa' | 'rakieta' | 'tarcza';

export const serviceIcons: Record<ServiceIcon, { label: string; svg: string }> = {
  okno: { label: 'Okno strony', svg: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>' },
  siatka: { label: 'Siatka podstron', svg: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>' },
  koszyk: { label: 'Koszyk', svg: '<path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>' },
  lupa: { label: 'Lupa (SEO)', svg: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>' },
  rakieta: { label: 'Rakieta', svg: '<path d="M5 15c-1 1-2 4-2 6 2 0 5-1 6-2"/><path d="M9 15l-3-3c2-5 6-9 12-9 0 6-4 10-9 12z"/><circle cx="15" cy="9" r="1.5"/>' },
  tarcza: { label: 'Tarcza (bezpieczeństwo)', svg: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>' },
};

export type Settings = {
  brand: string;
  logoInitials: string;
  logoUrl?: string;
  owner: string;
  companyName: string;
  nip: string;
  address: string;
  city: string;
  email: string;
  phone: string;
};

export type Package = { name: string; lead: string; price: string; features: string[]; featured?: boolean };

export type HomeContent = {
  hero: { eyebrow: string; title: string; lead: string; ctaPrimary: string; ctaSecondary: string };
  services: { title: string; items: { title: string; text: string; icon: ServiceIcon }[] };
  process: { title: string; steps: { title: string; text: string }[] };
  pricing: { title: string; intro: string; packages: Package[]; note: string };
  faq: { title: string; items: { q: string; a: string }[] };
  contact: { title: string; intro: string; area: string };
  seo: { title: string; description: string };
};

export const defaultSettings: Settings = {
  brand: 'kacper.dev',
  logoInitials: 'KB',
  owner: 'Kacper Bukalak',
  companyName: '[NAZWA FIRMY]',
  nip: '[NIP]',
  address: '[ADRES FIRMY]',
  city: '[MIASTO]',
  email: 'kontakt@twojadomena.pl',
  phone: '+48 000 000 000',
};

export const defaultHome: HomeContent = {
  hero: {
    eyebrow: 'projektuję i koduję strony www',
    title: 'Strona, która pracuje na Twoją firmę. Nie tylko ładnie wygląda.',
    lead: 'Tworzę szybkie, nowoczesne strony dla małych firm i freelancerów — od wizytówki po sklep. Projekt, teksty, wdrożenie i domena w jednych rękach. Ty akceptujesz, ja robię resztę.',
    ctaPrimary: 'Bezpłatna wycena',
    ctaSecondary: 'Zobacz cennik',
  },
  services: {
    title: 'Wszystko, czego potrzebujesz, żeby zaistnieć w sieci',
    items: [
      { title: 'Strony wizytówki', text: 'Onepage z ofertą, kontaktem i formularzem. Idealny start dla firmy usługowej.', icon: 'okno' },
      { title: 'Strony firmowe', text: 'Kilka podstron, blog i panel do samodzielnej edycji treści — bez znajomości kodu.', icon: 'siatka' },
      { title: 'Sklepy internetowe', text: 'Sklep na Shopify lub WooCommerce z płatnościami, dostawą i integracjami.', icon: 'koszyk' },
      { title: 'SEO i opieka', text: 'Widoczność w Google, aktualizacje, kopie zapasowe i szybkie poprawki po starcie.', icon: 'lupa' },
    ],
  },
  process: {
    title: 'Cztery kroki od rozmowy do gotowej strony',
    steps: [
      { title: 'Brief', text: 'Krótka rozmowa lub formularz: czym się zajmujesz, kto jest klientem, co ma się wydarzyć na stronie.' },
      { title: 'Projekt', text: 'Pokazuję szkic wyglądu i teksty. Poprawiamy, aż będzie dokładnie tak, jak chcesz.' },
      { title: 'Budowa', text: 'Koduję stronę, testuję na telefonach i komputerach, dbam o szybkość i SEO.' },
      { title: 'Start', text: 'Podpinam domenę, publikuję i pokazuję, jak korzystać ze strony. Zostaję w kontakcie.' },
    ],
  },
  pricing: {
    title: 'Jasne ceny, bez niespodzianek',
    intro: 'Podane kwoty to ceny startowe netto. Dokładną wycenę dostajesz po krótkiej rozmowie — za darmo i bez zobowiązań.',
    packages: [
      { name: 'Onepage', lead: 'Wizytówka firmy na jednej stronie', price: '1 500 zł', features: ['do 6 sekcji', 'formularz kontaktowy + RODO', 'wersja mobilna', 'podstawowe SEO', 'gotowe w ok. 7 dni'] },
      { name: 'Strona firmowa', lead: 'Kilka podstron i samodzielna edycja', price: '3 500 zł', features: ['do 8 podstron + blog', 'panel do edycji treści', 'teksty sprzedażowe', 'SEO i analityka', 'gotowe w ok. 3 tygodnie'], featured: true },
      { name: 'Sklep internetowy', lead: 'Sprzedaż online od pierwszego dnia', price: '6 000 zł', features: ['Shopify lub WooCommerce', 'płatności i dostawy', 'import produktów', 'regulamin i RODO', 'szkolenie z obsługi'] },
    ],
    note: 'Opieka techniczna po starcie: od 150 zł / mies. · Hosting i domena — pomogę wybrać i skonfigurować.',
  },
  faq: {
    title: 'Częste pytania',
    items: [
      { q: 'Ile trwa zrobienie strony?', a: 'Onepage zwykle około tygodnia, strona firmowa 2–4 tygodnie. Najwięcej zależy od tempa akceptacji i dostarczenia materiałów.' },
      { q: 'Nie mam tekstów ani zdjęć. Co teraz?', a: 'Żaden problem — napiszę teksty na podstawie rozmowy i dobiorę zdjęcia. Ty tylko akceptujesz.' },
      { q: 'Czy sam będę mógł zmieniać treści?', a: 'Tak, w pakiecie „Strona firmowa” dostajesz prosty panel do edycji tekstów, zdjęć i wpisów na blogu.' },
      { q: 'Jak wygląda płatność?', a: '50% zaliczki na start i 50% po akceptacji gotowej strony. Wystawiam fakturę.' },
    ],
  },
  contact: {
    title: 'Porozmawiajmy o Twojej stronie',
    intro: 'Opisz w kilku zdaniach, czego potrzebujesz. Odpowiadam w ciągu 24 godzin w dni robocze.',
    area: 'i zdalnie w całej Polsce',
  },
  seo: {
    title: 'Kacper Bukalak – strony internetowe dla firm',
    description:
      'Projektuję i koduję szybkie strony internetowe dla małych firm: wizytówki, strony firmowe i sklepy. Projekt, teksty i wdrożenie w jednych rękach.',
  },
};

export const nav = [
  { href: '#uslugi', label: 'Usługi' },
  { href: '#proces', label: 'Jak pracuję' },
  { href: '#cennik', label: 'Cennik' },
  { href: '#faq', label: 'FAQ' },
];

/** Identyfikator pakietu do formularza (np. „Strona firmowa” → „strona-firmowa”). */
export const packageId = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
