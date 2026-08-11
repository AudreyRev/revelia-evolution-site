# État du projet — Revelia Evolution

Mis à jour au 06/08/2026. Site vitrine (bilans de compétences + formations
VHSS), refonte de revelia-evolution.fr.

## Architecture actuelle

Site statique multi-pages, sans backend ni base de données.

```
/
├── index.html, nos-formations.html, nos-bilans-de-competences.html,
│   cout-et-financement.html, a-propos.html, faq.html, contact.html,
│   mentions-legales.html        8 pages, chacune autonome (head/body complets)
├── assets/
│   ├── css/style.css            design system unique (variables couleur/typo en tête)
│   ├── js/main.js               comportements partagés, chargé sur les 8 pages
│   ├── fonts/Lovelo-Black.otf   police du logo, auto-hébergée
│   ├── img/logo/                2 exports PNG du logo (fond clair / fond foncé)
│   └── docs/                    catalogue de formations en PDF
├── wordpress-embed/             8 variantes des pages, chemins réécrits pour WordPress
│   (copies dérivées des 8 pages racine — pas la source de vérité)
├── guide-integration-wordpress.html   guide de migration, publié en Artifact séparé
├── CLAUDE.md                    contexte projet pour Claude Code
└── .claude/                     serveur de prévisualisation local (PowerShell)
```

Chaque page HTML est indépendante (pas de templating serveur) : le header, le
footer et les balises `<link>`/`<script>` sont dupliqués dans les 8 fichiers. Toute
modification structurelle (nav, footer) doit être répercutée manuellement sur
chacun — `assets/css/style.css` et `assets/js/main.js` sont en revanche partagés et
ne nécessitent qu'une seule modification.

## Technologies utilisées

- HTML5 / CSS3 (variables CSS, Grid, Flexbox) — aucun framework
- JavaScript vanilla (aucune dépendance, aucun bundler)
- Polices : Lora, Inter, League Spartan (Google Fonts) + Lovelo Black (fichier
  auto-hébergé, licence Fontfabric vérifiée pour usage commercial/web)
- Formulaire de contact : Web3Forms (API tierce gratuite, appelée en `fetch()`
  depuis `main.js`)
- Aucun gestionnaire de paquets, aucun outil de build, aucun contrôle de version
  (pas de dépôt git initialisé)
- Prévisualisation locale : petit serveur statique PowerShell
  (`.claude/server.ps1`), écrit sur mesure car l'environnement ne dispose ni de
  Python ni de Node.js

## Fonctionnalités terminées

- 8 pages complètes avec contenu réel (pas de texte de remplissage) : accueil,
  formations (9 modules détaillés + catalogue PDF téléchargeable), bilans de
  compétences (formules Essor/Élan/Éclosion), coût & financement (règles CPF/décret
  2026), à propos, FAQ (accordéon), contact, mentions légales (informations légales
  réelles renseignées : SIRET, hébergeur OVH, directrice de publication, politique
  de confidentialité RGPD complète)
- Navigation responsive avec menu mobile
- Accordéon FAQ (un seul item ouvert à la fois)
- Formulaire de contact fonctionnel (validation, état de chargement, message de
  succès/erreur), branché sur Web3Forms
- Animations de révélation au scroll
- Logo recréé avec les polices de marque exactes (League Spartan + Lovelo Black),
  justifié au pixel près par mesure d'encre en canvas (`justifyLogoText` dans
  `main.js`) pour que "Revelia" et "EVOLUTION" s'alignent des deux côtés — le calcul
  tient désormais compte du `letter-spacing` CSS de "Revelia" (bug corrigé le
  04/08)
- Exports du logo en PNG transparent haute résolution (fond clair/foncé) pour
  supports imprimés — réutilisés pour recomposer le logo dans le catalogue PDF
