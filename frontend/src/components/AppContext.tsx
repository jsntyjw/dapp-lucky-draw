import React, { createContext, useContext, useState, ReactNode } from "react";

type AppContextType = {
  tokenBalance: number | null;
  latestRoundBaseAmount: number | null;
  setTokenBalance: (balance: number | null) => void;
  setLatestRoundBaseAmount: (amount: number | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode; // Specify children as ReactNode
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [latestRoundBaseAmount, setLatestRoundBaseAmount] = useState<
    number | null
  >(null);

  return (
    <AppContext.Provider
      value={{
        tokenBalance,
        latestRoundBaseAmount,
        setTokenBalance,
        setLatestRoundBaseAmount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
