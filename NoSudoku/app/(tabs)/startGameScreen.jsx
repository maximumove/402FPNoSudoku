// This screen will be where the user can start a new game, continue a saved game, or select a difficulty level.
// Add imports as needed
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function StartGameScreen() {
    const navigation = useNavigation();

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>Start Game Screen</Text>
            <Text style = {styles.title}>TODO: Implement the UI for starting a new game, continuing a saved game, and selecting difficulty levels.</Text>
            <Button title="Start New Game" onPress={() => navigation.navigate('gameScreen')} />
            <Button title="Continue Saved Game" onPress={() => navigation.navigate('gameScreen')} />
            <Text style = {styles.title}>Select Difficulty</Text>
            <TouchableOpacity onPress={() => navigation.navigate('gameScreen', { difficulty: 'easy' })} style={styles.button}>
                <Text style={styles.buttonText}>Easy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('gameScreen', { difficulty: 'medium' })} style={styles.button}>
                <Text style={styles.buttonText}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('gameScreen', { difficulty: 'hard' })} style={styles.button}>
                <Text style={styles.buttonText}>Hard</Text>
            </TouchableOpacity>
            <Text style = {styles.title}>Return to Home</Text>
            <Button title="Back to Home" onPress={() => navigation.navigate('index')} />
        </View>
        );
}

const styles = StyleSheet.create ({
        // Add styles as needed
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000000',
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
          buttonText: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 'bold',
          }
    })