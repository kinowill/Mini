# Journal de validation — Mini

## 2026-09-14 — Conception du pet de bureau

- Départ : commit `93b8d12`, main propre et aligné sur origin.
- Chantier documentaire : design du pet, aucun code écrit. Skill brainstorming
  chargée ; décisions prises une par une avec l'utilisateur.
- Décisions arbitrées : un seul pet ; apparence chat ; vrai pet de bureau
  flottant ; moteur Electron + TypeScript ; architecture trois couches
  (Hermes → Pet Controller → moteur) ; vie autonome sans IA ; V1 sans
  conversation ni actions depuis le pet ; DeepSeek inchangé (désactivé).
- Document externe `Hermes_Desktop_Pet_Architecture.txt` (bureau Windows) lu
  avec esprit critique : architecture conceptuelle retenue, choix technologique
  arbitré différemment (Electron au lieu de Tauri+Rust) ; les références GitHub
  et licences d'assets citées restent à vérifier (noté dans le design).
- Rédigé `docs/DESIGN_PET.md` (compréhension, journal des décisions,
  hypothèses, architecture, protocole d'événements, périmètre V1, phases,
  critères de réussite, risques) ; mis à jour `MASTER.md`, `ROADMAP.md` et
  `AGENTS.md` en cohérence.
- Contrôles : relecture des documents modifiés ; cohérence croisée
  maître/roadmap/design vérifiée ; aucun code ni secret ajouté.
- États : repo modifié (documentation, non committée) ; production applicative
  non applicable ; validation documentaire effectuée en session, avec
  arbitrages utilisateur explicites.

## 2026-09-14 — Chaîne d'outils et approbations

- Départ : commit `66c3389`, main propre.
- Chaîne même outil (file : écrire puis relire) : réussie en ~40 s ; fichier
  `chaine.txt` créé au chemin absolu demandé, contenu relu exact
  `CHAINE OUTIL OK`. Le passage en chemins absolus corrige l'erreur de
  résolution observée le matin même avec un chemin relatif.
- Chaîne inter-outils (file puis terminal : créer puis `Get-Content`) :
  réussie en ~100 s ; `chaine2.txt` créé avec `CHAINE2`, lecture via terminal
  rapportée correctement. Synthèse finale légèrement maladroite, substance exacte.
- Système d'approbation vérifié en dry-run (`hermes approvals test`, n'exécute
  rien) : `Write-Output` et `Get-Content` → allow sans invite ; `Remove-Item
  -Recurse` → ask-approval, règle « PowerShell destructive delete (Remove-Item) ».
  Les exécutions one-shot du matin n'ont donc pas contourné les garde-fous :
  leurs commandes étaient en catégorie allow.
- Limites : comportement de l'invite d'approbation en mode non interactif non
  testé (aucune commande destructive exécutée, par critère du chantier) ; chaînes
  courtes uniquement (2 étapes) ; une seule session chacun ; preuves dans
  `validation/2026-09-14-chaine-outils/`.
- États : repo modifié (documentation et preuves, non committées) ; validation
  locale effectuée ; production applicative non applicable.

## 2026-09-14 — Outils Hermes et mesure RAM

- Départ : commit `5d508dc`, main propre. Check de contexte avant chantier : feu vert.
- Environnement : variables utilisateur `OLLAMA_MODELS`, `HERMES_HOME`,
  `OLLAMA_CONTEXT_LENGTH=64000` effectives ; `ollama list` montre qwen3.5:2b ;
  `hermes.exe --version` : v0.21.2, upstream `476dbfed`.
- Au démarrage du serveur, un avertissement « models path not accessible, using
  default » a été observé une fois, sans conséquence : le modèle est resté
  visible et utilisable. Mise à jour Ollama v0.34.0 signalée, non appliquée.
- `ollama show qwen3.5:2b` : capacités officielles completion, vision, tools,
  thinking ; contexte natif 262144, plafonné à 64000 par Hermes.
- Échange de contrôle Hermes (`-z --cli`) : sortie exacte `TOOLS SANITY OK`,
  93,9 s (chargement du modèle inclus).
- RAM (échantillons toutes les 5 s, preuve `ram-samples.txt`) : 4 354 Mo libres
  à vide sur 15 720 ; ~2 025 Mo modèle chargé ; minimum 1 403 Mo pendant
  l'échange Hermes. Modèle : 3,9 Go, CPU/GPU 55 %/45 %. La marge existe mais
  reste étroite pour deux pets simultanés.
- Outil file : deux écritures réelles exécutées, contenu exact
  `FICHIER OUTIL OK.`, mais le modèle a créé les fichiers dans
  `C:\Users\ArtLi\chantier-outils\` au lieu du dossier demandé
  (`..\chantier-outils` depuis `runtime\hermes`) et a produit deux fichiers
  (`note-outil.txt`, `note.txt`) avec un résumé final incohérent. Exécution
  d'outil réelle, compréhension de chemin et synthèse non fiables. Dossier
  parasite supprimé après vérification du contenu.
- Outil terminal : exécution réelle capturée, sortie `TERMINAL_OUTIL_OK`,
  environ 40 s. Aucune entrée ajoutée dans `terminal-sessions`.
- Outil vision : image de test 320×160 fond bleu foncé `#00008B` avec texte
  blanc `TOOL TEST 42` ; description exacte (texte et couleur hexadécimale),
  environ 40 s. Preuves : `validation/2026-09-14-outils-hermes/`.
- Incidents résolus : l'invocation directe avec `2>&1` (PowerShell 5.1) se
  bloque sur les runs avec outils (fusion stderr) ; contournement : lancement
  via `Start-Process` avec redirections séparées. Le lanceur Hermes rejette les
  guillemets doubles imbriqués dans le prompt `-z` ; utiliser des prompts sans
  guillemets ou le lancement `Start-Process`.
