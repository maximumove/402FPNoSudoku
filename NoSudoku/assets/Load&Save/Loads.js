const loadScoresLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/loadjson.php?user=Team3Scores'
const loadUsersLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/loadjson.php?user=Team3Users'

export const loadUsers = () => {

}

export async function loadScores(){
    const response = await fetch(retrieveLink);
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
