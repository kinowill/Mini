# Mini — Document maître

Mis à jour le 2026-09-13.

## But

Construire un assistant personnel pour Windows, présent sur le bureau sous forme
de compagnon animé, capable de converser et d'agir avec des permissions progressives.
L'identité, la mémoire et les procédures doivent persister quand le modèle change.

## État courant

- Projet au stade du cadrage : cahier des charges et documentation, aucun code applicatif.
- Ollama 0.33.3 préinstallé, service démarré pendant l'inventaire ; Qwen 3.5 2B téléchargé et trois requêtes simples réussies. Hermes et DeepSeek non testés.
- Socle documentaire publié sur https://github.com/kinowill/Mini (`main`, commit initial `043bc53`) ; synchronisation vérifiée, preuves dans `VALIDATION_LOG.md`.

## Choix et pistes

- Choix du cahier des charges : Hermes Agent comme noyau ; le pet est une interface.
- Architecture visée : modèle local via Ollama et modèle distant interchangeable.
- Piste exprimée le 2026-09-13 : API DeepSeek pour les tâches complexes et petit modèle local fluide sur le PC actuel. Compatibilité, performances et coûts non vérifiés.
- Préférence provisoire : deux pets. Leur identité, leur mémoire commune ou séparée et leur relation aux modèles restent à décider.
- Le choix manuel Local / DeepSeek a été proposé par l'assistant, mais n'est pas une décision utilisateur acquise.
- Aucun routage automatique, modèle précis, fournisseur exclusif ou framework d'interface n'est arrêté.

## Environnement et stack

Environnement de travail observé : Windows, PowerShell, Git et GitHub CLI disponibles.
Machine décrite dans le cahier des charges : Ryzen 5 5600H, 16 Go RAM,
RTX 3050 Laptop, Windows 11 : matériel confirmé, 4 Go VRAM et environ 16 Go RAM.
Environ 4 Go RAM libres à l'inventaire. Ubuntu WSL2 présent et arrêté.
Commande Hermes absente du PATH Windows ; autres installations non exclues.
Stack envisagée : Hermes, Ollama, API distante et interface de bureau.
Versions, mode d'exécution d'Hermes sur Windows et technologie du pet à vérifier.

## Structure et sources de vérité

1. `MASTER.md` : état opératif et décisions.
2. `ROADMAP.md` : phases, critères et prochaines tâches.
3. `VALIDATION_LOG.md` : contrôles réellement exécutés et portée.
4. `projet_jarvis_hermes_agent.txt` : vision initiale conservée intégralement ; ses capacités sont des objectifs, pas des validations.
5. `AGENTS.md` : spécificités locales complétant le protocole global complet v1.4.
6. `README.md` : point d'entrée du dépôt.

Il n'existe encore ni code applicatif, ni migration, ni déploiement.

## Prochain chantier

Préparer Hermes natif Windows et son raccordement à Ollama avant DeepSeek.
Qwen 3.5 2B reste un candidat : premier appel 66,36 s (dont 45,21 s de chargement),
puis 0,38 et 0,27 s ; 32–42 tokens/s, contexte 4096, partage CPU/GPU 37 %/63 %.
Ces essais courts ne valident ni les tâches longues, ni les outils, ni la mémoire.
Preuve : `validation/2026-09-13-ollama.json`.

## Limites à préserver

Mémoire indépendante du modèle, priorité au local et outils extensibles.
Permissions progressives ; pas de secrets dans les prompts ou dans Git.
Les données envoyées à une API, les accès aux comptes, l'accès distant et les
actions sensibles devront être cadrés avant activation. Aucune exposition réseau
publique ni connexion à un compte personnel n'est réalisée par ce chantier.

## Protocole

Le protocole complet v1.4 est déjà installé globalement et visible dans cette
session, référence `a24f2443f64b09932a27db7343a87f6b18b86e05` de
https://github.com/kinowill/PROTOCOLE-CODEX.
Le dépôt ajoute ses instructions locales sans modifier l'installation globale.
Une autre machine doit disposer de ce protocole complet pour retrouver ce cadre.
Le comportement dans une nouvelle session n'a pas été testé.
