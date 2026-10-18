(() => {
  'use strict';
  const fail = (code, message) => Object.assign(new Error(message), { code });
  async function send(details, fetcher = globalThis.fetch, timeoutMs = 20000) {
    const config = window.STUDIO_CONFIG || {};
    if (config.contactProvider !== 'cloudflare' || config.contactEndpoint !== '/api/contact') throw fail('configuration', 'Réception non configurée.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email || '') || !String(details.name || '').trim() || String(details.message || '').trim().length < 20 || details.honey) throw fail('validation', 'Demande non valide.');
    const payload = {
      name: String(details.name).trim(), email: String(details.email).trim(),
      Entreprise: details.company || '', Téléphone: details.phone || '',
      Services: details.services || '', Budget: details.budget || '',
      Échéance: details.timeline || '', message: String(details.message).trim(), _honey: details.honey || ''
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetcher('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload), credentials: 'omit', signal: controller.signal
      });
      const body = await response.json();
      const knownCodes = ['origin', 'configuration', 'validation', 'invalid_email', 'rate_limited', 'provider_timeout', 'provider_unavailable', 'provider_rejected', 'provider_access', 'provider_token', 'provider_permission', 'provider_disabled', 'provider_account'];
      if (!response.ok || body.success !== true) throw fail(knownCodes.includes(body.code) ? body.code : 'provider_rejected', 'L’envoi n’a pas été accepté.');
      if (body.status !== 'delivered' && body.status !== 'queued') throw fail('uncertain', 'L’envoi n’a pas pu être confirmé.');
      return { status: body.status };
    } catch (error) {
      if (error.code) throw error;
      throw fail('uncertain', 'L’envoi n’a pas pu être confirmé.');
    } finally { clearTimeout(timer); }
  }
  window.BRAINFOR_CONTACT = Object.freeze({ send });
})();
