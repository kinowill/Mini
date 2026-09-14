# Design — Pet de bureau (chat) relié à Hermes

Version du 2026-09-14. Document de conception, aucun code encore écrit.
Le présent design couvre la V1 ; les phases suivantes restent au backlog.

## Compréhension

- Construire un chat virtuel autonome vivant sur le bureau Windows : fenêtre
  transparente, toujours visible, qui marche, dort, observe et réagit — sans
  dépendre de Hermes, d'Internet ni d'un modèle chargé.
- Hermes est le cerveau agentique ; le chat est son interface physique.
  Hermes envoie des intentions (thinking, working, speaking, success, error…),
  jamais des commandes de mouvement ou de frames.
- Un seul pet, une seule entité Hermes : le pet ne change rien à l'identité,
  à la mémoire ni aux cerveaux (local / API future).
- Démarrage Windows silencieux et désactivable (exigence retenue).

## Journal des décisions

1. **Un seul pet** (arbitré 2026-09-14, après préférence provisoire de deux pets).
2. **Apparence : un chat** — continuité de la vision d'origine, écosystème
   d'assets le plus riche, comportements lisibles. Licence des sprites à
   vérifier : chat original ou CC0/CC-BY uniquement, jamais un personnage protégé.
3. **Vrai pet de bureau flottant** (pas le système Petdex natif de Hermes, qui
   vit dans une fenêtre de l'app) — c'est le premier code applicatif du projet.
4. **Technologie du moteur : Electron + TypeScript** — développement rapide,
   écosystème mature, référence directe existante (Desktop Virtual Buddy).
   Coût accepté : ~200-400 Mo de RAM. Alternatives étudiées : Tauri+Rust
   (plus léger, plus difficile à faire évoluer) ; Python+PyQt (prototype léger,
   rendu final moins lisse).
5. **Architecture en trois couches** : Hermes (intentions) → Pet Controller
   (états, humeurs, choix) → Moteur (rendu, physique, fenêtres). Le pet ne
   contrôle pas ses frames depuis le modèle.
6. **Vie autonome garantie** : le chat existe et vit sans IA. L'IA l'augmente,
   elle ne le conditionne pas.

## Hypothèses

- V1 : aucune conversation dans le pet, aucune action PC déclenchée depuis le
  pet. Les échanges restent dans Hermes (CLI / app). Le pet affiche l'état.
- V1 : DeepSeek reste désactivé ; aucun réseau sortant depuis le moteur du pet.
- Sprites V1 : chat simple en placeholder (petit set cohérent), en attendant
  des assets à licence vérifiée.
- Nom du chat : non décidé, non bloquant pour la V1.

## Architecture

```
            HERMES / AGENT
                  |
        intentions haut niveau (JSON local)
                  v
          PET CONTROLLER
        mood, energy, boredom,
        focus, current_action
                  |
            action choisie
                  v
        DESKTOP PET ENGINE
        animations, mouvement, physique,
        fenêtres, souris, écrans, DPI
```

### Protocole d'événements Hermes → pet

Message minimal attendu (mêmes champs quelle que soit la source du cerveau) :

```json
{ "activity": "working", "mood": "focused", "importance": 0.6, "message": null }
```

États prévus : `idle`, `thinking`, `working`, `searching`, `listening`,
`speaking`, `success`, `error`, `alert`, `waiting`.
Le transport exact (WebSocket localhost, named pipe ou fichier) est choisi au
moment du premier câblage ; le contrat ci-dessus ne change pas.

## Périmètre V1

Inclus :
- fenêtre transparente, always-on-top, positionné sur le bureau ;
- animations : idle, marche, assis, sommeil, réveil, étirement, bâillement ;
- réactions souris : regard, poursuite, attraper/poser (drag) ;
- gravité et chute, posé sur la barre des tâches et les bords d'écran ;
- états Hermes affichés (thinking, working, speaking, success, error) ;
- menu tray : quitter, mode silencieux, démarrer avec Windows (case activable) ;
- démarrage auto silencieux (utilisateur, session Windows) et désactivable ;
- mesure RAM du pet en fonctionnement (contrôle du chantier).

Exclu de la V1 (backlog) : conversation dans le pet, bulles de dialogue,
actions PC depuis le pet, sons, escalade des fenêtres d'applications,
multi-écran avancé, DeepSeek, mémoire Hermes activée.

## Contraintes

- Machine : Ryzen 5 5600H, 16 Go RAM, RTX 3050 Laptop 4 Go, Windows 11.
  Référence mesurée : ~1,4 Go libres avec modèle chargé et Hermes actif,
  ~4,3 Go libres au repos. Le pet doit rester léger (~200-400 Mo accepté) et
  le modèle Ollama se décharge seul après 5 min d'inactivité.
- Confidentialité : aucun secret dans le code ou les prompts, aucun réseau
  sortant depuis le moteur du pet, cohérent avec `PRIVACY.md`.
- Permissions progressives (niveaux du cahier des charges) : la V1 ne donne
  au pet aucune capacité d'action système.

## Ordre de construction conseillé

1. Pet minimal : fenêtre transparente, sprite, idle, marche, drag, gravité.
2. Environnement Windows : barre des tâches, bords, écrans, DPI.
3. Vie féline : sommeil, étirements, curiosité, réactions souris, transitions.
4. Pet Controller : state machine, besoins internes, cooldowns, aléatoire pondéré.
5. Câblage Hermes : protocole d'événements, affichage des états.
6. Tray et autostart : quitter, silencieux, démarrage Windows désactivable.
7. Polissage : assets sous licence vérifiée, personnalité, skins.

Chaque phase se termine par les contrôles du chantier avant la suivante.

## Critères de réussite et contrôles

- Résultat attendu : un chat visible sur le bureau qui vit seul (marche,
  dort, réagit à la souris) et change d'état quand Hermes travaille ;
  démarrage Windows silencieux, désactivable et vérifié.
- À préserver : Hermes intact, aucune donnée personnelle impliquée,
  aucun secret versionné, pas d'action système depuis le pet.
- Contrôles : lancement et fermeture propres, RAM mesurée, comportement
  observé sans modèle chargé, réception d'un événement Hermes réelle
  (ex. pendant une tâche), autostart activé puis désactivé testés.

## Risques et inconnues

- Les quatre références GitHub citées dans le document externe
  (Desktop Virtual Buddy, Clawd, Desktop Pet Cat, Shimeji-ee) n'ont pas encore
  été vérifiées (existence, licence, activité, compatibilité Windows 11).
- Sprites : trouver ou produire un set de chat cohérent et licite est le
  principal risque artistique ; la V1 démarre avec un placeholder.
- Comportement du pet avec deux écrans / DPI élevé : à valider sur machine.
- Consommation RAM réelle d'Electron sur cette machine : à mesurer en phase 1.

## Sources de vérité

- `MASTER.md`, `ROADMAP.md`, `VALIDATION_LOG.md` : état et décisions du projet.
- `projet_jarvis_hermes_agent.txt` : vision d'origine, conservée intégralement.
- Document externe `Hermes_Desktop_Pet_Architecture.txt` (bureau Windows) :
  lu avec esprit critique le 2026-09-14 ; architecture conceptuelle retenue,
  choix technologique arbitré différemment (Electron au lieu de Tauri).
