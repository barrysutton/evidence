import evidenceData from "../data/evidence.json";

interface Trait {
  name: string;
  value: number;
}

type PieceData = {
  traits: { [key: string]: Trait };
};

// Calculate Trait Frequency across all pieces in the collection
export function calculateTraitDistribution() {
  const traitCounts: { [key: string]: number } = {};

  // Count how many times each trait appears across all pieces
  Object.values(evidenceData).forEach((piece: PieceData) => {
    Object.values(piece.traits).forEach((trait) => {
      traitCounts[trait.name] = (traitCounts[trait.name] || 0) + 1;
    });
  });

  // Convert counts to frequencies
  const totalPieces = Object.keys(evidenceData).length;
  Object.keys(traitCounts).forEach((traitName) => {
    traitCounts[traitName] = traitCounts[traitName] / totalPieces;
  });

  return traitCounts;
}

// Calculate Rarity Score for a specific piece based on trait distribution
export function calculateRarityScore(pieceData: PieceData) {
  const traitDistribution = calculateTraitDistribution();
  let score = 1;

  // Multiply the rarity score of each trait in the piece
  Object.values(pieceData.traits).forEach((trait) => {
    const rarity = traitDistribution[trait.name] || 0;
    score *= (1 / (rarity || 1));  // Higher score for rarer traits
  });

  return score;
}