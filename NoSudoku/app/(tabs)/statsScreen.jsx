// This screen will show the user's game statistics, such as their best times, average times, and number of games played.
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function StatsScreen() {
    const navigation = useNavigation();
    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>Stats Screen</Text>
            <Text style = {styles.title}>TODO: Implement the UI for displaying user game statistics, such as best times, average times, and number of games played.</Text>
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
          }
    })