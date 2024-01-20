import React from "react";
import { Button, ButtonGroup, Input } from "@nextui-org/react";

const WalletCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center  rounded-lg p-8">
      <h2 className="text-white text-lg font-semibold mb-6">VIEW RESULTS</h2>
      <div className="w-full grid grid-cols-3 gap-4">
        {/* Div 1 */}
        <div className="flex flex-col items-center justify-center space-y-2">
        <Button color="primary" variant="solid">Button 1</Button>
          <Input fullWidth color="success" placeholder="Enter text 1" />
        </div>

        {/* Div 2 */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Button color="success">Button 2</Button>
          <Input fullWidth color="success" placeholder="Enter text 2" />
        </div>

        {/* Div 3 */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Button color="success">Button 3</Button>
          <Input fullWidth color="success" placeholder="Enter text 3" />
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
