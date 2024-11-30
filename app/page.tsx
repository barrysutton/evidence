"use client";

import { useState } from "react";
import evidenceData from "../data/evidence.json";

type EvidenceTraits = {
  name: string;
  value: number;
};

type EvidencePiece = {
  id: string;
  about: string;
  traits: {
    temporal: EvidenceTraits;
    material: EvidenceTraits;
    structural: EvidenceTraits;
    emergent: EvidenceTraits;
    fibonacci?: EvidenceTraits;
  };
  relatedPieces?: { id: string; similarity: number }[];
  imageUrl: string;
};

const EvidencePage = () => {
  const [currentPiece, setPiece] = useState("001");
  const piece = evidenceData[currentPiece];

  if (!piece) {
    return <div>Error: Piece not found</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-[2000px] mx-auto p-8 grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-3">
          {/* Image Section */}
          <div className="aspect-[4/3] bg-gray-900 mb-4 relative">
            <img
              src={piece.imageUrl}
              alt={`Evidence ${currentPiece}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-2xl font-light tracking-wider">
            EVIDENCE #{currentPiece}
          </div>
        </div>

        {/* Middle Column */}
        <div className="col-span-6 pr-8">
          <h2 className="text-sm font-light tracking-widest text-gray-400">
            ABOUT THIS WORK
          </h2>
          <p className="text-sm leading-relaxed text-gray-300 mt-4">{piece.about}</p>
        </div>

        {/* Key Metrics */}
<div className="col-span-3">
  <h2 className="text-sm font-light tracking-widest text-gray-400 mb-4">
    KEY METRICS
  </h2>
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">Rarity Rank</span>
      <span>#1 of {Object.keys(evidenceData).length}</span> {/* Total pieces */}
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">Ultra-rare Traits</span>
      <span>
        {
          Object.values(piece.traits).filter(
            (trait) => trait.value <= 0.02
          ).length
        }
      </span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">Combined Rarity</span>
      <span>
        {(
          Object.values(piece.traits).reduce(
            (acc, trait) => acc * (trait.value || 1),
            1
          ) * 100
        ).toFixed(5)}%
      </span>
    </div>
  </div>
</div>
        {/* Bottom Section */}
        <div className="col-span-12 grid grid-cols-12 gap-8">
          {/* Categories & Traits (Left) */}
          <div className="col-span-3 space-y-8">
            <h2 className="text-sm font-light tracking-widest text-gray-400">
              CATEGORIES & TRAITS
            </h2>
            {Object.entries(piece.traits).map(([category, trait]) => (
              <div key={category} className="space-y-2">
                <div className="text-sm text-gray-400 uppercase">{category}</div>
                <div className="text-sm pl-4 space-y-1">
                  <div className="flex justify-between">
                    <span>{trait.name}</span>
                    <span>{(trait.value * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trait Visualization (Center) */}
          <div className="col-span-6">
            <h2 className="text-sm font-light tracking-widest text-gray-400 mb-4">
              TRAIT VISUALIZATION
            </h2>
            <div className="aspect-square bg-gray-900 bg-opacity-20"></div>
          </div>

          {/* Data Analysis (Right) */}
          <div className="col-span-3 space-y-8">
            <h2 className="text-sm font-light tracking-widest text-gray-400">
              DATA ANALYSIS
            </h2>
            <div className="space-y-4">
              <div className="h-32 bg-gray-900 bg-opacity-20"></div>
              <div className="h-32 bg-gray-900 bg-opacity-20"></div>
              <div className="h-32 bg-gray-900 bg-opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EvidencePage;