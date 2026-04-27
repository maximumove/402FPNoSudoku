import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const NumberTracker = ({ board, selectedNumber, onSelectNumber }) => {
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
  const usedCounts = Array(10).fill(0);

  if (Array.isArray(board)) {
    board.forEach((row) => {
      if (!Array.isArray(row)) return;

      row.forEach((cell) => {
        const numericCell = Number.parseInt(cell, 10);

        if (Number.isInteger(numericCell) && numericCell >= 1 && numericCell <= 9) {
          usedCounts[numericCell] += 1;
        }
      });
    });
  }

  return (
    <View style={styles.container}>
      {numbers.map((num) => (
        <Pressable 
          key={num}
          onPress={() => onSelectNumber?.(selectedNumber === String(num) ? '' : String(num))}
          style={[
            styles.cell,
            selectedNumber === String(num) && styles.selectedCell,
          ]}
        >
          <Text style={styles.number}>{num}</Text>
          <Text style={styles.count}>{Math.max(0, 9 - usedCounts[num])}</Text>
        </Pressable>
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
  selectedCell: {
    backgroundColor: "#fff4b8",
    borderColor: "#c4a000",
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
