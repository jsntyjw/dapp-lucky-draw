import React, { useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

import roundContractAbi from "../../../backend/contracts/Luckdraw.json";
import { CONTRACT_ADDRESS } from "../config";

interface Round {
  winner: string;
  requestId: string;
  randomNum: string;
  luckyNum: string;
  addressPool: string[];
}

function RoundHistoryTable() {
  const [roundHistory, setRoundHistory] = useState<Round[]>([]); // Specify the type as Round[]
  const [currentPage, setCurrentPage] = useState(1);
  const [contract, setContract] = useState<any | null>(null);
  const [web3, setWeb3] = useState<any | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [roundContract, setRoundContract] = useState<any>(null);

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

          const history: Round[] = await roundContractInstance.methods
            .getRoundHistory()
            .call();

          setRoundHistory(history);
        } catch (error) {
          console.error("Failed to connect to wallet:", error);
        }
      } else {
        console.error("MetaMask not detected.");
      }
    };

    initializeWeb3();
  }, []);

  return (
    <div>
      <h1>Round History</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th>Round Number</th>
            <th>Winner Address</th>
          </tr>
        </thead>
        <tbody>
          {roundHistory.map((round, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{round.winner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoundHistoryTable;