- Limites : prompts fictifs sans donnée personnelle, un toolset restreint par
  test (`-t file|terminal|vision`), aucune chaîne multi-étapes, commande
  terminal inoffensive, aucun accès réseau hors Ollama local, approbations en
  mode non interactif non explorées, mémoire désactivée.
- États : repo modifié (documentation et preuves copiées, non committées) ;
  validation locale effectuée sur cette machine ; production applicative non
  applicable.

## 2026-09-13 — Centralisation et installation Hermes locale

- Départ : commit `1c974bbd5ce4ceb70bd42932378fd495e814f85a`, main propre.
- Modèles déplacés de `C:\Users\ArtLi\.ollama\models` vers
  `C:\PROJETS\Mini\runtime\ollama\models` après arrêt contrôlé d'Ollama.
  Taille avant/après : 2 741 193 529 octets ; ancienne source absente.
- Variables utilisateur définies : `OLLAMA_MODELS`, `HERMES_HOME`,
  `OLLAMA_CONTEXT_LENGTH=64000`. Ollama redémarré et Qwen retrouvé.
- Qwen à 64K : réponse `OK`, 13,70 s dont 13,24 s de chargement ; `ollama ps`
  confirme 64 000 tokens, 3,9 Go, partage CPU/GPU 55 %/45 %.
- Appel d'outil fictif : Qwen a produit `get_local_time({"city":"Paris"})`
  avec `finish_reason=tool_calls` ; aucun outil réel exécuté.
- Hermes Agent 0.21.2 installé sous `runtime/hermes`, révision officielle
  `476dbfed3a76b85985674dc30e484de79859955f`. Installateur conservé localement,
  SHA-256 `226C70A90AD47E8A4D34CB11ACA4ECBEB649E2F9B67FBD009EA49791DE2D56F5`.
- Profil minimal appliqué : endpoint Ollama local, contexte 64K, outils limités
  à file/skills/terminal/vision ; mémoire, profil utilisateur, compression,
  checkpoints, routage intelligent et fournisseurs de secours désactivés.
- Métriques Hermes : collecte et envoi faux. Contrôles de mise à jour passifs
  et rafraîchissement CUA désactivés.
- Le diagnostic Hermes valide l'environnement, les paquets et la configuration.
  Il a été interrompu dès le lancement de 40 contrôles de connectivité externes.
- Échange intégré Hermes → Ollama réussi : sortie exacte `HERMES LOCAL OK`,
  session locale `20260913_155931_ca87b4`.
- L'installateur a ajouté CUA 0.28.1 hors Mini et sa télémétrie était activée
  par défaut. Télémétrie désactivée, identifiant effacé, autostart absent ;
  l'installateur signale un runtime incompatible. Environ 54 Mo restent hors Mini.
- Le programme Ollama installé par Windows reste sous AppData (environ 2,96 Go)
  pour préserver installation et mises à jour ; ses modèles lourds sont dans Mini.
- Clé DeepSeek déplacée sans lecture dans `runtime/secrets`, ignoré par Git,
  non chargée et non utilisée. Aucun appel DeepSeek effectué.
- Repo modifié : documentation et règles d'exclusion. Runtime local installé et
  échange validé. Production applicative et pets : non applicables à ce stade.

## 2026-09-13 — Premier essai local

- Départ : `54012afa3438f4f90396425c2c4055808e575375`, main propre.
- Rapport reproductible : `validation/2026-09-13-ollama.json`, requêtes, réponses,
  version, paramètres, empreinte du modèle conservés avec cette documentation.
- Inventaire CIM réussi après autorisation hors sandbox : Ryzen 5 5600H,
  16 483 872 768 octets RAM, Windows 11 10.0.26200 ; environ 4 Go RAM libres.
- NVIDIA : RTX 3050 Laptop, 4096 MiB VRAM, pilote 616.64.
- Ollama 0.33.3 préinstallé, aucun modèle initial ; la commande list a démarré
  automatiquement le service. Mise à jour signalée, non appliquée volontairement.
- Téléchargement autorisé `ollama pull qwen3.5:2b` : réussi, 2,7 Go.
- Première commande d'essai : erreur PowerShell sur une apostrophe typographique,
  avant toute requête ; commande corrigée puis exécutée avec succès.
- Trois appels API chat, température 0, think=false, contexte 4096, plafond 128 tokens.
- Salutation française attendue : obtenu « Bonjour ! », réussi, total 66,36 s,
  dont chargement 45,21 s et traitement du prompt 21,05 s.
- Extraction attendue `18:30` : obtenu `18:30`, réussi, 0,38 s.
- Calcul attendu `42` : obtenu `42`, réussi, 0,27 s.
- Débits de génération : 32,12 / 39,62 / 42,39 tokens/s ; ne mesurent pas le premier token.
- Ollama ps : 3,0 Go, CPU/GPU 37 %/63 %, maintien en mémoire temporaire cinq minutes.
- Limites : trois requêtes fictives sans outils ; aucun compte ni API distante,
  aucune validation Hermes, mémoire, pet ou tâches longues.
- Repo : documentation et preuve modifiées ; installation locale du modèle faite ;
  validation locale des trois scénarios réussie ; production applicative non applicable.

Sources officielles consultées :
- https://ollama.com/library/qwen3.5:2b
- https://docs.ollama.com/api/chat
- https://docs.ollama.com/integrations/hermes (connexion locale sur le port 11434).
- https://hermes-agent.nousresearch.com/docs/getting-started/installation (Windows natif disponible, installation non exécutée).
- https://api-docs.deepseek.com/ (aucun appel authentifié effectué).

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
