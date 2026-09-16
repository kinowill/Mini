# Design — Pet de bureau (chat) relié à Hermes

Version du 2026-09-16. La phase 1 est codée dans `apps/pet` et validée ;
la vie féline et l'escalade des fenêtres sont conçues (section
« Vie féline et escalade »). Le présent design couvre la V1 ; les phases
suivantes restent au backlog.

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
- halo de visibilité autour du sprite (chat noir lisible sur fond sombre) ;
- animations : idle, marche, assis, sommeil, réveil, étirement, bâillement ;
- réactions souris : regard, poursuite, attraper/poser (drag) ;
- gravité et chute, posé sur la barre des tâches et les bords d'écran ;
- vie autonome : cycles sommeil/veille, toilette, sauts, besoins internes
  (énergie, ennui) et décisions pondérées — conçue le 2026-09-16 ;
- escalade : monter sur les fenêtres des applications (bords supérieurs et
  côtés), passer de l'une à l'autre, suivre une fenêtre déplacée, tomber
  quand elle disparaît — conçue le 2026-09-16 ;
- clics traversants : les clics atteignent les applications sauf sur le
  corps du chat ;
- états Hermes affichés (thinking, working, speaking, success, error) ;
- menu tray : quitter, mode silencieux, démarrer avec Windows (case activable) ;
- démarrage auto silencieux (utilisateur, session Windows) et désactivable ;
- mesure RAM du pet en fonctionnement (contrôle du chantier).

Exclu de la V1 (backlog) : conversation dans le pet, bulles de dialogue,
actions PC depuis le pet, sons, multi-écran (un seul écran confirmé),
DeepSeek, mémoire Hermes activée.

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

1. Pet minimal : fenêtre transparente, sprite, idle, marche, drag, gravité. **Fait le 2026-09-16** (validé, RAM ~300 Mo, halo de visibilité ajouté).
2. Environnement Windows : barre des tâches et bords déjà couverts par `workArea` ; reste à vérifier la netteté du pixel art selon le DPI. Multi-écran repoussé au backlog (un seul écran confirmé).
3. Vie féline et Pet Controller : cycles sommeil/veille, toilette, étirements, sauts, réactions souris, besoins (énergie, ennui), décisions pondérées — conception validée le 2026-09-16, à coder.
4. Escalade des fenêtres : veilleur Win32 (`koffi` + `EnumWindows`), plateformes (bords supérieurs et côtés), grimpe, sauts entre fenêtres, suivi/chute, clics traversants — conception validée le 2026-09-16, à coder.
5. Câblage Hermes : protocole d'événements, affichage des états.
6. Tray et autostart : quitter, silencieux, démarrage Windows désactivable.
7. Polissage : assets sous licence vérifiée, personnalité, skins.

Chaque phase se termine par les contrôles du chantier avant la suivante.

## Vie féline et escalade — conception validée le 2026-09-16

Conçue avec l'utilisateur (skill brainstorming), avant tout code.

### Compréhension

