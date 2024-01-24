import { Avatar, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

import { abi } from "../abi/abi";

// Import the admin address from your properties file
import { ADMIN_WALLET_ADDRESS } from "../config"; // Adjust the import path

interface MyNavbarProps {
  onCreateLuckyDrawClick: () => void;
  userAddress: string | null; // Add userAddress to the interface
}

const MyNavbar: React.FC<MyNavbarProps> = ({ onCreateLuckyDrawClick }) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);

  // Add a state variable to track whether the connected wallet matches the admin address
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
    // throw error if web3 or userAddress is null
    if (!web3 || !userAddress) {
      console.error("Web3 or userAddress not initialized.");
      return;
    }

    abi.faucet(web3, userAddress);
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
          {" "}
          {/* Center the button horizontally */}
          <Button
            className="bg-fuchsia-50 text-black border border-solid border-gray-300 rounded-full px-4 py-2"
            onClick={onCreateLuckyDrawClick}
          >
            <b>Create Lucky Draw</b>
          </Button>
        </div>
      )}

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
    </nav>
  );
};

export default MyNavbar;
