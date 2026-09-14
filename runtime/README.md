# Runtime local

Ce dossier centralise les éléments lourds et privés qui ne doivent pas être
publiés sur GitHub :

- `ollama/models/` : modèles Ollama ;
- `hermes/` : installation, configuration, mémoire et skills Hermes ;
- `installers/` : installateurs téléchargés pour la maintenance locale ;
- `pet-assets/` : sprites du pet de bureau (non versionnés, voir ci-dessous).

Tout le contenu est ignoré par Git, sauf ce fichier explicatif. Les variables
utilisateur `OLLAMA_MODELS` et `HERMES_HOME` doivent pointer vers ces dossiers.
Ne jamais placer ici un fichier devant être partagé sans vérifier qu'il ne
contient ni secret, ni mémoire personnelle, ni modèle volumineux.

## Sprites du pet (pet-assets)

Le pack de sprites du chat n'est **pas versionné** (usage personnel ; le dépôt
public ne redistribue pas ces assets). Pour le récupérer sur cette machine ou
sur une autre :

- Source : https://github.com/PedroJimenezGuerrero/Black-Cat-Shimeji
  (Godot 4, GPL v3, branche `main`, ~0,13 Mo).
- Récupération, par exemple via GitHub CLI ou téléchargement du zip :
  ```
  gh repo clone PedroJimenezGuerrero/Black-Cat-Shimeji runtime/pet-assets/Black-Cat-Shimeji
  ```
  ou bien télécharger l'archive `main` depuis codeload et l'extraire dans
  `runtime/pet-assets/`.
- Disposition attendue : `runtime/pet-assets/Black-Cat-Shimeji/assets/`
  contenant les 34 dossiers d'animations (16×16 px, 4-8 frames PNG chacune).
- Seules les animations pertinentes pour le pet sont utilisées (idle, marche,
  course, saut, chute, atterrissage, escalade, attrapé, léchage, états
  expressifs) ; les frames hors sujet (attaque, sang) sont ignorées par le code.
- Si ce dossier manque au lancement, le pet démarre sans sprites (état
  d'erreur à prévoir) ; aucun téléchargement automatique n'est effectué.
