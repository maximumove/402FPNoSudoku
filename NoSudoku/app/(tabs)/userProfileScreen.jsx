import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { loadUsers, saveUsers, loadProfilePicture, resolveParam } from '../../assets/LoadNSave.js';

export default function UserProfileScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const incomingUsername = resolveParam(params.username);
    const { width, height } = useWindowDimensions();
    const isLandscape = Platform.OS !== 'web' && width > height;

    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState('');
    const [dateJoined, setDateJoined] = useState('');

    useFocusEffect(
        useCallback(() => {
            const fetchUser = async () => {
                const users = await loadUsers();
                const trimmedUsername = incomingUsername?.trim();
                const user = users.find(u => u.username?.trim() === trimmedUsername);

                if (user) {
                    setUsername(user.username);
                    setDateJoined(user.dateJoined || 'N/A');
                } else if (trimmedUsername) {
                    const today = new Date().toISOString().split('T')[0];
                    const newUser = { username: trimmedUsername, dateJoined: today };
                    try { await saveUsers([...users, newUser]); } catch (e) { console.error(e); }
                    setUsername(trimmedUsername);
                    setDateJoined(today);
                } else {
                    setUsername('Guest');
                    setDateJoined('N/A');
                }

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

    const picSize = isLandscape ? 80 : 120;

    return (
        <ScrollView contentContainerStyle={[styles.container, isLandscape && styles.containerLandscape]}>
            <Button title="Clear Users" onPress={async () => { await saveUsers([]); }} />
            <Text style={[styles.title, isLandscape && styles.titleLandscape]}>User Profile</Text>

            {isLandscape ? (
                // Landscape: picture left, info right
                <View style={styles.landscapeRow}>
                    <View style={styles.landscapeLeft}>
                        <TouchableOpacity onPress={handleUpdatePicture}>
                            <Image source={imageSource} style={[styles.profilePic, { width: picSize, height: picSize, borderRadius: picSize / 2 }]} />
                            <Text style={styles.changeText}>Tap to change</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.landscapeRight}>
                        <Text style={styles.subtitle}>Username: {username}</Text>
                        <Text style={styles.subtitle}>Date Joined: {dateJoined}</Text>
                        <Button title="Back to Home" onPress={() => router.push('/(tabs)/home?username=' + encodeURIComponent(username))} />
                    </View>
                </View>
            ) : (
                // Portrait: stacked
                <>
                    <TouchableOpacity onPress={handleUpdatePicture}>
                        <Image source={imageSource} style={styles.profilePic} />
                        <Text style={styles.changeText}>Tap to change</Text>
                    </TouchableOpacity>
                    <Text style={styles.subtitle}>Username: {username}</Text>
                    <Text style={styles.subtitle}>Date Joined: {dateJoined}</Text>
                    <Button title="Back to Home" onPress={() => router.push('/(tabs)/home?username=' + encodeURIComponent(username))} />
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222a4',
        paddingVertical: 20,
    },
    containerLandscape: {
        paddingVertical: 10,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#0f5ed5',
    },
    titleLandscape: {
        fontSize: 26,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
        color: '#0f5ed5',
        textAlign: 'center',
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
    },
    landscapeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    landscapeLeft: {
        alignItems: 'center',
        marginRight: 30,
    },
    landscapeRight: {
        alignItems: 'center',
        flex: 1,
    },
});

