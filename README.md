# Mini

Projet d'assistant personnel pour Windows : un compagnon de bureau animé,
une identité persistante portée par Hermes Agent, et des modèles interchangeables.

**État : cadrage documentaire. Aucune application utilisable pour le moment.**

La direction envisagée associe un petit modèle local via Ollama à une API pour
les tâches plus complexes. DeepSeek est la piste actuelle pour cette API.
Deux pets sont envisagés ; leur fonctionnement reste à définir.

- [Document maître](MASTER.md) : état réel, choix et inconnues.
- [Roadmap](ROADMAP.md) : prochaines étapes et critères de réussite.
- [Journal de validation](VALIDATION_LOG.md) : contrôles effectués.
- [Cahier des charges initial](projet_jarvis_hermes_agent.txt) : vision complète.
- [Instructions locales](AGENTS.md) : cadre de travail du projet.

Qwen 3.5 2B et Hermes sont maintenant reliés et leur premier échange local est
validé à 64K. Prochaine étape : éprouver les appels d'outils avant de construire
les pets. DeepSeek reste désactivé ; voir [PRIVACY.md](PRIVACY.md).

Le protocole de travail complet est chargé globalement sur la machine de travail.
`AGENTS.md` contient uniquement les compléments propres à Mini.
