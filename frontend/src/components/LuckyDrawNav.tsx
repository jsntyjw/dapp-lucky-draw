// pages/LuckyDrawSetup.tsx

import { useState, ChangeEvent, FormEvent, useEffect } from "react";

const LuckyDraw: React.FC = () => {
  const [step, setStep] = useState(1);
  const [numPrizes, setNumPrizes] = useState(1);
  const [prizes, setPrizes] = useState([{ name: "", description: "" }]);
  const [drawTime, setDrawTime] = useState("");

  // ... (Other handlers remain the same)

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleNumPrizesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNumPrizes = parseInt(e.target.value, 10);
    const newPrizes = Array(newNumPrizes).fill({ name: "", description: "" });
    setNumPrizes(newNumPrizes);
    setPrizes(newPrizes);
  };

  const numberSuffix = (i: number): string => {
    let j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return "st";
    }
    if (j === 2 && k !== 12) {
      return "nd";
    }
    if (j === 3 && k !== 13) {
      return "rd";
    }
    return "th";
  };

  useEffect(() => {
    setPrizes(Array(numPrizes).fill({ name: "", description: "" }));
  }, [numPrizes]);

  interface Prize {
    name: string;
    description: string;
  }

  const handlePrizeChange = (
    index: number,
    key: keyof Prize,
    value: string
  ) => {
    const updatedPrizes = prizes.map((prize, i) => {
      if (i === index) {
        return { ...prize, [key]: value };
      }
      return prize;
    });
    setPrizes(updatedPrizes);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Here you can handle the form submission, e.g., sending data to a server
    console.log("Form submitted:", { numPrizes, prizes, drawTime });
    // Add any other actions you need to perform on form submission
  };

  const [eventName, setEventName] = useState(""); // State for the event name
  const predefinedPrizes = [1, 2, 3, 5, 10]; // Define some predefined options for the number of prizes
  const buttonColors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
  ]; // Add more colors if needed

  const [showCustomInput, setShowCustomInput] = useState(false);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              🎉 Event Setup
            </h2>

            <div className="mb-4">
              <label
                htmlFor="eventName"
                className="block text-sm font-medium text-gray-700"
              >
                Event Name
              </label>
              <input
                type="text"
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter your event name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-700"
              />
            </div>

            <h3 className="text-md font-semibold mb-4 text-gray-700">
              Select the Number of Prizes
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {predefinedPrizes.map((num, index) => (
                <button
                  key={num}
                  onClick={() => {
                    setNumPrizes(num);
                    nextStep();
                  }}
                  className={`px-6 py-3 text-lg font-medium ${
                    buttonColors[index % buttonColors.length]
                  } text-white rounded-full hover:opacity-80 transition-opacity duration-200`}
                >
                  {num}
                </button>
              ))}
            </div>

            {showCustomInput ? (
              <div className="flex flex-col items-center justify-center">
                <div className="mt-4 w-full max-w-xs">
                  <input
                    type="number"
                    value={numPrizes}
                    onChange={(e) =>
                      setNumPrizes(parseInt(e.target.value) || 0)
                    }
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter custom number of prizes"
                  />
                </div>
                <div className="mt-4">
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center mt-8">
                {" "}
                {/* Increased top margin */}
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Custom Number
                </button>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              🎁 Prize Information
            </h2>
            {prizes.map((prize, index) => (
              <div key={index} className="mb-4 p-4 rounded-lg bg-gray-100">
                <h3 className="text-md font-semibold mb-2 text-gray-700">
                  🏆 Enter your {index + 1}
                  {numberSuffix(index + 1)} prize information:
                </h3>
                <div className="mb-4">
                  <label
                    htmlFor={`prizeName-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    📛 Prize Name
                  </label>
                  <input
                    type="text"
                    id={`prizeName-${index}`}
                    value={prize.name}
                    onChange={(e) =>
                      handlePrizeChange(index, "name", e.target.value)
                    }
                    className="mt-1 block w-1/2 p-2 border border-gray-300 rounded-md text-gray-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`prizeDesc-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    📝 Prize Description
                  </label>
                  <textarea
                    id={`prizeDesc-${index}`}
                    value={prize.description}
                    onChange={(e) =>
                      handlePrizeChange(index, "description", e.target.value)
                    }
                    className="mt-1 block w-1/2 p-2 border border-gray-300 rounded-md text-gray-700"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            ))}

            <div className="mb-4">
              <label
                htmlFor="drawTime"
                className="block text-sm font-medium text-gray-700"
              >
                Lucky Draw Time
              </label>
              <input
                type="datetime-local"
                id="drawTime"
                value={drawTime}
                onChange={(e) => setDrawTime(e.target.value)}
                className="mt-1 block w-1/2 p-2 border border-gray-300 rounded-md text-gray-700"
              />
            </div>

            <button
              onClick={prevStep}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="mt-4 ml-4 px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300"
            >
              Next
            </button>
          </div>
        );
      case 3:
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              📋 Review Your Input
            </h2>

            <div className="mb-4">
              <p className="text-gray-700">
                <strong>🎉 Event Name:</strong> {eventName}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                🏆 Prize Details
              </h3>
              {prizes.map((prize, index) => (
                <div key={index} className="mb-2 p-2 border-b border-gray-200">
                  <p className="text-gray-700">
                    <strong>
                      Prize {index + 1}
                      {numberSuffix(index + 1)}:
                    </strong>{" "}
                    {prize.name}
                  </p>
                  <p className="text-gray-700">{prize.description}</p>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-gray-700">
                <strong>🕒 Lucky Draw Time:</strong> {drawTime}
              </p>
            </div>

            <button
              onClick={prevStep}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="mt-4 ml-4 px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300"
            >
              Confirm
            </button>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-2">Submit Your Campaign</h2>
            <p>Click submit to finalize your lucky draw setup.</p>
            {/* <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Submit</button> */}
            <button>Submit</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xl"
    >
      {renderStepContent()}
    </form>
  );
};

export default LuckyDraw;
