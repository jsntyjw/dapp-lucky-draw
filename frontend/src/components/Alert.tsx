import React, { useEffect } from "react";

type AlertProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 3000); // Close the alert after 3 seconds (adjust as needed)

    return () => {
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70`}
    >
      <div
        className={`bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xl`}
      >
        {type === "success" ? (
          <p className="text-lg font-semibold mb-2 text-center text-green-700">
            {message}
          </p>
        ) : (
          <p className="text-lg font-semibold mb-2 text-center text-red-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Alert;
