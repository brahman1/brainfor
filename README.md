# Brainfor

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

La page contient la balise de vérification Search Console fournie par le propriétaire, une URL canonique `https://brainfor.net/`, la directive `index, follow` et les métadonnées Open Graph du domaine. `dist/robots.txt` autorise l’exploration du contenu, exclut `/api/` et annonce `https://brainfor.net/sitemap.xml`. Le sitemap contient uniquement l’URL canonique de la page : les sections `#expertises`, `#projets`, etc. ne sont pas des pages distinctes.

Après publication, valider la propriété Search Console correspondant à `https://brainfor.net/`, puis soumettre `sitemap.xml`. La vérification par balise HTML s’applique à une propriété de type préfixe d’URL ; une propriété de domaine utilise une vérification DNS. L’ajout de ces fichiers ne garantit ni une indexation immédiate ni un classement dans Google.

## Informations à compléter

Coordonnées et immatriculation de l’entreprise, mentions légales, modalités de service. Les concepts interactifs restent des démonstrations fictives. Les polices Inter et Space Grotesk sont chargées depuis Google Fonts.

## Historique des tests

Le dossier `tests` contient l’ancienne suite du connecteur FormSubmit et ne couvre pas le nouveau service Cloudflare. Aucun test n’a été ajouté ni exécuté pour cette migration, conformément à la demande du propriétaire. Ne pas utiliser cette ancienne suite pour valider l’envoi Cloudflare.
