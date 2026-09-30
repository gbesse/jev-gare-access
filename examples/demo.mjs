// Objectif : montrer une décision sémantique avec des données entièrement synthétiques.
import assert from "node:assert/strict";
import { assessStationAccess } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
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
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "assistance_required", probabilities: {
  "accessible": 0.05,
  "assistance_required": 0.85,
  "uncertain": 0.05,
  "impossible": 0.05
}, confidence: 0.85 } }, usage: { input_tokens: 120, output_tokens: 0 } }));
const résultat = await assessStationAccess(dossier, provider);
assert.equal(résultat.decision, "assistance_required");
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · probabilité : ${résultat.probability}`);
