// Add imports as needed
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// This is the home screen component for NoSudoku
// This should be the first screen users see when they open the app.
export default function HomeScreen() {
  return (
    <div>
        <View style={styles.title}>Welcome to NoSudoku!</View>
        <Text>Click the button below to start playing.</Text>
        <Button style = {styles.button} title="Start Game" onPress={() => alert('Start Game!')} />
        <Text>See how your score compares to others!</Text>
        <Button style = {styles.button} title="View Leaderboard" onPress={() => alert('View Leaderboard!')} />
        <Text>Adjust user or game settings.</Text>
        <Button style = {styles.button} title="Settings" onPress={() => alert('Go to Settings!')} />
    </div>
  )

    const styles = StyleSheet.create ({
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
        marginVertical: 10,
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: 10,
        borderRadius: 25,
      },
  });
}