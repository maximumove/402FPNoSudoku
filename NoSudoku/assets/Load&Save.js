// Loading
const loadScoresLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/loadjson.php?user=Team3Scores';
const loadUsersLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/loadjson.php?user=Team3Users';

// Saving
const saveScoresLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/savejson.php?user=Team3Scores';
const saveUsersLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/savejson.php?user=Team3Users';


export const loadUsers = () => {

}

export async function loadScores(){
    const response = await fetch(loadScoresLink);
    const data = await response.json();

    const grouped = {
        Easy: [],
        Medium: [],
        Hard: [],
    };

    data.forEach((item) => {
        if (grouped[item.difficulty]) {
            grouped[item.difficulty].push({
                user: item.user,
                time: item.time,
            });
        }
    });

    setScores(grouped);
}

export async function saveUsers(){
  const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(users),
    };

    await fetch(saveUsersLink, requestOptions);
}

export async function saveScores(){
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scores),
    };

    await fetch(saveScoresLink, requestOptions);
}