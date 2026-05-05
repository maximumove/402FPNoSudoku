import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { loadUsers, saveUsers } from '../../assets/LoadNSave.js';

export default function UserProfileScreen() {
const router = useRouter();
    
    const { username: incomingUsername } = useLocalSearchParams(); 

    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState('');
    const [dateJoined, setDateJoined] = useState('');

    useFocusEffect(
        useCallback(() => {
            const fetchUser = async () => {
                console.log('Fetching data for:', incomingUsername);
                const users = await loadUsers();
                
                const user = users.find(u => u.username === incomingUsername);
                
                if (user) {
                    setProfilePicture(user.profilePicture);
                    setUsername(user.username);
                    setDateJoined(user.dateJoined);
                } else {
                    setUsername(incomingUsername || 'Guest');
                    setDateJoined('Not found');
                }
            };

            fetchUser();
        }, [incomingUsername]) 
    );

    const handleUpdatePicture = () => {
        // Use incomingUsername here too
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
            <Button title="Back to Home" onPress={() => router.push('/(tabs)/')} />
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