// This screen will be where the user can change/view their profile settings.
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { loadUsers } from '../../assets/LoadNSave.js';

export default function UserProfileScreen() {
    const router = useRouter();
    const { username } = useLocalSearchParams();
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        loadUsers().then(loadedUsers => setUsers(loadedUsers));
    }, []);
    
    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>User Profile Screen</Text>
            <Text style = {styles.subtitle}>Username: JohnDoe</Text>
            <Text style = {styles.subtitle}>Date Joined: 2023-01-01</Text>
            <Button title="Back to Home" onPress={() => router.push('/(tabs)/home?username=' + encodeURIComponent(username))} />
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