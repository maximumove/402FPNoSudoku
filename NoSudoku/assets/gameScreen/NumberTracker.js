import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NumberTracker = () => {
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {numbers.map((num) => (
        <View key={num} style={styles.cell}>
          <Text style={styles.number}>{num}</Text>
          <Text style={styles.count}>4</Text>
        </View>
      ))}
    </View>
  );
};

export default NumberTracker;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    marginTop: 20,
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  number: {
    fontSize: 20,
    fontWeight: "bold",
  },
  count: {
    position: "absolute",
    bottom: 4,
    right: 6,
    fontSize: 12,
    color: "#666",
  },
});
