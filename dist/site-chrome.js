(() => {
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  // Homepage interactions are already handled by its localized application script.
  if (document.body.classList.contains('erp-page')) {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('#navigation');
    const labels = {fr:['Ouvrir le menu','Fermer le menu'],en:['Open menu','Close menu'],ar:['فتح القائمة','إغلاق القائمة']};
    const text = labels[document.documentElement.lang] || labels.fr;
    const setOpen = open => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', text[open ? 1 : 0]);
      menu.classList.toggle('open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  } else {
    const legal = new URLSearchParams(location.search).get('legal');
    if (legal === 'privacy' || legal === 'mentions') document.querySelector('[data-legal="'+legal+'"]')?.click();
  }
})();
