import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { StyleSheet, View, Text, Button } from 'react-native';
import LoginScreen from './app/index.js'; // Import the LoginScreen component
import HomeScreen from './app/(tabs)/home.jsx'; // Import the HomeScreen component
import StartGameScreen from './app/(tabs)/startGameScreen.jsx'; // Import the StartGameScreen component
import StatsScreen from './app/(tabs)/statsScreen.jsx'; // Import the StatsScreen component
import UserProfileScreen from './app/(tabs)/userProfileScreen.jsx'; // Import the UserProfileScreen component
import gameScreen from './app/(tabs)/gameScreen.jsx'; // Import the GameScreen component

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  //TODO: Add any global providers or context here if needed
  // For now, we just render the ExpoRoot which will handle routing to our screens
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
