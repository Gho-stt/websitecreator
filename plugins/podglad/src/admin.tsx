/**
 * Podgląd strony w panelu EmDash.
 * - pages["/"]: pełny podgląd z przełącznikiem urządzeń (szkic ze zmianami albo wersja opublikowana)
 * - contentEditorPanels: mini-podgląd sekcji w bocznym pasku edytora, odświeżany po każdym zapisie
 *
 * Szkic = strona renderowana w trybie edycji EmDash (ciasteczko emdash-edit-mode),
 * więc pokazuje zapisane, ale jeszcze nieopublikowane zmiany i pozwala edytować teksty w podglądzie.
 */
import * as React from 'react';

type Device = { id: string; label: string; width: number };
const DEVICES: Device[] = [
  { id: 'desktop', label: 'Komputer', width: 1440 },
  { id: 'tablet', label: 'Tablet', width: 820 },
  { id: 'phone', label: 'Telefon', width: 390 },
];

/** Kolekcja → sekcja strony, do której przewija mini-podgląd. */
const SECTION: Record<string, string> = {
  strona: 'top',
  uslugi: 'uslugi',
  kroki: 'proces',
  pakiety: 'cennik',
  faq: 'faq',
  dane_firmy: 'kontakt',
};

function setDraftMode(on: boolean) {
  document.cookie = on
    ? 'emdash-edit-mode=true;path=/;samesite=lax'
    : 'emdash-edit-mode=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

const ui = {
  bar: { display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', gap: 8 },
  group: { display: 'inline-flex', border: '1px solid rgba(127,127,127,.35)', borderRadius: 8, overflow: 'hidden' },
  seg: (active: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    fontSize: 13,
    border: 0,
    cursor: 'pointer',
    background: active ? 'rgba(59,130,246,.15)' : 'transparent',
    color: active ? 'rgb(37,99,235)' : 'inherit',
    fontWeight: active ? 600 : 400,
  }),
  btn: {
    padding: '6px 12px',
    fontSize: 13,
    borderRadius: 8,
    border: '1px solid rgba(127,127,127,.35)',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    textDecoration: 'none',
  } as React.CSSProperties,
  frameBox: {
    position: 'relative' as const,
    overflow: 'hidden',
    borderRadius: 10,
    border: '1px solid rgba(127,127,127,.3)',
    background: '#0e0f11',
  },
  muted: { fontSize: 12, opacity: 0.7 },
};

/** Ramka z podglądem: renderuje stronę w szerokości urządzenia i skaluje ją do dostępnego miejsca. */
type FrameProps = {
  src: string;
  width: number;
  height: number;
  reloadKey: string;
  /** ID wpisu: po załadowaniu przewiń do jego elementu na stronie i podświetl go */
  focusId?: string;
  /** Ukryj pasek EmDash w podglądzie (mini-podgląd jest za mały) */
  hideToolbar?: boolean;
};

function Frame({ src, width, height, reloadKey, focusId, hideToolbar }: FrameProps) {
  const box = React.useRef<HTMLDivElement>(null);
  const [avail, setAvail] = React.useState(0);

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setAvail(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = avail ? Math.min(1, avail / width) : 1;

  // Ta sama domena → mamy dostęp do dokumentu w ramce
  const onLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const doc = e.currentTarget.contentDocument;
    if (!doc) return;
    if (hideToolbar) {
      const st = doc.createElement('style');
      st.textContent = '#emdash-toolbar{display:none!important}';
      doc.head.appendChild(st);
    }
    if (focusId) {
      const el = Array.from(doc.querySelectorAll<HTMLElement>('[data-emdash-ref]')).find((n) => {
        try {
          const ref = JSON.parse(n.getAttribute('data-emdash-ref') || '{}');
          return ref.id === focusId && !ref.field;
        } catch {
          return false;
        }
      });
      if (el) {
        el.classList.add('is-visible'); // od razu pokaż element z animacją „wjazdu”
        el.scrollIntoView({ block: 'center' });
        el.style.outline = '3px solid rgb(59,130,246)';
        el.style.outlineOffset = '4px';
      }
    }
  };
  return (
    <div ref={box} style={{ ...ui.frameBox, height }}>
      {avail > 0 && (
        <iframe
          key={reloadKey}
          src={src}
          onLoad={onLoad}
          title="Podgląd strony"
          style={{
            width,
            height: height / scale,
            border: 0,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            position: 'absolute',
            left: Math.max(0, (avail - width * scale) / 2),
            top: 0,
          }}
        />
      )}
    </div>
  );
}

function PreviewPage() {
  const [device, setDevice] = React.useState<Device>(DEVICES[0]);
  const [draft, setDraft] = React.useState(true);
  const [nonce, setNonce] = React.useState(() => String(Date.now()));
  const [height, setHeight] = React.useState(() => Math.max(480, window.innerHeight - 230));

  React.useEffect(() => {
    const onResize = () => setHeight(Math.max(480, window.innerHeight - 230));
    const onFocus = () => setNonce(String(Date.now())); // wracasz z edycji w innej karcie → świeży podgląd
    window.addEventListener('resize', onResize);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  setDraftMode(draft);
  const src = draft ? '/?_edit=1' : '/';

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ ...ui.bar, justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Podgląd strony / edycja live</h1>
          <p style={ui.muted}>
            {draft
              ? 'Szkic: widać zapisane, jeszcze nieopublikowane zmiany. Włącz „Tryb edycji” na pasku w podglądzie, żeby klikać i poprawiać teksty.'
              : 'Wersja opublikowana: tak stronę widzą teraz odwiedzający.'}
          </p>
        </div>
        <div style={ui.bar}>
          <div style={ui.group} role="group" aria-label="Urządzenie">
            {DEVICES.map((d) => (
              <button key={d.id} type="button" style={ui.seg(d.id === device.id)} aria-pressed={d.id === device.id} onClick={() => setDevice(d)}>
                {d.label}
              </button>
            ))}
          </div>
          <div style={ui.group} role="group" aria-label="Wersja">
            <button type="button" style={ui.seg(draft)} aria-pressed={draft} onClick={() => { setDraft(true); setNonce(String(Date.now())); }}>
              Szkic
            </button>
            <button type="button" style={ui.seg(!draft)} aria-pressed={!draft} onClick={() => { setDraft(false); setNonce(String(Date.now())); }}>
              Opublikowana
            </button>
          </div>
          <button type="button" style={ui.btn} onClick={() => setNonce(String(Date.now()))}>
            Odśwież
          </button>
          <a style={ui.btn} href={src} target="_blank" rel="noreferrer">
            Otwórz w nowej karcie ↗
          </a>
        </div>
      </div>
      <Frame src={src} width={device.width} height={height} reloadKey={`${nonce}-${draft}-${device.id}`} />
    </section>
  );
}

type PanelProps = { collection: string; entry: { id: string; updatedAt?: string; draftRevisionId?: string | null; liveRevisionId?: string | null } };

function PreviewPanel({ collection, entry }: PanelProps) {
  const section = SECTION[collection] ?? 'top';
  // Po zapisie / autozapisie / publikacji zmienia się updatedAt lub rewizja → przeładuj podgląd (z lekkim opóźnieniem)
  const version = `${entry.updatedAt ?? ''}|${entry.draftRevisionId ?? ''}|${entry.liveRevisionId ?? ''}`;
  const [key, setKey] = React.useState(version);
  React.useEffect(() => {
    const t = setTimeout(() => setKey(version), 700);
    return () => clearTimeout(t);
  }, [version]);

  setDraftMode(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Frame src={`/?_edit=1#${section}`} width={390} height={440} reloadKey={key} focusId={entry.id} hideToolbar />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={ui.muted}>Szkic, widok telefonu. Odświeża się po zapisie.</span>
        <a style={{ ...ui.btn, padding: '4px 10px', fontSize: 12 }} href="/_emdash/admin/plugins/podglad/">
          Pełny podgląd
        </a>
      </div>
    </div>
  );
}

export const pages = { '/': PreviewPage };

export const contentEditorPanels = [
  {
    id: 'podglad-sekcji',
    title: 'Podgląd / edycja live',
    component: PreviewPanel,
    collections: Object.keys(SECTION),
    order: 1,
  },
];
