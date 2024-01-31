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

  return (
    <div className="bg-slate-400 flex flex-col justify-center items-center w-screen h-screen">
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

        <div className="flex">
          {/* Left side */}
          <div className="flex-1 p-4 flex items-center justify-center">
            <div>
              <TokenBalance userAddress={userAddress} />
              <div className="flex space-x-4">
                {/* Token Balance Card */}
                <LuckyDrawButton userAddress={userAddress} />

                {/* Latest Round Base Amount Card */}
                <JoinLuckyDrawPool userAddress={userAddress} />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex-1 p-4">
            <RoundHistoryTable />
          </div>
        </div>
      </div>
      {showNewLuckyDraw && (
        <NewLuckyDraw onClose={() => setShowNewLuckyDraw(false)} />
      )}

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
