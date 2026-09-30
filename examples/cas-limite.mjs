// Objectif : vérifier qu’une règle explicite évite un appel Jev inutile.
import assert from "node:assert/strict";
import { assessStationAccess } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-16"
  },
  "stationOpen": false
};
const provider = createFakeProvider(() => { throw new Error("Jev ne doit pas être appelé"); });
const résultat = await assessStationAccess(dossier, provider);
assert.equal(résultat.decision, "impossible");
assert.equal(résultat.deterministic, true);
assert.equal(provider.calls, 0);
console.log(`Décision : ${résultat.label} · appels Jev : ${provider.calls}`);
