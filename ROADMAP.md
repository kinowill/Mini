# Roadmap — Mini / assistant personnel JARVIS

Dernière mise à jour : 2026-09-13.

## Sources et état

- Vision : `projet_jarvis_hermes_agent.txt`, lu intégralement.
- Document maître : `MASTER.md`, créé dans le cadre de la demande d'alignement.
- Dossier initial : cahier des charges uniquement ; socle documentaire et Git ajoutés, aucun code applicatif.
- Ollama et Qwen 3.5 2B : premier essai effectué ; Hermes et DeepSeek non intégrés.
- Production et validation comportementale : non établies.

## Objectif courant

Établir les sources de vérité, puis préparer la phase 1 du cahier des charges :
installer Ollama si nécessaire et tester un petit modèle local adapté au PC.

## Prochaines tâches

- [x] Rédiger le document maître factuel et les spécificités locales, sur autorisation de structurer le projet.
- [x] Vérifier le matériel, Ollama et consulter les prérequis officiels.
- [x] Télécharger et tester Qwen 3.5 2B ; trois réponses simples correctes, rapport conservé.
- [ ] Préparer Hermes Windows et vérifier un échange intégré avec Ollama.

## Critères de réussite du démarrage

- Résultat attendu : document maître autonome distinguant vision, choix retenus et état observé ; prérequis connus avant installation.
- À préserver : cahier des charges original, Hermes comme noyau retenu, mémoire indépendante du modèle, approche locale prioritaire et permissions progressives.
- Contrôles prévus : relecture des documents, inspection Windows et commandes de version en lecture seule ; essai d'inférence seulement après disponibilité du moteur et du modèle.
- Environnement : Windows / PowerShell ; écritures actuellement autorisées dans `C:\PROJETS\Mini`. Toute installation hors de cette portée suit les permissions de la session.

## Premier essai local effectué — 2026-09-13

Qwen 3.5 2B est un candidat d'essai, pas un choix définitif. Attendus : réponse
courte en français, extraction exacte d'une heure et calcul simple correct.
Mesurer le temps total et le débit de génération à contexte 4096, sans raisonnement
étendu, avec requêtes fictives uniquement. Préserver les installations existantes,
ne connecter aucun compte et ne donner aucun outil système au modèle.
Conserver les requêtes, réponses, paramètres et identifiant du modèle dans un
rapport versionné. Ce test ne valide ni Hermes ni des actions réelles sur le PC.

Résultat : trois réponses correctes ; premier appel 66,36 s puis 0,38 et 0,27 s.
Preuve : `validation/2026-09-13-ollama.json`.

## Points en attente

- DeepSeek envisagé pour le modèle distant ; deux pets préférés provisoirement, sans décision sur leurs identités, mémoire ou routage.
- Versions, compatibilité réelle, ressources disponibles et modèle initial à établir ; les exemples du cahier des charges ne valent pas mesure ni validation.

## Suite prévue dans le cahier des charges

Hermes, personnalité et mémoire, modèles local/API, outils PC, skills, pet,
liaison pet–Hermes, voix, automatisations, comptes, accès distant sécurisé,
réseau local, enrichissement des skills, mesure des limites et éventuelle machine dédiée.

## Vérification documentaire du 2026-09-13

Inspection en lecture seule du dossier et lecture intégrale du cahier des charges.
Absence de `.git` dans le dossier et ses parents jusqu'à `C:\` : commandes
`git status` et `git log` non applicables. Aucun test logiciel exécuté.
Fichier de roadmap créé localement ; aucune publication ou installation effectuée.

Cette observation décrit l'état initial. Le chantier d'alignement GitHub qui suit
est tracé dans `VALIDATION_LOG.md` ; aucune installation applicative n'est réalisée.
