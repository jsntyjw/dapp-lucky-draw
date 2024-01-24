import { Avatar } from "@nextui-org/react";
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

// Import the ABI and contract address
import abi from "../abi/abi.json";
import { CONTRACT_ADDRESS } from "../config";

interface MyNavbarProps {
  userAddress: string | null; // Add userAddress to the interface
}

const TokenBalance: React.FC<MyNavbarProps> = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null); // State for the contract
  const [tokenBalance, setTokenBalance] = useState<number | null>(null); // State to store token balance

  useEffect(() => {
    const initializeWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3Instance = new Web3(provider as any); // Cast provider to any

        // Request access to the user's MetaMask account
        try {
          await (provider as any).request({ method: "eth_requestAccounts" }); // Cast provider to any
          const accounts = await web3Instance.eth.getAccounts();
          setUserAddress(accounts[0]);
          setWeb3(web3Instance);

          // Initialize the contract instance
          const contractInstance = new web3Instance.eth.Contract(
            abi,
            CONTRACT_ADDRESS
          );
          setContract(contractInstance);

          // Fetch token balance
          if (accounts[0]) {
            fetchTokenBalance(accounts[0], contractInstance);
          }
        } catch (error) {
          console.error("Failed to connect to wallet:", error);
        }
      } else {
        console.error("MetaMask not detected.");
      }
    };

    initializeWeb3();
  }, []);

  const decimals = 18; // Replace with the actual decimal count of LDT

  const fetchTokenBalance = async (address: string, contractInstance: any) => {
    try {
      const balanceInSmallestUnit = await contractInstance.methods
        .balanceOf(address)
        .call();

      // Explicitly convert balanceInSmallestUnit to a JavaScript number
      const balance = Number(balanceInSmallestUnit) / 10 ** decimals;

      console.log("Token balance fetched:", balance);

      setTokenBalance(balance);
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  return (
    <div className="flex items-center flex-col">
      <p className="text-xl font-semibold text-white">
        🚀 Your Token Balance:{" "}
        {tokenBalance !== null ? tokenBalance : "Fetching..."} LDT 🌟
      </p>
    </div>
  );
};

export default TokenBalance;
