// Define the types for traits and piece data
export interface Trait {
  name: string;
  value: number;
}

type PieceData = {
  traits: { [key: string]: Trait };
};

// Calculate Ultra-rare Traits and Combined Rarity
export function calculateMetrics(pieceData: { traits: Record<string, Trait> }) {
  const ultraRareTraits = Object.values(pieceData.traits || {})
    .filter((trait: Trait) => trait.value === 0.02)
    .length; 

  console.log("Ultra Rare Traits:", ultraRareTraits); // Added log

  const combinedRarity = Object.values(pieceData.traits || {})
  .reduce((acc: number, trait: Trait) => acc * trait.value, 1);

  console.log("Combined Rarity:", combinedRarity); // Added log

  return {
    ultraRareTraits,
    combinedRarity: (combinedRarity * 100).toFixed(6) + "%",
  };
}

// Calculate Rarity Breakdown
export function calculateRarityBreakdown(pieceData: PieceData) {
  const rarityCounts = {
    ultraRare: 0,
    rare: 0,
    uncommon: 0,
    common: 0,
  };

  Object.values(pieceData.traits || {}).forEach((trait) => {
    if (trait.value === 0.02) {
      rarityCounts.ultraRare++;
    } else if (trait.value === 0.05) {
      rarityCounts.rare++;
    } else if (trait.value === 0.08) {
      rarityCounts.uncommon++;
    } else {
      rarityCounts.common++;
    }
  });

  console.log("Rarity Breakdown:", rarityCounts); // Added log for debugging

  return rarityCounts;
}

// Calculate Category Distribution
export function calculateCategoryDistribution(pieceData: PieceData) {
  const totalTraits = Object.values(pieceData.traits || {}).length;
  const distribution: { [key: string]: number } = {}; // Explicit type for the object

  Object.entries(pieceData.traits || {}).forEach(([category, trait]) => {
    distribution[category] = (trait.value / totalTraits) * 100;
  });

  return distribution;
}

// Calculate Collection Rank
export function calculateCollectionRank(
  pieceId: string,
  allPieceData: { [id: string]: PieceData }
) {
  const piecesWithMetrics = Object.entries(allPieceData).map(([id, data]) => ({
    id,
    ultraRareTraits: Object.values(data.traits || {}).filter((trait) => trait.value <= 0.02).length,
    combinedRarity: Object.values(data.traits || {}).reduce((acc, trait) => acc * trait.value, 1),
  }));

  console.log("Pieces With Metrics:", piecesWithMetrics); // Added log

  piecesWithMetrics.sort((a, b) => {
    if (b.ultraRareTraits !== a.ultraRareTraits) {
      return b.ultraRareTraits - a.ultraRareTraits;
    }
    return b.combinedRarity - a.combinedRarity; // Sort combined rarity from highest to lowest
  });

  const rank = piecesWithMetrics.findIndex((p) => p.id === pieceId) + 1;
  return `#${rank} of ${piecesWithMetrics.length}`;
}

// Calculate Shared Traits
export function calculateSharedTraits(
  currentTraits: Record<string, { name: string; value: number }>,
  relatedTraits: Record<string, { name: string; value: number }>
) {
  // Count traits with the same name and value
  return Object.entries(currentTraits).reduce((count, [key, currentTrait]) => {
    const relatedTrait = relatedTraits[key];
    if (relatedTrait && currentTrait.name === relatedTrait.name) {
      count += 1;
    }
    return count;
  }, 0);
}

// Calculate Traits in Common
// Commenting out or deleting computeTraitsInCommon function
// function computeTraitsInCommon(pieceA: EvidencePiece, pieceB: EvidencePiece): number {
//   let traitsInCommon = 0;
//   Object.keys(pieceA.traits).forEach((traitKey) => {
//     const traitA = pieceA.traits[traitKey];
//     const traitB = pieceB.traits[traitKey];
//     if (traitA && traitB && traitA.name === traitB.name && traitA.value === traitB.value) {
//       traitsInCommon++;
//     }
//   });
//   return traitsInCommon;
// }

// Sample data test
const sampleData = {
  "001": {
    traits: {
      temporal: { name: "Spectrum Anomaly", value: 0.02 },
      material: { name: "Orbital Matter", value: 0.05 },
      structural: { name: "Grid Formation", value: 0.08 },
    },
  },
  "002": {
    traits: {
      temporal: { name: "Echo Pattern", value: 0.03 },
      material: { name: "Fibonacci", value: 0.02 },
    },
  },
};

console.log(calculateMetrics(sampleData["001"])); // Test Metrics Calculation
console.log(calculateCollectionRank("001", sampleData)); // Test Rank Calculation