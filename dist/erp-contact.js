(() => {
  if (new URLSearchParams(location.search).get('product') !== 'brainfor-erp') return;
  const field = document.querySelector('#project-form textarea[name="message"]');
  const briefs = {"fr": "Je souhaite une démonstration de Brainfor ERP pour mon entreprise.\nNombre de postes : \nModules recherchés : \nDisponibilités : ", "en": "I would like a Brainfor ERP demonstration for my company.\nNumber of workstations: \nRequired modules: \nAvailability: ", "ar": "أرغب في عرض توضيحي لبرنامج Brainfor ERP لمؤسستي.\nعدد الأجهزة: \nالوحدات المطلوبة: \nالأوقات المناسبة: "};
  if (field && !field.value.trim()) {
    field.value = briefs[document.documentElement.lang] || briefs.fr;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
})();
