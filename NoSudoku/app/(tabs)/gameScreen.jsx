/**
 * Home for the main loaded game for the screen
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { Timer, NumberTracker, ShareButton } from '../../assets/gameScreen';
import { useLocalSearchParams } from 'expo-router'; 
import Puzzle from '../../assets/gameScreen/Puzzle';
import { useGame } from '../../context/GameContext';
import { useRouter } from 'expo-router';

const FIXED_SEED = 1;

export default function GameScreen() {
    const [puzzle] = useState(() => new Puzzle('E', FIXED_SEED));
    const { addTime } = useGame();
    const { difficulty, username } = useLocalSearchParams();
    const router = useRouter();
    const [selectedNumber, setSelectedNumber] = useState('');
    const [seconds, setSeconds] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const hasRecordedSolve = useRef(false);    

    const puzzleGrid = puzzle.getPuzzleBoard();
    const solutionGrid = puzzle.getSolvedBoard();

    const [grid, setGrid] = useState(() =>
        puzzleGrid.map((row) => row.map((cell) => (cell === 0 ? '' : String(cell))))
    );

    // This is for the timer!
    useEffect(() => {
        if (isSolved) {
            return undefined;
        }

        const interval = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isSolved]);

    // This is for checking to see if it is it done
    useEffect(() => {
        const solved = grid.every((row, rowIndex) =>
            row.every((cell, colIndex) => cell === String(solutionGrid[rowIndex][colIndex]))
        );

        if (!solved || isSolved) {
            return;
        }

        setIsSolved(true);
        setSelectedNumber('');

        if (!hasRecordedSolve.current) {
            const normalizedDifficulty = String(difficulty ?? 'easy').toLowerCase();
            const scoreKey = normalizedDifficulty === 'medium'
                ? 'Medium'
                : normalizedDifficulty === 'hard'
                    ? 'Hard'
                    : 'Easy';

            addTime(scoreKey, seconds);
            hasRecordedSolve.current = true;
        }
    }, [addTime, difficulty, grid, isSolved, seconds, solutionGrid]);

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
            {isSolved ? (
                <View style={styles.completionContainer}>
                    <Text style={styles.completionTitle}>Congratulations!</Text>
                    <Text style={styles.completionText}>You solved the puzzle in {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}!</Text>
                    <Button title="Back to Home" onPress={() => router.push('/(tabs)/home?username=' + encodeURIComponent(username))} />
                    <Button title="View Stats" onPress={() => router.push('/(tabs)/statsScreen?username=' + encodeURIComponent(username))} />
                </View>
            ) : (
                <>
                    <Timer seconds={seconds}/>
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
                                        caretHidden={!isSolved}
                                        contextMenuHidden={!isSolved}
                                        editable={!isSolved}
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
                </>
            )}
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
    completionContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    completionTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#0f5ed5',
    },
    completionText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#0f5ed5',
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
        textAlign: "center",
        textAlignVertical: "center",
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
});