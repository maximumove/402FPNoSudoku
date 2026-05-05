// This screen will be where the user can start a new game, continue a saved game, or select a difficulty level.
import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { loadGameState, resolveParam } from '../../assets/LoadNSave';

export default function StartGameScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const username = resolveParam(params.username);

    const [hasSavedGame, setHasSavedGame] = useState(false);

    // Re-check for a saved game every time this screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadGameState(username).then(saved => {
                setHasSavedGame(!!saved?.grid);
            }).catch(() => setHasSavedGame(false));
        }, [username])
    );

    const startNew = (difficulty = 'easy') => {
        router.push(
            '/(tabs)/gameScreen?resume=false&difficulty=' +
            encodeURIComponent(difficulty) +
            '&username=' +
            encodeURIComponent(username)
        );
    };

    const continueSaved = () => {
        if (!hasSavedGame) return;
        router.push(
            '/(tabs)/gameScreen?resume=true&username=' +
            encodeURIComponent(username)
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Start Game Screen</Text>

            {/* Continue — only active if there is a saved game */}
            <TouchableOpacity
                onPress={continueSaved}
                style={[styles.button, !hasSavedGame && styles.buttonDisabled]}
                disabled={!hasSavedGame}
            >
                <Text style={styles.buttonText}>
                    {hasSavedGame ? 'Continue Saved Game' : 'No Saved Game'}
                </Text>
            </TouchableOpacity>

            <Text style={styles.title}>Start New Game</Text>
            <TouchableOpacity onPress={() => startNew('easy')}   style={styles.button}>
                <Text style={styles.buttonText}>Easy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startNew('medium')} style={styles.button}>
                <Text style={styles.buttonText}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startNew('hard')}   style={styles.button}>
                <Text style={styles.buttonText}>Hard</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Return to Home</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#11269e',
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
