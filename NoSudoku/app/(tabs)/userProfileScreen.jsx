// This screen will be where the user can change/view their profile settings.
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function UserProfileScreen() {
    const navigation = useNavigation();
    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>User Profile Screen</Text>
            <Text style = {styles.title}>Username: JohnDoe</Text>
            <Text style = {styles.title}>Date Joined: 2023-01-01</Text>
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
            backgroundColor: '#000000',
          },
          title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            color: '#11269e',
          }
    })