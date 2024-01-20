import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <Link href="/">
        Home
      </Link>
      {/* ... other nav items */}
    </nav>
  );
};

export default Navbar;
