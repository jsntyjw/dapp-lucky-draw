import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import detectEthereumProvider from "@metamask/detect-provider";

import Web3 from "web3";

// Import the ABI and contract address
import roundContractAbi from "../../../backend/contracts/Luckdraw.json";
import { CONTRACT_ADDRESS, ADMIN_WALLET_ADDRESS } from "../config";
import Alert from "./Alert";

interface LuckyDrawButtonProps {
  userAddress: string | null;
}

const LuckyDrawButton: React.FC<LuckyDrawButtonProps> = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [roundContract, setRoundContract] = useState<any>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Determine if the current user is an admin based on their address

  useEffect(() => {
    const initializeWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        console.log("MetaMask detected.");
        const web3Instance = new Web3(provider as any);

        const accounts = await web3Instance.eth.getAccounts();
        setUserAddress(accounts[0]);
        setWeb3(web3Instance);
        setIsAdmin(accounts[0] === ADMIN_WALLET_ADDRESS);

        // Check if  connected wallet matches the admin address

        console.log("userAddress: " + userAddress);
        console.log("ADMIN_WALLET_ADDRESS: " + ADMIN_WALLET_ADDRESS);

        try {
          await (provider as any).request({ method: "eth_requestAccounts" });
          setWeb3(web3Instance);

          const roundContractInstance = new web3Instance.eth.Contract(
            roundContractAbi,
            CONTRACT_ADDRESS
          );
          setRoundContract(roundContractInstance);
        } catch (error) {
          console.error("Failed to connect to wallet:", error);
        }
      } else {
        console.error("MetaMask not detected.");
      }
    };

    initializeWeb3();
  }, []);

  const handleDrawLottery = async () => {
    setAlert({
      message: "Transaction pending... Please approve transaction in Metamask",
      type: "success",
    });
    setIsTransactionPending(true);

    try {
      if (!roundContract || !web3) {
        console.error("Contract or Web3 not initialized.");
        return;
      }

      const accounts = await web3.eth.getAccounts();

      const currentRound = await roundContract.methods.getCurrentRound().call();

      if (currentRound.randomNum > 1) {
        console.log("currentRound.randomNum > 1");
        const response = await roundContract.methods
          .makeLuckyDrawTransfer()
          .send({ from: accounts[0] });

        console.log("Lucky draw transfer initiated!");
        console.log("response: " + response);

        setAlert({
          message: "Lucky draw transfer initiated!",
          type: "success",
        });
      } else {
        console.log("Requesting a random number...");
        setAlert({
          message: "Requesting a random number...",
          type: "success",
        });
        await roundContract.methods.requestLuckyDrawRandomNumber().send({
          from: accounts[0],
        });

        console.log("Lucky draw random number requested!");

        setAlert({
          message:
            "Lucky draw random number requested. Waiting for a valid random number...",
          type: "success",
        });

        let isValidRandomNumber = false;
        while (!isValidRandomNumber) {
          const updatedRound = await roundContract.methods
            .getCurrentRound()
            .call();
          if (updatedRound.randomNum > 0) {
            isValidRandomNumber = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
          }
        }

        console.log("Valid random number obtained. Initiating transfer...");
        setAlert({
          message: "Valid random number obtained. Initiating transfer...",
          type: "success",
        });

        const transferResponse = await roundContract.methods
          .makeLuckyDrawTransfer()
          .send({ from: accounts[0] });

        console.log("Lucky draw transfer initiated!");
        console.log("Transfer response: " + transferResponse);

        setAlert({
          message: "Lucky draw transfer initiated!",
          type: "success",
        });
      }

      console.log("Lucky draw request successful!");

      setAlert({
        message: "Lucky draw request successful!",
        type: "success",
      });
    } catch (error) {
      // Handle errors...
    } finally {
      setIsTransactionPending(false);
      setTimeout(() => {
        setAlert(null);
      }, 2500);
    }
  };

  return (
    <nav className="text-white p-4 pt-5 pb-5 flex justify-between items-center">
      {isAdmin && (
        <div className="flex justify-center">
          <Button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full text-lg"
            onClick={handleDrawLottery}
          >
            <b>Draw a Lottery</b>
          </Button>
        </div>
      )}

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

export default LuckyDrawButton;
