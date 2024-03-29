import { Avatar, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

// Import the ABI and contract address
import abi from "../abi/abi.json";
import { TOKEN_CONTRACT_ADDRESS, ADMIN_WALLET_ADDRESS } from "../config";
import Alert from "./Alert";

interface MyNavbarProps {
  onCreateLuckyDrawClick: () => void;
  userAddress: string | null; // Add userAddress to the interface
}

const MyNavbar: React.FC<MyNavbarProps> = ({ onCreateLuckyDrawClick }) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null); // State for the contract
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null); // State for the alert message

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

          // Check if the connected wallet matches the admin address
          setIsAdmin(accounts[0] === ADMIN_WALLET_ADDRESS);

          // Initialize the contract instance
          const contractInstance = new web3Instance.eth.Contract(
            abi,
            TOKEN_CONTRACT_ADDRESS
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Failed to connect to wallet:", error);
        }
      } else {
        console.error("MetaMask not detected.");
      }
    };

    initializeWeb3();
  }, []);

  const handleConnectWallet = async () => {
    if (!web3) {
      console.error("Web3 not initialized.");
      return;
    }

    try {
      await web3.eth.requestAccounts();
      const accounts = await web3.eth.getAccounts();
      setUserAddress(accounts[0]);

      // Check if the connected wallet matches the admin address
      setIsAdmin(accounts[0] === ADMIN_WALLET_ADDRESS);
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
    }
  };

  const callFaucet = async () => {
    if (!web3 || !contract || !userAddress) {
      console.error("Web3, contract, or userAddress not initialized.");
      return;
    }

    try {
      // Show a pending transaction alert
      setAlert({
        message: "Transaction pending... Please wait.",
        type: "success",
      });

      // Call the faucet method from your contract
      const result = await contract.methods
        .faucet()
        .send({ from: userAddress });
      console.log("Faucet called successfully:", result);

      // Show a success message and automatically hide it after a few seconds
      setAlert({
        message: "Faucet called successfully.",
        type: "success",
      });

      setTimeout(() => {
        setAlert(null); // Hide the alert after a few seconds
      }, 5000); // 5000 milliseconds (5 seconds) delay before hiding
    } catch (error) {
      console.error("Error calling faucet:", error);

      // Show an error message and automatically hide it after a few seconds
      setAlert({
        message: "Error calling faucet.",
        type: "error",
      });

      setTimeout(() => {
        setAlert(null); // Hide the alert after a few seconds
      }, 5000); // 5000 milliseconds (5 seconds) delay before hiding
    }
  };

  return (
    <nav className="text-white p-4 pt-5 pb-5 flex justify-between items-center">
      <div className="flex items-center">
        {userAddress ? (
          <p className="text-base font-semibold text-white">
            Wallet Address: {userAddress}
          </p>
        ) : (
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        )}
      </div>

      {/* Conditionally render the "Create Lucky Draw" button based on isAdmin */}
      {isAdmin && (
        <div className="flex justify-center">
          <Button
            className="bg-fuchsia-50 text-black border border-solid border-gray-300 rounded-full px-4 py-2"
            onClick={onCreateLuckyDrawClick}
          >
            <b>Set Lucky Draw Base Amount</b>
          </Button>
        </div>
      )}

      {/* Button to get test tokens from the faucet */}
      {userAddress && (
        <div>
          <Button
            className="bg-fuchsia-50 text-black border border-solid border-gray-300 rounded-full px-4 py-2"
            onClick={callFaucet}
          >
            <b>Call Faucet</b>
          </Button>
        </div>
      )}

      {userAddress ? (
        <p className="text-base font-semibold text-white">
          Connected to Wallet
        </p>
      ) : (
        <Button
          className="bg-fuchsia-50 text-black border border-solid border-gray-300 rounded-full px-4 py-2"
          onClick={handleConnectWallet}
        >
          <b>Connect Wallet</b>
        </Button>
      )}

      {/* Display the alert message */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </nav>
  );
};

export default MyNavbar;
