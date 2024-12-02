import evidenceData from '../data/evidence.json';

type Trait = {
  name: string;
  value: number;
};

type EvidencePiece = {
  id: string;
  about: string;
  traits: {
    temporal: Trait;
    material: Trait;
    structural: Trait;
    emergent: Trait;
    fibonacci?: Trait;
  };
  relatedPieces: string[];
};

const typedEvidenceData: { [id: string]: EvidencePiece } = evidenceData as any;

// Your validateRelationships logic here
function computeSharedTraits(pieceA: EvidencePiece, pieceB: EvidencePiece): number {
  const traitsA = Object.values(pieceA.traits);
  const traitsB = Object.values(pieceB.traits);

  return traitsA.filter((traitA) =>
    traitsB.some((traitB) => traitA.name === traitB.name && traitA.value === traitB.value)
  ).length;
}

function validateRelationships() {
  const updatedData = { ...typedEvidenceData };

  for (const idA of Object.keys(typedEvidenceData)) {
    const pieceA = typedEvidenceData[idA];

    for (const idB of Object.keys(typedEvidenceData)) {
      if (idA === idB) continue;

      const sharedTraits = computeSharedTraits(pieceA, typedEvidenceData[idB]);

      if (sharedTraits > 0 && !pieceA.relatedPieces.includes(idB)) {
        pieceA.relatedPieces.push(idB);
      }
    }
  }

  return updatedData;
}

// Run validation
console.log(validateRelationships());