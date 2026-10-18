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
  menu.addEventListener('click', () => { const expanded = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(expanded)); menu.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu'); $('.nav').classList.toggle('open', expanded); });
  $$('.nav a').forEach(link => link.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open menu'); $('.nav').classList.remove('open'); }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { menu.click(); menu.focus(); } });
  $('#year').textContent = new Date().getFullYear();
  $$('.language-switch a').forEach(link => link.addEventListener('click', () => {
    if (window.location.hash) link.hash = window.location.hash;
  }));
  const services = {
    web: { title:'Websites & web applications', description:'Your online presence should have a purpose: building awareness, selling or simplifying a service. We create a consistent experience, from the first visit to the actions that matter.', deliverables:['Business website and service catalogue','Online shop and ordering journey','Customer portal or business application','An interface for mobile and desktop','SEO structure and accessible content','Deployment and documentation'], note:'Payments, hosting, domain names and third-party services are assessed and priced according to your needs. Integrations depend on availability and provider terms.', choice:'Website or web application' },
    mobile: { title:'Mobile applications', description:'Booking, delivery, customer accounts or field tools: bring your service closer to users with an enjoyable application tailored to their needs.', deliverables:['User journeys and interactive mockups','Android and iOS application according to scope','Connection to your services and APIs','Notifications and native features as needed','Testing for target devices and use cases','Preparation for app store submission'], note:'Developer accounts, store approval and any third-party fees are specified in the proposal. Offline behaviour is agreed when defining the scope.', choice:'Mobile application' },
    desktop: { title:'Desktop software', description:'Software tailored to your business: inventory tracking, invoicing, document management, reporting or internal operations. The goal is to simplify your essential tasks.', deliverables:['Business process analysis','Desktop interface and tailored workflows','Data and access management','Import and export in agreed formats','Offline mode where appropriate','Installation, documentation and onboarding'], note:'Platforms, backup arrangements and any business-specific requirements are agreed together before development.', choice:'Desktop application' },
    custom: { title:'Custom solutions', description:'Your tools do not communicate? A task takes too long? Your idea needs specialist development? We identify the right technical approach for your needs.', deliverables:['APIs and connections between your tools','Automation of repetitive tasks','Dashboards and data processing','AI integrations with result validation','Review and improvement of an existing application','Documentation and knowledge transfer'], note:'API access, usage costs, data privacy and third-party system limitations are assessed during scoping.', choice:'Custom solution' }
  };
  $$('[data-service]').forEach(button => button.addEventListener('click', () => { const service = services[button.dataset.service]; openDialog(`<p class="dialog-eyebrow">OUR EXPERTISE / CUSTOM DEVELOPMENT</p><h2 class="dialog-title" id="dialog-title">${service.title}</h2><p class="dialog-description">${service.description}</p><ul class="deliverables">${service.deliverables.map(item => `<li>${item}</li>`).join('')}</ul><p class="dialog-note">${service.note}</p><div class="dialog-actions"><button class="button primary" id="service-contact">Discuss this requirement ↗</button></div>`); $('#service-contact').addEventListener('click', () => { const choice = $$('input[name="services"]').find(input => input.value === service.choice); if (choice) choice.checked = true; closeDialog(); $('#contact').scrollIntoView({behavior: 'smooth'}); setTimeout(() => $('input[name="name"]').focus({preventScroll:true}), 350); }); }));
  const orders = [ {id:'CMD-024',name:'Office equipment',status:'Delivered',amount:24500}, {id:'CMD-023',name:'Supplies',status:'Delivered',amount:18200}, {id:'CMD-022',name:'Accessories',status:'In progress',amount:9800}, {id:'CMD-021',name:'Computer equipment',status:'In progress',amount:67500}, {id:'CMD-020',name:'Furniture',status:'Delivered',amount:32000} ];
  const money = value => new Intl.NumberFormat('en-DZ').format(value) + ' DZD';
  function openGestion() {
    openDialog(`<p class="dialog-eyebrow">INTERACTIVE CONCEPT · FICTIONAL DATA</p><h2 class="dialog-title" id="dialog-title">Flux. A clear view of everything.</h2><p class="dialog-description">A sample dashboard for a small business. Search for an order or filter by status to explore the interface.</p><div class="demo-panel"><div class="demo-toolbar"><input id="order-search" aria-label="Search for an order" placeholder="Search for a product or number…"><div class="demo-filters" aria-label="Order status"><button class="active" data-filter="All" aria-pressed="true">All</button><button data-filter="Delivered" aria-pressed="false">Delivered</button><button data-filter="In progress" aria-pressed="false">In progress</button></div></div><div class="demo-table-wrap"><table class="demo-table"><thead><tr><th>ORDER</th><th>DESCRIPTION</th><th>STATUS</th><th>AMOUNT</th></tr></thead><tbody id="orders-body"></tbody></table></div><p class="demo-total" aria-live="polite" id="orders-total"></p></div><p class="dialog-note">This demo does not represent software delivered to a customer. No real data is used or modified.</p><div class="dialog-actions"><button class="button primary" id="demo-contact">Plan my business tool ↗</button></div>`);
    let filter = 'All';
    const render = () => { const query = $('#order-search').value.toLocaleLowerCase('en'); const visible = orders.filter(order => (filter === 'All' || order.status === filter) && `${order.id} ${order.name}`.toLocaleLowerCase('en').includes(query)); $('#orders-body').innerHTML = visible.length ? visible.map(order => `<tr><td>${order.id}</td><td>${order.name}</td><td><span class="demo-pill ${order.status === 'In progress' ? 'wait' : ''}">${order.status}</span></td><td>${money(order.amount)}</td></tr>`).join('') : '<tr><td colspan="4">No matching orders.</td></tr>'; $('#orders-total').textContent = `${visible.length} order(s) · Total: ${money(visible.reduce((sum, order) => sum + order.amount, 0))}`; };
    $('#order-search').addEventListener('input', render);
    $$('[data-filter]', content).forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; $$('[data-filter]', content).forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); }); render(); }));
    render(); $('#demo-contact').addEventListener('click', goContact);
  }
  function goContact() { closeDialog(); $('#contact').scrollIntoView({behavior:'smooth'}); }
  function openBooking() {
    openDialog(`<p class="dialog-eyebrow">INTERACTIVE CONCEPT · SIMULATED BOOKING</p><h2 class="dialog-title" id="dialog-title">Rendez. Choose a time, make it yours.</h2><p class="dialog-description">A preview of an appointment booking app. Choose a day and time: the booking is only simulated.</p><div class="demo-panel demo-booking"><label for="booking-day">Choose a day<select id="booking-day"></select></label><p>Available time slots</p><div class="slots" aria-label="Choose a time">${['09:00','10:30','11:30','14:00','15:30','16:30'].map(time => `<button aria-pressed="false" data-time="${time}">${time}</button>`).join('')}</div><button class="button primary" id="book-demo" disabled>Select a time</button><p id="booking-status" role="status" class="dialog-description"></p></div><p class="dialog-note">No real appointment is recorded. Dates and times only illustrate the user journey.</p><div class="dialog-actions"><button class="button secondary" id="demo-contact">Build my application ↗</button></div>`);
    const days = Array.from({length:5}, (_, index) => { const day = new Date(); day.setDate(day.getDate() + index + 1); return new Intl.DateTimeFormat('en-DZ', {weekday:'long',day:'numeric',month:'long'}).format(day); });
    $('#booking-day').innerHTML = days.map(day => `<option>${escape(day)}</option>`).join(''); let selected;
    $$('[data-time]', content).forEach(button => button.addEventListener('click', () => { selected = button.dataset.time; $$('[data-time]', content).forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', String(item === button)); }); $('#book-demo').disabled = false; $('#book-demo').textContent = `Simulate booking at ${selected} ↗`; $('#booking-status').textContent = ''; }));
    $('#booking-day').addEventListener('change', () => { $('#booking-status').textContent = ''; });
    $('#book-demo').addEventListener('click', () => { $('#booking-status').textContent = `✓ Simulation complete: ${$('#booking-day').value} at ${selected}. No real booking has been made.`; });
    $('#demo-contact').addEventListener('click', goContact);
  }
  $$('[data-project]').forEach(button => button.addEventListener('click', button.dataset.project === 'gestion' ? openGestion : openBooking));
  const displayedEmail = config.publicEmail || config.email || '';
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(displayedEmail) ? displayedEmail : '';
  const directEmailReady = Boolean(validEmail && config.publicEmailReady !== false);
  const contact = $('#direct-contact');
  if (validEmail) { const link = document.createElement(directEmailReady ? 'a' : 'span'); link.className = 'direct-link'; if (directEmailReady) link.href = 'mailto:' + validEmail; link.textContent = validEmail; contact.append(link); $('#form-mode').textContent = 'Review your request before sending it to Brainfor. You can also keep your brief.'; }
  if (config.phone) { const link = document.createElement('a'); link.className = 'direct-link'; link.href = 'tel:' + config.phone.replace(/[^+\d]/g, ''); link.textContent = config.phone; contact.append(link); }
  if (/^\d{8,15}$/.test(config.whatsapp || '')) { const link = document.createElement('a'); link.className = 'direct-link'; link.href = 'https://wa.me/' + config.whatsapp; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Chat on WhatsApp ↗'; contact.append(link); }
  if (config.city) { const location = document.createElement('p'); location.className = 'form-note'; location.textContent = config.city + ', Algeria'; contact.append(location); }
  async function copyBrief(brief) { try { await navigator.clipboard.writeText(brief); toast('Your brief has been copied.'); } catch { const text = document.createElement('textarea'); text.value = brief; text.style.position='fixed'; content.append(text); text.focus(); text.select(); const copied = document.execCommand('copy'); text.remove(); toast(copied ? 'Your brief has been copied.' : 'Copying is unavailable. Download your brief instead.'); } }
  function downloadBrief(brief) { const blob = new Blob(['\ufeff' + brief], {type:'text/plain;charset=utf-8'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'brainfor-project-brief-en.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Your brief is ready to download.'); }
  $('#project-form').addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; if (!form.reportValidity()) return; const data = new FormData(form); if (String(data.get('message')).trim().length < 20 || !String(data.get('name')).trim()) { toast('Enter your name and describe your project in at least 20 characters.'); return; }
    const brief = `PROJECT ENQUIRY — ${config.name || 'Brainfor'}\n\nName: ${String(data.get('name')).trim()}\nCompany: ${String(data.get('company')).trim() || 'Not provided'}\nEmail: ${data.get('email')}\nPhone : ${String(data.get('phone')).trim() || 'Not provided'}\n\nRequirements: ${data.getAll('services').join(', ') || 'To be discussed'}\nEstimated budget: ${data.get('budget')}\nPreferred timeline: ${data.get('timeline')}\n\nTHE PROJECT\n${String(data.get('message')).trim()}\n\nThis document is a preliminary project brief. It is neither a quote nor an order.\n`;
    const canSend = config.contactEndpoint === '/api/contact' && config.contactProvider === 'cloudflare' && window.BRAINFOR_CONTACT;
    openDialog(`<p class="dialog-eyebrow">YOUR PROJECT / THE FIRST STEP</p><h2 class="dialog-title" id="dialog-title">Review your request.</h2><p class="dialog-description">${canSend ? `Contact Brainfor: <strong>${escape(validEmail)}</strong>. Your request will be sent through this form.` : 'You can download your brief or contact us by email.'}</p><pre class="brief-preview">${escape(brief)}</pre><div class="dialog-actions">${canSend ? '<button class="button primary" id="send-brief">Send my request ↗</button>' : ''}<button class="button secondary" id="download-brief">Download brief ↓</button><button class="button secondary" id="copy-brief">Copy text</button>${directEmailReady ? '<button class="button secondary" id="email-brief">Open my email app ↗</button>' : ''}</div><p id="send-status" class="send-status" role="status" aria-live="polite"></p><p class="dialog-note">Sending shares your contact details and project with Brainfor through Cloudflare. Downloading or copying the brief does not send any information.</p>`);
    $('#download-brief').addEventListener('click', () => downloadBrief(brief));
    $('#copy-brief').addEventListener('click', () => copyBrief(brief));
    if (directEmailReady) $('#email-brief').addEventListener('click', () => { window.location.href = `mailto:${validEmail}?subject=${encodeURIComponent('Project enquiry — ' + data.get('name'))}&body=${encodeURIComponent(brief)}`; });
    if (canSend) {
      const sendButton = $('#send-brief');
      const sendStatus = $('#send-status');
      sendButton.addEventListener('click', async () => {
        if (contactSending || sendButton.disabled) return;
        contactSending = true;
        sendButton.disabled = true;
        $('.dialog-close').disabled = true;
        sendButton.textContent = 'Sending…';
        sendStatus.dataset.state = 'pending';
        sendStatus.textContent = 'Please wait while your request is being sent.';
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
            sendStatus.textContent = 'Cloudflare has accepted your request and queued it for delivery to Brainfor. You can keep a copy of your brief.';
            sendButton.textContent = 'Request accepted ✓'; form.reset();
          } else {
            sendStatus.dataset.state = 'accepted';
            sendStatus.textContent = 'Your request has been handled by the delivery service for Brainfor. You can keep a copy of your brief.';
            sendButton.textContent = 'Request sent ✓';
            $('#dialog-title').textContent = 'Thank you for your enquiry.';
            $('.dialog-description', content).textContent = 'Your request has been sent to Brainfor. Business contact: ' + validEmail + '.';
            form.reset();
          }
        } catch (error) {
          sendStatus.dataset.state = 'error';
          const errors = {
            validation: 'Check your name, email address and project description (at least 20 characters).',
            invalid_email: 'The service rejected this email address. Use a real address where you can receive our reply.',
            configuration: 'Brainfor’s server email settings are incomplete. You can keep your brief or contact us by email.',
            provider_token: 'Cloudflare rejected the site’s sending key. Brainfor needs to replace the server token.',
            provider_permission: 'Cloudflare denied the site permission to send email. Brainfor needs to review the email service permissions.',
            provider_access: 'Cloudflare reports that this account cannot access the email sending API. Brainfor needs to adjust its email configuration.',
            provider_disabled: 'Cloudflare reports that email sending is disabled for this domain or account.',
            provider_account: 'Cloudflare cannot find the account or sending service configured for this site.',
            origin: 'The request origin was not recognised. Open the form at https://brainfor.net.',
            rate_limited: 'The service is temporarily limiting submissions. Please wait before trying again.',
            provider_timeout: 'Cloudflare did not respond in time. Before retrying, check whether the request was received to avoid duplicates.',
            provider_unavailable: 'Cloudflare’s email service is temporarily unreachable from the server. Sending is not confirmed.',
            provider_rejected: 'Cloudflare rejected the request. Brainfor needs to review the email service connection.'
          };
          sendStatus.textContent = (errors[error.code] || 'Sending could not be confirmed.') + ' Your brief is saved in this form. You can download or copy it.';
          sendButton.textContent = 'Retry sending ↗';
          sendButton.disabled = false;
        } finally {
          contactSending = false;
          $('.dialog-close').disabled = false;
        }
      });
    }

  });
  $$('[data-legal]').forEach(button => button.addEventListener('click', () => { const privacy = button.dataset.legal === 'privacy';
    const legal = `<h3>Publisher</h3><p>${config.legalName ? escape(config.legalName) : 'Brainfor is a software engineering business project in Algeria. Company identification details must be completed before the public launch.'}</p><p>${config.address ? escape(config.address) : 'Business address: to be provided.'}<br>${config.registration ? escape(config.registration) : 'Company registration and identification details: to be completed.'}<br>Contact: ${validEmail ? escape(validEmail) : 'to be provided.'}</p><h3>Website status</h3><p>This version supports launch preparation. Sendlyy, Floutons and EduBest are presented as projects. EduBest is not live yet. Flux and Rendez remain fictional demos, with no claimed customer or commercial results. Services, deadlines, rights, prices and commitments will be defined in each contractual proposal.</p><h3>Hosting</h3><p>This website is hosted on Cloudflare Pages. The form uses Cloudflare Email Service to deliver requests to Brainfor’s mailbox.</p><h3>Before the public launch</h3><p>Company and hosting details must be completed, and the text adapted to the actual business operation.</p>`;
    const privacyCopy = `<h3>Preparing your brief</h3><p>The information you enter prepares your enquiry: name, email, company, phone, requirements, budget, timeline and description. You can download or copy the brief without sending it. No server is contacted during this preparation.</p><h3>Sending to Brainfor</h3><p>Clicking “Send my request” sends this information to the website server hosted by Cloudflare. Its email service delivers it to Brainfor’s mailbox so we can assess your project and reply. The website has no separate prospect database. Received messages remain in Brainfor’s mailbox for as long as needed to follow up your enquiry.</p><h3>Technical provider</h3><p>Cloudflare provides hosting and the technical processing of submissions. See its <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">privacy policy</a>. Technical retention periods depend on the services used and are not determined by this website.</p><h3>Another way to contact us</h3><p>${directEmailReady ? '“Open my email app” prepares a draft to contact@brainfor.net in your mail application. You decide whether to send it.' : 'You can keep your brief by copying or downloading it. The displayed business address is contact@brainfor.net; its activation still needs to be completed.'}</p><h3>Cookies and external services</h3><p>The website code adds no analytics cookies or advertising trackers. Fonts load from Google Fonts, which may receive technical data such as your IP address. Hosting and form protection services may also process technical data.</p><h3>Demos</h3><p>Orders and appointments in the demos are fictional. No real purchase or appointment is recorded.</p><h3>Your information</h3><p>For questions about your enquiry, or to request correction or deletion of the information you submitted, ${directEmailReady ? `write to ${escape(validEmail)}.` : 'use the contact form and explain your request.'} Company legal details and business-specific retention periods still need to be specified before the public launch.</p>`;
    openDialog(`<div class="legal-copy"><p class="dialog-eyebrow">WEBSITE INFORMATION</p><h2 class="dialog-title" id="dialog-title">${privacy ? 'Privacy' : 'Legal notice'}</h2>${privacy ? privacyCopy : legal}</div>`);
  }));
})();
