// Objectif : vérifier la normalisation, la règle déterministe et la décision sémantique.
import test from "node:test";
import assert from "node:assert/strict";
import { journeyCase, assessStationAccess } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const edge = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-16"
  },
  "stationOpen": false
};
test("exige une source", () => assert.throws(() => journeyCase({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => { const provider = createFakeProvider(() => { throw new Error("appel interdit"); }); assert.equal((await assessStationAccess(edge, provider)).decision, "impossible"); assert.equal(provider.calls, 0); });
test("classe un dossier sourcé", async () => { const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "assistance_required", probabilities: {
  "accessible": 0.05,
  "assistance_required": 0.85,
  "uncertain": 0.05,
  "impossible": 0.05
}, confidence: 0.85 } }, usage: { input_tokens: 10, output_tokens: 0 } })); const result = await assessStationAccess({
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
}, provider); assert.equal(result.decision, "assistance_required"); assert.equal(result.review, false); });

const dossierÀRevoir = {
  "id": "revue-1",
  "text": "Un ascenseur est déclaré disponible, mais son état à l’heure de la correspondance et le cheminement de secours sont inconnus.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-20"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};

test("marque une décision incertaine pour revue humaine", async () => {
  const provider = createFakeProvider(() => ({
    model: "jev-1.13.0",
    answers: {
      decision: {
        type: "choice",
        choice: "uncertain",
        probabilities: {
          accessible: 0.15,
          assistance_required: 0.15,
          uncertain: 0.55,
          impossible: 0.15,
        },
        confidence: 0.62,
      },
    },
    usage: { input_tokens: 10, output_tokens: 0 },
  }));
  const résultat = await assessStationAccess(dossierÀRevoir, provider);
  assert.equal(résultat.decision, "uncertain");
  assert.equal(résultat.review, true);
  assert.equal(résultat.confidence, 0.62);
  assert.equal(provider.calls, 1);
});
