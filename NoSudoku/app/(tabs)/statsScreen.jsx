// This screen will show the user's game statistics, such as their best times, average times, and number of games played.

import { Button } from "react-native-web";

export default function StatsScreen() {
    const navigation = useNavigation();
    return (
        <View>
            <Text>Stats Screen</Text>
            <Text>TODO: Implement the UI for displaying user game statistics, such as best times, average times, and number of games played.</Text>
            <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
        </View>
        )

    const styles = StyleSheet.create ({
        // Add styles as needed
    })
}