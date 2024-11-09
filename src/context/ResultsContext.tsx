import React, { createContext, useContext, useState } from 'react';

type ResultsContextType = {
  results: string | null;
  setResults: (results: string | null) => void;
};

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export function ResultsProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<string | null>(null);

  return (
    <ResultsContext.Provider value={{ results, setResults }}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
} 