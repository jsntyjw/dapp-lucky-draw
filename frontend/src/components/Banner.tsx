import Image from "next/image";

const MainBanner: React.FC = () => {
  return (
    <Image
      src="/background-img.png" // Use forward slashes and the correct path
      alt="Top Image Alt Text"
      width={1919}
      height={491}
    />
  );
};

export default MainBanner;
