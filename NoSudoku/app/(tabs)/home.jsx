// Add imports as needed
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// This is the home screen component for NoSudoku
// This should be the first screen users see when they open the app.
export default function HomeScreen() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const displayUsername = username || 'Guest';

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Welcome to NoSudoku!</Text>
        <Text style={styles.subtitle}>Logged in as: {displayUsername}</Text>
        <Text style={styles.subtitle}>Click the button below to start playing.</Text>
        <Button style = {styles.button} title="Start Game" onPress={() => router.push('/(tabs)/startGameScreen?username=' + encodeURIComponent(displayUsername))} />
        <Text style={styles.subtitle}>See how your score compares to others!</Text>
        <Button style = {styles.button} title="View Leaderboard" onPress={() => router.push('/(tabs)/statsScreen?username=' + encodeURIComponent(displayUsername))} />
        <Text style={styles.subtitle}>Adjust user or game settings.</Text>
        <Button title="Settings" onPress={() => router.push('/(tabs)/userProfileScreen?username=' + encodeURIComponent(displayUsername))} />
    </View>
  );
}

const styles = StyleSheet.create ({
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
      button: {
        marginVertical: 10,
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: 10,
        borderRadius: 25,
      },
  });