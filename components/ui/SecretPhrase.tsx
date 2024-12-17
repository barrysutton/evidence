import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import type { TokenMapping } from "../types";
import tokenMapping from "./token_mapping.json";
import secretPhrases from "../../data/secretPhrases.json";

const CONTRACT_ADDRESS = "0x9AbE49717fc7e7fC0742E8a1edeca333BC979098";
const CHAIN_ID = "0x1"; // Ethereum mainnet

interface SecretPhraseProps {
  tokenId: string; // piece ID (e.g., "007")
  walletConnected: boolean;
  walletAddress: string;
}

const SecretPhrase = ({ tokenId, walletConnected, walletAddress }: SecretPhraseProps) => {
  const [secretPhrase, setSecretPhrase] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ownsThisToken, setOwnsThisToken] = useState<boolean>(false);

  useEffect(() => {
    if (walletConnected && walletAddress) {
      checkTokenOwnership();
    } else {
      // Reset states when wallet disconnects
      setSecretPhrase("");
      setOwnsThisToken(false);
    }
  }, [walletConnected, walletAddress, tokenId]);

  const checkTokenOwnership = async () => {
    if (!walletConnected || !walletAddress) return;

    setIsLoading(true);
    setOwnsThisToken(false); // Reset ownership state
    setSecretPhrase(""); // Reset secret phrase

    try {
      if (!window.ethereum) return;

      const provider = new BrowserProvider(window.ethereum);
      const chainId = await provider.send("eth_chainId", []);

      if (chainId !== CHAIN_ID) {
        console.warn("Wrong network. Please connect to Ethereum mainnet.");
        return;
      }

      // Get the mapped token ID for THIS specific image
      const mappedTokenId = (tokenMapping as TokenMapping)[tokenId];

      // If this image hasn't been minted yet, exit early
      if (mappedTokenId === null || mappedTokenId === undefined) {
        console.warn(`Image ${tokenId} has not been minted yet`);
        return;
      }

      // Minimal ABI for ERC721 ownerOf
      const minABI = [
        {
          inputs: [{ name: "tokenId", type: "uint256" }],
          name: "ownerOf",
          outputs: [{ name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
      ];

      const contract = new Contract(CONTRACT_ADDRESS, minABI, provider);

      // Check ownership of THIS specific token
      const owner = await contract.ownerOf(mappedTokenId);
      const isOwner = owner.toLowerCase() === walletAddress.toLowerCase();
      
      setOwnsThisToken(isOwner);

      // Only if they own THIS specific token, show ITS secret phrase
      if (isOwner) {
        const thisTokenSecretPhrase = secretPhrases.secret_phrases.find(
          (entry) => entry.id === tokenId.padStart(3, "0")
        );

        if (thisTokenSecretPhrase) {
          setSecretPhrase(thisTokenSecretPhrase.text);
        } else {
          console.warn(`No secret phrase found for image ID ${tokenId}`);
        }
      }
    } catch (error) {
      console.error(`Error checking ownership for image ${tokenId}:`, error);
      setOwnsThisToken(false);
      setSecretPhrase("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-sm font-light tracking-widest text-gray-400">
        SECRET PHRASE
      </h2>
      {isLoading ? (
        <div className="mt-2 flex items-center">
          <div className="animate-spin h-4 w-4 border-b-2 border-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-400">Verifying ownership...</span>
        </div>
      ) : ownsThisToken && secretPhrase ? (
        <p className="text-sm leading-relaxed text-gray-300 mt-2">{secretPhrase}</p>
      ) : (
        <p className="text-sm leading-relaxed text-gray-300 italic mt-2">
          *Token-sealed evidence. If you own this artwork, connect your wallet to unlock deeper insights into the creative process.
        </p>
      )}
    </div>
  );
};

export default SecretPhrase;