- Construire un chat qui vit sa vie sur le bureau : dort, se lave, s'étire,
  saute, réagit à la souris, monte sur les fenêtres des applications (y
  compris celle où l'utilisateur travaille), marche sur leurs bords et passe
  de l'une à l'autre.
- Un seul utilisateur, une seule machine, un seul écran confirmé.
- Rythme : calme avec phases actives (~60 % repos / ~40 % activité).
- Les clics traversent le chat : ils atteignent les applications sauf sur le
  corps du chat (seule façon de l'attraper).

### Journal des décisions

1. **Concevoir vie féline et escalade ensemble** (arbitré 2026-09-16) ; la
   réalisation reste découpée en deux chantiers (vie féline d'abord).
2. **Le chat va partout, y compris sur la fenêtre active** (arbitré) ; aucune
   fenêtre n'est évitée.
3. **Clics traversants** (arbitré) : `setIgnoreMouseEvents(true, {forward:
   true})` en permanence ; réactivation des événements souris uniquement
   quand le curseur est sur les pixels opaques du sprite, puis re-coupure.
4. **Accès aux fenêtres : `koffi`** (arbitré) — bindings N-API précompilés
   vers `user32.dll`, limités à `EnumWindows`, `GetWindowRect`, `IsIconic`,
   `DwmGetWindowAttribute`. Alternatives écartées : PowerShell en boucle
   (lent, pics CPU, fragile) ; sans Win32 (impossible, Electron ne voit que
   les écrans).
5. **Cerveau du chat dans le renderer** (arbitré) : machine à états et
   décisions côté rendu, le processus principal ne fournit que la géométrie
   des fenêtres par IPC. Alternative écartée : contrôleur dans le principal
   (plus robuste à long terme, plomberie prématurée).
6. **Halo de visibilité** (demandé 2026-09-16, validé visuellement) : le chat
   noir était invisible sur fond noir ; silhouette blanche floutée dessinée
   derrière le sprite, précalculée par frame au chargement.

### Architecture retenue

- **Veilleur de fenêtres (processus principal)** : toutes les ~1,5 s,
  `EnumWindows` ; filtres : visible, non minimisée, non cloaked, pas une
  fenêtre outil, pas la fenêtre du chat ; ne lit que des **rectangles** et la
  visibilité — jamais de titres, de contenu ni de captures. Publication au
  renderer par IPC (`windows:update`).
- **Plateformes (renderer)** : le sol (workArea/barre des tâches) + le bord
  supérieur de chaque fenêtre (le chat s'y tient « posé dessus ») + les
  côtés des fenêtres pour grimper (`climb_side`, `wall`, `climb_front`).
- **États** : `idle`, `sleep` (couché puis assoupi), `groom` (toilette),
  `stretch` (étirement), `walk` (sol ou bord de fenêtre), `jump`, `climb`,
  `curious`/`scared` (réactions souris), `grabbed`, `fall`. Toutes les
  animations existent dans le pack.
- **Besoins** (0-100, invisibles) : `énergie` (baisse en marchant/grimpant,
  remonte en dormant), `ennui` (monte avec le temps, baisse en explorant).
- **Boucle de décision** : toutes les 3-10 s, choix pondéré par les besoins ;
  énergie basse → dormir puis réveil/étirement/toilette ; ennui haut → phase
  active (marche, grimpe, sauts entre fenêtres) ; sinon repos majoritaire ;
  souris proche → curiosité, souris rapide → fuite d'un saut.

### Cas limites

- Fenêtre déplacée avec le chat dessus → il suit ; fermée ou minimisée → il
  tombe (gravité existante).
- Plein écran : fenêtre pleine taille → bord supérieur en haut de l'écran, il
  y marche comme ailleurs ; plein écran exclusif (jeux) → Windows le recouvre,
  il réapparaît ensuite. Rien de spécial à coder.
- Barre des tâches auto-masquée : le workArea change, le sol suit.

### Perf, confidentialité et sécurité

- Polling ~1,5 s : CPU négligeable ; `koffi` précompilé : ~0 Mo de RAM.
- Chat endormi ou immobile : dessin réduit (pas de redessin à pleine cadence),
  objectif < 5 % de CPU en moyenne ; budget RAM total < 400 Mo.
- Aucun réseau sortant, aucune action système ; appel Win32 strictement limité
  aux quatre fonctions listées.

### Plan de vérification

- Chantier A (vie féline, sans fenêtres) : cycle sommeil→réveil→étirement→
  toilette observé, sauts, réactions souris ; phase 1 non régressée (build,
  typecheck, idle/marche/drag/gravité).
- Chantier B (escalade) : monter sur une fenêtre réelle (navigateur), passer
  de l'une à l'autre, chute à la fermeture, suivi au déplacement, clics
  traversants (le clic atteint l'application sous le chat), drag intact.
- Mesures à chaque chantier : RAM du pet seul puis avec Hermes + modèle
  chargé ; CPU au repos (chat endormi).
- Multi-écran : repoussé au backlog.

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

- Les quatre références GitHub citées dans le document externe ont été
  vérifiées le 2026-09-14 par API GitHub : toutes existent. Licences :
  Desktop Virtual Buddy = MIT (réutilisable avec attribution) ; clawd,
  Desktop Pet Cat et Shimeji-ee = sans licence (inspiration uniquement,
  aucune copie). Shimeji-ee est dormant depuis 2016.
- Sprites : pack Black-Cat-Shimeji retenu le 2026-09-14 (GitHub
  `PedroJimenezGuerrero/Black-Cat-Shimeji`, Godot 4, GPL v3) — 34 animations
  de chat noir, 4-8 frames, 16×16 px, ~0,13 Mo. Décision utilisateur : usage
  personnel uniquement, stocké hors Git dans `runtime/pet-assets/` ; le dépôt
  public ne redistribue aucun sprite. Upscale pixel-art nécessaire (×4-×6).
  Animations V1 couvertes : stand/sit/lay/loaf idle, walk, run, jump, falling,
  landing, climb, wall, grabbed (drag), lick, catflip, scared, confused.
  Frames hors sujet (attaque, sang) : non utilisées.
- Comportement du pet avec deux écrans / DPI élevé : à valider sur machine.
  Un seul écran confirmé (2026-09-16) ; le multi-écran est repoussé au
  backlog, la netteté du pixel art selon le DPI reste à vérifier.
- Consommation RAM réelle d'Electron sur cette machine : mesurée en phase 1
  (~300 Mo pour le pet seul, ~2,3 Go libres restants sur cette machine).
- Chat noir sur fond sombre : résolu le 2026-09-16 par un halo lumineux
  (silhouette blanche floutée), validé visuellement par l'utilisateur sur
  son wallpaper noir.

## Sources de vérité

- `MASTER.md`, `ROADMAP.md`, `VALIDATION_LOG.md` : état et décisions du projet.
- `projet_jarvis_hermes_agent.txt` : vision d'origine, conservée intégralement.
- Document externe `Hermes_Desktop_Pet_Architecture.txt` (bureau Windows) :
  lu avec esprit critique le 2026-09-14 ; architecture conceptuelle retenue,
  choix technologique arbitré différemment (Electron au lieu de Tauri).
