export function formatEvidenceData(evidenceData, selectedNodeId) {
    const nodes = [];
    const links = [];
    const groups = {
      temporal: 1,
      material: 2,
      structural: 3,
      emergent: 4,
      fibonacci: 5,
    };
  
    // Add the selected node
    if (evidenceData[selectedNodeId]) {
      const selectedNodeData = evidenceData[selectedNodeId];
  
      // Add the selected node itself
      nodes.push({
        id: selectedNodeId,
        group: groups[Object.keys(selectedNodeData.traits)[0]], // First trait's group
        value: Object.values(selectedNodeData.traits).filter(t => t.value === 0.02).length
      });
  
      // Add related nodes
      if (selectedNodeData.relatedPieces) {
        selectedNodeData.relatedPieces.forEach(related => {
          if (evidenceData[related.id]) {
            // Add the related node
            nodes.push({
              id: related.id,
              group: groups[Object.keys(evidenceData[related.id].traits)[0]], // First trait's group
              value: Object.values(evidenceData[related.id].traits).filter(t => t.value === 0.02).length
            });
  
            // Add the link between the selected node and the related node
            links.push({
              source: selectedNodeId,
              target: related.id,
              value: related.similarity * 10
            });
          }
        });
      }
    }
  
    return { nodes, links };
  }