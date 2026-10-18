(() => {
  'use strict';
  const config = window.STUDIO_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = text => String(text ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const dialog = $('#detail-dialog');
  const content = $('#dialog-content');
  let returnFocus;
  let contactSending = false;
  let toastTimer;
  function toast(message) { const node = $('.toast'); node.textContent = message; node.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('visible'), 4000); }
  function openDialog(html) { returnFocus = document.activeElement; content.innerHTML = html; dialog.showModal(); document.body.classList.add('modal-open'); dialog.scrollTop = 0; $('.dialog-close').focus(); }
  function closeDialog() { if (!contactSending) dialog.close(); }
  dialog.addEventListener('cancel', event => { if (contactSending) event.preventDefault(); });
  $('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); returnFocus?.focus(); });
  const menu = $('.menu-toggle');
  menu.addEventListener('click', () => { const expanded = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(expanded)); menu.setAttribute('aria-label', expanded ? 'Fermer le menu' : 'Ouvrir le menu'); $('.nav').classList.toggle('open', expanded); });
  $$('.nav a').forEach(link => link.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Ouvrir le menu'); $('.nav').classList.remove('open'); }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { menu.click(); menu.focus(); } });
  $('#year').textContent = new Date().getFullYear();
  $$('.language-switch a').forEach(link => link.addEventListener('click', () => {
    if (window.location.hash) link.hash = window.location.hash;
  }));
  const services = {
    web: { title:'Sites & applications web', description:'Votre présence en ligne doit servir un objectif : vous faire connaître, vendre ou simplifier un service. Nous construisons une expérience cohérente, de la première visite aux actions essentielles.', deliverables:['Site vitrine et catalogue de services','Boutique en ligne et parcours de commande','Portail client ou application métier','Interface adaptée au mobile et à l’ordinateur','Structure SEO et contenus accessibles','Mise en ligne et documentation'], note:'Paiements, hébergement, noms de domaine et services tiers sont étudiés et chiffrés selon les besoins. Les intégrations dépendent de leur disponibilité et de leurs conditions.', choice:'Site ou application web' },
    mobile: { title:'Applications mobiles', description:'Réservation, livraison, espace client ou outil terrain : mettez votre service au plus près de vos utilisateurs avec une application agréable et adaptée à leurs usages.', deliverables:['Parcours et maquettes interactives','Application Android et iOS selon le périmètre','Connexion à vos services et API','Notifications et fonctions natives selon besoin','Tests sur les usages et appareils ciblés','Préparation à la publication sur les stores'], note:'Comptes développeur, validation des stores et éventuels frais tiers sont précisés dans la proposition. Le fonctionnement hors connexion est défini au cadrage.', choice:'Application mobile' },
    desktop: { title:'Logiciels de bureau', description:'Votre logiciel s’adapte à votre métier : suivi de stock, facturation, gestion documentaire, reporting ou opérations internes. L’objectif est de rendre vos tâches essentielles plus simples.', deliverables:['Analyse de votre fonctionnement métier','Interface bureau et workflows adaptés','Gestion des données et des accès','Import et export selon les formats convenus','Mode hors connexion si le besoin s’y prête','Installation, documentation et prise en main'], note:'Les plateformes, les modalités de sauvegarde et les éventuelles exigences métier sont définies ensemble avant le développement.', choice:'Logiciel de bureau' },
    custom: { title:'Solutions sur mesure', description:'Vos outils ne communiquent pas ? Une tâche prend trop de temps ? Votre idée demande un développement spécifique ? Nous étudions le bon assemblage technique pour votre besoin.', deliverables:['API et connexions entre vos outils','Automatisation de tâches répétitives','Tableaux de bord et traitement de données','Intégrations IA avec validation des résultats','Audit et évolution d’une application existante','Documentation et transfert de compétences'], note:'Les accès aux API, les coûts d’usage, la confidentialité des données et les limites des systèmes tiers sont analysés au cadrage.', choice:'Solution sur mesure' }
  };
  $$('[data-service]').forEach(button => button.addEventListener('click', () => { const service = services[button.dataset.service]; openDialog(`<p class="dialog-eyebrow">NOS EXPERTISES / DÉVELOPPEMENT SUR MESURE</p><h2 class="dialog-title" id="dialog-title">${service.title}</h2><p class="dialog-description">${service.description}</p><ul class="deliverables">${service.deliverables.map(item => `<li>${item}</li>`).join('')}</ul><p class="dialog-note">${service.note}</p><div class="dialog-actions"><button class="button primary" id="service-contact">Discuter de ce besoin ↗</button></div>`); $('#service-contact').addEventListener('click', () => { const choice = $$('input[name="services"]').find(input => input.value === service.choice); if (choice) choice.checked = true; closeDialog(); $('#contact').scrollIntoView({behavior: 'smooth'}); setTimeout(() => $('input[name="name"]').focus({preventScroll:true}), 350); }); }));
  const orders = [ {id:'CMD-024',name:'Équipement bureau',status:'Livrée',amount:24500}, {id:'CMD-023',name:'Fournitures',status:'Livrée',amount:18200}, {id:'CMD-022',name:'Accessoires',status:'En cours',amount:9800}, {id:'CMD-021',name:'Matériel informatique',status:'En cours',amount:67500}, {id:'CMD-020',name:'Mobilier',status:'Livrée',amount:32000} ];
  const money = value => new Intl.NumberFormat('fr-DZ').format(value) + ' DA';
  function openGestion() {
    openDialog(`<p class="dialog-eyebrow">CONCEPT INTERACTIF · DONNÉES FICTIVES</p><h2 class="dialog-title" id="dialog-title">Flux. Tout voir, simplement.</h2><p class="dialog-description">Un exemple de tableau de bord pour une PME. Recherchez une commande ou filtrez son statut pour essayer l’interface.</p><div class="demo-panel"><div class="demo-toolbar"><input id="order-search" aria-label="Rechercher une commande" placeholder="Rechercher un produit ou un n°…"><div class="demo-filters" aria-label="Statut des commandes"><button class="active" data-filter="Toutes" aria-pressed="true">Toutes</button><button data-filter="Livrée" aria-pressed="false">Livrées</button><button data-filter="En cours" aria-pressed="false">En cours</button></div></div><div class="demo-table-wrap"><table class="demo-table"><thead><tr><th>COMMANDE</th><th>LIBELLÉ</th><th>STATUT</th><th>MONTANT</th></tr></thead><tbody id="orders-body"></tbody></table></div><p class="demo-total" aria-live="polite" id="orders-total"></p></div><p class="dialog-note">Cette démonstration ne représente pas un logiciel livré à un client. Aucune donnée réelle n’est utilisée ni modifiée.</p><div class="dialog-actions"><button class="button primary" id="demo-contact">Imaginer mon outil métier ↗</button></div>`);
    let filter = 'Toutes';
    const render = () => { const query = $('#order-search').value.toLocaleLowerCase('fr'); const visible = orders.filter(order => (filter === 'Toutes' || order.status === filter) && `${order.id} ${order.name}`.toLocaleLowerCase('fr').includes(query)); $('#orders-body').innerHTML = visible.length ? visible.map(order => `<tr><td>${order.id}</td><td>${order.name}</td><td><span class="demo-pill ${order.status === 'En cours' ? 'wait' : ''}">${order.status}</span></td><td>${money(order.amount)}</td></tr>`).join('') : '<tr><td colspan="4">Aucune commande correspondante.</td></tr>'; $('#orders-total').textContent = `${visible.length} commande${visible.length > 1 ? 's' : ''} · Total : ${money(visible.reduce((sum, order) => sum + order.amount, 0))}`; };
    $('#order-search').addEventListener('input', render);
    $$('[data-filter]', content).forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; $$('[data-filter]', content).forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); }); render(); }));
    render(); $('#demo-contact').addEventListener('click', goContact);
  }
  function goContact() { closeDialog(); $('#contact').scrollIntoView({behavior:'smooth'}); }
  function openBooking() {
    openDialog(`<p class="dialog-eyebrow">CONCEPT INTERACTIF · RÉSERVATION SIMULÉE</p><h2 class="dialog-title" id="dialog-title">Rendez. Choisir, c’est réservé.</h2><p class="dialog-description">Un aperçu d’application de prise de rendez-vous. Choisissez un jour et un horaire : la réservation est uniquement simulée.</p><div class="demo-panel demo-booking"><label for="booking-day">Choisir un jour<select id="booking-day"></select></label><p>Les créneaux disponibles</p><div class="slots" aria-label="Choisir un horaire">${['09:00','10:30','11:30','14:00','15:30','16:30'].map(time => `<button aria-pressed="false" data-time="${time}">${time}</button>`).join('')}</div><button class="button primary" id="book-demo" disabled>Sélectionnez un horaire</button><p id="booking-status" role="status" class="dialog-description"></p></div><p class="dialog-note">Aucun rendez-vous réel n’est enregistré. Les dates et créneaux servent uniquement à illustrer le parcours.</p><div class="dialog-actions"><button class="button secondary" id="demo-contact">Créer mon application ↗</button></div>`);
    const days = Array.from({length:5}, (_, index) => { const day = new Date(); day.setDate(day.getDate() + index + 1); return new Intl.DateTimeFormat('fr-DZ', {weekday:'long',day:'numeric',month:'long'}).format(day); });
    $('#booking-day').innerHTML = days.map(day => `<option>${escape(day)}</option>`).join(''); let selected;
    $$('[data-time]', content).forEach(button => button.addEventListener('click', () => { selected = button.dataset.time; $$('[data-time]', content).forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', String(item === button)); }); $('#book-demo').disabled = false; $('#book-demo').textContent = `Simuler la réservation à ${selected} ↗`; $('#booking-status').textContent = ''; }));
    $('#booking-day').addEventListener('change', () => { $('#booking-status').textContent = ''; });
    $('#book-demo').addEventListener('click', () => { $('#booking-status').textContent = `✓ Simulation réussie : ${$('#booking-day').value} à ${selected}. Aucune réservation réelle n’a été effectuée.`; });
    $('#demo-contact').addEventListener('click', goContact);
  }
  $$('[data-project]').forEach(button => button.addEventListener('click', button.dataset.project === 'gestion' ? openGestion : openBooking));
  const displayedEmail = config.publicEmail || config.email || '';
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(displayedEmail) ? displayedEmail : '';
  const directEmailReady = Boolean(validEmail && config.publicEmailReady !== false);
  const contact = $('#direct-contact');
  if (validEmail) { const link = document.createElement(directEmailReady ? 'a' : 'span'); link.className = 'direct-link'; if (directEmailReady) link.href = 'mailto:' + validEmail; link.textContent = validEmail; contact.append(link); $('#form-mode').textContent = 'Vérifiez votre demande avant de l’envoyer à Brainfor. Vous pouvez aussi conserver votre brief.'; }
  if (config.phone) { const link = document.createElement('a'); link.className = 'direct-link'; link.href = 'tel:' + config.phone.replace(/[^+\d]/g, ''); link.textContent = config.phone; contact.append(link); }
  if (/^\d{8,15}$/.test(config.whatsapp || '')) { const link = document.createElement('a'); link.className = 'direct-link'; link.href = 'https://wa.me/' + config.whatsapp; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Échanger sur WhatsApp ↗'; contact.append(link); }
  if (config.city) { const location = document.createElement('p'); location.className = 'form-note'; location.textContent = config.city + ', Algérie'; contact.append(location); }
  async function copyBrief(brief) { try { await navigator.clipboard.writeText(brief); toast('Le brief a été copié.'); } catch { const text = document.createElement('textarea'); text.value = brief; text.style.position='fixed'; content.append(text); text.focus(); text.select(); const copied = document.execCommand('copy'); text.remove(); toast(copied ? 'Le brief a été copié.' : 'La copie est indisponible. Téléchargez votre brief.'); } }
  function downloadBrief(brief) { const blob = new Blob(['\ufeff' + brief], {type:'text/plain;charset=utf-8'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'mon-projet-brainfor.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Votre brief est prêt à être téléchargé.'); }
  $('#project-form').addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; if (!form.reportValidity()) return; const data = new FormData(form); if (String(data.get('message')).trim().length < 20 || !String(data.get('name')).trim()) { toast('Précisez votre nom et décrivez le projet en au moins 20 caractères.'); return; }
    const brief = `DEMANDE DE PROJET — ${config.name || 'Brainfor'}\n\nNom : ${String(data.get('name')).trim()}\nEntreprise : ${String(data.get('company')).trim() || 'Non renseignée'}\nE-mail : ${data.get('email')}\nTéléphone : ${String(data.get('phone')).trim() || 'Non renseigné'}\n\nBesoins : ${data.getAll('services').join(', ') || 'À définir ensemble'}\nBudget indicatif : ${data.get('budget')}\nÉchéance souhaitée : ${data.get('timeline')}\n\nLE PROJET\n${String(data.get('message')).trim()}\n\nCe document est un brief préparatoire. Il ne constitue ni un devis ni une commande.\n`;
    const canSend = config.contactEndpoint === '/api/contact' && config.contactProvider === 'cloudflare' && window.BRAINFOR_CONTACT;
    openDialog(`<p class="dialog-eyebrow">VOTRE PROJET / LE PREMIER PAS</p><h2 class="dialog-title" id="dialog-title">Vérifiez votre demande.</h2><p class="dialog-description">${canSend ? `Contact Brainfor : <strong>${escape(validEmail)}</strong>. Votre demande sera transmise par le formulaire.` : 'Vous pouvez télécharger votre brief ou nous écrire par e-mail.'}</p><pre class="brief-preview">${escape(brief)}</pre><div class="dialog-actions">${canSend ? '<button class="button primary" id="send-brief">Envoyer ma demande ↗</button>' : ''}<button class="button secondary" id="download-brief">Télécharger le brief ↓</button><button class="button secondary" id="copy-brief">Copier le texte</button>${directEmailReady ? '<button class="button secondary" id="email-brief">Ouvrir ma messagerie ↗</button>' : ''}</div><p id="send-status" class="send-status" role="status" aria-live="polite"></p><p class="dialog-note">L’envoi transmet vos coordonnées et votre projet à Brainfor via Cloudflare. Télécharger ou copier le brief ne transmet aucune information.</p>`);
    $('#download-brief').addEventListener('click', () => downloadBrief(brief));
    $('#copy-brief').addEventListener('click', () => copyBrief(brief));
    if (directEmailReady) $('#email-brief').addEventListener('click', () => { window.location.href = `mailto:${validEmail}?subject=${encodeURIComponent('Demande de projet — ' + data.get('name'))}&body=${encodeURIComponent(brief)}`; });
    if (canSend) {
      const sendButton = $('#send-brief');
      const sendStatus = $('#send-status');
      sendButton.addEventListener('click', async () => {
        if (contactSending || sendButton.disabled) return;
        contactSending = true;
        sendButton.disabled = true;
        $('.dialog-close').disabled = true;
        sendButton.textContent = 'Envoi en cours…';
        sendStatus.dataset.state = 'pending';
        sendStatus.textContent = 'Veuillez patienter pendant la transmission de votre demande.';
        try {
          const result = await window.BRAINFOR_CONTACT.send({
            name: String(data.get('name')).trim(), email: String(data.get('email')).trim(),
            company: String(data.get('company')).trim(), phone: String(data.get('phone')).trim(),
            services: data.getAll('services').join(', '), budget: data.get('budget'), timeline: data.get('timeline'),
            message: String(data.get('message')).trim(), honey: String(data.get('_honey') || ''),
            source: window.location.origin + window.location.pathname
          });
          if (result.status === 'queued') {
            sendStatus.dataset.state = 'accepted';
            sendStatus.textContent = 'Votre demande a été acceptée par Cloudflare et placée en attente de livraison à Brainfor. Vous pouvez conserver une copie du brief.';
            sendButton.textContent = 'Demande prise en charge ✓'; form.reset();
          } else {
            sendStatus.dataset.state = 'accepted';
            sendStatus.textContent = 'Votre demande a été prise en charge par le service d’envoi à destination de Brainfor. Vous pouvez conserver une copie de votre brief.';
            sendButton.textContent = 'Demande transmise ✓';
            $('#dialog-title').textContent = 'Merci pour votre demande.';
            $('.dialog-description', content).textContent = 'Votre demande a été transmise à Brainfor. Contact professionnel : ' + validEmail + '.';
            form.reset();
          }
        } catch (error) {
          sendStatus.dataset.state = 'error';
          const errors = {
            validation: 'Vérifiez votre nom, votre adresse e-mail et la description du projet (20 caractères minimum).',
            invalid_email: 'Le service a refusé l’adresse e-mail saisie. Utilisez une véritable adresse à laquelle vous pouvez recevoir notre réponse.',
            configuration: 'Les paramètres serveur de réception de Brainfor sont incomplets. Vous pouvez conserver votre brief ou nous contacter par e-mail.',
            provider_token: 'Cloudflare a refusé la clé d’envoi du site. Brainfor doit remplacer le jeton serveur.',
            provider_permission: 'Cloudflare refuse l’autorisation d’envoi du site. Brainfor doit vérifier les permissions du service mail.',
            provider_access: 'Cloudflare indique que ce compte n’a pas accès à l’API d’envoi utilisée. Brainfor doit adapter sa configuration de messagerie.',
            provider_disabled: 'Cloudflare indique que l’envoi d’e-mails est désactivé pour ce domaine ou ce compte.',
            provider_account: 'Cloudflare ne trouve pas le compte ou le service d’envoi configuré pour ce site.',
            origin: 'L’origine de la demande n’a pas été reconnue. Ouvrez le formulaire sur https://brainfor.net.',
            rate_limited: 'Le service limite temporairement les envois. Patientez avant de réessayer.',
            provider_timeout: 'Cloudflare n’a pas répondu dans le délai prévu. Avant de réessayer, vérifiez si la demande a été reçue pour éviter un doublon.',
            provider_unavailable: 'Le service de messagerie Cloudflare est momentanément inaccessible depuis le serveur. L’envoi n’est pas confirmé.',
            provider_rejected: 'Cloudflare a refusé la demande. Le raccordement au service nécessite une vérification par Brainfor.'
          };
          sendStatus.textContent = (errors[error.code] || 'L’envoi n’a pas pu être confirmé.') + ' Votre brief est conservé. Vous pouvez le télécharger ou le copier.';
          sendButton.textContent = 'Réessayer l’envoi ↗';
          sendButton.disabled = false;
        } finally {
          contactSending = false;
          $('.dialog-close').disabled = false;
        }
      });
    }

  });
  $$('[data-legal]').forEach(button => button.addEventListener('click', () => { const privacy = button.dataset.legal === 'privacy';
    const legal = `<h3>Éditeur</h3><p>${config.legalName ? escape(config.legalName) : 'Brainfor est un projet d’entreprise d’ingénierie informatique en Algérie. Les informations d’identification de l’entreprise sont à compléter avant l’ouverture au public.'}</p><p>${config.address ? escape(config.address) : 'Adresse professionnelle : à renseigner.'}<br>${config.registration ? escape(config.registration) : 'Informations d’immatriculation et identification de l’entreprise : à compléter.'}<br>Contact : ${validEmail ? escape(validEmail) : 'à renseigner.'}</p><h3>Statut du site</h3><p>Cette version est destinée à la préparation du lancement. Sendlyy, Floutons et EduBest sont présentés comme des réalisations. EduBest n’est pas encore publié. Les concepts Flux et Rendez restent des démonstrations fictives, sans client ni résultat commercial revendiqué. Les prestations, délais, droits, tarifs et engagements seront définis dans chaque proposition contractuelle.</p><h3>Hébergement</h3><p>Ce site est hébergé par Cloudflare Pages. Le formulaire utilise Cloudflare Email Service pour acheminer les demandes vers la messagerie de Brainfor.</p><h3>Avant ouverture au public</h3><p>Les informations d’entreprise et d’hébergement doivent être renseignées et les textes adaptés au fonctionnement réel de l’activité.</p>`;
    const privacyCopy = `<h3>Préparation du brief</h3><p>Les informations saisies servent à préparer votre demande : nom, e-mail, entreprise, téléphone, besoins, budget, échéance et description. Vous pouvez télécharger ou copier le brief sans l’envoyer. Aucun serveur n’est contacté pour cette préparation.</p><h3>Envoi à Brainfor</h3><p>En cliquant sur « Envoyer ma demande », vous transmettez ces informations au serveur du site, hébergé par Cloudflare. Son service de messagerie les achemine vers la boîte de réception de Brainfor pour étudier votre projet et vous répondre. Le site ne possède pas de base de prospects propre. Les messages reçus sont conservés dans la messagerie de Brainfor le temps nécessaire au suivi de votre demande.</p><h3>Prestataire technique</h3><p>Cloudflare assure l’hébergement et le traitement technique de l’envoi. Consultez sa <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>. Les durées de conservation techniques dépendent des services utilisés et ne sont pas fixées par ce site.</p><h3>Autre moyen de contact</h3><p>${directEmailReady ? 'Le bouton « Ouvrir ma messagerie » prépare un brouillon adressé à contact@brainfor.net dans votre application de courrier. Vous choisissez vous-même de l’envoyer.' : 'Vous pouvez conserver votre brief en le copiant ou en le téléchargeant. L’adresse professionnelle affichée est contact@brainfor.net ; son activation reste à finaliser.'}</p><h3>Cookies et services externes</h3><p>Le code du site n’ajoute pas de cookies analytiques ni de traceurs publicitaires. Les polices sont chargées depuis Google Fonts ; ce chargement peut transmettre des données techniques, notamment l’adresse IP. L’hébergement et les protections du service de formulaire peuvent également traiter des données techniques.</p><h3>Démonstrations</h3><p>Les commandes et rendez-vous des démonstrations sont fictifs. Aucun achat ni rendez-vous réel n’y est enregistré.</p><h3>Vos informations</h3><p>Pour toute question sur votre demande ou pour demander la correction ou la suppression des informations transmises, ${directEmailReady ? `écrivez à ${escape(validEmail)}.` : 'utilisez le formulaire de contact en indiquant votre demande.'} Les informations légales de l’entreprise et les durées de conservation propres à son activité restent à préciser avant ouverture publique.</p>`;
    openDialog(`<div class="legal-copy"><p class="dialog-eyebrow">INFORMATIONS DU SITE</p><h2 class="dialog-title" id="dialog-title">${privacy ? 'Confidentialité' : 'Mentions légales'}</h2>${privacy ? privacyCopy : legal}</div>`);
  }));
})();
