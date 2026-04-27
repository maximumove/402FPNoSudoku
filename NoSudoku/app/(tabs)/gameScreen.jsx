/**
 * Home for the main loaded game for the screen
 */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Timer, NumberTracker, ShareButton } from '../../assets/gameScreen';
import Puzzle from '../../assets/gameScreen/Puzzle';

const FIXED_SEED = 1;

export default function GameScreen() {
    const [puzzle] = useState(() => new Puzzle('E', FIXED_SEED));
    const [selectedNumber, setSelectedNumber] = useState('');

    const puzzleGrid = puzzle.getPuzzleBoard();
    const solutionGrid = puzzle.getSolvedBoard();

    const [grid, setGrid] = useState(() =>
        puzzleGrid.map((row) => row.map((cell) => (cell === 0 ? '' : String(cell))))
    );

    const handleCellChange = (rowIndex, colIndex, value) => {
        const nextValue = value.replace(/[^1-9]/g, '').slice(0, 1);

        setSelectedNumber(nextValue);

        setGrid((prevGrid) =>
            prevGrid.map((row, currentRow) =>
                row.map((cell, currentCol) => {
                    if (currentRow !== rowIndex || currentCol !== colIndex) {
                        return cell;
                    }

                    return nextValue;
                })
            )
        );
    };

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
                    const isGiven = puzzleGrid[rowIndex][colIndex] !== 0;
                    const isFilled = cell !== '';
                    const isIncorrect = !isGiven
                        && isFilled
                        && cell !== String(solutionGrid[rowIndex][colIndex]);
                    const isSelected = selectedNumber !== ''
                        && String(isGiven ? puzzleGrid[rowIndex][colIndex] : cell) === selectedNumber;

                    return (
                        <View
                        key={`${rowIndex}-${colIndex}`}
                        style={[
                            styles.cell,
                            isGiven && styles.givenCell,
                            isSelected && styles.selectedCell,
                            isIncorrect && styles.incorrectCell,
                            isRightBorder && styles.rightBorder,
                            isBottomBorder && styles.bottomBorder,
                        ]}
                        >
                        {isGiven ? (
                            <Text style={styles.cellText}>{puzzleGrid[rowIndex][colIndex]}</Text>
                        ) : (
                            <TextInput
                                style={[styles.cellInput, isIncorrect && styles.incorrectText]}
                                value={cell}
                                onChangeText={(value) => handleCellChange(rowIndex, colIndex, value)}
                                keyboardType="number-pad"
                                maxLength={1}
                                textAlign="center"
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                        )}
                        </View>
                    );
                    })}
                </View>
                ))}
            </View>

            <NumberTracker
                board={grid}
                selectedNumber={selectedNumber}
                onSelectNumber={setSelectedNumber}
            />
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
        backgroundColor: "white",
    },
    givenCell: {
        backgroundColor: "#eef2f7",
    },
    selectedCell: {
        backgroundColor: "#fff4b8",
    },
    incorrectCell: {
        backgroundColor: "#ffd6d6",
        borderColor: "#d64545",
    },
    cellText: {
        fontSize: 18,
        fontWeight: "600",
    },
    cellInput: {
        width: "100%",
        height: "100%",
        fontSize: 18,
        fontWeight: "600",
        padding: 0,
        margin: 0,
    },
    incorrectText: {
        color: "#b00020",
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