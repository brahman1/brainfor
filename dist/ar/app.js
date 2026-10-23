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
  menu.addEventListener('click', () => { const expanded = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(expanded)); menu.setAttribute('aria-label', expanded ? 'إغلاق القائمة' : 'افتح القائمة'); $('.nav').classList.toggle('open', expanded); });
  $$('.nav a').forEach(link => link.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'افتح القائمة'); $('.nav').classList.remove('open'); }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { menu.click(); menu.focus(); } });
  $('#year').textContent = new Date().getFullYear();
  const services = {
    web: { title:'المواقع وتطبيقات الويب', description:'ينبغي أن يخدم حضوركم الرقمي هدفًا: التعريف بكم أو البيع أو تبسيط خدمة. نبني تجربة متكاملة، من الزيارة الأولى إلى الإجراءات الأساسية.', deliverables:['موقع تعريفي ودليل للخدمات','متجر إلكتروني ومسار الطلب','بوابة للعملاء أو تطبيق أعمال','واجهة مناسبة للهاتف والحاسوب','بنية ملائمة لمحركات البحث ومحتوى متاح للجميع','الإطلاق والتوثيق'], note:'تُدرس المدفوعات والاستضافة وأسماء النطاقات وخدمات الأطراف الثالثة وتُحدَّد تكلفتها حسب الحاجة. ويتوقف التكامل على توافرها وشروط مقدّميها.', choice:'موقع أو تطبيق ويب' },
    mobile: { title:'تطبيقات الهاتف', description:'الحجز والتوصيل وحسابات العملاء والأدوات الميدانية: قرّبوا خدماتكم من المستخدمين بتطبيق مريح يناسب احتياجاتهم.', deliverables:['رحلات المستخدم ونماذج تفاعلية','تطبيق Android وiOS حسب نطاق المشروع','الربط بخدماتكم وواجهات API','إشعارات ووظائف أصلية حسب الحاجة','اختبارات للأجهزة والاستخدامات المستهدفة','التحضير للنشر في متاجر التطبيقات'], note:'تُوضَّح حسابات المطوّرين وموافقات المتاجر ورسوم الأطراف الثالثة المحتملة في المقترح. ويُحدَّد العمل دون اتصال عند ضبط نطاق المشروع.', choice:'تطبيق هاتف' },
    desktop: { title:'برمجيات سطح المكتب', description:'برمجيات تناسب نشاطكم: متابعة المخزون والفوترة وإدارة الوثائق والتقارير والعمليات الداخلية. هدفنا تبسيط مهامكم الأساسية.', deliverables:['تحليل سير عملكم','واجهة سطح مكتب ومسارات عمل مناسبة','إدارة البيانات وصلاحيات الوصول','استيراد وتصدير بالصيَغ المتفق عليها','وضع دون اتصال عند ملاءمته للاستخدام','التثبيت والتوثيق والتدريب'], note:'نتفق معًا على المنصات وآليات النسخ الاحتياطي ومتطلبات النشاط قبل بدء التطوير.', choice:'تطبيق سطح المكتب' },
    custom: { title:'حلول حسب الطلب', description:'هل أدواتكم غير مترابطة؟ هل تستهلك مهمة وقتًا طويلًا؟ هل تحتاج فكرتكم إلى تطوير خاص؟ ندرس الحل التقني الأنسب لاحتياجاتكم.', deliverables:['واجهات API وربط أدواتكم','أتمتة المهام المتكررة','لوحات التحكم ومعالجة البيانات','تكامل الذكاء الاصطناعي مع التحقق من النتائج','تدقيق تطبيق قائم وتطويره','التوثيق ونقل المهارات'], note:'تُدرَس صلاحيات API وتكاليف الاستخدام وخصوصية البيانات وحدود الأنظمة الخارجية عند تحديد نطاق المشروع.', choice:'حل حسب الطلب' }
  };
  $$('[data-service]').forEach(button => button.addEventListener('click', () => { const service = services[button.dataset.service]; openDialog(`<p class="dialog-eyebrow">خبراتنا / تطوير حسب الطلب</p><h2 class="dialog-title" id="dialog-title">${service.title}</h2><p class="dialog-description">${service.description}</p><ul class="deliverables">${service.deliverables.map(item => `<li>${item}</li>`).join('')}</ul><p class="dialog-note">${service.note}</p><div class="dialog-actions"><button class="button primary" id="service-contact">مناقشة هذه الحاجة ↗</button></div>`); $('#service-contact').addEventListener('click', () => { const choice = $$('input[name="services"]').find(input => input.value === service.choice); if (choice) choice.checked = true; closeDialog(); $('#contact').scrollIntoView({behavior: 'smooth'}); setTimeout(() => $('input[name="name"]').focus({preventScroll:true}), 350); }); }));
  const orders = [ {id:'CMD-024',name:'تجهيزات مكتبية',status:'تم التسليم',amount:24500}, {id:'CMD-023',name:'لوازم',status:'تم التسليم',amount:18200}, {id:'CMD-022',name:'ملحقات',status:'قيد التنفيذ',amount:9800}, {id:'CMD-021',name:'معدات معلوماتية',status:'قيد التنفيذ',amount:67500}, {id:'CMD-020',name:'أثاث',status:'تم التسليم',amount:32000} ];
  const money = value => '\u2066' + new Intl.NumberFormat('fr-DZ').format(value).replace(/\s/g, '\u00a0') + '\u2069' + ' د.ج';
  function openGestion() {
    openDialog(`<p class="dialog-eyebrow">نموذج تفاعلي · بيانات افتراضية</p><h2 class="dialog-title" id="dialog-title">Flux. رؤية شاملة ببساطة.</h2><p class="dialog-description">مثال للوحة تحكم مؤسسة صغيرة أو متوسطة. ابحثوا عن طلب أو رشّحوا حسب حالته لاستكشاف الواجهة.</p><div class="demo-panel"><div class="demo-toolbar"><input id="order-search" aria-label="البحث عن طلب" placeholder="البحث عن منتج أو رقم…"><div class="demo-filters" aria-label="حالة الطلبات"><button class="active" data-filter="الكل" aria-pressed="true">الكل</button><button data-filter="تم التسليم" aria-pressed="false">تم التسليم</button><button data-filter="قيد التنفيذ" aria-pressed="false">قيد التنفيذ</button></div></div><div class="demo-table-wrap"><table class="demo-table"><thead><tr><th>الطلب</th><th>الوصف</th><th>الحالة</th><th>المبلغ</th></tr></thead><tbody id="orders-body"></tbody></table></div><p class="demo-total" aria-live="polite" id="orders-total"></p></div><p class="dialog-note">هذا النموذج لا يمثّل برنامجًا سُلّم لعميل. لا تُستخدم أو تُعدَّل أي بيانات حقيقية.</p><div class="dialog-actions"><button class="button primary" id="demo-contact">تصوّر أداة أعمالي ↗</button></div>`);
    let filter = 'الكل';
    const render = () => { const query = $('#order-search').value.toLocaleLowerCase('ar'); const visible = orders.filter(order => (filter === 'الكل' || order.status === filter) && `${order.id} ${order.name}`.toLocaleLowerCase('ar').includes(query)); $('#orders-body').innerHTML = visible.length ? visible.map(order => `<tr><td>${order.id}</td><td>${order.name}</td><td><span class="demo-pill ${order.status === 'قيد التنفيذ' ? 'wait' : ''}">${order.status}</span></td><td>${money(order.amount)}</td></tr>`).join('') : '<tr><td colspan="4">لا توجد طلبات مطابقة.</td></tr>'; $('#orders-total').textContent = `${visible.length} طلبًا · الإجمالي: ${money(visible.reduce((sum, order) => sum + order.amount, 0))}`; };
    $('#order-search').addEventListener('input', render);
    $$('[data-filter]', content).forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; $$('[data-filter]', content).forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); }); render(); }));
    render(); $('#demo-contact').addEventListener('click', goContact);
  }
  function goContact() { closeDialog(); $('#contact').scrollIntoView({behavior:'smooth'}); }
  function openBooking() {
    openDialog(`<p class="dialog-eyebrow">نموذج تفاعلي · حجز تجريبي</p><h2 class="dialog-title" id="dialog-title">Rendez. اختاروا وقتكم واحجزوه.</h2><p class="dialog-description">معاينة لتطبيق حجز المواعيد. اختاروا يومًا ووقتًا: الحجز محاكاة فقط.</p><div class="demo-panel demo-booking"><label for="booking-day">اختيار يوم<select id="booking-day"></select></label><p>المواعيد المتاحة</p><div class="slots" aria-label="اختيار وقت">${['09:00','10:30','11:30','14:00','15:30','16:30'].map(time => `<button aria-pressed="false" data-time="${time}">${time}</button>`).join('')}</div><button class="button primary" id="book-demo" disabled>اختاروا وقتًا</button><p id="booking-status" role="status" class="dialog-description"></p></div><p class="dialog-note">لا يُسجَّل أي موعد حقيقي. التواريخ والأوقات مخصّصة لتوضيح المسار فقط.</p><div class="dialog-actions"><button class="button secondary" id="demo-contact">إنشاء تطبيقي ↗</button></div>`);
    const days = Array.from({length:5}, (_, index) => { const day = new Date(); day.setDate(day.getDate() + index + 1); return new Intl.DateTimeFormat('ar-DZ', {weekday:'long',day:'numeric',month:'long'}).format(day); });
    $('#booking-day').innerHTML = days.map(day => `<option>${escape(day)}</option>`).join(''); let selected;
    $$('[data-time]', content).forEach(button => button.addEventListener('click', () => { selected = button.dataset.time; $$('[data-time]', content).forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', String(item === button)); }); $('#book-demo').disabled = false; $('#book-demo').textContent = `محاكاة الحجز على الساعة ${selected} ↗`; $('#booking-status').textContent = ''; }));
    $('#booking-day').addEventListener('change', () => { $('#booking-status').textContent = ''; });
    $('#book-demo').addEventListener('click', () => { $('#booking-status').textContent = `✓ اكتملت المحاكاة: ${$('#booking-day').value} على الساعة ${selected}. لم يتم إجراء أي حجز حقيقي.`; });
    $('#demo-contact').addEventListener('click', goContact);
  }
  $$('[data-project]').forEach(button => button.addEventListener('click', button.dataset.project === 'gestion' ? openGestion : openBooking));
  const displayedEmail = config.publicEmail || config.email || '';
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(displayedEmail) ? displayedEmail : '';
  const directEmailReady = Boolean(validEmail && config.publicEmailReady !== false);
  const contact = $('#direct-contact');
  if (validEmail) { const link = document.createElement(directEmailReady ? 'a' : 'span'); link.className = 'direct-link'; if (directEmailReady) link.href = 'mailto:' + validEmail; link.textContent = validEmail; contact.append(link); $('#form-mode').textContent = 'راجعوا طلبكم قبل إرساله إلى Brainfor. ويمكنكم الاحتفاظ بملخّص المشروع.'; }
  if (config.phone) { const link = document.createElement('a'); link.className = 'direct-link'; link.href = 'tel:' + config.phone.replace(/[^+\d]/g, ''); link.textContent = config.phone; contact.append(link); }
  if (/^\d{8,15}$/.test(config.whatsapp || '')) { const link = document.createElement('a'); link.className = 'direct-link'; link.href = 'https://wa.me/' + config.whatsapp; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'التواصل عبر WhatsApp ↗'; contact.append(link); }
  if (config.city) { const location = document.createElement('p'); location.className = 'form-note'; location.textContent = config.city + '، الجزائر'; contact.append(location); }
  async function copyBrief(brief) { try { await navigator.clipboard.writeText(brief); toast('تم نسخ ملخّص المشروع.'); } catch { const text = document.createElement('textarea'); text.value = brief; text.style.position='fixed'; content.append(text); text.focus(); text.select(); const copied = document.execCommand('copy'); text.remove(); toast(copied ? 'تم نسخ ملخّص المشروع.' : 'النسخ غير متاح. يمكنكم تنزيل ملخّص المشروع.'); } }
  function downloadBrief(brief) { const blob = new Blob(['\ufeff' + brief], {type:'text/plain;charset=utf-8'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'brainfor-project-brief-ar.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('ملخّص المشروع جاهز للتنزيل.'); }
  $('#project-form').addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; if (!form.reportValidity()) return; const data = new FormData(form); if (String(data.get('message')).trim().length < 20 || !String(data.get('name')).trim()) { toast('أدخلوا الاسم وصِفوا المشروع في 20 حرفًا على الأقل.'); return; }
    const brief = `طلب مشروع — ${config.name || 'Brainfor'}\n\nالاسم: ${String(data.get('name')).trim()}\nالمؤسسة: ${String(data.get('company')).trim() || 'غير مذكورة'}\nالبريد الإلكتروني: ${data.get('email')}\nالهاتف : ${String(data.get('phone')).trim() || 'غير مذكور'}\n\nالاحتياجات: ${data.getAll('services').join(', ') || 'نحدّدها معًا'}\nالميزانية التقديرية: ${data.get('budget')}\nالموعد المطلوب: ${data.get('timeline')}\n\nالمشروع\n${String(data.get('message')).trim()}\n\nهذه الوثيقة ملخّص أولي للمشروع، ولا تُعدّ عرض سعر أو طلب شراء.\n`;
    const canSend = config.contactEndpoint === '/api/contact' && config.contactProvider === 'cloudflare' && window.BRAINFOR_CONTACT;
    openDialog(`<p class="dialog-eyebrow">مشروعكم / الخطوة الأولى</p><h2 class="dialog-title" id="dialog-title">راجعوا طلبكم.</h2><p class="dialog-description">${canSend ? `التواصل مع Brainfor: <strong>${escape(validEmail)}</strong>. سيُرسل طلبكم عبر هذا النموذج.` : 'يمكنكم تنزيل ملخّص المشروع أو مراسلتنا بالبريد الإلكتروني.'}</p><pre class="brief-preview">${escape(brief)}</pre><div class="dialog-actions">${canSend ? '<button class="button primary" id="send-brief">إرسال الطلب ↗</button>' : ''}<button class="button secondary" id="download-brief">تنزيل الملخّص ↓</button><button class="button secondary" id="copy-brief">نسخ النص</button>${directEmailReady ? '<button class="button secondary" id="email-brief">فتح تطبيق البريد ↗</button>' : ''}</div><p id="send-status" class="send-status" role="status" aria-live="polite"></p><p class="dialog-note">عند الإرسال تُنقل بيانات الاتصال ومشروعكم إلى Brainfor عبر Cloudflare. تنزيل الملخّص أو نسخه لا يرسل أي معلومات.</p>`);
    $('#download-brief').addEventListener('click', () => downloadBrief(brief));
    $('#copy-brief').addEventListener('click', () => copyBrief(brief));
    if (directEmailReady) $('#email-brief').addEventListener('click', () => { window.location.href = `mailto:${validEmail}?subject=${encodeURIComponent('طلب مشروع — ' + data.get('name'))}&body=${encodeURIComponent(brief)}`; });
    if (canSend) {
      const sendButton = $('#send-brief');
      const sendStatus = $('#send-status');
      sendButton.addEventListener('click', async () => {
        if (contactSending || sendButton.disabled) return;
        contactSending = true;
        sendButton.disabled = true;
        $('.dialog-close').disabled = true;
        sendButton.textContent = 'جارٍ الإرسال…';
        sendStatus.dataset.state = 'pending';
        sendStatus.textContent = 'يرجى الانتظار أثناء إرسال طلبكم.';
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
            sendStatus.textContent = 'استقبل Cloudflare طلبكم ووضعه في قائمة انتظار التسليم إلى Brainfor. يمكنكم الاحتفاظ بنسخة من الملخّص.';
            sendButton.textContent = 'تم قبول الطلب ✓'; form.reset();
          } else {
            sendStatus.dataset.state = 'accepted';
            sendStatus.textContent = 'عالجت خدمة الإرسال طلبكم لتوجيهه إلى Brainfor. يمكنكم الاحتفاظ بنسخة من الملخّص.';
            sendButton.textContent = 'تم إرسال الطلب ✓';
            $('#dialog-title').textContent = 'شكرًا على طلبكم.';
            $('.dialog-description', content).textContent = 'تم إرسال طلبكم إلى Brainfor. البريد المهني: ' + validEmail + '.';
            form.reset();
          }
        } catch (error) {
          sendStatus.dataset.state = 'error';
          const errors = {
            validation: 'تحقّقوا من الاسم والبريد الإلكتروني ووصف المشروع (20 حرفًا على الأقل).',
            invalid_email: 'رفضت الخدمة البريد الإلكتروني المُدخل. استخدموا عنوانًا حقيقيًا يمكنكم تلقّي ردّنا عليه.',
            configuration: 'إعدادات استقبال البريد على خادم Brainfor غير مكتملة. يمكنكم الاحتفاظ بالملخّص أو مراسلتنا بالبريد الإلكتروني.',
            provider_token: 'رفض Cloudflare مفتاح الإرسال الخاص بالموقع. يجب على Brainfor استبدال رمز الخادم.',
            provider_permission: 'رفض Cloudflare منح الموقع صلاحية إرسال البريد. يجب على Brainfor مراجعة صلاحيات خدمة البريد.',
            provider_access: 'يفيد Cloudflare بأن هذا الحساب لا يملك حق الوصول إلى واجهة إرسال البريد. يجب على Brainfor تعديل إعدادات المراسلة.',
            provider_disabled: 'يفيد Cloudflare بأن إرسال البريد معطّل لهذا النطاق أو الحساب.',
            provider_account: 'لم يعثر Cloudflare على الحساب أو خدمة الإرسال المحدّدة لهذا الموقع.',
            origin: 'لم يتم التعرّف على مصدر الطلب. افتحوا النموذج على https://brainfor.net.',
            rate_limited: 'تحدّ الخدمة مؤقتًا من عمليات الإرسال. يرجى الانتظار قبل المحاولة مجددًا.',
            provider_timeout: 'لم يردّ Cloudflare في الوقت المحدّد. قبل المحاولة مجددًا، تحقّقوا من وصول الطلب لتجنّب التكرار.',
            provider_unavailable: 'خدمة بريد Cloudflare غير متاحة مؤقتًا من الخادم. لم يتم تأكيد الإرسال.',
            provider_rejected: 'رفض Cloudflare الطلب. يجب على Brainfor مراجعة الربط بخدمة البريد.'
          };
          sendStatus.textContent = (errors[error.code] || 'تعذّر تأكيد الإرسال.') + ' يبقى ملخّصكم محفوظًا في هذا النموذج. يمكنكم تنزيله أو نسخه.';
          sendButton.textContent = 'إعادة محاولة الإرسال ↗';
          sendButton.disabled = false;
        } finally {
          contactSending = false;
          $('.dialog-close').disabled = false;
        }
      });
    }

  });
  $$('[data-legal]').forEach(button => button.addEventListener('click', () => { const privacy = button.dataset.legal === 'privacy';
    const legal = `<h3>الناشر</h3><p>${config.legalName ? escape(config.legalName) : 'Brainfor مشروع مؤسسة لهندسة الحاسوب في الجزائر. يجب استكمال بيانات تعريف المؤسسة قبل الإطلاق العام.'}</p><p>${config.address ? escape(config.address) : 'العنوان المهني: يُستكمل لاحقًا.'}<br>${config.registration ? escape(config.registration) : 'بيانات التسجيل وتعريف المؤسسة: تُستكمل لاحقًا.'}<br>التواصل: ${validEmail ? escape(validEmail) : 'يُستكمل لاحقًا.'}</p><h3>حالة الموقع</h3><p>هذه النسخة مخصّصة للتحضير للإطلاق. تُعرض Sendlyy وFloutons وEduBest بوصفها أعمالًا، ولم يُنشر EduBest بعد. يظلّ Flux وRendez نموذجين افتراضيين دون ادّعاء وجود عميل أو نتائج تجارية. تُحدَّد الخدمات والآجال والحقوق والأسعار والالتزامات في كل مقترح تعاقدي.</p><h3>الاستضافة</h3><p>يُستضاف هذا الموقع على Cloudflare Pages. ويستخدم النموذج Cloudflare Email Service لإيصال الطلبات إلى بريد Brainfor.</p><h3>قبل الإطلاق العام</h3><p>يجب استكمال بيانات المؤسسة والاستضافة وتكييف النصوص مع طريقة عمل النشاط الفعلية.</p>`;
    const privacyCopy = `<h3>إعداد الملخّص</h3><p>تُستخدم المعلومات المُدخلة لإعداد طلبكم: الاسم والبريد والمؤسسة والهاتف والاحتياجات والميزانية والموعد والوصف. يمكنكم تنزيل الملخّص أو نسخه دون إرساله. لا يُتصل بأي خادم أثناء هذا الإعداد.</p><h3>الإرسال إلى Brainfor</h3><p>بالنقر على «إرسال الطلب»، تُنقل هذه المعلومات إلى خادم الموقع المستضاف لدى Cloudflare. وتوصلها خدمة البريد إلى صندوق Brainfor لدراسة مشروعكم والردّ عليكم. لا يملك الموقع قاعدة مستقلة لبيانات العملاء المحتملين. تُحفَظ الرسائل في بريد Brainfor للمدة اللازمة لمتابعة طلبكم.</p><h3>مقدّم الخدمة التقنية</h3><p>يوفّر Cloudflare الاستضافة والمعالجة التقنية للإرسال. يمكنكم الاطّلاع على <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a>. تتوقف مدد الاحتفاظ التقنية على الخدمات المستخدمة ولا يحدّدها هذا الموقع.</p><h3>وسيلة تواصل أخرى</h3><p>${directEmailReady ? 'يُعدّ زر «فتح تطبيق البريد» مسوّدة إلى contact@brainfor.net في تطبيق بريدكم. وأنتم من يقرّر إرسالها.' : 'يمكنكم الاحتفاظ بالملخّص بنسخه أو تنزيله. البريد المهني المعروض هو contact@brainfor.net؛ ولا يزال تفعيله بحاجة إلى استكمال.'}</p><h3>ملفات الارتباط والخدمات الخارجية</h3><p>لا تضيف شيفرة الموقع ملفات ارتباط تحليلية أو أدوات تتبّع إعلانية. تُحمّل الخطوط من Google Fonts، وقد ينقل ذلك بيانات تقنية مثل عنوان IP. وقد تعالج الاستضافة وخدمات حماية النموذج بيانات تقنية أيضًا.</p><h3>النماذج التوضيحية</h3><p>الطلبات والمواعيد في النماذج افتراضية. لا يُسجَّل أي شراء أو موعد حقيقي.</p><h3>معلوماتكم</h3><p>لأي سؤال حول طلبكم، أو لطلب تصحيح المعلومات المرسلة أو حذفها، ${directEmailReady ? `راسلونا على ${escape(validEmail)}.` : 'استخدموا نموذج الاتصال مع توضيح طلبكم.'} لا تزال البيانات القانونية للمؤسسة ومدد الاحتفاظ الخاصة بنشاطها بحاجة إلى تحديد قبل الإطلاق العام.</p>`;
    openDialog(`<div class="legal-copy"><p class="dialog-eyebrow">معلومات الموقع</p><h2 class="dialog-title" id="dialog-title">${privacy ? 'الخصوصية' : 'الإشعارات القانونية'}</h2>${privacy ? privacyCopy : legal}</div>`);
  }));
})();
