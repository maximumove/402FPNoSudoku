import React, { createContext, useContext, useState } from 'react';
import saveScores from '../assets/LoadNSave';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [seed, setSeed] = useState('1');

  // Users
  const [currentUser, setCurrentUser] = useState("Admin");
  const [users, setUsers] = useState(
      {
      user: "FakeUser",
      fastestTime: null,
      board: null,
      seed: null,
      friendList: [],
    },
  );

  const addUser = (name, board = null, seed = null, friendList=null,) => {
    setUsers((prev) => [
      ...prev,
      {
        name: name,
        fastestTime: null,
        board: board,
        seed: seed,
        friendList: friendList,
      },
    ]);
  }

  const updateUser = (name, boad = null, seed = null, friendlist = null) =>{

    if(!board == null || !seed == null){
      // the users board and seed here.
    }
    if(!friendlist == null){
      // ADD FRIENDS HERE TODO:
    }
  }
 
  // Scores
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

    saveScores(scores);
  };

  const addTime = (difficulty, time) => {
    addScore(difficulty, { user: currentUser, time: time });
  };

  return <GameContext.Provider value={{
        // Board stuff    
        seed,
        setSeed,

        // Users stuff
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        addUser,
        updateUser,

        // Scores Stuff
        scores,
        addTime,
      }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useSeed must be used within a GameProvider');
  }

  return context;
}
