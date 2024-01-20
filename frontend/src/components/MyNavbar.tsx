import { Avatar, Button } from "@nextui-org/react";

const Navbar: React.FC = () => {
  return (
    <nav className="text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      </div>

      <Button className="bg-fuchsia-50 text-black border border-solid border-gray-300 rounded-full px-4 py-2">
        Login
      </Button>
    </nav>
  );
};

export default Navbar;
