import { ethers } from "ethers";
import contractABI from "../data/contractABI.json";

const CONTRACT_ADDRESS = "0x9AbE49717fc7e7fC0742E8a1edeca333BC979098";

// Function to connect to the blockchain and smart contract
export const getContract = async () => {
  try {
    // Check for MetaMask or Ethereum provider
    if (typeof window.ethereum === "undefined") {
      console.error("MetaMask is not installed.");
      return null;
    }

    // Connect to Ethereum provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request wallet connection

    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    console.log("Contract connected successfully:", contract);
    return contract;
  } catch (error) {
    console.error("Error connecting to contract:", error);
    return null;
  }
};