// This screen will be where the user can start a new game, continue a saved game, or select a difficulty level.
// Add imports as needed
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function StartGameScreen() {
    const navigation = useNavigation();

    return (
        <View>
            <Text>Start Game Screen</Text>
            <Text>TODO: Implement the UI for starting a new game, continuing a saved game, and selecting difficulty levels.</Text>
            <Button title="Start New Game" onPress={() => navigation.navigate('Game')} />
            <Button title="Continue Saved Game" onPress={() => navigation.navigate('Game')} />
            <h2>Select Difficulty</h2>
            <button onclick="setDifficulty('easy')">Easy</button>
            <button onclick="setDifficulty('medium')">Medium</button>
            <button onclick="setDifficulty('hard')">Hard</button>
            <h3>Return to Home</h3>
            <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
        </View>
        )

    const styles = StyleSheet.create ({
        // Add styles as needed
    })
}