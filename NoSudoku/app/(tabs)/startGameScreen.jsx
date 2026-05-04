// This screen will be where the user can start a new game, continue a saved game, or select a difficulty level.
// Add imports as needed
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function StartGameScreen() {
    const router = useRouter();
    const { username } = useLocalSearchParams();

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>Start Game Screen</Text>
            <Text style = {styles.title}>TODO: Implement the UI for starting a new game, continuing a saved game, and selecting difficulty levels.</Text>
            <Button title="Start New Game" onPress={() => router.push('/gameScreen?username=' + username)} />
            <Button title="Continue Saved Game" onPress={() => router.push('/gameScreen?username=' + username)} />
            <Text style = {styles.title}>Select Difficulty</Text>
            <Button title="Easy" onPress={() => router.push('/gameScreen?difficulty=easy&username=' + username)} />
            <Button title="Medium" onPress={() => router.push('/gameScreen?difficulty=medium&username=' + username)} />
            <Button title="Hard" onPress={() => router.push('/gameScreen?difficulty=hard&username=' + username)} />
            <Text style = {styles.title}>Return to Home</Text>
            <Button title="Back to Home" onPress={() => router.push('/home?username=' + username)} />
        </View>
        );
}

const styles = StyleSheet.create ({
        // Add styles as needed
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
            color: '#0f5ed5',
          }
    })