// This screen will show the user's game statistics, such as their best times, average times, and number of games played.
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {loadScores} from 'C:/Users/skysk/Spring26/CS402/FinalProject/NoSudoku/assets/LoadNSave.js';

export default function StatsScreen() {
    const navigation = useNavigation();
    const [scores, setScores] = React.useState([]);

    React.useEffect(() => {
        loadScores().then(loadedScores => setScores(loadedScores));
    }, []);

    const userScores = scores.filter(score => score.username === 'JohnDoe');
    const bestTime = userScores.length > 0 ? Math.min(...userScores.map(score => score.time)) : null;
    const averageTime = userScores.length > 0 ? userScores.reduce((sum, score) => sum + score.time, 0) / userScores.length : null;

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>Stats Screen</Text>
            <Text style = {styles.subtitle}>Games Played: {userScores.length}</Text>
            <Text style = {styles.subtitle}>High Scores</Text>
            <Text style = {styles.subtitle}>Most Recent: {userScores.length > 0 ? userScores[userScores.length - 1].time : '00:00'}</Text>
            <Text style = {styles.subtitle}>Average Time: {averageTime !== null ? averageTime.toFixed(2) : '00:00'}</Text>
            <Button title="Back to Home" onPress={() => navigation.navigate('home')} />
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