// Kolekcja „na żywo” EmDash – treść pobierana przy żądaniu, bez przebudowy strony.
import { defineLiveCollection } from 'astro:content';
import { emdashLoader } from 'emdash/runtime';

export const collections = {
  _emdash: defineLiveCollection({ loader: emdashLoader() }),
};
