import React from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { loadUsers, saveUsers } from '../assets/LoadNSave.js';

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = React.useState('');
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        loadUsers().then(loadedUsers => setUsers(loadedUsers || [])).catch(error => {
            console.error('Failed to load users:', error);
            setUsers([]);
        });
    }, []);

    const handleLogin = async () => {
        if (!username.trim()) {
            alert('Please enter a username');
            return;
        }

        let existingUser = users.find(user => user.username === username);
        
        if (!existingUser) {
            // Create new user
            existingUser = {
                username: username,
                dateJoined: new Date().toISOString().split('T')[0],
            };
            const updatedUsers = [...users, existingUser];
            try {
                await saveUsers(updatedUsers);
            } catch (error) {
                console.error('Failed to save user:', error);
                // Still proceed to login
            }
        }

        router.replace('/(tabs)/home?username=' + encodeURIComponent(username));
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222a4',
      },
      title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#0f5ed5',
      },
    button: {
      marginVertical: 10,
      backgroundColor: '#007BFF',
      color: '#fff',
      padding: 10,
      borderRadius: 25,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '80%',
    },
});