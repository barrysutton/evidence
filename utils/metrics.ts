// Utility functions for calculating metrics
type Traits = {
    [key: string]: {
      name: string;
      value: number;
    };
  };
  
  type PieceData = {
    traits: Traits;
  };
// Calculate Ultra-rare Traits and Combined Rarity
export function calculateMetrics(pieceData: any) {
    // Calculate Ultra-rare Traits
    const ultraRareTraits = Object.values(pieceData.traits || {})
      .filter((trait: any) => trait.value === 0.02)
      .length;
  
    // Calculate Combined Rarity
    const combinedRarity = Object.values(pieceData.traits || {})
      .reduce((acc: number, trait: any) => acc * trait.value, 1);
  
    return {
      ultraRareTraits,
      combinedRarity: (combinedRarity * 100).toFixed(6) + "%",
    };
  }
  // Calculate Rarity Breakdown
export function calculateRarityBreakdown(pieceData: any) {
  const rarityCounts = {
    ultraRare: 0,
    rare: 0,
    uncommon: 0,
    common: 0,
  };

  Object.values(pieceData.traits || {}).forEach((trait: any) => {
    if (trait.value <= 0.02) rarityCounts.ultraRare++;
    else if (trait.value <= 0.05) rarityCounts.rare++;
    else if (trait.value <= 0.08) rarityCounts.uncommon++;
    else rarityCounts.common++;
  });

  return rarityCounts;
}

// Calculate Category Distribution
export function calculateCategoryDistribution(pieceData: any) {
  const totalTraits = Object.values(pieceData.traits || {}).length;
  const distribution = {};

  Object.entries(pieceData.traits || {}).forEach(([category, trait]: any) => {
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
      ultraRareTraits: Object.values(data.traits).filter(
        (trait) => trait.value <= 0.02
      ).length,
      combinedRarity: Object.values(data.traits).reduce(
        (acc: number, trait) => acc * trait.value,
        1
      ),
    }));
  
    piecesWithMetrics.sort((a, b) => {
      if (b.ultraRareTraits !== a.ultraRareTraits) {
        return b.ultraRareTraits - a.ultraRareTraits;
      }
      return a.combinedRarity - b.combinedRarity;
    });
  
    const rank = piecesWithMetrics.findIndex((p) => p.id === pieceId) + 1;
    return `#${rank} of ${piecesWithMetrics.length}`;
  }
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
  //sample data test
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