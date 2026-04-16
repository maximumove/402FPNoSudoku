import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  //TODO: Add any global providers or context here if needed
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
