// Add imports as needed

// This is the home screen component for NoSudoku
// This should be the first screen users see when they open the app.
export function HomeScreen() {
  return (
    <div>
        <h1>Welcome to NoSudoku!</h1>
        <p>Click the button below to start playing.</p>
        <button onClick={() => alert('Start Game!')}>Start Game</button>
        <p2>See how your score compares to others!</p2>
        <button onClick={() => alert('View Leaderboard!')}>View Leaderboard</button>
        <p3>Adjust user or game settings.</p3>
        <button onClick={() => alert('Go to Settings!')}>Settings</button>
    </div>
  );
}