export function formatEvidenceData(evidenceData) {
  const nodes = [];
  const links = [];

  // Create nodes and links
  Object.entries(evidenceData).forEach(([id, data]) => {
    // Add node
    nodes.push({
      id, // Node ID
      group: data.traits ? Object.keys(data.traits).length : 1, // Group based on trait count
      value: Object.values(data.traits).length, // Use the number of traits for size
      imageUrl: data.imageUrl // Image URL for potential use later
    });

    // Add links
    if (data.relatedPieces) {
      data.relatedPieces.forEach(related => {
        links.push({
          source: id,
          target: related.id,
          value: related.similarity * 10 // Use similarity as link weight
        });
      });
    }
  });
  console.log("Formatted Evidence Data:", { nodes, links });
  return { nodes, links };
}