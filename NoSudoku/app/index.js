import React from 'react';
import { View, Text, Button, StyleSheet, TextInput, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { loadUsers, saveUsers } from '../assets/LoadNSave.js';

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const { width, height } = useWindowDimensions();
    const isLandscape = Platform.OS !== 'web' && width > height;

    React.useEffect(() => {
        loadUsers().then(loadedUsers => setUsers(loadedUsers || [])).catch(error => {
            console.error('Failed to load users:', error);
            setUsers([]);
        });
    }, []);

    const handleLogin = async () => {
        const trimmedUsername = username.trim();
        if (!trimmedUsername) {
            alert('Please enter a username');
            return;
        }

        let userList = users;
        if (userList.length === 0) {
            try {
                const loadedUsers = await loadUsers();
                userList = loadedUsers || [];
                setUsers(userList);
            } catch (error) {
                console.error('Failed to reload users on login:', error);
            }
        }

        const existingUser = userList.find(user => user.username?.trim().toLowerCase() === trimmedUsername.toLowerCase());
        const loginName = existingUser?.username ?? trimmedUsername;

        if (!existingUser) {
            const today = new Date();
            const dateJoined = today.toLocaleDateString('en-CA');
            const newUser = {
                username: loginName,
                dateJoined,
                profilePicture: null,
            };
            const updatedUsers = [...userList, newUser];
            try {
                await saveUsers(updatedUsers);
                setUsers(updatedUsers);
            } catch (error) {
                console.error('Failed to save user:', error);
            }
        }

        router.replace('/home?username=' + encodeURIComponent(loginName));
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, isLandscape && styles.containerLandscape]}>
            <Text style={[styles.title, isLandscape && styles.titleLandscape]}>NoSudoku</Text>
            <TextInput
                style={[styles.input, isLandscape && styles.inputLandscape]}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
            />
            <Button title="Login" onPress={handleLogin} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222a4',
        paddingVertical: 40,
    },
    containerLandscape: {
        paddingVertical: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#0f5ed5',
    },
    titleLandscape: {
        fontSize: 28,
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '80%',
        color: '#0f5ed5',
        backgroundColor: '#fff',
        borderRadius: 6,
    },
    inputLandscape: {
        width: '50%',
    },
});
