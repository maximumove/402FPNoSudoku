import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, []);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 3,
    marginTop: 3,
    // padding: 5,
    borderWidth: 3,
    paddingLeft: 15,
    paddingRight: 15,
  },
  timer: {
    fontSize: 32,
    fontWeight: "bold",
  },
});

export default Timer;
