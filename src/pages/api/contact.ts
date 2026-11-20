import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

// Ten endpoint działa na żądanie (Cloudflare Worker), reszta strony jest statyczna.
export const prerender = false;

type Env = {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Pakiety pochodzą z panelu, więc przyjmujemy dowolny identyfikator w bezpiecznym formacie.
const packageLabel = (id: string) =>
  /^[a-z0-9-]{1,60}$/.test(id) ? id.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()) : 'nie podano';

export const POST: APIRoute = async ({ request, redirect }) => {
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  const reply = (status: number, error?: string) =>
    wantsJson
      ? new Response(JSON.stringify(error ? { error } : { ok: true }), {
          status,
          headers: { 'Content-Type': 'application/json' },
        })
      : redirect(error ? '/?blad=1#kontakt' : '/dziekuje', 303);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(400, 'Nieprawidłowe dane formularza.');
  }

  const get = (key: string) => String(form.get(key) ?? '').trim();

  // Honeypot – boty wypełniają ukryte pole; udajemy sukces.
  if (get('website')) return reply(200);

  const name = get('name').slice(0, 120);
  const email = get('email').slice(0, 200);
  const message = get('message').slice(0, 5000);
  const pkg = packageLabel(get('package'));
  const consent = get('consent') === 'tak';

  if (!name || !EMAIL_RE.test(email) || message.length < 10) {
    return reply(422, 'Uzupełnij imię, poprawny e-mail i wiadomość (min. 10 znaków).');
  }
  if (!consent) {
    return reply(422, 'Zaznacz zgodę na przetwarzanie danych, żebym mógł odpowiedzieć.');
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = env as unknown as Env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    console.error('Brak konfiguracji: RESEND_API_KEY / CONTACT_TO / CONTACT_FROM');
    return reply(500, 'Formularz jest chwilowo niedostępny. Napisz proszę bezpośrednio na e-mail.');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `Nowe zapytanie: ${pkg} – ${name}`,
      text: [
        `Imię i nazwisko: ${name}`,
        `E-mail: ${email}`,
        `Pakiet: ${pkg}`,
        `Zgoda RODO: tak (${new Date().toISOString()})`,
        '',
        message,
      ].join('\n'),
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return reply(502, 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz na e-mail.');
  }

  return reply(200);
};
