# Journal de validation — Mini

## 2026-09-13 — Initialisation documentaire

### Périmètre et état

Demande : reprendre le protocole projet et aligner le dossier avec `kinowill/Mini`.
Environnement : Windows / PowerShell, branche locale `main`.
État reproductible : premier commit documentaire contenant cette entrée et tous
les fichiers concernés ; aucun code applicatif ni secret inclus.

### Contrôles effectués avant rédaction

- Lecture du protocole global, du cahier des charges complet et de la roadmap : réussie.
- Inspection du dossier : cahier des charges et roadmap uniquement, aucun dépôt Git initial.
- `gh api repos/kinowill/Mini` et `git ls-remote` : dépôt public, aucune référence distante.
- `git init -b main` : réussi.
- `git status --short --branch` : branche sans commit, les deux fichiers attendus non suivis.
- `git log --oneline -20` : non disponible, car le dépôt vient d'être créé sans commit.

### Critères du chantier

Documents cohérents avec le cahier des charges et les décisions exprimées ;
aucune capacité envisagée présentée comme réalisée ; texte original conservé ;
diff relu avant commit et égalité local/distant vérifiée après publication.

### États

- Fichiers locaux : socle documentaire rédigé.
- Publication : premier commit `043bc53aa86552833ba51bfb89863c2181dc6adb` poussé sur `main` ; égalité avec `refs/heads/main` distante vérifiée par `git ls-remote`, état local propre.
- Installation du protocole : global existant inchangé ; compléments locaux ajoutés.
- Chargement : protocole global observé dans cette session ; nouvelle session avec les compléments locaux non testée.
- Production applicative : non applicable, aucune application.
- Tests comportementaux, performances, Ollama, Hermes et DeepSeek : non exécutés.

### Résultats documentaires et incidents résolus

- `git diff --staged --check` : réussi ; diff documentaire relu avant le premier commit.
- Cahier des charges original conservé, sans modification pendant le chantier.
- Les écritures internes Git bloquées par le sandbox ont nécessité les commandes autorisées hors sandbox.
- Le premier lancement du script via Bash WSL a échoué sur le chemin Windows,
  puis sur l'identité Git absente dans WSL. Utilisation de Git Bash Windows avec
  l'identité existante : commit et push réussis, sans modification globale de configuration.
- Le présent suivi documentaire complète la preuve du premier commit ; aucun changement applicatif.
