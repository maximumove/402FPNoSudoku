/**
 * Home for the main loaded game for the screen
 */
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Timer, NumberTracker, ShareButton } from '../../assets/gameScreen';

export default function GameScreen() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(""));

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
                        <Text>{cell}</Text>
                        </View>
                    );
                    })}
                </View>
                ))}
            </View>

            <NumberTracker />
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
    rightBorder: {
        borderRightWidth: 3,
    },
    bottomBorder: {
        borderBottomWidth: 3,
    },
});