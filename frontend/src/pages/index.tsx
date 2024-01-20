import type { NextPage } from "next";
import MyNavbar from "../components/MyNavbar";
import Banner from "../components/Banner";
import WalletCard from "../components/WalletCard";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";

const Home: NextPage = () => {
  return (
    <div className="bg-slate-400 flex justify-center items-center w-full h-screen">
      <div
        className="bg-background-dark shadow-lg rounded-lg m-4 flex flex-col"
        style={{ width: "60%", height: "75%" }}
      >
        <div className="flex-none" style={{ height: "10%" }}>
          <MyNavbar />
        </div>
        <div
          className="bg-gradient-to-b from-mainframe-green to-mainframe-dark flex-grow"
          style={{ height: "60%" }}
        >
          <Banner />
        </div>
        <div className="flex-none" style={{ height: "30%" }}>
          <WalletCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
