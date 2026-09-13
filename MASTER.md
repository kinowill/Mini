# Mini — Document maître

Mis à jour le 2026-09-13.

## But

Construire un assistant personnel pour Windows, présent sur le bureau sous forme
de compagnon animé, capable de converser et d'agir avec des permissions progressives.
L'identité, la mémoire et les procédures doivent persister quand le modèle change.

## État courant

- Projet au stade du cadrage : cahier des charges et documentation, aucun code applicatif.
- Ollama 0.33.3 et Qwen 3.5 2B opérationnels. Hermes Agent 0.21.2 installé et relié au modèle local ; premier échange intégré réussi. DeepSeek non activé.
- Socle documentaire publié sur https://github.com/kinowill/Mini (`main`, commit initial `043bc53`) ; synchronisation vérifiée, preuves dans `VALIDATION_LOG.md`.

## Choix et pistes

- Choix du cahier des charges : Hermes Agent comme noyau ; le pet est une interface.
- Architecture visée : modèle local via Ollama et modèle distant interchangeable.
- Piste exprimée le 2026-09-13 : API DeepSeek pour les tâches complexes et petit modèle local fluide sur le PC actuel. Compatibilité, performances et coûts non vérifiés.
- Préférence provisoire : deux pets. Leur identité, leur mémoire commune ou séparée et leur relation aux modèles restent à décider.
- Exigence retenue : les deux pets devront pouvoir démarrer silencieusement avec Windows et ce démarrage devra être désactivable.
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

Runtime centralisé sous `C:\PROJETS\Mini\runtime` et exclu de Git : modèles
Ollama, installation/configuration/mémoire Hermes, installateurs et secrets.
Variables utilisateur : `OLLAMA_MODELS`, `OLLAMA_CONTEXT_LENGTH=64000` et
`HERMES_HOME`. Le programme Ollama reste dans son emplacement Windows géré par
son installateur. Le pilote CUA optionnel conserve environ 54 Mo hors projet ;
sa télémétrie et son démarrage automatique sont désactivés.

## Structure et sources de vérité

1. `MASTER.md` : état opératif et décisions.
2. `ROADMAP.md` : phases, critères et prochaines tâches.
3. `VALIDATION_LOG.md` : contrôles réellement exécutés et portée.
4. `projet_jarvis_hermes_agent.txt` : vision initiale conservée intégralement ; ses capacités sont des objectifs, pas des validations.
5. `AGENTS.md` : spécificités locales complétant le protocole global complet v1.4.
6. `README.md` : point d'entrée du dépôt.

Il n'existe encore ni code applicatif, ni migration, ni déploiement.

## Prochain chantier

Évaluer la fiabilité de Qwen avec les outils Hermes avant de développer les pets.
Qwen 3.5 2B reste un candidat : premier appel 66,36 s (dont 45,21 s de chargement),
puis 0,38 et 0,27 s ; 32–42 tokens/s, contexte 4096, partage CPU/GPU 37 %/63 %.
Ces essais courts ne valident ni les tâches longues, ni les outils, ni la mémoire.
Preuve : `validation/2026-09-13-ollama.json`.
Hermes 0.21.2, révision `476dbfe`, est configuré sur l'URL locale
`http://127.0.0.1:11434/v1`. Métriques, mises à jour passives, mémoire,
routage intelligent et fournisseurs de secours désactivés. Premier échange :
« HERMES LOCAL OK ».

## Limites à préserver

Mémoire indépendante du modèle, priorité au local et outils extensibles.
Permissions progressives ; pas de secrets dans les prompts ou dans Git.
Les données envoyées à une API, les accès aux comptes, l'accès distant et les
actions sensibles devront être cadrés avant activation. Aucune exposition réseau
publique ni connexion à un compte personnel n'est réalisée par ce chantier.
La clé DeepSeek fournie a été déplacée sans lecture dans
`runtime/secrets/deepseek-api-key.txt`, ignoré par Git. Elle n'a pas été utilisée.
L'API DeepSeek reste à activation manuelle : aucun fichier, mémoire, historique
ou donnée personnelle ne doit lui être envoyé automatiquement.

## Protocole

Le protocole complet v1.4 est déjà installé globalement et visible dans cette
session, référence `a24f2443f64b09932a27db7343a87f6b18b86e05` de
https://github.com/kinowill/PROTOCOLE-CODEX.
Le dépôt ajoute ses instructions locales sans modifier l'installation globale.
Une autre machine doit disposer de ce protocole complet pour retrouver ce cadre.
Le comportement dans une nouvelle session n'a pas été testé.