- Catalogue de formations en PDF (V16, 20 pages) : refonte complète pour
  correspondre à la charte du site — polices réelles (Lora/Inter/League Spartan,
  téléchargées depuis Google Fonts et instanciées en statique avec fontTools),
  couleurs corrigées (logo et fonds jaunes en `#e3a72e`, plus aucune variation
  intempestive), page sommaire (p.5), page de vue d'ensemble des 9 modules en
  grille de cartes façon `nos-formations.html` (p.6), les 9 pages module
  harmonisées sur un seul gabarit (fini l'alternance navy/or héritée de l'ancien
  document), tableau "Obligations légales" et page "Sources" recolorés (l'ancien
  document utilisait un rose/magenta hors charte, probablement un reliquat d'export
  Google Docs, corrigé par retouche des images sources). Généré via un pipeline
  Python (pypdf/reportlab/pdfplumber/PyMuPDF, voir "Environnement local"
  ci-dessous). Les 9 pages module alternent police bleue/jaune (comme l'ancien
  document), utilisent toute la hauteur de page (le coût est aligné en bas), et
  le bandeau de titre de chaque section rejoint le tableau de droite sans blanc.
  Les 9 pages module n'affichent plus le tag/numéro d'en-tête (retiré à la demande
  de l'utilisatrice) ; la vue d'ensemble (p.6) garde le numéro mais plus le tag. La
  taille de police du corps de texte s'ajuste automatiquement (10.6pt → 8.2pt par
  paliers) si le contenu d'un module est trop dense pour tenir sur une page.
  Le logo (icône + texte "Revelia EVOLUTION") est désormais reconstruit
  directement depuis les vraies polices du site (League Spartan Bold + Lovelo
  Black, avec l'espacement de lettres exact calculé en direct dans le navigateur
  via `justifyLogoText`) plutôt que depuis un ancien export PNG figé — fidélité
  quasi parfaite (< 2px d'écart sur un rendu 900px). Fichier source également
  conservé dans
  `…/Desktop/projet/offres formations/Revelia-Evolution-Formations_V16.pdf`.
- Couleur du logo harmonisée sur tout le site : le texte "EVOLUTION" utilisait
  `--gold-600` (`#c98f1e`) au lieu de `--gold-600` réservé au texte seul — le logo
  utilise désormais `--gold-500` (`#e3a72e`) partout, comme l'icône
- Icône "prix" corrigée sur `nos-formations.html` : l'ancien pictogramme
  ressemblait à un signe dollar ($) ; remplacé par une icône euro (€)
- Guide de migration WordPress/Kubio complet, publié en Artifact partageable (non
  resynchronisé avec les derniers contenus — voir "Bugs connus")
- 8 fichiers `wordpress-embed/` prêts à coller dans des blocs HTML Kubio
- Témoignages : 5 avis clients (Nathalie, Anissa, Hélène, Clément, Monia dans cet
  ordre), avatars alignés par ligne
- Bilans de compétences : coût affiché pour chaque formule (Essor 1 600 €, Élan
  2 190 €, Éclosion 2 650 €), les 3 boutons "Choisir" alignés en bas de carte
  quelle que soit la longueur du texte, ribbon Élan renommé "Le plus demandé"
- Mentions légales : section "Les modalités de réclamation" ajoutée, "Cookies"
  promu au même niveau que "Politique de confidentialité" et déplacé après
  "Formulaire de contact"
- Témoignages : ajout du témoignage d'Anna (6e carte, avatar "A"), sur
  `index.html` et `wordpress-embed/accueil.html`
- **Alignement du logo "Revelia"/"EVOLUTION" (bord droit) résolu à la source** :
  le site (`justifyLogoText` dans `main.js`) était en réalité déjà correct
  (écart mesuré < 0,05 mm en conditions réelles) — le vrai défaut vivait dans
  le PDF, où 3 exemplaires du logo dupliqués dans le fichier (pages
  couverture/contact/formations, fond blanc, navy et doré) accusaient tous un
  manque identique d'environ 0,6 mm sur "EVOLUTION". Corrigé en reconstruisant
  le texte du logo en vectoriel pur à partir des vraies polices (League
  Spartan Bold téléchargée depuis google/fonts + Lovelo Black locale, via
  fontTools) et du même calcul de justification que `justifyLogoText`, avec un
  écart final nul (mesuré au pixel de police près). Réinjecté sur les 20 pages
  du catalogue PDF, dans la bonne variante de couleur selon le fond de chaque
  page (navy/or sur blanc, crème/or sur navy, tout-navy sur or).
- **4 logos SVG vectoriels livrés** dans `assets/img/logo/` :
  `revelia-evolution-icon.svg`, `revelia-evolution-logo.svg` (icône + texte)
  et leurs variantes fond foncé `-blanc.svg` (Revelia en blanc/crème, icône
  blanc/or, EVOLUTION reste doré) — texte vectorisé en vrais contours de
  police (pas de dépendance à une police installée), alignement bord droit
  mathématiquement exact.
- **Pages 17-18 du catalogue PDF reconstruites en vectoriel natif** (elles
  étaient auparavant deux images bitmap mal cadrées : tableau débordant du
  cadre, police non conforme à la charte, en-tête de couleur incohérente).
  Reconstruites avec reportlab (mêmes polices Lora/Inter que le reste du
  document) en conformité avec la maquette de référence fournie par
  l'utilisatrice : tableau "Seuil d'effectif / Obligation / Détail" à
  en-tête doré, tableau des propositions de loi (PPL) à en-tête navy, ordre du
  texte respecté ("À retenir" et "À surveiller" entre les deux tableaux),
  liste complète des 5 sources (au lieu d'une ligne condensée), coins
  arrondis et marges cohérents avec le reste du document, sans chevaucher le
  logo. Les bandeaux de section ("Évaluation et prévention des risques...",
  "Représentation du personnel et référents", "Affichage et information...",
  "Mesures de prévention recommandées...") ont une teinte dorée dédiée,
  distincte de l'alternance blanc/gris très pâle des lignes de données, pour
  bien les différencier visuellement.
- **Page "Coût des formations" supprimée du catalogue PDF** (jugée non
  pertinente) : le catalogue passe de 20 à 19 pages. Le sommaire (page 4) a
  été mis à jour en conséquence — ligne retirée, "Obligations légales de
  prévention des entreprises" et "Sources" renumérotées 16/17 (au lieu de
  17/18), avec la même ligne pointillée que les autres entrées. Tous les
  numéros de page après l'ancienne page 16 ont été décalés de -1 dans le
  contenu (nouvelle numérotation 16-19 sur les 4 dernières pages).
- **Taille du logo PDF corrigée** : la première passe de correction
  d'alignement (ci-dessus) avait préservé la hauteur d'origine du logo au
  lieu de sa largeur — comme le nouveau tracé vectoriel est
  proportionnellement plus étroit que l'ancien, le logo ressortait
  visiblement plus petit sur toutes les pages à logo seul (repéré par
  l'utilisatrice sur la page 5, fond doré, mais présent partout). Corrigé en
  préservant la largeur d'origine (86pt) plutôt que la hauteur. La page 5
  avait en réalité un logo plus petit dès l'origine du document (72,9pt de
  large au lieu de 86pt, position légèrement différente) — toujours perçu
  comme trop petit après ce premier correctif ; alignée sur la taille et la
  position exactes utilisées sur toutes les autres pages à logo seul.
- **VSS → VHSS** : plusieurs occurrences de l'acronyme incomplet "VSS"
  corrigées en "VHSS" (Violences et Harcèlement Sexistes et Sexuels) sur la
  page 2 ("Ce que nous proposons") — paragraphe de gauche, intro et deux
  puces de la colonne "À qui s'adressent nos formations ?" (texte reformulé
  pour englober harcèlement + burn-out + VHSS, pas seulement VHSS, avec
  reflow complet de la colonne et repositionnement des puces).
- **Titre de la page 3 simplifié** : "Le cadre sécurisant : un engagement
  essentiel de nos formations VHSS" → suppression de "VHSS" en fin de titre.

## Fonctionnalités en cours

- **Intégration WordPress** : la méthode est choisie et les fichiers sont prêts,
  mais la mise en ligne effective dans le WordPress de l'utilisatrice n'est pas
  confirmée — dépend de son partenaire, hors de portée de cette session
- **Formulaire de contact** : fonctionnel en local mais désactivé en pratique tant
  que la clé Web3Forms réelle n'est pas renseignée (voir Bugs connus)

## Bugs connus / limitations

- **Formulaire de contact inopérant** : `contact.html` et
  `wordpress-embed/contact.html` contiennent encore la valeur factice
  `VOTRE_CLE_WEB3FORMS_ICI` à la place d'une vraie clé Web3Forms — les messages ne
  partiront pas tant qu'elle n'est pas remplacée
- **Logos partenaires externes** : les logos "Mission locale Sélestat" et "Femmes
  Strasbourg" sur `index.html` (et `wordpress-embed/accueil.html`) pointent vers
  l'ancien site (`revelia-evolution.fr/wp-content/uploads/...`) — dépendance
  fragile si cet ancien site est un jour désactivé
- **Pas de contrôle de version** : aucun dépôt git, donc aucun historique ni
  possibilité de revenir en arrière facilement en cas d'erreur
- **Duplication inter-fichiers** : header/footer répétés dans les 8 pages (et à
  nouveau dans les 8 variantes `wordpress-embed/`) — un futur changement de nav ou
  de coordonnées demande 16 modifications manuelles au lieu d'une
- ~~`guide-integration-wordpress.html` désynchronisé~~ — **régénéré le 06/08** :
  9 modules, 3 formules de bilan (Essor/Élan/Éclosion), mentions légales
  complètes (SIRET, OVH, Audrey Nobis...), 6 témoignages (dont Anna),
  formulations harcèlement/burn-out/VHSS à jour partout. Republié sur la même
  URL d'Artifact.
## Environnement local — outils PDF

Python 3.12 (installé via winget le 04/08, absent de l'environnement de base) avec
`pypdf`, `reportlab`, `pdfplumber`, `pymupdf`, `fonttools`, `numpy` (+ LibreOffice
déjà présent sous `C:\Program Files\LibreOffice`) sont maintenant disponibles pour
l'édition de PDF et de documents Office en local — nécessaires pour la refonte du
catalogue de formations. Polices Lora/Inter/League Spartan téléchargées depuis le
dépôt GitHub google/fonts (variable fonts) et instanciées en statique (Regular/
SemiBold/Bold) avec `fonttools.varLib.instancer`. Scripts de génération non
conservés dans le projet (exécutés depuis le répertoire scratch de la session) —
à recréer si une future modification du catalogue est nécessaire. Session du
06/08 : mêmes polices re-téléchargées (nécessaire à chaque session, non
persistées) pour reconstruire les pages 17-18 en vectoriel et régénérer le
logo ; script de reconstruction des pages 17-18 non conservé non plus — si un
futur changement de contenu sur ces deux pages est nécessaire, il faudra soit
retrouver l'historique de session, soit reconstruire le script (logique :
reportlab `BaseDocTemplate` + `Table`/`Paragraph`, un `PageBreak()` forcé entre
la 9e et la 10e ligne du tableau des obligations pour reproduire exactement le
découpage de la maquette de référence).

## Prochaines étapes recommandées

1. Récupérer une vraie clé Web3Forms et l'appliquer aux deux fichiers `contact.html`
2. Régénérer `guide-integration-wordpress.html` pour refléter le contenu actuel
   (3 formules de bilan, 9 modules, mentions légales complètes) avant de l'utiliser
3. Suivre le guide de migration pour publier le site dans WordPress (partenaire)
4. Re-téléverser les logos partenaires et le catalogue PDF dans la médiathèque
   WordPress, puis mettre à jour les liens correspondants
5. Initialiser un dépôt git local pour sécuriser l'historique avant la mise en ligne
6. Une fois en ligne : vérifier le formulaire de contact avec un envoi test, et
   contrôler l'affichage sur mobile réel (pas seulement en prévisualisation)
