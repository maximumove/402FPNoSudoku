import React from 'react';
import { View, Text, Button, StyleSheet, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { resolveParam } from '../../assets/LoadNSave';

export default function HomeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const username = resolveParam(params.username);
    const displayUsername = username || 'Guest';
    const { width, height } = useWindowDimensions();
    const isLandscape = Platform.OS !== 'web' && width > height;

    return (
        <ScrollView contentContainerStyle={[styles.container, isLandscape && styles.containerLandscape]}>
            <Text style={[styles.title, isLandscape && styles.titleLandscape]}>Welcome to NoSudoku!</Text>
            <Text style={styles.subtitle}>Logged in as: {displayUsername}</Text>

            <View style={isLandscape ? styles.buttonGridLandscape : styles.buttonGridPortrait}>
                <View style={isLandscape ? styles.buttonCol : styles.buttonRow}>
                    <Text style={styles.subtitle}>Click the button below to start playing.</Text>
                    <Button title="Start Game" onPress={() => router.push('/(tabs)/startGameScreen?username=' + encodeURIComponent(displayUsername))} />
                </View>
                <View style={isLandscape ? styles.buttonCol : styles.buttonRow}>
                    <Text style={styles.subtitle}>See how your score compares to others!</Text>
                    <Button title="View Leaderboard" onPress={() => router.push('/(tabs)/statsScreen?username=' + encodeURIComponent(displayUsername))} />
                </View>
                <View style={isLandscape ? styles.buttonCol : styles.buttonRow}>
                    <Text style={styles.subtitle}>Adjust user or game settings.</Text>
                    <Button title="Settings" onPress={() => router.push('/(tabs)/userProfileScreen?username=' + encodeURIComponent(displayUsername))} />
                </View>
            </View>
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
        textAlign: 'center',
    },
    titleLandscape: {
        fontSize: 28,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 8,
        color: '#0f5ed5',
        textAlign: 'center',
    },
    buttonGridPortrait: {
        width: '100%',
        alignItems: 'center',
    },
    buttonGridLandscape: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
    },
    buttonRow: {
        alignItems: 'center',
        marginVertical: 8,
        width: '80%',
    },
    buttonCol: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 8,
    },
});
