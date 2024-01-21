import React, { useState } from "react";
import { Button, ButtonGroup, Input } from "@nextui-org/react";
import LuckyDrawEventCard from "./LuckyDrawEventCard"; // Import the card component

interface LuckyDrawEvent {
  eventName: string;
  numPrizes: number;
  drawTime: string;
}

const WalletCard: React.FC = () => {
  const [luckyDrawEvents, setLuckyDrawEvents] = useState<LuckyDrawEvent[]>([]);

  // Function to add a new lucky draw event to the list
  const addLuckyDrawEvent = (event: LuckyDrawEvent) => {
    setLuckyDrawEvents([...luckyDrawEvents, event]);
  };

  return (
    <div className="flex flex-col items-center rounded-lg p-8">
      <h2 className="text-white text-lg font-semibold mb-6">VIEW RESULTS</h2>

      {luckyDrawEvents.map((event, index) => (
        <LuckyDrawEventCard key={index} {...event} />
      ))}

      {/* <div className="w-full grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Button
            radius="md"
            className="bg-button-dark-green text-white shadow-lg text-xl px-6 py-3"
          >
            Button 1
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2">
          <Button
            radius="md"
            className="bg-button-dark-green text-white shadow-lg text-xl px-6 py-3"
          >
            Button 2
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2">
          <Button
            radius="md"
            className="bg-button-dark-green text-white shadow-lg text-xl px-6 py-3"
          >
            Button 3
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default WalletCard;
