# Quiz JavaScript – HTML/CSS/JS vanilla

Un quiz minimal, accessible  et sans framework, destiné aux apprenant·es de l’Ada Tech School. Projet « vibecoder »: petites itérations guidées et commentées.

- Démo: https://quiz-js-v1.vercel.app/
- Code source: https://github.com/anais0210/quiz-js-v1

## Objectifs
- QCM avec feedback immédiat (bonne/mauvaise réponse)
- Progression « Question X/Y »
- Score final + bouton « Rejouer »
- Optionnels: meilleur score (localStorage), timer 20s/question

## Stack
- HTML/CSS/JS vanilla
- Pas de build, pas de dépendances, pas de serveur Node
- Fichiers: `index.html`, `styles.css`, `script.js`

## Démarrage local
1. Télécharger/cloner le dépôt
2. Ouvrir `index.html` dans votre navigateur (ou via un serveur local type Live Server)

## Utilisation
- Cliquer « Commencer »
- Sélectionner une réponse (clavier: Tab, Entrée/Espace)
- Cliquer « Valider » puis « Question suivante »
- Fin: affichage du score et « Rejouer »

## Accessibilité 
- `lang="fr"`, un seul `h1`, structure sémantique
- Lien d’évitement « Aller au contenu principal »
- Navigation clavier complète + focus visible
- Live region pour le feedback: `#feedback[aria-live="polite"]`
- Bouton « Suivante » désactivé tant qu’aucune réponse n’est choisie
- Cibles tactiles ≥ 44×44 px, contrastes vérifiés
- `prefers-reduced-motion` respecté

## Optionnels inclus
- Meilleur score (localStorage) + bouton de réinitialisation
- Timer 20s/question: verrouillage à 0s + feedback « Temps écoulé »

## Modèle de données (extrait)
```js
const questions = [
  { text: "JavaScript : que retourne '5' + 3 ?", answers: ["8","53","undefined","NaN"], correctIndex: 1 },
  { text: "Quel attribut HTML définit le texte alternatif d’une image ?", answers: ["title","aria-label","alt","desc"], correctIndex: 2 }
];
```

## Déploiement
- GitHub Pages: activer Pages sur la branche `main` (Settings → Pages)
- URL attendue: `https://<votre-compte>.github.io/quiz-js-v1/`
- Alternative: démo Vercel sur https://quiz-js-v1.vercel.app/

## Licence
Usage pédagogique. Merci de créditer la source en cas de réutilisation.
