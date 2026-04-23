//Once the user starts a game, they will be take to this screen to play the game.
// The screen will display the game board, a timer, and buttons for pausing the game, saving progress, or quitting to the home screen.
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function GameScreen() {
    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>Game Screen</Text>
            <Text style = {styles.title}>TODO: Implement the UI for the game board, timer, and buttons for pausing, saving, and quitting.</Text>
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
          }
    })