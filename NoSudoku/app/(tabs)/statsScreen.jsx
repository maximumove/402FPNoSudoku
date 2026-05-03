// This screen will show the user's game statistics, such as their best times, average times, and number of games played.
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function StatsScreen() {
    const navigation = useNavigation();
    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>Stats Screen</Text>
            <Text style = {styles.subtitle}>Games Played: 0</Text>
            <Text style = {styles.subtitle}>High Scores</Text>
            //Insert code to display high scores once loading from database is implemented
            <Text style = {styles.subtitle}>Most Recent: 00:00</Text>
            <Text style = {styles.subtitle}>Average Time: 00:00</Text>
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