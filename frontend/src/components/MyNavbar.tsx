import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {

  const router = useRouter();
  const handleCreateLuckyDraw = () => {
    router.push("/LuckyDrawNav");
  };

  return (
    <nav className="text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      </div>

      <Button
            onClick={handleCreateLuckyDraw}
            color="primary"
            variant="flat"
          >
            Create Lucky Draw
          </Button>

      <Button className="bg-fuchsia-50 text-black border border-solid border-gray-300 rounded-full px-4 py-2">
        Login
      </Button>
    </nav>
  );
};

export default Navbar;
