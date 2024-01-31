import React, { useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import ReactPaginate from "react-paginate";

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
  const [roundHistory, setRoundHistory] = useState<Round[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contract, setContract] = useState<any | null>(null);
  const [web3, setWeb3] = useState<any | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [roundContract, setRoundContract] = useState<any>(null);
  const perPage = 5; // Number of items per page

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

          // Define a function to fetch data from the contract
          const fetchData = async () => {
            const history: Round[] = await roundContractInstance.methods
              .getRoundHistory()
              .call();
            setRoundHistory(history);
          };

          // Fetch data initially
          fetchData();

          // Fetch data every 3 seconds
          const intervalId = setInterval(fetchData, 3000);

          // Clean up the interval when the component unmounts
          return () => clearInterval(intervalId);
        } catch (error) {
          console.error("Failed to connect to wallet:", error);
        }
      } else {
        console.error("MetaMask not detected.");
      }
    };

    initializeWeb3();
  }, []);

  // Calculate the total number of pages
  const pageCount = Math.ceil(roundHistory.length / perPage);

  // Function to handle page change
  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  // Calculate the range of items to display on the current page
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Get the items to display on the current page
  const itemsToDisplay = roundHistory.slice(startIndex, endIndex);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Round History</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Round Number</th>
            <th className="px-4 py-2">Winner Address</th>
          </tr>
        </thead>
        <tbody>
          {itemsToDisplay.map((round, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{startIndex + index + 1}</td>
              <td className="border px-4 py-2">🏆{round.winner}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination mt-4"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default RoundHistoryTable;
