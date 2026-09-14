# Roadmap — Mini / assistant personnel JARVIS

Dernière mise à jour : 2026-09-14.

## Sources et état

- Vision : `projet_jarvis_hermes_agent.txt`, lu intégralement.
- Document maître : `MASTER.md`, créé dans le cadre de la demande d'alignement.
- Dossier initial : cahier des charges uniquement ; socle documentaire et Git ajoutés, aucun code applicatif.
- Ollama, Qwen 3.5 2B et Hermes : échanges, outils et chaînes validés en local ; DeepSeek désactivé.
- Design du pet de bureau : `docs/DESIGN_PET.md`, validé le 2026-09-14.
- Production et validation comportementale : non établies.

## Objectif courant

Construire le pet de bureau V1 : un chat autonome (Electron + TypeScript) qui
vit sur le bureau et affiche les états de Hermes, avec démarrage Windows
silencieux et désactivable.

## Prochaines tâches

- [x] Rédiger le document maître factuel et les spécificités locales, sur autorisation de structurer le projet.
- [x] Vérifier le matériel, Ollama et consulter les prérequis officiels.
- [x] Télécharger et tester Qwen 3.5 2B ; trois réponses simples correctes, rapport conservé.
- [x] Installer Hermes Windows dans Mini et vérifier un échange intégré avec Ollama.
- [x] Tester plusieurs appels d'outils Hermes sans donnée personnelle.
- [x] Tester une chaîne multi-étapes d'outils (ex. écrire puis relire) et le mode approbation.
- [x] Concevoir le pet (décisions produit, design écrit dans `docs/DESIGN_PET.md`).
- [x] Vérifier les références GitHub citées (existence, licence, activité).
- [ ] Trouver des sprites de chat sous licence CC0/CC-BY vérifiée, ou produire un set original (placeholder en attendant).
- [ ] Pet phase 1 : fenêtre transparente, idle, marche, drag, gravité ; mesure RAM.
- [ ] Pet phase 2 : environnement Windows (barre des tâches, bords, DPI).
- [ ] Pet phase 3 : vie féline (sommeil, étirements, réactions souris).
- [ ] Pet phase 4 : Pet Controller (state machine, besoins, cooldowns).
- [ ] Pet phase 5 : câblage Hermes (protocole d'événements, états affichés).
- [ ] Pet phase 6 : menu tray, démarrage Windows silencieux et désactivable.
- [ ] Pet phase 7 : assets sous licence vérifiée et polissage.

## Centralisation du runtime — critères

- Résultat attendu : modèles Ollama sous `runtime/ollama/models` et installation,
  mémoire, configuration et skills Hermes sous `runtime/hermes`.
- À préserver : modèle Qwen téléchargé, dépôt Git léger, installation Ollama
  Windows réparable et absence de secrets ou mémoires dans GitHub.
- Contrôles : taille et contenu avant/après, variables utilisateur effectives,
  redémarrage Ollama, présence du modèle, diagnostic Hermes et échange local.
- Le programme Ollama peut rester dans son emplacement d'installation Windows :
  ses données lourdes sont centralisées ; un déplacement manuel du binaire n'est
  pas retenu car l'installateur et la mise à jour s'appuient sur cet emplacement.

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

## Chantier — outils Hermes et mesure RAM — critères

- Résultat attendu : plusieurs appels d'outils Hermes (file, terminal, vision)
  réussis avec Qwen 3.5 2B sur des données fictives uniquement, dans un dossier
  de test dédié sous `runtime` ; mesure de la RAM libre avec Ollama et Hermes
  simultanés (modèle chargé + session active).
- À préserver : aucune donnée personnelle, aucun compte, aucun accès réseau
  externe (Ollama local uniquement), aucune écriture hors du dossier de test,
  installations existantes intactes, secrets non lus.
- Contrôles : fichier créé puis relu par l'outil file, commande terminal
  inoffensive exécutée, image de test générée localement décrite par l'outil
  vision ; RAM libre mesurée avant chargement, modèle chargé, et pendant une
  session Hermes ; sorties et preuves conservées sous `validation/`.

## Chantier — outils Hermes et mesure RAM — résultats

Exécuté le 2026-09-14, preuves dans `validation/2026-09-14-outils-hermes/`.
- Outil file : exécution réelle avec contenu exact, mais chemin mal résolu
  (écriture dans le profil utilisateur) et synthèse incohérente.
- Outil terminal : exécution réelle capturée (`TERMINAL_OUTIL_OK`).
- Outil vision : description exacte de l'image de test (`TOOL TEST 42` sur
  `#00008B`).
- RAM : 4 354 Mo libres à vide → ~2 025 Mo modèle chargé → minimum 1 403 Mo
  pendant l'échange Hermes. Marge étroite mais suffisante à ce stade.
