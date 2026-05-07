import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { loadGameState, resolveParam } from '../assets/LoadNSave';

export default function StartGameScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const username = resolveParam(params.username);
    const { width, height } = useWindowDimensions();
    const isLandscape = Platform.OS !== 'web' && width > height;

    const [hasSavedGame, setHasSavedGame] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadGameState(username).then(saved => {
                setHasSavedGame(!!saved?.grid);
            }).catch(() => setHasSavedGame(false));
        }, [username])
    );

    const startNew = (difficulty = 'E') => {
        router.push(
            '/gameScreen?resume=false&difficulty=' +
            encodeURIComponent(difficulty) +
            '&username=' +
            encodeURIComponent(username)
        );
    };

    const continueSaved = () => {
        if (!hasSavedGame) return;
        router.push('/gameScreen?resume=true&username=' + encodeURIComponent(username));
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, isLandscape && styles.containerLandscape]}>
            <Text style={[styles.title, isLandscape && styles.titleLandscape]}>Start Game</Text>

            {/* Continue button */}
            <TouchableOpacity
                onPress={continueSaved}
                style={[styles.button, !hasSavedGame && styles.buttonDisabled]}
                disabled={!hasSavedGame}
            >
                <Text style={styles.buttonText}>
                    {hasSavedGame ? 'Continue Saved Game' : 'No Saved Game'}
                </Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, isLandscape && styles.sectionTitleLandscape]}>
                Start New Game
            </Text>

            {/* Difficulty buttons — row in landscape, column in portrait */}
            <View style={isLandscape ? styles.difficultyRowLandscape : styles.difficultyCol}>
                <TouchableOpacity onPress={() => startNew('E')}   style={styles.button}>
                    <Text style={styles.buttonText}>Easy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => startNew('Me')} style={styles.button}>
                    <Text style={styles.buttonText}>Medium</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => startNew('H')}   style={styles.button}>
                    <Text style={styles.buttonText}>Hard</Text>
                </TouchableOpacity>
            </View>

            <Button title="Back to Home" onPress={() => router.push('/home?username=' + encodeURIComponent(username))} />
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#11269e',
    },
    titleLandscape: {
        fontSize: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 10,
        color: '#11269e',
    },
    sectionTitleLandscape: {
        marginTop: 8,
        marginBottom: 6,
    },
    difficultyCol: {
        alignItems: 'center',
        width: '100%',
    },
    difficultyRowLandscape: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    button: {
        backgroundColor: '#11269e',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        width: 200,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#888',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

