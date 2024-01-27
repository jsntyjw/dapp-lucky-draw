import React, { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import tokenAbi from "../../../backend/contracts/LukydrawERC20TokenOZ.json";
import { TOKEN_CONTRACT_ADDRESS } from "../config";
import roundContractAbi from "../../../backend/contracts/Luckdraw.json";
import { CONTRACT_ADDRESS } from "../config";
import Alert from "./Alert"; // Import the Alert component

type CardData = {
  round_no: number;
  base_prize: number;
  participants: string[];
  is_resolved: boolean;
};

type LuckyDrawCardsProps = {
  cardData: CardData[];
  showAlert: (message: string, type: "success" | "error") => void;
};

const LuckyDrawCards: React.FC<LuckyDrawCardsProps> = ({
  cardData,
  showAlert,
}) => {
  const cardsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [contract, setContract] = useState<any | null>(null);
  const [web3, setWeb3] = useState<any | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [roundContract, setRoundContract] = useState<any>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleParticipateClick = async (round_no: number) => {
    setAlert({
      message: "Transaction pending... Please approve transaction in Metamask",
      type: "success",
    });
    setIsTransactionPending(true);

    try {
      if (!roundContract || !web3) {
        console.error("Contract or Web3 not initialized.");
        showAlert("Contract or Web3 not initialized", "error");
        return;
      }

      const accounts = await web3.eth.getAccounts();
      const roundContractInstance = new web3.eth.Contract(
        roundContractAbi,
        CONTRACT_ADDRESS
      );

      const tokenContractInstance = new web3.eth.Contract(
        tokenAbi,
        TOKEN_CONTRACT_ADDRESS
      );

      const minDepositToken = await roundContractInstance.methods
        .getMinDepositToken()
        .call();

      const minDepositTokenNumber = Number(minDepositToken.toString());
      const approvalAmountWei = minDepositTokenNumber * 10 ** 18;

      await tokenContractInstance.methods
        .approve(CONTRACT_ADDRESS, approvalAmountWei)
        .send({ from: accounts[0] });

      const receipt = await roundContractInstance.methods
        .joinPool(round_no)
        .send({ from: accounts[0] });

      if (receipt.status) {
        setAlert({
          message:
            "Operation Successful... You have joined the lucky draw pool",
          type: "success",
        });
      } else {
        setAlert({
          message: "Transaction Failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error participating in the lucky draw pool:", error);
      setAlert({
        message: "Error participating in the lucky draw pool",
        type: "error",
      });
    } finally {
      setIsTransactionPending(false);
      // Automatically hide the alert after a few seconds
      setTimeout(() => {
        setAlert(null);
      }, 2500); // 2500 milliseconds (5 seconds) delay before hiding
    }
  };

  useEffect(() => {
    const initializeWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3Instance = new Web3(provider as any);
        try {
          await (provider as any).request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          setUserAddress(accounts[0]);
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

  const renderCards = () => {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;

    return cardData
      .slice(startIndex, endIndex)
      .map(({ round_no, base_prize, participants, is_resolved }, index) => (
        <div key={index} className="p-4 w-1/3">
          <div
            className={`flex rounded-lg h-full ${
              is_resolved ? "bg-orange-400" : "bg-green-400"
            } p-8 flex-col`}
          >
            {/* ... (existing card content) */}
            {!is_resolved && (
              <button
                className="border-2 border-white rounded-lg text-green"
                disabled={is_resolved}
                onClick={() => handleParticipateClick(round_no)}
              >
                <b>Participate</b>
              </button>
            )}
          </div>
        </div>
      ));
  };

  const totalPages = Math.ceil(cardData.length / cardsPerPage);

  return (
    <div className="flex flex-wrap justify-center mt-10">
      {renderCards()}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`mx-2 p-2 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            } rounded`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default LuckyDrawCards;