- Enseignements : mécanique des appels d'outils fiable ; compréhension des
  chemins et synthèses du petit modèle peu fiables (à re-tester en chaîne) ;
  lancer Hermes sans guillemets imbriqués dans le prompt et sans fusion
  `2>&1` PowerShell.

## Chantier — chaîne d'outils et approbations — critères

- Résultat attendu : chaîne d'outils en une session réussie (écrire puis relire
  avec le même outil ; écrire puis lire via terminal), contenus rapportés à
  l'exact ; verdicts du système d'approbation documentés via
  `hermes approvals test` (dry-run, n'exécute rien) ; comportement observé des
  approbations en mode one-shot non interactif.
- À préserver : données fictives, chemins absolus sous `runtime` uniquement,
  aucune commande destructive, aucun accès réseau externe, aucune donnée
  personnelle.
- Contrôles : fichier créé et contenu relu mot pour mot ; sortie terminal
  capturée exacte ; verdicts `approvals test` notés ; aucune commande réellement
  exécutée par le dry-run ; preuves conservées sous `validation/`.

## Chantier — chaîne d'outils et approbations — résultats

Exécuté le 2026-09-14, preuves dans `validation/2026-09-14-chaine-outils/`.
- Chaîne file (écrire puis relire) : réussie, chemin absolu respecté, contenu
  relu exact. L'usage de chemins absolus corrige l'erreur de chemin relative
  du matin.
- Chaîne file puis terminal (`Get-Content`) : réussie, sortie rapportée
  correctement.
- Approbations (dry-run) : commandes simples → allow ; `Remove-Item -Recurse`
  → ask-approval (règle destructive détectée). Les garde-fous fonctionnent ;
  l'invite en mode non interactif reste à observer plus tard, sans commande
  destructive.
- Verdict : la mécanique des outils et les chaînes courtes sont fiables avec
  Qwen 3.5 2B à contexte 64K. Le pet (chat, Electron + TypeScript) a été
  conçu le 2026-09-14 : `docs/DESIGN_PET.md`.

## Chantier — Pet de bureau V1 — critères

Résultat attendu : un chat visible sur le bureau qui vit seul (marche, dort,
réagit à la souris, gravité) et change d'état quand Hermes travaille ;
démarrage Windows silencieux, désactivable et vérifié. À préserver : Hermes
intact, aucune donnée personnelle, aucun secret versionné, aucune action
système depuis le pet. Contrôles : lancement/fermeture propres, RAM mesurée,
comportement observé sans modèle chargé, réception d'un événement Hermes
réel, autostart activé puis désactivé testés. Détails : `docs/DESIGN_PET.md`.

## Chantier — vérification des références et licences — critères

- Résultat attendu : pour chacune des quatre références GitHub citées par le
  document externe, faits vérifiés par API GitHub (existence, licence, activité,
  archivage, langage) et verdict d'usage pour le projet ; critères de licence
  retenus pour les sprites du chat (CC0/CC-BY ou création originale).
- À préserver : aucune installation, aucun code copié, aucun asset téléchargé
  tant que les licences ne sont pas vérifiées ; décisions structurantes du
  design inchangées.
- Contrôles : réponses API consignées, verdict écrit pour chaque référence,
  cohérence avec `docs/DESIGN_PET.md` mise à jour.

## Chantier — vérification des références et licences — résultats

Vérifié le 2026-09-14 par API GitHub (`gh api`), aucun code ni asset téléchargé.
- `spyderweb47/Desktop-Virtual-buddy` : existe, MIT, TypeScript, actif 2026-04.
  Référence principale, réutilisable avec attribution.
- `ccyrene/clawd` : existe, sans licence, actif 2026-04. Inspiration uniquement
  (moteur Windows, escalade), aucune copie de code.
- `WildxHV/desktop-pet` : existe, sans licence, Python, actif 2026-06.
  Inspiration comportement félin uniquement.
- `MorningAppleDew/shimeji-ee` : existe, sans licence, dormant depuis 2016.
  Vocabulaire d'animations historique uniquement ; ne pas utiliser son moteur.
- Sprites de chat : aucun pack CC0/CC-BY sélectionné ; la V1 démarre avec un
  placeholder original, l'asset final reste à trouver ou produire.

## Points en attente

- Un seul pet décidé (chat, Electron + TypeScript, design validé). Deuxième pet non retenu à ce stade.
- DeepSeek envisagé pour le modèle distant, désactivé ; passerelle manuelle à définir (minimiser le texte envoyé, exclure mémoire, fichiers et historique) ; aucun routage automatique arrêté.
- Centralisation restante : environ 2,96 Go de programme Ollama restent dans son emplacement Windows géré ; environ 54 Mo de pilote CUA restent hors Mini.
- Références GitHub du document externe et licences d'assets : à vérifier avant usage.
- Versions, compatibilité réelle et ressources à re-mesurer au fil des phases du pet ; les exemples du cahier des charges ne valent pas mesure ni validation.

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
