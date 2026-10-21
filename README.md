# Brainfor

## Captures EduBest

La fiche EduBest des réalisations présente le site web et l’application Android, avec une galerie HTML native traduite dans les trois langues. `dist/assets/edubest-web.png` est une capture de l’accueil local actuel (port 3120). Les captures `edubest-dashboard.png` et `edubest-app.png` proviennent des captures existantes `theme-v3-app-dashboard.png` et `theme-v3-app-mobile.png` du projet EduBest : gestion avec données fictives et aperçu de l’export web Expo de l’application. Elles ne constituent pas une validation sur appareil Android physique. Aucun compte, donnée réelle ou adresse locale n’est publié sur la fiche. Le statut indique une mise en ligne à venir. `dist/portfolio.css` gère la composition et la galerie ; les légendes sont dans `locales/static.tsv`.

## DAZO

Présentation du pilote DAZO 0.5.1 : `/erp/`, `/en/erp/` et `/ar/erp/`, avec liens depuis les réalisations, canonical et hreflang réciproques, métadonnées sociales, données structurées et sitemap. Les contenus sont maintenus dans `scripts/build_erp.py`, appelé par `scripts/build_locales.py`.

L’accueil présente les deux activités : développement sur mesure et édition de DAZO sous licence. L’ERP figure dans le menu, dans les actions du premier écran et dans une section dédiée immédiatement après le premier écran. Les pages produit réutilisent `style.css` et `languages.css` : même logo SVG recadré, typographie, palette, boutons, rythmes de sections et contrôles de langue. `erp.css` apporte uniquement les composants produit et leur adaptation mobile. Les tarifs de licence permanente affichés reprennent le catalogue initial validé dans le projet ERP (Starter 29 900 DA, Business 69 900 DA, Enterprise à partir de 149 000 DA) ; toute évolution du catalogue commercial doit être reportée dans `scripts/build_erp.py`. La demande de licence passe par le même formulaire de démonstration, sans paiement en ligne.

« Demander une démonstration » ouvre le formulaire existant dans la langue choisie avec `?product=dazo#contact`. `dist/erp-contact.js` préremplit uniquement un champ de description vide ; le visiteur complète ses coordonnées et confirme l’envoi par le parcours habituel. Aucun message n’est envoyé automatiquement. La page ne publie aucun installateur, accès local, compte, clé ou fichier de l’ERP. Le SaaS est annoncé comme non ouvert et les limites du pilote sont indiquées.

## Langues et référencement international

Trois versions HTML complètes sont publiées : français à `/`, anglais à `/en/` et arabe à `/ar/`. Le sélecteur FR / EN / العربية est accessible dans l’en-tête, ouvre le haut de la page dans la langue choisie et utilise de vrais liens explorables. Aucun changement automatique selon l’IP ou le navigateur.

Les traductions couvrent le contenu, la navigation, les attributs accessibles, les formulaires et leurs briefs, les détails de prestations, les démonstrations, les messages d’erreur, les mentions légales et la confidentialité. Les noms de marques, les captures de produits originaux et les identifiants techniques ne sont pas traduits. L’arabe utilise `lang="ar"`, `dir="rtl"`, une feuille de style adaptée et une direction isolée pour les e-mails et téléphones.

Chaque page possède son titre, sa description, sa canonical, son URL Open Graph et son aperçu social localisés. Les trois pages annoncent toutes les variantes `hreflang` (`fr`, `en`, `ar`, `x-default`), également présentes dans le sitemap. Les données structurées Organization / WebSite / WebPage décrivent l’organisation, les langues et la page courante sans inventer de coordonnées ou d’avis. `robots.txt` conserve l’accès aux trois versions et l’exclusion de `/api/`. La balise Google fournie est conservée.

Les sources des traductions sont `locales/static.tsv` et `locales/dynamic.tsv` (français, anglais, arabe, séparés par `¦`). Après une modification de la page française ou de `dist/app.js`, générer les fichiers de langue avant de committer :

```sh
python scripts/build_locales.py
```

Le générateur écrit `dist/en/index.html`, `dist/ar/index.html`, leurs scripts de texte interactif et le sitemap ; il maintient les liens de langues sur la page française. Les fichiers générés sont versionnés : la commande Cloudflare existante peut rester inchangée. Les images de partage traduites et leurs SVG sources sont dans `dist/assets/`. Aucun service de traduction tiers n’est appelé à l’exécution.

Cette livraison a été préparée sans lancer de tests ni utiliser le navigateur, conformément à la demande du propriétaire. L’indexation et le classement restent décidés par les moteurs de recherche. Dans Search Console, conserver la propriété Brainfor et soumettre le sitemap racine actualisé ; il contient les trois URL.

Site français d’ingénierie informatique en Algérie : développement web, mobile, bureau et solutions sur mesure. Identité : monogramme B original, bleu marine, bleu acier et blanc. Réalisations : Sendlyy, Floutons et EduBest (pas encore en ligne). Les démonstrations Flux et Rendez restent fictives.

## Publication sur Cloudflare Pages

Branche : `main`. Commande : `cp dist/config.example.js dist/config.js`. Sortie : `dist`. Le dossier `functions` à la racine fournit `/api/contact`. Une publication uniquement statique ne suffit pas pour envoyer les demandes.

## Formulaire : Cloudflare Email Service

