import React from "react";
import {Button} from '@nextui-org/react'

const WalletCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center bg-darkBlue rounded-lg p-8">
      <h2 className="text-white text-lg font-semibold mb-6">VIEW RESULTS</h2>
      <div className="grid grid-cols-7 gap-4 mb-6">
        {Array.from({ length: 7 }).map((_, index) => (
          <Button
            key={index}
            className="w-14 h-14 bg-blue-500 rounded-md flex items-center justify-center text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => {
              /* Handle click event */
            }}
          >
            {/* You can insert an icon or text here */}
            {index + 1}
          </Button>
        ))}
      </div>
      <div className="flex flex-row justify-center items-center w-full space-x-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Button
            key={index}
            className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg"
          >
            Button {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WalletCard;
