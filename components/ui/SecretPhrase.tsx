import { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';

const CONTRACT_ADDRESS = '0x9AbE49717fc7e7fC0742E8a1edeca333BC979098';
const CHAIN_ID = '0x1'; // Ethereum mainnet

interface SecretPhraseProps {
  tokenId: string;
  walletConnected: boolean;
  walletAddress: string;
}

const SecretPhrase = ({ tokenId, walletConnected, walletAddress }: SecretPhraseProps) => {
  const [secretPhrase, setSecretPhrase] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (walletConnected && walletAddress) {
      checkTokenOwnership();
    }
  }, [walletConnected, walletAddress, tokenId]);

  const checkTokenOwnership = async () => {
    if (!walletConnected || !walletAddress) return;
    
    setIsLoading(true);
    try {
      if (!window.ethereum) return;
      
      const provider = new BrowserProvider(window.ethereum);
      const chainId = await provider.send('eth_chainId', []);
      
      if (chainId !== CHAIN_ID) {
        setIsLoading(false);
        return;
      }

      // Minimal ABI for ERC721 ownerOf
      const minABI = [
        {
          "inputs": [{"name": "tokenId", "type": "uint256"}],
          "name": "ownerOf",
          "outputs": [{"name": "", "type": "address"}],
          "stateMutability": "view",
          "type": "function"
        }
      ];

      const contract = new Contract(CONTRACT_ADDRESS, minABI, provider);
      
      try {
        const owner = await contract.ownerOf(parseInt(tokenId));
        const isOwner = owner.toLowerCase() === walletAddress.toLowerCase();
        
        if (isOwner) {
          // Here you would fetch the actual secret phrase from your data source
          setSecretPhrase(`Secret phrase content for Evidence #${tokenId}`);
        }
      } catch (error) {
        console.log('Token ownership check error:', error);
      }
    } catch (error) {
      console.error('Verification error:', error);
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
      ) : secretPhrase ? (
        <p className="text-sm leading-relaxed text-gray-300 mt-2">{secretPhrase}</p>
      ) : (
        <p className="text-sm leading-relaxed text-gray-300 italic mt-2">
          *Deeper insights into the creative process for this piece will be generated
          upon acquisition.
        </p>
      )}
    </div>
  );
};

export default SecretPhrase;