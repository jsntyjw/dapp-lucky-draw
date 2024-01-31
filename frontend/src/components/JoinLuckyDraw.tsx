import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

// Import the ABI and contract address
import roundContractAbi from "../../../backend/contracts/Luckdraw.json";
import tokenAbi from "../../../backend/contracts/LukydrawERC20TokenOZ.json";

import {
  TOKEN_CONTRACT_ADDRESS,
  CONTRACT_ADDRESS,
  ADMIN_WALLET_ADDRESS,
} from "../config";
import Alert from "./Alert";

interface LuckyDrawButtonProps {
  userAddress: string | null;
}

const JoinLuckyDrawPool: React.FC<LuckyDrawButtonProps> = ({}) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [roundContract, setRoundContract] = useState<any>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  useEffect(() => {
    const initializeWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        console.log("MetaMask detected.");
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

  const handleJoinPoolClick = async () => {
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
      console.log("accounts: ", accounts);
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

      const minDepositTokenNumber = Number(minDepositToken);
      const approvalAmountWei = minDepositTokenNumber * 10 ** 18;

      console.log("approvalAmountWei: ", approvalAmountWei);

      const approveStatus = await tokenContractInstance.methods
        .approve(CONTRACT_ADDRESS, Number(approvalAmountWei))
        .send({ from: accounts[0] });

      console.log("approvalAmountWei: ", approvalAmountWei);
      console.log("approveStatus: ", approveStatus);

      const receipt = await roundContractInstance.methods
        .joinPool()
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

  return (
    <nav className="text-white p-4 pt-5 pb-5 flex justify-between items-center">
      {
        <div className="flex justify-center">
          <Button
            className="bg-fuchsia-50 text-black border border-solid border-gray-300 rounded-full px-4 py-2"
            onClick={handleJoinPoolClick}
          >
            <b>Join Pool</b>
          </Button>
        </div>
      }

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

export default JoinLuckyDrawPool;
