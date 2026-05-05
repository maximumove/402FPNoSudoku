import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
 
// Loading
const loadScoresLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/loadjson.php?user=Team3Scores';
const loadUsersLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/loadjson.php?user=Team3Users';
 
// Saving
const saveScoresLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/savejson.php?user=Team3Scores';
const saveUsersLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/savejson.php?user=Team3Users';
 
// ── Local picture storage (stays on device, avoids server size limits) ──────
 
export async function saveProfilePicture(username, dataUri) {
    const key = `profilePic_${username}`;
    try {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, dataUri);
        } else {
            await AsyncStorage.setItem(key, dataUri);
        }
    } catch (e) {
        console.error('Failed to save profile picture locally:', e);
    }
}
 
export async function loadProfilePicture(username) {
    const key = `profilePic_${username}`;
    try {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key) || null;
        } else {
            return await AsyncStorage.getItem(key);
        }
    } catch (e) {
        console.error('Failed to load profile picture locally:', e);
        return null;
    }
}
 
// ── Helpers ──────────────────────────────────────────────────────────────────
 
// useLocalSearchParams can return string | string[] on web — always get a plain string
export function resolveParam(param) {
    if (Array.isArray(param)) return param[0] ?? '';
    return param ?? '';
}
 
// ── Server: Users ─────────────────────────────────────────────────────────────
 
export async function loadUsers() {
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
 
export async function saveUsers(users) {
    // Strip profilePicture before sending to server — stored locally instead
    const stripped = users.map(({ profilePicture, ...rest }) => rest);
    const requestOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stripped),
    };
    await fetch(saveUsersLink, requestOptions);
}
 
export async function loadUser(username) {
    const users = await loadUsers();
    const name = resolveParam(username);
    return users.find(u => u.username?.trim() === name.trim()) || null;
}
 
export async function saveUser(updatedUser) {
    const users = await loadUsers();
    const index = users.findIndex(u => u.username === updatedUser.username);
    if (index !== -1) {
        users[index] = updatedUser;
    } else {
        users.push(updatedUser);
    }
    await saveUsers(users);
}
 
// ── Server: Scores ────────────────────────────────────────────────────────────
 
export async function loadScores() {
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
 
export async function saveScores(scores) {
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