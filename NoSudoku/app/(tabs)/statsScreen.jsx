// This screen will show the user's game statistics, such as their best times, average times, and number of games played.
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {loadScores} from '../../assets/LoadNSave.js';

export default function StatsScreen() {
    const router = useRouter();
    const { username } = useLocalSearchParams();
    const [scores, setScores] = React.useState([]);

    React.useEffect(() => {
        loadScores().then(loadedScores => setScores(loadedScores));
    }, []);

    const userScores = scores.filter(score => score.username === username);
    const bestTime = userScores.length > 0 ? Math.min(...userScores.map(score => score.time)) : null;
    const averageTime = userScores.length > 0 ? userScores.reduce((sum, score) => sum + score.time, 0) / userScores.length : null;

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>Stats Screen</Text>
            <Text style = {styles.subtitle}>Games Played: {userScores.length}</Text>
            <Text style = {styles.subtitle}>High Scores</Text>
            <Text style = {styles.subtitle}>Most Recent: {userScores.length > 0 ? userScores[userScores.length - 1].time : '00:00'}</Text>
            <Text style = {styles.subtitle}>Average Time: {averageTime !== null ? averageTime.toFixed(2) : '00:00'}</Text>
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
    })