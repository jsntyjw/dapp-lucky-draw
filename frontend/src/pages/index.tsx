import type { NextPage } from "next";
import MyNavbar from "../components/MyNavbar";
import Banner from "../components/Banner";
import WalletCard from "../components/WalletCard";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";
import LuckyDraw from "@/components/LuckyDrawNav";

const Home: NextPage = () => {
  return (
    <div className="bg-slate-400 flex flex-col justify-center items-center w-full h-screen">
      <div className="bg-background-dark shadow-lg rounded-lg m-4 flex flex-col flex-grow">
        <div className="flex-none">
          <MyNavbar />
        </div>
        <div className=" bg-background-dark from-mainframe-green to-mainframe-dark flex-grow">
          <Banner />
        </div>
        <div className="flex-none">
          <WalletCard />
        </div>
      </div>
      {/* <LuckyDraw /> */}
    </div>
  );
};

export default Home;