FormSubmit est remplacé par l’API native Cloudflare Email Service, appelée uniquement par la fonction serveur. Le navigateur ne reçoit aucun jeton ni adresse de réception privée. Le visiteur vérifie son brief, puis choisit de l’envoyer, de le copier ou de le télécharger. Le code distingue une livraison signalée par Cloudflare d’une mise en file d’attente ; il ne confirme pas la lecture dans la boîte de réception. Une erreur conserve le formulaire.

### Configuration de production requise

Dans Pages > brainfor > Settings > Variables and secrets > Production, définir :

| Nom | Type | Valeur |
| --- | --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Texte | Identifiant du compte Cloudflare propriétaire du domaine |
| `CLOUDFLARE_EMAIL_TOKEN` | Secret | Jeton Cloudflare autorisé à envoyer des e-mails pour ce compte |
| `CONTACT_RECIPIENT` | Secret | Adresse de réception vérifiée dans Email Routing |

Pendant la migration, la fonction peut réutiliser la valeur du secret existant `FORM_SUBMIT_DESTINATION` comme adresse de réception, uniquement si `CONTACT_RECIPIENT` est absent. Malgré son ancien nom, aucune requête vers FormSubmit n’est faite. Une ancienne valeur contenant un identifiant anonyme au lieu d’une adresse n’est pas utilisable : renseigner `CONTACT_RECIPIENT` avec l’adresse vérifiée.

Activer le domaine `brainfor.net` dans Cloudflare Email Service et les enregistrements DNS demandés. L’expéditeur est fixé côté serveur à `contact@brainfor.net`. La destination est fixée par le secret serveur ; le visiteur ne peut ni la choisir ni envoyer des copies. Son adresse sert uniquement au Reply-To. Vérifier l’adresse de destination dans l’e-mail reçu de Cloudflare. Créer un jeton limité à la permission d’envoi et au compte concerné ; ne jamais le publier dans Git, `dist` ou la conversation. Redéployer après toute modification des variables.

L’envoi vers une destination vérifiée est gratuit selon la documentation Cloudflare. L’accès à Email Sending et les droits du compte restent des prérequis : si l’API n’est pas activée ou si le jeton manque, le formulaire affiche une erreur de configuration et conserve le brief. Le code et un push ne créent ni ces droits ni ces secrets.

Documentation : https://developers.cloudflare.com/email-service/api/send-emails/rest-api/
Tarifs : https://developers.cloudflare.com/email-service/platform/pricing/

### Adresse publique et redirection

`publicEmail` vaut `contact@brainfor.net`. `publicEmailReady` reste `false` tant que la redirection n’a pas été confirmée. Après activation de la règle `contact@brainfor.net` vers la boîte vérifiée, passer ce champ à `true` dans le modèle de configuration pour activer les liens mailto et le bouton « Ouvrir ma messagerie ». Répondre depuis la boîte Outlook affiche l’adresse Outlook sauf configuration séparée de l’envoi sous le domaine.

## Confidentialité

Le formulaire passe par Cloudflare et la messagerie de réception. Aucune base de prospects propre au site. Les erreurs et journaux du code ne contiennent ni contenu des demandes, ni destinataire, ni jeton. Le code conserve les contrôles d’origine, le champ piège et les limites de taille. Les anciennes protections du prestataire FormSubmit ne sont plus utilisées ; les protections Cloudflare de production sont à configurer selon le trafic.

## Interface

La sélection de texte utilise un fond bleu clair et du texte bleu marine, sur les pages et dans les briefs. Les fichiers CSS et scripts portent une version dans leur URL pour éviter les anciennes ressources en cache. Le PNG original du logo est conservé dans `dist/assets/brainfor-monogram.png`.

## Référencement Google

Les aperçus de partage utilisent l’image officielle `dist/assets/brainfor-social-v1.png` (1200 × 630), composée avec le logo original et l’identité Brainfor. Les balises Open Graph et Twitter indiquent son URL absolue, ses dimensions et son texte alternatif pour empêcher les plateformes de choisir une capture de projet du portfolio. Le SVG source est conservé à côté du PNG. Une plateforme peut conserver un ancien aperçu en cache : une nouvelle récupération du lien peut être nécessaire sur cette plateforme après publication.

La page contient la balise de vérification Search Console fournie par le propriétaire, une URL canonique `https://brainfor.net/`, la directive `index, follow` et les métadonnées Open Graph du domaine. `dist/robots.txt` autorise l’exploration du contenu, exclut `/api/` et annonce `https://brainfor.net/sitemap.xml`. Le sitemap contient uniquement l’URL canonique de la page : les sections `#expertises`, `#projets`, etc. ne sont pas des pages distinctes.

Après publication, valider la propriété Search Console correspondant à `https://brainfor.net/`, puis soumettre `sitemap.xml`. La vérification par balise HTML s’applique à une propriété de type préfixe d’URL ; une propriété de domaine utilise une vérification DNS. L’ajout de ces fichiers ne garantit ni une indexation immédiate ni un classement dans Google.

## Informations à compléter

Coordonnées et immatriculation de l’entreprise, mentions légales, modalités de service. Les concepts interactifs restent des démonstrations fictives. Les polices Inter et Space Grotesk sont chargées depuis Google Fonts.

## Historique des tests

Le dossier `tests` contient l’ancienne suite du connecteur FormSubmit et ne couvre pas le nouveau service Cloudflare. Aucun test n’a été ajouté ni exécuté pour cette migration, conformément à la demande du propriétaire. Ne pas utiliser cette ancienne suite pour valider l’envoi Cloudflare.
