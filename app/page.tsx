"use client";

import { useState } from "react";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import evidenceData from "../data/evidence.json";
import visualData from "../data/visualAnalysis.json"; // Import the visual analysis JSON
import {
  calculateMetrics,
  calculateCollectionRank,
  calculateRarityBreakdown,
  calculateCategoryDistribution,
  calculateSharedTraits, // Add this import
} from "../utils/metrics";
import Image from "next/image";
import { ethers, BrowserProvider } from 'ethers';
import { ExternalProvider } from "@ethersproject/providers";

// Define the types for evidenceData and visualData
interface EvidenceData {
  [key: string]: Piece;
}

interface VisualData {
  [key: string]: string; // Dictionary: keys are strings (IDs), values are strings (text content)
}

const visualDataTyped: VisualData = visualData as VisualData; // Explicitly cast the imported JSON

interface Piece {
  id: string;
  about: string;
  traits: {
    temporal: { name: string; value: number };
    material: { name: string; value: number };
    structural: { name: string; value: number };
    emergent: { name: string; value: number };
    fibonacci: { name: string; value: number };
  };
  series: string[];
  imageUrl: string;
  relatedPieces: string[];
}

interface PieceNavigatorProps {
  currentPiece: string;
  onPieceSelect: (piece: string) => void;
}

const formatPieceNumber = (num: number): string => {
  return String(num).padStart(3, "0");
};

