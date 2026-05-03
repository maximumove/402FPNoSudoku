const saveScoresLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/savejson.php?user=Team3Scores';
const saveUsersLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/savejson.php?user=Team3Users';

export const saveUsers = () => {

}

export const saveScores = () => {
    
}

export const addScore = (data, difficulty, newScore) => {
  const updatedList = [...data[difficulty], newScore]
    .sort((a, b) => a.time - b.time) // fastest first
    .slice(0, 10); // keep top 10

  return {
    ...data,
    [difficulty]: updatedList,
  };
};

