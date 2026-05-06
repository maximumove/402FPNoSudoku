/**
 * Home for the main loaded game for the screen
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, useWindowDimensions, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Timer, NumberTracker, ShareButton } from '../../assets/gameScreen';
import { useLocalSearchParams } from 'expo-router';
import Puzzle from '../../assets/gameScreen/Puzzle';
import { useGame } from '../../context/GameContext';
import { useRouter } from 'expo-router';
import { saveGameState, loadGameState, clearGameState, resolveParam } from '../../assets/LoadNSave';

export default function GameScreen() {
    const { addTime } = useGame();
    const params = useLocalSearchParams();
    const difficulty = resolveParam(params.difficulty) || 'E';
    const username   = resolveParam(params.username);
    const resume     = resolveParam(params.resume) === 'true';
    const router     = useRouter();
    const { width, height } = useWindowDimensions();
    const isLandscape = Platform.OS !== 'web' && width > height;

    const [puzzle] = useState(() => new Puzzle(difficulty));
    const puzzleGrid   = puzzle.getPuzzleBoard();
    const solutionGrid = puzzle.getSolvedBoard();
    const seed = puzzle.getSeed();

    const [grid, setGrid]         = useState(() =>
        puzzleGrid.map((row) => row.map((cell) => (cell === 0 ? '' : String(cell))))
    );
    const [seconds, setSeconds]     = useState(0);
    const [isSolved, setIsSolved]   = useState(false);
    const [isReady, setIsReady]     = useState(false);
    const [selectedNumber, setSelectedNumber] = useState('');
    const [scoreSaving, setScoreSaving] = useState(false);
    const [scoreSaved, setScoreSaved] = useState(false);
    const hasRecordedSolve = useRef(false);

    // Scale cell size to fit the screen, with a smaller cap in landscape
    const maxBoardSize = isLandscape
        ? Math.min(height - 40, width * 0.55)
        : Math.min(width - 20, height * 0.6);
    const cellSize = Math.floor(maxBoardSize / 9);

    // ── On mount: load saved state if resuming ───────────────────────────────
    useEffect(() => {
        if (!resume) {
            clearGameState(username).finally(() => setIsReady(true));
            return;
        }
        loadGameState(username).then(saved => {
            if (saved?.grid) {
                setGrid(saved.grid);
                setSeconds(saved.seconds ?? 0);
            }
            setIsReady(true);
        }).catch(() => setIsReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Auto-save ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isReady || isSolved || !username) return;
        saveGameState(username, { seed: seed, difficulty, grid, seconds });
    }, [grid, seconds, isReady, isSolved, username, difficulty]);

    // ── Timer ────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isSolved || !isReady) return undefined;
        const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [isSolved, isReady]);

    // ── Check for solve ──────────────────────────────────────────────────────
    useEffect(() => {
        if (!isReady) return;
        const solved = grid.every((row, rowIndex) =>
            row.every((cell, colIndex) => cell === String(solutionGrid[rowIndex][colIndex]))
        );
        if (!solved || isSolved) return;

        setIsSolved(true);
        setSelectedNumber('');
        clearGameState(username);

        if (!hasRecordedSolve.current) {
            const normalizedDifficulty = difficulty.toLowerCase();
            const scoreKey = normalizedDifficulty === 'medium' ? 'Medium'
                : normalizedDifficulty === 'hard' ? 'Hard' : 'Easy';

            setScoreSaving(true);
            addTime(scoreKey, seconds, username)
                .then(() => setScoreSaved(true))
                .catch((e) => {
                    console.error('Failed to record score:', e);
                    setScoreSaved(true); // Allow navigation even on failure
                })
                .finally(() => {
                    hasRecordedSolve.current = true;
                    setScoreSaving(false);
                });
        }
    }, [addTime, difficulty, grid, isSolved, isReady, seconds, solutionGrid, username]);

    const handleCellChange = (rowIndex, colIndex, value) => {
        const nextValue = value.replace(/[^1-9]/g, '').slice(0, 1);
        setSelectedNumber(nextValue);
        setGrid((prevGrid) =>
            prevGrid.map((row, currentRow) =>
                row.map((cell, currentCol) => {
                    if (currentRow !== rowIndex || currentCol !== colIndex) return cell;
                    return nextValue;
                })
            )
        );
    };

    if (!isReady) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    if (isSolved) {
        return (
            <View style={styles.container}>
                <View style={styles.completionContainer}>
                    <Text style={styles.completionTitle}>Congratulations!</Text>
                    <Text style={styles.completionText}>
                        You solved the puzzle in {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}!
                    </Text>
                    {scoreSaved ? (
                        <>
                            <Button title="Back to Home" onPress={() => router.push('/(tabs)/home?username=' + encodeURIComponent(username))} />
                            <Button title="View Stats" onPress={() => router.push('/(tabs)/statsScreen?username=' + encodeURIComponent(username))} />
                        </>
                    ) : (
                        <Text style={styles.completionText}>Saving your score...</Text>
                    )}
                </View>
            </View>
        );
    }

    const board = (
        <View style={{ borderWidth: 3, borderColor: '#000', marginTop: 3 }}>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => {
                        const borderLeftWidth = colIndex === 0 ? 3 : (colIndex % 3 === 0 ? 3 : 1);
                        const borderRightWidth = colIndex === 8 ? 3 : ((colIndex + 1) % 3 === 0 ? 3 : 1);
                        const borderTopWidth = rowIndex === 0 ? 3 : (rowIndex % 3 === 0 ? 3 : 1);
                        const borderBottomWidth = rowIndex === 8 ? 3 : ((rowIndex + 1) % 3 === 0 ? 3 : 1);
                        const isGiven        = puzzleGrid[rowIndex][colIndex] !== 0;
                        const isFilled       = cell !== '';
                        const isIncorrect    = !isGiven && isFilled && cell !== String(solutionGrid[rowIndex][colIndex]);
                        const isSelected     = selectedNumber !== '' && String(isGiven ? puzzleGrid[rowIndex][colIndex] : cell) === selectedNumber;

                        return (
                            <View
                                key={`${rowIndex}-${colIndex}`}
                                style={[
                                    {
                                        width: cellSize,
                                        height: cellSize,
                                        borderLeftWidth,
                                        borderRightWidth,
                                        borderTopWidth,
                                        borderBottomWidth,
                                        borderColor: '#000',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'white',
                                    },
                                    isGiven       && styles.givenCell,
                                    isSelected    && styles.selectedCell,
                                    isIncorrect   && styles.incorrectCell,
                                ]}
                            >
                                {isGiven ? (
                                    <Text style={[styles.cellText, { fontSize: cellSize * 0.45 }]}>
                                        {puzzleGrid[rowIndex][colIndex]}
                                    </Text>
                                ) : (
                                    <TextInput
                                        style={[
                                            styles.cellInput,
                                            { fontSize: cellSize * 0.45 },
                                            isIncorrect && styles.incorrectText,
                                        ]}
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
    );

    if (isLandscape) {
        // Landscape: board on the left, controls on the right
        return (
            <View style={styles.landscapeContainer}>
                <View style={styles.landscapeLeft}>
                    {board}
                </View>
                <View style={styles.landscapeRight}>
                    <Timer seconds={seconds} />
                    <ShareButton />
                    <NumberTracker
                        board={grid}
                        selectedNumber={selectedNumber}
                        onSelectNumber={setSelectedNumber}
                    />
                </View>
            </View>
        );
    }

    // Portrait: stacked layout
    return (
        <View style={styles.container}>
            <Timer seconds={seconds} />
            <ShareButton seed={seed} />
            {board}
            <NumberTracker
                board={grid}
                selectedNumber={selectedNumber}
                onSelectNumber={setSelectedNumber}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    landscapeContainer: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    landscapeLeft: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    landscapeRight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    completionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
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
    row: { flexDirection: 'row' },
    givenCell:     { backgroundColor: '#eef2f7' },
    selectedCell:  { backgroundColor: '#fff4b8' },
    incorrectCell: { backgroundColor: '#ffd6d6', borderColor: '#d64545' },
    cellText:  { fontWeight: '600' },
    cellInput: {
        width: '100%',
        height: '100%',
        fontWeight: '600',
        padding: 0,
        margin: 0,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    incorrectText: { color: '#b00020' },
    rightBorder:   { borderRightWidth: 3, borderColor: '#000000'},
    bottomBorder:  { borderBottomWidth: 3 },
});