const PieceNavigator = ({ currentPiece, onPieceSelect }: PieceNavigatorProps) => {
  const [searchValue, setSearchValue] = useState(currentPiece);

  const handlePrevious = () => {
    const prevNum = Math.max(1, parseInt(currentPiece) - 1);
    const formattedNum = formatPieceNumber(prevNum);
    onPieceSelect(formattedNum);
    setSearchValue(formattedNum);
  };

  const handleNext = () => {
    const nextNum = Math.min(36, parseInt(currentPiece) + 1);
    const formattedNum = formatPieceNumber(nextNum);
    onPieceSelect(formattedNum);
    setSearchValue(formattedNum);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const num = parseInt(searchValue);
    if (num >= 1 && num <= 36) {
      const formattedNum = formatPieceNumber(num);
      onPieceSelect(formattedNum);
    }
  };

  return (
    <div className="flex items-center justify-center w-full mt-4">
      <div className="flex items-center w-full max-w-md space-x-2">
        <button
          onClick={handlePrevious}
          className="text-gray-400 hover:text-white p-2 focus:outline-none"
          aria-label="Previous piece"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter Number"
            className="w-full px-2 py-2 text-center bg-black border border-gray-700 text-white font-light text-sm focus:outline-none focus:border-gray-500"
            maxLength={6}
          />
          <select
            value={searchValue}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setSearchValue(selectedValue);
              onPieceSelect(selectedValue);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option value="" disabled>
              Select a number
            </option>
            {[...Array(36).keys()].map((num) => {
              const formattedNum = String(num + 1).padStart(3, "0");
              return (
                <option key={formattedNum} value={formattedNum}>
                  {formattedNum}
                </option>
              );
            })}
          </select>
        </form>

        <button
          onClick={handleNext}
          className="text-gray-400 hover:text-white p-2 focus:outline-none"
          aria-label="Next piece"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const EvidencePage = () => {
  const [currentPiece, setPiece] = useState("001");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const piece = (evidenceData as EvidenceData)[currentPiece];

  if (!piece) return <div>Error: Piece not found</div>;

  // Wallet connection logic
  const connectWallet = async () => {
    if (typeof window === "undefined") {
      return; // Ensure this runs only in the browser
    }

    if (!window.ethereum) {
      alert("Please install a Web3 wallet such as MetaMask!");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      console.log("Wallet connected:", address);

      setWalletAddress(address); // Save the connected wallet address
      setWalletConnected(true); // Update the connection state
    } catch (error: any) {
      if (error.code === 4001) {
        // MetaMask connection rejected by the user
        alert("Connection request was rejected. Please try again.");
      } else {
        console.error("Failed to connect wallet:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Wallet disconnection logic
  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    console.log("Wallet disconnected.");
  };

  return (
    <main className="min-h-screen bg-black text-white px-8">
      {/* Header Section */}
      <header className="bg-black flex justify-between items-center py-8 px-4">
        <Image
          src="/logo-primordium-white.png"
          alt="Site Logo"
          width={212}
          height={48}
          className="h-12 w-auto"
          quality={100}
          priority
        />

        {/* Wallet Connection Section */}
        <div className="flex items-center">
          {!walletConnected ? (
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm text-gray-300">
                Wallet Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <button
                onClick={disconnectWallet}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="grid gap-8 p-4 max-w-[2000px] mx-auto sm:grid-cols-12">
        <div className="col-span-full sm:col-span-4">
          <div className="relative w-full h-0 pb-[75%]">
            <Image
              src={piece.imageUrl}
              alt={`Evidence ${currentPiece}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center mt-4">
            <h1 className="text-l font-light tracking-wider">
              EVIDENCE #{currentPiece}
            </h1>
            <PieceNavigator currentPiece={currentPiece} onPieceSelect={setPiece} />
          </div>

          <section className="mt-8">
            <h2 className="text-sm font-light tracking-widest text-gray-400">
              CATEGORIES & TRAITS
            </h2>
            {Object.entries(piece.traits).map(([category, trait]) => (
              <div key={category} className="text-sm mt-2">
                <span className="text-gray-400 uppercase">{category}</span>:{" "}
                <span>{trait.name}</span> -{" "}
                <span>{(trait.value * 100).toFixed(2)}%</span>
              </div>
            ))}
          </section>
        </div>

        <section className="col-span-full sm:col-span-5">
  <h2 className="text-sm font-light tracking-widest text-gray-400">
    VISUAL ANALYSIS
  </h2>
  <p className="text-sm leading-relaxed text-gray-300 mt-4">
    {visualDataTyped[currentPiece] || "Visual analysis unavailable."}
  </p>
          

          {/* Secret Phrase */}
          <div className="mt-8">
            <h2 className="text-sm font-light tracking-widest text-gray-400">
              SECRET PHRASE
            </h2>
            <p className="text-sm leading-relaxed text-gray-300 italic">
              *Deeper insights into the creative process for this piece will be generated
              upon acquisition.
            </p>
          </div>
        </section>

        <div className="col-span-full sm:col-span-3">
          <section>
            <h2 className="text-sm font-light tracking-widest text-gray-400">
              KEY METRICS
            </h2>
            <div className="text-sm mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Rarity Rank:</span>
                <span>{calculateCollectionRank(currentPiece, evidenceData)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">UltraRare Traits:</span>
                <span>{calculateMetrics(piece).ultraRareTraits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Combined Rarity:</span>
                <span>
                  {(
                    Object.values(piece.traits).reduce(
                      (acc, trait) => acc * (trait.value || 1),
                      1
                    ) * 100
                  ).toFixed(5)}
                  %
                </span>
              </div>
            </div>
          </section>

          <section className="mt-8">
 <h2 className="text-sm font-light tracking-widest text-gray-400">
   DATA ANALYSIS
 </h2>
 <div className="space-y-8 mt-4">
   {/* Rarity Breakdown */}
   <div>
     <h3 className="text-sm font-light tracking-widest text-gray-400">
       RARITY BREAKDOWN
     </h3>
     <div className="text-sm space-y-2">
       {Object.entries(calculateRarityBreakdown(piece)).map(([rarity, count]) => (
         <div className="flex justify-between" key={rarity}>
           <span className="capitalize text-gray-400">{rarity}</span>
           <span>{count}</span>
         </div>
       ))}
     </div>
   </div>

   {/* Related Pieces */}
   <div>
     <h3 className="text-sm font-light tracking-widest text-gray-400">
       RELATED PIECES
     </h3>
     <div className="text-sm space-y-1">
       {piece.relatedPieces.map((related) => {
         const relatedPiece = (evidenceData as EvidenceData)[related];
         const sharedTraits = calculateSharedTraits(piece.traits, relatedPiece.traits);
         return (
           <div
             key={related}
             className="flex justify-between text-sm bg-gray-900 bg-opacity-20 p-2"
           >
             <span>#{related}</span>
             <span>{sharedTraits} shared traits</span>
           </div>
         );
       })}
     </div>
   </div>

   {/* Category Distribution */}
   <div>
     <h3 className="text-sm font-light tracking-widest text-gray-400">
       CATEGORY DISTRIBUTION
     </h3>
     <div className="text-sm space-y-2">
       {Object.entries(calculateCategoryDistribution(piece)).map(
         ([category, percentage]) => (
           <div className="flex justify-between" key={category}>
             <span className="capitalize text-gray-400">{category}</span>
             <span>{percentage.toFixed(2)}%</span>
           </div>
         )
       )}
     </div>
   </div>
 </div>
</section>
        </div>
      </div>
    </main>
  );
};

export default EvidencePage;