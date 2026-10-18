# Brainfor

Site d’ingénierie informatique en Algérie. Identité fournie par l’utilisateur : monogramme B, bleu marine #132D49, bleu acier #4B759E, blanc. Valeurs : Ingénierie — Fiabilité — Innovation.

## Logo

Le PNG original est conservé sans modification dans dist/assets/brainfor-monogram.png. Des fenêtres SVG cadrent son affichage pour retirer visuellement les marges transparentes, sans redessiner ni retoucher le fichier.

## Fonctionnement

Site HTML/CSS/JS sans compilation. Servir dist via HTTP. Présentation, expertises détaillées, concepts interactifs, méthode, FAQ et formulaire de brief. Données de démonstration fictives.

## Contact

La réception est configurée vers la boîte de réception privée du propriétaire via FormSubmit. Le visiteur vérifie son brief puis confirme l’envoi depuis le site. Le téléchargement et la copie restent disponibles en alternatives. Le brouillon e-mail est proposé seulement lorsque l’adresse publique est active. Aucune base de prospects n’est hébergée par le site ; FormSubmit traite les soumissions pour leur acheminement.

## Avant ouverture au public

Renseigner les coordonnées et les mentions d’entreprise, les modalités de services et l’hébergement. La marque Brainfor remplace le nom de travail initial ; elle ne préjuge pas de l’immatriculation de l’entreprise.

## Technique

Typographie du nom : Inter 800. Titres : Space Grotesk. Corps : Inter. Polices chargées via Google Fonts avec repli système. Aucun outil de mesure ni cookie applicatif ajouté. Publication privée via Sites et projet existant conservé.

## Réalisations

Sendlyy (https://sendlyy.net/) et Floutons (https://floutons.com/) sont liés à leurs sites publics, avec des captures réelles de leurs pages d’accueil. EduBest, plateforme de gestion scolaire, est présenté avec la mention « Bientôt en ligne », sans URL inventée. Les deux démonstrations fictives restent accessibles dans un panneau distinct.

## Réception des demandes — FormSubmit

Adresse : la boîte de réception privée du propriétaire. Le visiteur vérifie son brief puis confirme l’envoi. Le site transmet les champs à FormSubmit par POST AJAX ; le service achemine un e-mail avec Reply-To correspondant au visiteur. Aucune clé SMTP côté navigateur. Les états accepté, activation, erreur et résultat incertain sont distincts. Le formulaire est conservé en cas d’échec. Un champ piège complète les protections du service.

L’activation a été confirmée par le propriétaire et la réception d’un e-mail de test dans Outlook a été confirmée. En cas de nouvelle adresse ou de nouvelle configuration nécessitant une activation, suivre le lien FormSubmit reçu par e-mail, vérifier les courriers indésirables et confirmer une vraie réception. Les protections CAPTCHA n’ont pas été désactivées. Le téléchargement et la copie restent disponibles.

La notice de confidentialité mentionne FormSubmit, le destinataire, la finalité et la conservation de 30 jours annoncée dans la documentation du prestataire. Les paramètres antérieurs de coordonnées non renseignées restent à compléter.

## Adresse publique

L’adresse affichée est contact@brainfor.net. Cette boîte n’est pas encore créée : publicEmailReady reste false et aucun lien mailto vers cette adresse n’est proposé. Le formulaire continue de fonctionner avec son destinataire de réception actuel. La ligne E-mail dans le brief est celle saisie par le visiteur.

Le champ formSubmitId permet de remplacer l’adresse de destination dans le point d’accès public par l’identifiant anonyme fourni par FormSubmit, sans modifier le destinataire réel. Tant que ce champ est vide, l’adresse de réception reste nécessaire dans la configuration technique du service.

## Développement local

Le site ne nécessite aucune compilation ni dépendance npm. Avant le premier lancement, copier `dist/config.example.js` en `dist/config.js` et renseigner la configuration. Pour le prévisualiser avec Python :

```sh
python -m http.server 4173 --directory dist
```

Ouvrir http://localhost:4173. Le formulaire doit être servi par HTTP(S), pas ouvert en fichier local. Les tests isolent le service d’envoi et n’envoient aucun e-mail :

```sh
node tests/contact-send.test.cjs
```

## Déploiement statique

Publier le contenu de `dist/`. Sur un hébergeur demandant un dossier de sortie, choisir `dist` et aucune commande de compilation. `.openai/hosting.json` conserve l’identité du site publié via Sites. Aucun workflow de déploiement automatique n’est installé dans ce dépôt.

## Configuration de réception et confidentialité

Le dépôt est public. `dist/config.js`, qui contient la configuration personnelle de réception de la version déjà publiée, est volontairement exclu de Git. Le dépôt fournit `dist/config.example.js` avec des valeurs publiques et un destinataire vide. Copier ce modèle en `dist/config.js` pour lancer ou déployer une nouvelle instance.

Pour activer l’envoi, renseigner `formSubmitId` avec l’identifiant anonyme fourni par FormSubmit. Cet identifiant de formulaire est conçu pour être public et remplace l’adresse de réception dans le point d’accès. Aucune clé de compte ni mot de passe n’est nécessaire. Sans identifiant ou destinataire configuré, l’envoi automatique n’est pas disponible ; la préparation, la copie et le téléchargement du brief restent utilisables.

Ne renseigner `email` avec une adresse personnelle que si l’on accepte qu’elle soit accessible dans les fichiers du site déployé. L’exclusion Git protège ce dépôt mais ne rend pas privée une valeur incluse dans des fichiers servis au navigateur. `publicEmail` contrôle uniquement l’adresse affichée.
