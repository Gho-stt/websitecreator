import { useState } from 'react';
import { useDocumentOperation, type DocumentActionComponent } from 'sanity';
import { defaultHome, defaultSettings } from '../../src/data/site';

// Typy elementów tablic muszą zgadzać się z nazwami w schemacie
const ARRAY_TYPES: Record<string, string> = {
  'services.items': 'usluga',
  'process.steps': 'krok',
  'pricing.packages': 'pakiet',
  'faq.items': 'pytanie',
};

const key = () => Math.random().toString(36).slice(2, 10);

/** Dodaje _key i _type do obiektów w tablicach (wymagane przez Sanity). */
function prepare(value: unknown, path = ''): unknown {
  if (Array.isArray(value)) {
    return value.map((item) =>
      item && typeof item === 'object'
        ? { _key: key(), _type: ARRAY_TYPES[path], ...(prepare(item, path) as object) }
        : item,
    );
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, prepare(v, path ? `${path}.${k}` : k)]),
    );
  }
  return value;
}

/** Akcja „Przywróć treści startowe” – nadpisuje pola tekstami z src/data/site.ts (jako szkic). */
export const RestoreDefaultsAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const [open, setOpen] = useState(false);

  const values =
    props.type === 'stronaGlowna' ? prepare(defaultHome) : props.type === 'ustawienia' ? { ...defaultSettings } : null;
  if (!values) return null;

  return {
    label: 'Przywróć treści startowe',
    tone: 'caution',
    onHandle: () => setOpen(true),
    dialog: open && {
      type: 'confirm',
      message:
        'Wszystkie pola tego dokumentu zostaną zastąpione tekstami startowymi. Na stronie nic się nie zmieni, dopóki nie klikniesz „Opublikuj”. Kontynuować?',
      onCancel: () => setOpen(false),
      onConfirm: () => {
        patch.execute([{ set: values as Record<string, unknown> }]);
        setOpen(false);
        props.onComplete();
      },
    },
  };
};
