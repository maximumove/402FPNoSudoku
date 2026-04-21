import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { StyleSheet, View, Text, Button } from 'react-native';
import HomeScreen from './app/(tabs)/index.js'; // Import the HomeScreen component

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  //TODO: Add any global providers or context here if needed
  // For now, we just render the ExpoRoot which will handle routing to our screens
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
