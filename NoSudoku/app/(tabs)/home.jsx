// Add imports as needed
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// This is the home screen component for NoSudoku
// This should be the first screen users see when they open the app.
export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    // relink once login screen is implemented
    // navigation.navigate('login'),
    <View style={styles.container}>
        <Text style={styles.title}>Welcome to NoSudoku!</Text>
        <Text style={styles.subtitle}>Click the button below to start playing.</Text>
        <Button style = {styles.button} title="Start Game" onPress={() => navigation.navigate('startGameScreen')} />
        <Text style={styles.subtitle}>See how your score compares to others!</Text>
        <Button style = {styles.button} title="View Leaderboard" onPress={() => navigation.navigate('statsScreen')} />
        <Text style={styles.subtitle}>Adjust user or game settings.</Text>
        <Button style = {styles.button} title="Settings" onPress={() => navigation.navigate('userProfileScreen')} />
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