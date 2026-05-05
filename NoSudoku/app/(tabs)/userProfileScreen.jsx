import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { loadUsers, saveUsers, loadProfilePicture, resolveParam } from '../../assets/LoadNSave.js';

export default function UserProfileScreen() {
    const router = useRouter();

    const params = useLocalSearchParams();
    const incomingUsername = resolveParam(params.username);

    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState('');
    const [dateJoined, setDateJoined] = useState('');

    useFocusEffect(
        useCallback(() => {
            const fetchUser = async () => {
                console.log('Fetching data for:', incomingUsername);
                const users = await loadUsers();
                console.log('All users:', users);

                const trimmedUsername = incomingUsername?.trim();
                const user = users.find(u => u.username?.trim() === trimmedUsername);
                console.log('Found user:', user);

                if (user) {
                    setUsername(user.username);
                    setDateJoined(user.dateJoined || 'N/A');
                } else if (trimmedUsername) {
                    // Not on server yet — create and save
                    const today = new Date().toISOString().split('T')[0];
                    const newUser = { username: trimmedUsername, dateJoined: today };
                    try {
                        await saveUsers([...users, newUser]);
                    } catch (e) {
                        console.error('Failed to save new user from profile screen:', e);
                    }
                    setUsername(trimmedUsername);
                    setDateJoined(today);
                } else {
                    setUsername('Guest');
                    setDateJoined('N/A');
                }

                // Load picture from local storage (not the server)
                if (trimmedUsername) {
                    const pic = await loadProfilePicture(trimmedUsername);
                    setProfilePicture(pic);
                }
            };

            fetchUser();
        }, [incomingUsername])
    );

    const handleUpdatePicture = () => {
        router.push(`/camera?username=${encodeURIComponent(incomingUsername || username)}`);
    };

    const imageSource = profilePicture
        ? { uri: profilePicture }
        : require('../../assets/images/defaultIcon.svg.png');

    return (
        <View style={styles.container}>
            <Button title="Clear Users" onPress={async () => {
                await saveUsers([]);
                console.log('cleared!');
            }} />
            <Text style={styles.title}>User Profile Screen</Text>
            <TouchableOpacity onPress={handleUpdatePicture}>
                <Image source={imageSource} style={styles.profilePic} />
                <Text style={styles.changeText}>Tap to change</Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>Username: {username}</Text>
            <Text style={styles.subtitle}>Date Joined: {dateJoined}</Text>
            <Button title="Back to Home" onPress={() => router.push('/(tabs)/home?username=' + encodeURIComponent(username))} />
        </View>
    );
}

const styles = StyleSheet.create({
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
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
        color: '#0f5ed5',
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ccc',
        marginBottom: 10,
    },
    changeText: {
        textAlign: 'center',
        color: '#aaa',
        marginBottom: 20,
    }
});
