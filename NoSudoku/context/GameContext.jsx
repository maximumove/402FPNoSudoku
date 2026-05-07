import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadScores, saveScores } from '../assets/LoadNSave';  // named imports

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

  const updateUser = (name, board = null, seed = null, friendlist = null) => {
    if (!board == null || !seed == null) {
      // the users board and seed here.
    }
    if (!friendlist == null) {
      // ADD FRIENDS HERE TODO:
    }
  }
 
  // Scores
  const [scores, setScores] = useState({
    Easy: [],
    Medium: [],
    Hard: [],
  });

  useEffect(() => {
    loadScores()
      .then((loadedScores) => {
        if (loadedScores) {
          setScores(loadedScores);
        }
      })
      .catch((e) => console.error('Failed to load scores:', e));
  }, []);

  const addScore = (difficulty, newScore) => {
    let flatScores = null;

    setScores((prev) => {
      const updated = [...prev[difficulty], newScore]
        .sort((a, b) => a.time - b.time)
        .slice(0, 10); // Grabs Top ten per difficulty

      const newScores = {
        ...prev,
        [difficulty]: updated,
      };

      flatScores = [
        ...newScores.Easy.map(s => ({ ...s, difficulty: 'Easy' })),
        ...newScores.Medium.map(s => ({ ...s, difficulty: 'Medium' })),
        ...newScores.Hard.map(s => ({ ...s, difficulty: 'Hard' })),
      ];

      return newScores;
    });

    if (!flatScores) {
      return Promise.resolve();
    }

    return saveScores(flatScores).catch(e => {
      console.error('Failed to save scores:', e);
      throw e;
    });
  };

  const addTime = (difficulty, time, username = currentUser) => {
    return addScore(difficulty, { user: username, time: time });
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
