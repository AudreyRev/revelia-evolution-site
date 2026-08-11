# Revelia Evolution — site vitrine

Refonte du site de Revelia Evolution (bilans de compétences + formations VHSS en
entreprise), inspirée de revelia-evolution.fr mais entièrement recodée et améliorée.
8 pages HTML/CSS/JS statiques, sans framework ni étape de build.

## Structure

- `index.html`, `nos-formations.html`, `nos-bilans-de-competences.html`,
  `cout-et-financement.html`, `a-propos.html`, `faq.html`, `contact.html`,
  `mentions-legales.html` — les 8 pages du site
- `assets/css/style.css` — tout le design system (variables couleurs/typo en tête de
  fichier)
- `assets/js/main.js` — menu mobile, accordéon FAQ, formulaire de contact,
  justification pixel-précise du logo ("Revelia" / "EVOLUTION" alignés à gauche et à
  droite via mesure d'encre en canvas, voir `justifyLogoText`)
- `assets/fonts/Lovelo-Black.otf` — police du logo (licence Fontfabric vérifiée,
  usage commercial + web autorisé, voir EULA fournie par l'utilisatrice)
- `assets/img/logo/` — logos exportés en PNG transparent 300dpi (fond clair / fond
  foncé) pour cartes de visite
- `assets/docs/` — catalogue de formations en PDF
- `wordpress-embed/` — versions des 8 pages adaptées pour être collées dans un bloc
  "HTML personnalisé" Kubio (chemins absolus `/assets/...`, liens internes réécrits
  en permaliens WordPress type `/nos-formations/`)
- `guide-integration-wordpress.html` — guide de reconstruction/intégration
  WordPress, publié en Artifact partageable (kit de marque + contenu de chaque page +
  méthode d'intégration retenue)
- `.claude/server.ps1` + `.claude/launch.json` — serveur statique PowerShell local
  pour prévisualiser le site (pas de Python/Node dans cet environnement)

## Décisions prises

- **Hébergement/CMS** : le site sera intégré dans le WordPress existant de
  l'utilisatrice (Kubio), pas hébergé tel quel en statique. Méthode retenue :
  coller le code HTML de chaque page dans un bloc "HTML personnalisé" Kubio (plus
  rapide qu'une reconstruction native par blocs, au prix d'une édition de texte qui
  passera par le code plutôt que 100% visuelle).
- **Formulaire de contact** : Web3Forms (`assets/js/main.js`), nécessite une clé
  d'accès à récupérer sur web3forms.com — actuellement un placeholder
  `VOTRE_CLE_WEB3FORMS_ICI` dans `contact.html` et `wordpress-embed/contact.html`.
- **Police du logo** : Lovelo Black (fichier réel obtenu et sa licence vérifiée),
  pas une police de substitution.

## À vérifier avant mise en ligne

- Compléter les mentions légales (SIRET, forme juridique, hébergeur...)
- Re-téléverser les logos partenaires (actuellement hébergés sur l'ancien site
  revelia-evolution.fr) et le catalogue PDF dans la médiathèque WordPress
- Remplacer la clé Web3Forms placeholder
- Vérifier que les permaliens WordPress sont en mode "Titre de la publication"
