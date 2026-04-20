// This screen will be where the user can change/view their profile settings.

export default function UserProfileScreen() {
    const navigation = useNavigation();
    return (
        <View>
            <Text>User Profile Screen</Text>
            <Text>TODO: Implement the UI for viewing and changing user profile settings.</Text>
            <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
        </View>
        )

    const styles = StyleSheet.create ({
        // Add styles as needed
    })
}