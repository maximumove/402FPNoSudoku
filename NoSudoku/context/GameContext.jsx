import React, { createContext, useContext, useMemo, useState } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [seed, setSeed] = useState('1');

  // readable Scores
  const [scores, setScores] = useState({
    Easy: [],
    Medium: [],
    Hard: [],
  });

  const addScore = (difficulty, newScore) => {
    setScores((prev) => {
      const updated = [...prev[difficulty], newScore]
        .sort((a, b) => a.time - b.time)
        .slice(0, 10); // Grabs Top ten per

      return {
        ...prev,
        [difficulty]: updated,
      };
    });
  };

  return <GameContext.Provider value={{
        seed,
        setSeed,
        scores,
        addScore,
      }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useSeed must be used within a GameProvider');
  }

  return context;
}
