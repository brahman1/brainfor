(() => {
 const product = new URLSearchParams(location.search).get('product');
 const messages = {"dazo": {"fr": "Je souhaite une démonstration de DAZO pour mon entreprise.\nNombre de postes : \nModules recherchés : \nDisponibilités : ", "en": "I would like a DAZO demonstration for my company.\nNumber of workstations: \nRequired modules: \nAvailability: ", "ar": "أرغب في عرض توضيحي لبرنامج DAZO لمؤسستي.\nعدد الأجهزة: \nالوحدات المطلوبة: \nالأوقات المناسبة: "}, "siyano": {"fr": "Je souhaite une démonstration et une proposition commerciale pour SIYANO.\nEntreprise : \nNombre de sites et d’utilisateurs : \nParc d’équipements : \nCloud ou serveur local : ", "en": "I would like a SIYANO demonstration and commercial proposal.\nCompany: \nNumber of sites and users: \nEquipment fleet: \nCloud or local server: ", "ar": "أرغب في عرض توضيحي واقتراح تجاري لبرنامج SIYANO.\nالمؤسسة: \nعدد المواقع والمستخدمين: \nحظيرة المعدات: \nسحابة أو خادم محلي: "}};
 const brief = messages[product === 'brainfor-erp' ? 'dazo' : product];
 const field = document.querySelector('#project-form textarea[name="message"]');
 if (brief && field && !field.value.trim()) {
  field.value = brief[document.documentElement.lang] || brief.fr;
  field.dispatchEvent(new Event('input', { bubbles: true }));
 }
})();
