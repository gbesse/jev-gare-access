// Objectif : vérifier que les types publics sont importables.
import { journeyCase, assessStationAccess } from "../src/index.mjs";
const dossier = journeyCase({
  "id": "exemple-1",
  "text": "Correspondance de 14 minutes ; ascenseur annoncé disponible mais quai étroit pour un fauteuil roulant.",
  "source": {
    "url": "https://example.test/donnee-source",
    "date": "2026-09-15"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
});
void assessStationAccess(dossier, { decide: async () => ({}) });
