# Confidentialité et fonctionnement local

## État initial

- Hermes utilise uniquement Ollama sur `http://127.0.0.1:11434/v1`.
- Aucun fournisseur distant, compte ou service de messagerie n'est configuré.
- Les métriques partagées Hermes sont désactivées (`enabled: false`, `send: false`).
- Les recherches passives de mise à jour Hermes et du pilote CUA sont désactivées.
- La télémétrie CUA est désactivée et son identifiant local a été effacé.
- Mémoire, profil utilisateur, compression distante, routage intelligent et
  fournisseurs de secours sont désactivés pour le premier fonctionnement.

## DeepSeek

Utiliser l'API exige d'envoyer une requête à DeepSeek. Il n'existe donc aucun
mode sans transfert pour cette API. Au 2026-09-13, la politique publiée indique
que les entrées peuvent être collectées et que des données peuvent être traitées
et stockées en République populaire de Chine. Aucun réglage API officiel assurant
un opt-out total de conservation ou d'utilisation n'a été identifié.

DeepSeek reste donc désactivé par défaut. Une future intégration devra :

- demander un passage manuel en mode distant ;
- envoyer uniquement le texte sélectionné pour la tâche ;
- exclure mémoire, profil, historique, fichiers et secrets par défaut ;
- afficher clairement que la requête quitte le PC ;
- permettre l'annulation avant envoi ;
- ne jamais journaliser la clé ou le corps complet des requêtes.

La clé locale se trouve dans `runtime/secrets/deepseek-api-key.txt`, dossier
ignoré par Git. Elle n'a été ni lue ni utilisée pendant l'installation.

Source consultée : https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html
