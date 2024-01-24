import type { NextPage } from "next";
import { useState } from "react";

import Banner from "../components/Banner";
import NewLuckyDraw from "@/components/NewLuckyDraw";
import MyNavbar from "@/components/MyNavbar";
import LuckyDrawCards from "@/components/LuckyDrawCards"; // Import the LuckyDrawCards component
import TokenBalance from "@/components/TokenBalance";

const Home: NextPage = () => {
  const [showNewLuckyDraw, setShowNewLuckyDraw] = useState(false);
  const [userAddress] = useState<string | null>(null);

  const handleCreateLuckyDrawClick = () => {
    setShowNewLuckyDraw(true);
  };

  // Example card data with six items
  const cardData = [
    {
      round_no: 1,
      base_prize: 100,
      participants: ["Address1", "Address2", "Address3"],
      is_resolved: false,
    },
    {
      round_no: 2,
      base_prize: 200,
      participants: ["Address4", "Address5", "Address6"],
      is_resolved: true,
    },
    {
      round_no: 3,
      base_prize: 150,
      participants: ["Address7", "Address8", "Address9"],
      is_resolved: true,
    },
    {
      round_no: 4,
      base_prize: 300,
      participants: ["Address10", "Address11", "Address12"],
      is_resolved: true,
    },
    {
      round_no: 5,
      base_prize: 120,
      participants: ["Address13", "Address14", "Address15"],
      is_resolved: true,
    },
    {
      round_no: 6,
      base_prize: 250,
      participants: ["Address16", "Address17", "Address18"],
      is_resolved: true,
    },
    // Add more card data objects as needed
  ];

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

      <div className="flex justify-between w-full p-4">
        <div className="w-full">
          <LuckyDrawCards cardData={cardData} />
        </div>
      </div>
    </div>
  );
};

export default Home;
