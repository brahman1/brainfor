(() => {
  if (!['dazo', 'brainfor-erp'].includes(new URLSearchParams(location.search).get('product'))) return;
  const field = document.querySelector('#project-form textarea[name="message"]');
  const briefs = {"fr": "Je souhaite une démonstration de DAZO pour mon entreprise.\nNombre de postes : \nModules recherchés : \nDisponibilités : ", "en": "I would like a DAZO demonstration for my company.\nNumber of workstations: \nRequired modules: \nAvailability: ", "ar": "أرغب في عرض توضيحي لبرنامج DAZO لمؤسستي.\nعدد الأجهزة: \nالوحدات المطلوبة: \nالأوقات المناسبة: "};
  if (field && !field.value.trim()) {
    field.value = briefs[document.documentElement.lang] || briefs.fr;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
})();
