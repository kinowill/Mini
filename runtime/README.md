# Runtime local

Ce dossier centralise les éléments lourds et privés qui ne doivent pas être
publiés sur GitHub :

- `ollama/models/` : modèles Ollama ;
- `hermes/` : installation, configuration, mémoire et skills Hermes ;
- `installers/` : installateurs téléchargés pour la maintenance locale.

Tout le contenu est ignoré par Git, sauf ce fichier explicatif. Les variables
utilisateur `OLLAMA_MODELS` et `HERMES_HOME` doivent pointer vers ces dossiers.
Ne jamais placer ici un fichier devant être partagé sans vérifier qu'il ne
contient ni secret, ni mémoire personnelle, ni modèle volumineux.
