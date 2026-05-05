import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { loadUsers, saveUsers } from '../../assets/LoadNSave.js';

export default function UserProfileScreen() {
    const router = useRouter();
    const { username: routeUsername } = useLocalSearchParams();

    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState(routeUsername ?? '');
    const [dateJoined, setDateJoined] = useState('');

    // Runs every time this screen comes into focus (including after camera closes)
    useFocusEffect(
        useCallback(() => {
            const fetchUser = async () => {
                const lookupUsername = routeUsername || username;
                if (!lookupUsername) return;
                const users = await loadUsers();
                console.log('profile fetch for', lookupUsername, 'all users:', JSON.stringify(users));
                const user = users.find(u => u.username === lookupUsername);
                setProfilePicture(user?.profilePicture ?? null);
                setUsername(user?.username ?? lookupUsername);
                setDateJoined(user?.dateJoined ?? '');
            };
            fetchUser();
        }, [routeUsername, username])
    );

const handleUpdatePicture = () => {
    router.push({ pathname: '/camera', params: { username: routeUsername || username } });
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