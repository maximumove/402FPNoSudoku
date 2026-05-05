import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
 
// Loading
const loadScoresLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/loadjson.php?user=Team3Scores';
const loadUsersLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/loadjson.php?user=Team3Users';
 
// Saving
const saveScoresLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/savejson.php?user=Team3Scores';
const saveUsersLink = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips/savejson.php?user=Team3Users';
 
// ── Local storage helpers ────────────────────────────────────────────────────
 
async function localSet(key, value) {
    const str = JSON.stringify(value);
    if (Platform.OS === 'web') {
        localStorage.setItem(key, str);
    } else {
        await AsyncStorage.setItem(key, str);
    }
}
 
async function localGet(key) {
    try {
        if (Platform.OS === 'web') {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : null;
        } else {
            const val = await AsyncStorage.getItem(key);
            return val ? JSON.parse(val) : null;
        }
    } catch (e) {
        console.error('localGet error:', e);
        return null;
    }
}
 
async function localDelete(key) {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
    } else {
        await AsyncStorage.removeItem(key);
    }
}
 
// ── Profile picture (stored locally, never on server) ───────────────────────
 
export async function saveProfilePicture(username, dataUri) {
    try {
        if (Platform.OS === 'web') {
            await localSet(`profilePic_${username}`, dataUri);
        } else {
            const base64 = dataUri.split(',')[1]; // Extract base64 part
            const fileUri = FileSystem.documentDirectory + `${username}_profile.jpg`;
            await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        }
    } catch (e) {
        console.error('Failed to save profile picture:', e);
    }
}
 
export async function loadProfilePicture(username) {
    try {
        if (Platform.OS === 'web') {
            return await localGet(`profilePic_${username}`);
        } else {
            const fileUri = FileSystem.documentDirectory + `${username}_profile.jpg`;
            const info = await FileSystem.getInfoAsync(fileUri);
            if (info.exists) {
                const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
                return `data:image/jpeg;base64,${base64}`;
            }
            return null;
        }
    } catch (e) {
        console.error('Failed to load profile picture:', e);
        return null;
    }
}
 
// ── Game state (stored locally per user) ────────────────────────────────────
//
// Saved shape:
// {
//   seed: number,
//   difficulty: string,   // 'easy' | 'medium' | 'hard'
//   grid: string[][],     // current user-entered grid
//   seconds: number,      // elapsed time
//   savedAt: string,      // ISO timestamp
// }
 
export async function saveGameState(username, state) {
    try {
        await localSet(`gameState_${username}`, { ...state, savedAt: new Date().toISOString() });
    } catch (e) {
        console.error('Failed to save game state:', e);
    }
}
 
export async function loadGameState(username) {
    try {
        return await localGet(`gameState_${username}`);
    } catch (e) {
        console.error('Failed to load game state:', e);
        return null;
    }
}
 
export async function clearGameState(username) {
    try {
        await localDelete(`gameState_${username}`);
    } catch (e) {
        console.error('Failed to clear game state:', e);
    }
}
 
// ── Param helper ─────────────────────────────────────────────────────────────
 
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
        if (!text || text.trim() === '' || text.trim() === 'Undefined') return { Easy: [], Medium: [], Hard: [] };
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