import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/router";

interface MyNavbarProps {
  onCreateLuckyDrawClick: () => void;
}

const MyNavbar: React.FC<MyNavbarProps> = ({ onCreateLuckyDrawClick }) => {
  const router = useRouter();

  return (
    <nav className="text-white p-4 pt-5 pb-5 flex justify-between items-center">
      {/* Adjust the padding (pt-6 and pb-6) for top and bottom spacing */}
      <div className="flex items-center">
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      </div>

      <Button
        className="bg-fuchsia-50 text-black border border-solid border-gray-300 rounded-full px-4 py-2"
        onClick={onCreateLuckyDrawClick} // Call the function when the button is clicked
      >
        <b>Create Lucky Draw</b>
      </Button>

      <Button className="bg-fuchsia-50 text-black border border-solid border-gray-300 rounded-full px-4 py-2">
        <b>Login</b>
      </Button>
    </nav>
  );
};

export default MyNavbar;
