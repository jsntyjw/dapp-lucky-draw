import React from "react";
import { Button, ButtonGroup, Input } from "@nextui-org/react";

const WalletCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center rounded-lg p-8">
      <h2 className="text-white text-lg font-semibold mb-6">VIEW RESULTS</h2>
      <div className="w-full grid grid-cols-3 gap-4">
        {/* Div 1 */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Button
            radius="md"
            className="bg-button-dark-green text-white shadow-lg text-xl px-6 py-3"
          >
            Button 1
          </Button>
        </div>

        {/* Div 2 */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Button
            radius="md"
            className="bg-button-dark-green text-white shadow-lg text-xl px-6 py-3"
          >
            Button 2
          </Button>
        </div>

        {/* Div 3 */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Button
            radius="md"
            className="bg-button-dark-green text-white shadow-lg text-xl px-6 py-3"
          >
            Button 3
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
