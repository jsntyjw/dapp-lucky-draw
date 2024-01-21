import React from "react";

interface LuckyDrawEventCardProps {
  eventName: string;
  numPrizes: number;
  drawTime: string;
}

const LuckyDrawEventCard: React.FC<LuckyDrawEventCardProps> = ({
  eventName,
  numPrizes,
  drawTime,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">{eventName}</h2>
      <p>Number of Prizes: {numPrizes}</p>
      <p>Lucky Draw Time: {drawTime}</p>
      {/* Add any other event details you want to display */}
    </div>
  );
};

export default LuckyDrawEventCard;
