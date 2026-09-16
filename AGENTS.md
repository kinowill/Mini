# Instructions locales — Mini

Ces consignes complètent le protocole global PROTOCOLE-CODEX v1.4 intégral ;
elles ne le résument pas et ne le remplacent pas.
Source : https://github.com/kinowill/PROTOCOLE-CODEX
Révision du protocole global : a24f2443f64b09932a27db7343a87f6b18b86e05.

- Lire `MASTER.md`, `ROADMAP.md`, puis `VALIDATION_LOG.md` au démarrage.
- Un message « . » signifie commencer la prise de connaissance et identifier la
  suite documentée. Il n'autorise pas à inventer une décision produit ni à déployer.
- Documentation et échanges en français ; code en anglais.
- Préserver `projet_jarvis_hermes_agent.txt` comme vision initiale.
- Hermes est le noyau retenu. Le pet de bureau (chat, Electron + TypeScript)
  est conçu : `docs/DESIGN_PET.md`. DeepSeek reste désactivé.
- Les sprites du pet vivent hors Git dans `runtime/pet-assets/` (usage
  personnel uniquement) ; ne jamais les versionner.
- Ne pas présenter les capacités du cahier des charges comme déjà fonctionnelles.
- App du pet : `apps/pet` (Electron + TypeScript). Commandes : `npm run check`
  (typecheck, deux configs : main/preload en Node16, renderer en module ES),
  `npm run build` (compilation), `npm start` (lancement). Pour voir les erreurs
  console du renderer, lancer avec `--enable-logging` et redirections séparées
  (`Start-Process`, pas de `2>&1` sous PowerShell 5.1). Les sprites vivent hors
  Git dans `runtime/pet-assets/Black-Cat-Shimeji/assets`.
- Forge : https://github.com/kinowill/Mini ; branche initiale `main`.
- Ne jamais versionner les clés API, conversations personnelles, mémoires réelles,
  modèles téléchargés ou identifiants de comptes.
- Aucun agent parallèle sans demande explicite de l'utilisateur.
