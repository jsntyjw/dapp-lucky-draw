import React, { useState } from "react";

// Define a type for the card data
type CardData = {
  round_no: number;
  base_prize: number;
  participants: string[];
  is_resolved: boolean;
};

type LuckyDrawCardsProps = {
  cardData: CardData[]; // Specify the type for cardData
};

const LuckyDrawCards: React.FC<LuckyDrawCardsProps> = ({ cardData }) => {
  const cardsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const renderCards = () => {
    return cardData
      .slice(startIndex, endIndex)
      .map(({ round_no, base_prize, participants, is_resolved }, index) => (
        <div key={index} className="p-4  w-1/3 ">
          <div
            className={`flex rounded-lg h-full ${
              is_resolved ? "bg-orange-400" : "bg-green-400"
            } p-8 flex-col`}
          >
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h2 className="text-white dark:text-white text-lg font-medium">
                Round No: {round_no}
              </h2>
            </div>
            <div className="flex flex-col justify-between flex-grow pd-2">
              <p className="leading-relaxed text-base text-white dark:text-gray-300">
                Base Prize: ${base_prize}
              </p>
              <h4>Participants:</h4>
              <ul>
                {participants.map((participant, index) => (
                  <li key={index}>{participant}</li>
                ))}
              </ul>
              {is_resolved ? null : ( // If is_resolved is true, don't show the button
                // If is_resolved is false, show the button with a white color border
                <button
                  className="border-2 border-white rounded-lg text-green "
                  disabled={is_resolved}
                >
                  <b>Participate</b>
                </button>
              )}
            </div>
          </div>
        </div>
      ));
  };

  const totalPages = Math.ceil(cardData.length / cardsPerPage);

  return (
    <div className="flex flex-wrap justify-center mt-10">
      {renderCards()}
      {/* Pagination controls */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`mx-2 p-2 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            } rounded`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LuckyDrawCards;
