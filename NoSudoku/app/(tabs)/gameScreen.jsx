/**
 * Home for the main loaded game for the screen
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Timer, NumberTracker, ShareButton } from '../../assets/gameScreen';
import Puzzle from '../../assets/gameScreen/Puzzle';

const FIXED_SEED = 1;

export default function GameScreen() {
    const [grid] = useState(() => {
        const puzzle = new Puzzle('E', FIXED_SEED);
        return puzzle.getPuzzleBoard();
    });

    return (
        <View style={styles.container}>
            <Timer />
            <ShareButton />

            <View style={styles.board}>
                {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => {
                    const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8;
                    const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

                    return (
                        <View
                        key={`${rowIndex}-${colIndex}`}
                        style={[
                            styles.cell,
                            isRightBorder && styles.rightBorder,
                            isBottomBorder && styles.bottomBorder,
                        ]}
                        >
                        <Text style={styles.cellText}>{cell === 0 ? '' : cell}</Text>
                        </View>
                    );
                    })}
                </View>
                ))}
            </View>

            <NumberTracker board={grid} />
        </View>
    );
}

const styles = StyleSheet.create ({
    container: {
        backgroundColor: "white",
        flex: 1,
        alignItems: "center",
        justifyContent: "center", 
    },
    board: {
        borderWidth: 3,
        marginTop: 3,
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        width: 40,
        height: 40,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    cellText: {
        fontSize: 18,
        fontWeight: "600",
    },
    rightBorder: {
        borderRightWidth: 3,
    },
    bottomBorder: {
        borderBottomWidth: 3,
    },
    seedText: {
        marginTop: 8,
        fontSize: 14,
        color: "#666",
    },
});