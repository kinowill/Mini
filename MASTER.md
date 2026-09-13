# Mini — Document maître

Mis à jour le 2026-09-13.

## But

Construire un assistant personnel pour Windows, présent sur le bureau sous forme
de compagnon animé, capable de converser et d'agir avec des permissions progressives.
L'identité, la mémoire et les procédures doivent persister quand le modèle change.

## État courant

- Projet au stade du cadrage : cahier des charges et documentation, aucun code applicatif.
- Aucun moteur, modèle ou service installé ou testé dans le cadre de ce chantier.
- Dépôt de publication : https://github.com/kinowill/Mini ; suivi de publication dans `VALIDATION_LOG.md`.

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
RTX 3050 Laptop, Windows 11. Matériel non contrôlé ; VRAM disponible inconnue.
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

Vérifier le matériel et la présence d'Ollama/Hermes, puis consulter leurs sources
officielles actuelles pour préparer un premier essai local reproductible.
Choisir le petit modèle à partir des ressources constatées et d'un essai mesuré.
Vérifier ensuite l'intégration DeepSeek avant de construire l'interface des pets.

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
