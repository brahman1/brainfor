// Cloudflare Email Service REST API. Credentials and recipient stay on the server.
const reply = (body, status = 200) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
});

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return reply({ success: false }, 405);
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return reply({ success: false, code: 'origin' }, 403);
  if (!request.headers.get('Content-Type')?.includes('application/json')) return reply({ success: false }, 415);
  // Keep the existing private recipient during migration; no FormSubmit request is made.
  const destination = env.CONTACT_RECIPIENT || env.FORM_SUBMIT_DESTINATION || '';
  const accountId = env.CLOUDFLARE_ACCOUNT_ID || '';
  const token = env.CLOUDFLARE_EMAIL_TOKEN || '';
  if (!/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(destination) || !/^[a-f0-9]{32}$/i.test(accountId) || !token) {
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
    const textBody = [
      'DEMANDE DE PROJET — Brainfor', '',
      'Nom : ' + name, 'Entreprise : ' + (clean(input.Entreprise, 200) || 'Non renseignée'),
      'E-mail : ' + email, 'Téléphone : ' + (clean(input.Téléphone, 80) || 'Non renseigné'), '',
      'Besoins : ' + (clean(input.Services, 500) || 'À définir ensemble'),
      'Budget indicatif : ' + (clean(input.Budget, 200) || 'À définir ensemble'),
      'Échéance souhaitée : ' + (clean(input.Échéance, 200) || 'À définir ensemble'), '',
      'LE PROJET', message, '',
      'Ce document est un brief préparatoire. Il ne constitue ni un devis ni une commande.'
    ].join('\n');
    const upstream = await fetch('https://api.cloudflare.com/client/v4/accounts/' + accountId + '/email/sending/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', Accept: 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({
        from: 'contact@brainfor.net', to: destination,
        reply_to: email,
        subject: '[Brainfor] Demande de projet — ' + name.replace(/[\r\n]/g, ' '),
        text: textBody
      }),
      signal: AbortSignal.timeout(15000)
    });
    const text = await upstream.text();
    let result;
    try { result = JSON.parse(text); } catch {
      console.warn('contact_provider_non_json', { status: upstream.status });
      return reply({ success: false, code: 'provider_unavailable' }, 502);
    }
    if (!upstream.ok || result?.success !== true) {
      let code = 'provider_rejected';
      const errorCodes = Array.isArray(result?.errors) ? result.errors.map(error => Number(error.code)) : [];
      if (errorCodes.includes(10105)) code = 'provider_access';
      else if (errorCodes.includes(10101) || errorCodes.includes(10103) || upstream.status === 401) code = 'provider_token';
      else if (errorCodes.includes(10102)) code = 'provider_permission';
      else if (errorCodes.includes(10203)) code = 'provider_disabled';
      else if (upstream.status === 403) code = 'provider_permission';
      else if (upstream.status === 404) code = 'provider_account';
      else if (upstream.status === 429) code = 'rate_limited';
      // Log only a classification and HTTP status, never the message or addresses.
      console.warn('contact_provider_rejected', { status: upstream.status, code });
      return reply({ success: false, code }, 502);
    }
    // Cloudflare success alone is insufficient: require acceptance of our fixed recipient.
    const delivered = result.result?.delivered;
    const queued = result.result?.queued;
    const matches = list => Array.isArray(list) && list.some(address => typeof address === 'string' && address.toLowerCase() === destination.toLowerCase());
    if (matches(delivered)) return reply({ success: true, status: 'delivered' });
    if (matches(queued)) return reply({ success: true, status: 'queued' });
    return reply({ success: false, code: 'provider_rejected' }, 502);
  } catch (error) {
    // Never return provider messages, recipient addresses or submission data.
    const code = error?.name === 'TimeoutError' || error?.name === 'AbortError' ? 'provider_timeout' : 'provider_unavailable';
    console.warn('contact_provider_failed', { code });
    return reply({ success: false, code }, 502);
  }
}
