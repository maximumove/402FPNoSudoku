// Loading
const loadScoresLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/loadjson.php?user=Team3Scores';
const loadUsersLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/loadjson.php?user=Team3Users';

// Saving
const saveScoresLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/savejson.php?user=Team3Scores';
const saveUsersLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/savejson.php?user=Team3Users';

export async function loadUsers(){
    try {
        const response = await fetch(loadUsersLink);
        const text = await response.text();
        if (!text || text.trim() === '') return [];
        return JSON.parse(text);
    } catch (e) {
        console.error('Failed to load users:', e);
        return [];
    }
}

export async function loadScores(){
    try {
        const response = await fetch(loadScoresLink);
        const text = await response.text();
        if (!text || text.trim() === '') return { Easy: [], Medium: [], Hard: [] };
        const data = JSON.parse(text);

        const grouped = { Easy: [], Medium: [], Hard: [] };
        data.forEach((item) => {
            if (grouped[item.difficulty]) {
                grouped[item.difficulty].push({
                    user: item.user,
                    time: item.time,
                });
            }
        });
        return grouped;
    } catch (e) {
        console.error('Failed to load scores:', e);
        return { Easy: [], Medium: [], Hard: [] };
    }
}

export async function loadUser(username) {
    const users = await loadUsers();
    return users.find(u => u.username === username) || null;
}

// ================================= //

export async function saveUsers(users){
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

export async function saveUser(updatedUser) {
    const users = await loadUsers();
    const index = users.findIndex(u => u.username === updatedUser.username);
    if (index !== -1) {
        users[index] = updatedUser; // update existing user
    } else {
        users.push(updatedUser); // add new user
    }
    await saveUsers(users);
}

export async function saveScores(scores){
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
