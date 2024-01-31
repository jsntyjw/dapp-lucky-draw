import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

// Import the ABI and contract address for the token contract
import tokenAbi from "../../../backend/contracts/LukydrawERC20TokenOZ.json";
import { TOKEN_CONTRACT_ADDRESS } from "../config";

// Import the ABI and contract address for the contract with getMinDepositToken function
import roundContractAbi from "../../../backend/contracts/Luckdraw.json";
import { CONTRACT_ADDRESS } from "../config";

interface MyNavbarProps {
  userAddress: string | null; // Add userAddress to the interface
}

const TokenBalance: React.FC<MyNavbarProps> = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [tokenContract, setTokenContract] = useState<any>(null); // State for the token contract
  const [roundContract, setRoundContract] = useState<any>(null); // State for the round contract
  const [tokenBalance, setTokenBalance] = useState<number | null>(null); // State to store token balance
  const [latestRoundBaseAmount, setLatestRoundBaseAmount] = useState<
    number | null
  >(null); // State to store latest round base amount

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

          // Initialize the token contract instance
          const tokenContractInstance = new web3Instance.eth.Contract(
            tokenAbi,
            TOKEN_CONTRACT_ADDRESS
          );
          setTokenContract(tokenContractInstance);

          // Initialize the round contract instance
          const roundContractInstance = new web3Instance.eth.Contract(
            roundContractAbi,
            CONTRACT_ADDRESS
          );
          setRoundContract(roundContractInstance);

          // Fetch token balance initially
          if (accounts[0]) {
            fetchTokenBalance(accounts[0], tokenContractInstance);
          }

          // Fetch the latest round base amount initially
          fetchLatestRoundBaseAmount(roundContractInstance);

          // Periodically refresh data every 5 seconds (adjust the interval as needed)
          const refreshInterval = setInterval(async () => {
            if (accounts[0]) {
              fetchTokenBalance(accounts[0], tokenContractInstance);
            }
            fetchLatestRoundBaseAmount(roundContractInstance);
          }, 3); // Refresh every 5 seconds

          // Cleanup the interval when the component unmounts
          return () => clearInterval(refreshInterval);
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

      // Convert balanceInSmallestUnit to a JavaScript number and adjust for decimals
      const balance = parseFloat(balanceInSmallestUnit) / 10 ** decimals;

      setTokenBalance(balance);
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  const fetchLatestRoundBaseAmount = async (contractInstance: any) => {
    try {
      const latestRoundBaseAmount = await contractInstance.methods
        .getMinDepositToken()
        .call();

      // Convert latestRoundBaseAmount to a regular JavaScript number
      const latestRoundBaseAmountNumber = Number(latestRoundBaseAmount);

      setLatestRoundBaseAmount(latestRoundBaseAmountNumber);
    } catch (error) {
      console.error("Error fetching latest round base amount:", error);
    }
  };

  return (
    <div className="flex space-x-4">
      {/* Token Balance Card */}
      <div className="max-w-md rounded shadow-lg p-4">
        <div className="font-bold text-xl mb-4">🚀 Your Token Balance: </div>
        <div className="text-5xl font-semibold">
          {tokenBalance !== null ? tokenBalance.toFixed(2) : "Fetching..."} LDT
          🌟
        </div>
      </div>

      {/* Latest Round Base Amount Card */}
      <div className="max-w-md rounded shadow-lg p-4">
        <div className="font-bold text-xl mb-4">💵Latest Round Base Amount</div>
        <div className="text-5xl font-semibold">
          {latestRoundBaseAmount !== null
            ? latestRoundBaseAmount.toFixed(2)
            : "Fetching..."}{" "}
          LDT 🌟
        </div>
      </div>
    </div>
  );
};

export default TokenBalance;
