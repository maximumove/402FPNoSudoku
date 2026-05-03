import React from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = React.useState('');
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
            />
            <Button title="Login" onPress={() => navigation.navigate('home')} />
        </View>
    );
}

const styles = StyleSheet.create ({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#44333271',
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '80%',
    },
});