type Node = {
  id: string;
  name: string;
  relatedPieces?: { id: string; similarity: number }[];
  group?: number;
  value?: number;
  main?: boolean;
  related?: boolean;
  background?: boolean;
  similarity?: number;
};

type Link = {
  source: string;
  target: string;
  value: number;
};

type GraphData = {
  nodes: Node[];
  links: Link[];
};

import ForceGraph from "./forcegraph.js";
import evidenceData from '../data/evidence.json';

const extractMainAndRelated = (data: { [id: string]: Node }, mainId: string): GraphData => {
  const mainNode = data[mainId];
  if (!mainNode) {
    console.error(`Main node with ID ${mainId} not found!`);
    return { nodes: [], links: [] };
  }

  // Extract related nodes dynamically
  const relatedNodes = mainNode.relatedPieces?.map((related: { id: string; similarity: number }) => ({
    ...data[related.id],
    id: related.id,
    similarity: related.similarity,
    related: true,
  })) || [];

  // Include all other nodes marked as "background"
  const backgroundNodes = Object.keys(data)
    .filter((id) => id !== mainId && !relatedNodes.some((r) => r.id === id))
    .map((id) => ({
      ...data[id],
      id,
      background: true,
    }));

  // Combine all nodes
  const nodes: Node[] = [
    { ...mainNode, id: mainId, main: true },
    ...relatedNodes,
    ...backgroundNodes,
  ];

  // Create links dynamically for relationships
  const links: Link[] = relatedNodes.map((related) => ({
    source: mainId,
    target: related.id,
    value: related.similarity * 10,
  }));

  return { nodes, links };
};

// Extract data for the main node (e.g., "032") and its related works
const mainId = "032";
const formattedData = extractMainAndRelated(evidenceData, mainId);

export default function HomePage() {
  return (
    <main>
      <h1 className="text-center text-xl font-bold">Evidence Data Visualization</h1>
      <ForceGraph data={formattedData} selectedId="032" />
    </main>
  );
}