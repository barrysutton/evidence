const fs = require("fs");
const path = require("path");
const evidenceData = require("../data/evidence.json");

// Function to compute shared traits between two pieces
function computeSharedTraits(pieceA, pieceB) {
  let commonTraits = 0;

  for (const category in pieceA.traits) {
    const traitA = pieceA.traits[category];
    const traitB = pieceB.traits[category];

    // Only count traits that are not "None" and have the same name
    if (
      traitA &&
      traitB &&
      traitA.name !== "None" &&
      traitB.name !== "None" &&
      traitA.name === traitB.name
    ) {
      commonTraits++;
    }
  }

  return commonTraits;
}

// Main function to analyze all relationships
function analyzeAllRelationships(data) {
  const result = {};

  // Iterate through every pair of images
  for (const idA in data) {
    result[idA] = []; // Initialize the array for each piece

    for (const idB in data) {
      if (idA === idB) continue; // Skip self-comparison

      const commonTraits = computeSharedTraits(data[idA], data[idB]);
      if (commonTraits > 0) {
        result[idA].push({
          id: idB,
          commonTraits,
        });
      }
    }
  }

  return result;
}

// Run the analysis and write the results to a file
const relationships = analyzeAllRelationships(evidenceData);
fs.writeFileSync(
  path.join(__dirname, "../data/relationships.json"),
  JSON.stringify(relationships, null, 2)
);

console.log("Relationships have been analyzed and saved to relationships.json");