// Import necessary libraries and components
import type { NextPage } from "next";
import { useState } from "react";

import Banner from "../components/Banner";
import NewLuckyDraw from "@/components/NewLuckyDraw";
import MyNavbar from "@/components/MyNavbar";
import TokenBalance from "@/components/TokenBalance";
import Alert from "../components/Alert"; // Import the Alert component
import LuckyDrawButton from "@/components/LuckyDrawButton";
import JoinLuckyDrawPool from "@/components/JoinLuckyDraw";
import RoundHistoryTable from "@/components/RoundHistory";

const Home: NextPage = () => {
  const [showNewLuckyDraw, setShowNewLuckyDraw] = useState(false);
  const [userAddress] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null); // Add alert state

  const handleCreateLuckyDrawClick = () => {
    setShowNewLuckyDraw(true);
  };

  // Example card data with six items
  const cardData = [
    {
      round_no: 1,
      participants: ["Address1", "Address2", "Address3"],
      winner: "Address1",
    },
    {
      round_no: 2,
      participants: ["Address4", "Address5", "Address6"],
      winner: "Address1",
    },
    {
      round_no: 3,
      participants: ["Address7", "Address8", "Address9"],
      winner: "Address1",
    },
    {
      round_no: 4,
      participants: ["Address10", "Address11", "Address12"],
      winner: "Address1",
    },
    {
      round_no: 5,
      participants: ["Address13", "Address14", "Address15"],
      winner: "Address1",
    },
    {
      round_no: 6,
      participants: ["Address16", "Address17", "Address18"],
      winner: "Address1",
    },
    // Add more card data objects as needed
  ];

  // Function to show the alert
  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000); // Hide the alert after 3 seconds (adjust as needed)
  };

  return (
    <div className="bg-slate-400 flex flex-col justify-center items-center w-full h-screen">
      <div className="bg-background-dark shadow-lg rounded-lg m-4 flex flex-col flex-grow">
        <div className="flex-none">
          <MyNavbar
            onCreateLuckyDrawClick={handleCreateLuckyDrawClick}
            userAddress={userAddress}
          />
        </div>
        <div className="bg-background-dark from-mainframe-green to-mainframe-dark">
          <Banner />
        </div>
      </div>
      {showNewLuckyDraw && (
        <NewLuckyDraw onClose={() => setShowNewLuckyDraw(false)} />
      )}

      <div>
        <TokenBalance userAddress={userAddress} />
      </div>

      <LuckyDrawButton userAddress={userAddress} />

      <JoinLuckyDrawPool userAddress={userAddress} />

      <RoundHistoryTable />

      {/* Display the Alert component if an alert is present */}
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

export default Home;
