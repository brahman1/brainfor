// The recipient is stored only in the Cloudflare production secret.
const reply = (body, status = 200) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
});

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return reply({ success: false }, 405);
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return reply({ success: false, code: 'origin' }, 403);
  if (!request.headers.get('Content-Type')?.includes('application/json')) return reply({ success: false }, 415);
  const destination = env.FORM_SUBMIT_DESTINATION || '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination) && !/^[a-zA-Z0-9_-]{16,128}$/.test(destination)) {
    return reply({ success: false, code: 'configuration' }, 503);
  }
  try {
    // Bound the body even when Content-Length is absent.
    const reader = request.body?.getReader();
    if (!reader) return reply({ success: false }, 400);
    const chunks = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 24000) { await reader.cancel(); return reply({ success: false }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const input = JSON.parse(new TextDecoder().decode(bytes));
    const clean = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
    const name = clean(input.name, 160);
    const email = clean(input.email, 254);
    const message = clean(input.message, 10000);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(email) || message.length < 20 || input._honey) {
      return reply({ success: false, code: 'validation' }, 400);
    }
    // Only these fields are forwarded; clients cannot set recipients or webhooks.
    const payload = {
      name, email, message,
      Entreprise: clean(input.Entreprise, 200),
      Téléphone: clean(input.Téléphone, 80),
      Services: clean(input.Services, 500),
      Budget: clean(input.Budget, 200),
      Échéance: clean(input.Échéance, 200),
      _replyto: email,
      _subject: '[Brainfor] Demande de projet — ' + name.replace(/[\r\n]/g, ' '),
      _template: 'table', _honey: '', _url: url.origin + '/'
    };
    const upstream = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(destination), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', Accept: 'application/json',
        Origin: url.origin, Referer: url.origin + '/'
      },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(15000)
    });
    const text = await upstream.text();
    let result;
    try { result = JSON.parse(text); } catch {
      console.warn('contact_provider_non_json', { status: upstream.status });
      return reply({ success: false, code: 'provider_unavailable' }, 502);
    }
    const providerMessage = String(result?.message || '');
    if (upstream.ok && /activat|confirm.{0,30}e.?mail|check.{0,30}e.?mail|verify.{0,30}e.?mail/i.test(providerMessage)) {
      return reply({ success: false, message: 'activation required' });
    }
    if (!upstream.ok || (result?.success !== true && result?.success !== 'true')) {
      let code = 'provider_rejected';
      if (/invalid.{0,40}email|email.{0,40}invalid|valid.{0,20}email/i.test(providerMessage)) code = 'invalid_email';
      else if (/referer|referrer|web.?server|file:\/\//i.test(providerMessage)) code = 'provider_origin';
      else if (/captcha|robot|bot|spam/i.test(providerMessage)) code = 'provider_protection';
      else if (upstream.status === 429 || /limit|too many/i.test(providerMessage)) code = 'rate_limited';
      // Log only a classification and HTTP status, never the message or addresses.
      console.warn('contact_provider_rejected', { status: upstream.status, code });
      return reply({ success: false, code }, 502);
    }
    return reply({ success: true });
  } catch (error) {
    // Never return provider messages, recipient addresses or submission data.
    const code = error?.name === 'TimeoutError' || error?.name === 'AbortError' ? 'provider_timeout' : 'provider_unavailable';
    console.warn('contact_provider_failed', { code });
    return reply({ success: false, code }, 502);
  }
}
