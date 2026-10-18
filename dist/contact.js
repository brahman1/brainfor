(() => {
  'use strict';
  const fail = (code, message) => Object.assign(new Error(message), {code});
  async function send(details, fetcher = globalThis.fetch, timeoutMs = 20000) {
    const config = window.STUDIO_CONFIG || {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const destination = config.formSubmitId || config.email || '';
    if (config.contactProvider !== 'formsubmit' || (!/^[a-zA-Z0-9_-]{16,128}$/.test(destination) && !emailPattern.test(destination))) throw fail('configuration', 'Réception non configurée.');
    if (!emailPattern.test(details.email || '') || !String(details.name || '').trim() || String(details.message || '').trim().length < 20 || details.honey) throw fail('validation', 'Demande non valide.');
    const payload = {
      name: String(details.name).trim(), email: String(details.email).trim(),
      Entreprise: details.company || 'Non renseignée', Téléphone: details.phone || 'Non renseigné',
      Services: details.services || 'À définir ensemble', Budget: details.budget || 'À définir ensemble',
      Échéance: details.timeline || 'À définir ensemble', message: String(details.message).trim(),
      _replyto: String(details.email).trim(), _subject: '[Brainfor] Demande de projet — ' + String(details.name).trim(),
      _template: 'table', _honey: '', _url: details.source || ''
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetcher('https://formsubmit.co/ajax/' + encodeURIComponent(destination), {
        method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload), credentials:'omit', signal:controller.signal
      });
      const body = await response.json();
      if (!response.ok) throw fail('rejected', 'Le service n’a pas confirmé la prise en charge.');
      if (/activat|confirm.{0,30}e.?mail|check.{0,30}e.?mail|verify.{0,30}e.?mail/i.test(String(body.message || ''))) return {status:'activation'};
      if (body.success !== true && body.success !== 'true') throw fail('rejected', 'Le service n’a pas accepté la demande.');
      return {status:'accepted'};
    } catch (error) {
      if (error.code) throw error;
      throw fail('uncertain', 'L’envoi n’a pas pu être confirmé.');
    } finally { clearTimeout(timer); }
  }
  window.BRAINFOR_CONTACT = Object.freeze({send});
})();
