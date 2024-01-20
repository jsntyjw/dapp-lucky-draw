import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import WalletCard from "../components/WalletCard";

const Home: NextPage = () => {
  return (
    <div className="bg-white flex justify-center items-center w-full h-screen">
      <div
        className="bg-gray-100 shadow-lg rounded-lg p-8 m-4"
        style={{ width: "60%", height: "75%" }}
      >
        <Navbar />
        <Banner />
        <WalletCard />
        {/* ... other components */}
      </div>
    </div>
  );
};

export default Home;
