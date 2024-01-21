import { useState } from "react";

const NewLuckyDraw: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [numAmount, setNumAmount] = useState<number | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);

  const predefinedAmount = [1, 2, 3, 5, 10];

  const handleNumberButtonClick = (num: number) => {
    setNumAmount(num);
    setShowCustomInput(false);
    setShowProceedButton(true);
  };

  const handleCustomNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const customNum = parseInt(e.target.value) || 0;
    setNumAmount(customNum);
    setShowProceedButton(customNum > 0);
  };

  const handleExitClick = () => {
    onClose(); // Close the NewLuckyDraw component
  };

  const renderStepContent = () => {
    const baseAmountMessage =
      numAmount !== null && numAmount > 0
        ? `Your base amount is 💰${numAmount}`
        : "";

    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xl">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            🎉 Lucky Draw Setup
          </h2>

          <h3 className="text-md font-semibold mb-4 text-gray-700">
            Select the Base Amount
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {predefinedAmount.map((num) => (
              <button
                key={num}
                onClick={() => handleNumberButtonClick(num)}
                className={`px-6 py-3 text-lg font-medium ${
                  num === numAmount
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                } rounded-full hover:bg-gray-300`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => {
                setNumAmount(null);
                setShowCustomInput(true);
                setShowProceedButton(false);
              }}
              className={`px-6 py-3 text-lg font-medium ${
                numAmount === null
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-full hover:bg-gray-300`}
            >
              Custom Number
            </button>
          </div>

          {showCustomInput && (
            <div className="flex flex-col items-center justify-center">
              <div className="mt-4 w-full max-w-xs">
                <input
                  type="number"
                  value={numAmount !== null && numAmount > 0 ? numAmount : ""}
                  onChange={handleCustomNumberInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter custom number of Amount"
                />
              </div>
            </div>
          )}

          {baseAmountMessage && (
            <p className="text-lg font-semibold mb-2 text-gray-700 text-center">
              {baseAmountMessage}
            </p>
          )}

          <div className="flex justify-center mt-8">
            <button
              onClick={handleExitClick}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-4"
            >
              Exit
            </button>
            <button
              className={`px-4 py-2 ${
                numAmount !== null && numAmount > 0
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-400 text-gray-800 cursor-not-allowed"
              } rounded-md ml-4`}
              onClick={() => {
                // Handle the "Proceed" button click action here
              }}
              disabled={!showProceedButton}
            >
              Proceed 🚀
            </button>
          </div>
        </div>
      </div>
    );
  };

  return renderStepContent();
};

export default NewLuckyDraw;
