import type { NextPage } from "next";
import { useState } from "react";

import Banner from "../components/Banner";
import NewLuckyDraw from "@/components/NewLuckyDraw";
import MyNavbar from "@/components/MyNavbar";

const Home: NextPage = () => {
  const [showNewLuckyDraw, setShowNewLuckyDraw] = useState(false);

  const handleCreateLuckyDrawClick = () => {
    setShowNewLuckyDraw(true);
  };

  return (
    <div className="bg-slate-400 flex flex-col justify-center items-center w-full h-screen">
      <div className="bg-background-dark shadow-lg rounded-lg m-4 flex flex-col flex-grow">
        <div className="flex-none">
          <MyNavbar onCreateLuckyDrawClick={handleCreateLuckyDrawClick} />
        </div>
        <div className="bg-background-dark from-mainframe-green to-mainframe-dark flex-grow">
          <Banner />
        </div>
      </div>

      {showNewLuckyDraw && (
        <NewLuckyDraw
          onClose={() => setShowNewLuckyDraw(false)} // Pass a callback to handle closing
        />
      )}
    </div>
  );
};

export default Home;
