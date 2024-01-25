import { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../../../backend/contracts/Luckdraw.json";

import detectEthereumProvider from "@metamask/detect-provider";

import { CONTRACT_ADDRESS, ADMIN_WALLET_ADDRESS } from "../config";

const NewLuckyDraw: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [numAmount, setNumAmount] = useState<number | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [transactionStatus, setTransactionStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const predefinedAmount = [1, 2, 3, 5, 10];

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
            CONTRACT_ADDRESS
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

  const handleNumberButtonClick = (num: number) => {
    setNumAmount(num);
    setShowCustomInput(false);
    setShowProceedButton(true);
  };

  const handleCustomNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const customNum = parseInt(e.target.value) || 0;
    setNumAmount(customNum);
    setShowProceedButton(customNum > 0);
  };

  const handleExitClick = () => {
    onClose(); // Close the NewLuckyDraw component
  };

  const handleProceedClick = async () => {
    if (!web3 || !contract || numAmount === null || numAmount <= 0) {
      console.error(
        "Web3 is not initialized, contract is not set, or numAmount is invalid"
      );
      setTransactionStatus("error");
      return;
    }

    setTransactionStatus("pending");
    try {
      const accounts = await web3.eth.getAccounts();
      if (!accounts.length) {
        console.error("No accounts found");
        setTransactionStatus("error");
        return;
      }
      const account = accounts[0];

      await contract.methods
        .setMinDepositToken(numAmount)
        .send({ from: account });

      setTransactionStatus("success");
      setTimeout(onClose, 2000); // Close the component after 2 seconds
    } catch (error) {
      console.error(error);
      setTransactionStatus("error");
    }
  };

  const renderStepContent = () => {
    let message;
    switch (transactionStatus) {
      case "pending":
        message = "Transaction pending... please wait...";
        break;
      case "success":
        message = "Operation successful! Transaction has been processed.";
        break;
      case "error":
        message = "Operation failed: Transaction was not completed.";
        break;
      default:
        message = "";
        break;
    }

    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xl">
          {transactionStatus === "idle" ? (
            <>
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                🎉 Lucky Draw Setup
              </h2>
              <h3 className="text-md font-semibold mb-4 text-gray-700">
                Select the Base Amount
              </h3>
              <div className="flex flex-wrap gap-4 justify-center">
                {predefinedAmount.map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumberButtonClick(num)}
                    className={`px-6 py-3 text-lg font-medium ${
                      num === numAmount
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    } rounded-full hover:bg-gray-300`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setNumAmount(null);
                    setShowCustomInput(true);
                    setShowProceedButton(false);
                  }}
                  className={`px-6 py-3 text-lg font-medium ${
                    numAmount === null
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  } rounded-full hover:bg-gray-300`}
                >
                  Custom Number
                </button>
              </div>
              {showCustomInput && (
                <div className="flex flex-col items-center justify-center">
                  <div className="mt-4 w-full max-w-xs">
                    <input
                      type="number"
                      value={
                        numAmount !== null && numAmount > 0 ? numAmount : ""
                      }
                      onChange={handleCustomNumberInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-700"
                      placeholder="Enter custom number of Amount"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleExitClick}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-4"
                >
                  Exit
                </button>
                <button
                  className={`px-4 py-2 ${
                    numAmount !== null && numAmount > 0
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-400 text-gray-800 cursor-not-allowed"
                  } rounded-md ml-4`}
                  onClick={handleProceedClick}
                  disabled={!showProceedButton}
                >
                  Proceed 🚀
                </button>
              </div>
            </>
          ) : (
            <p
              className={`text-lg font-semibold mb-2 text-center ${
                transactionStatus === "error"
                  ? "text-red-700"
                  : "text-green-700"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    );
  };

  return renderStepContent();
};

export default NewLuckyDraw;
