import React from 'react';
import { View, Text, Button, StyleSheet, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { loadScores, resolveParam } from '../../assets/LoadNSave.js';

export default function StatsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const username = resolveParam(params.username);
    const { width, height } = useWindowDimensions();
    const isLandscape = Platform.OS !== 'web' && width > height;

    const [scores, setScores] = React.useState([]);

    React.useEffect(() => {
        loadScores()
            .then(loadedScores => { if (loadedScores) setScores(loadedScores); })
            .catch(e => console.error('scores error:', e));
    }, []);

    const allScores = Object.values(scores).flat();
    const userScores = allScores.filter(score => score.user === username);
    const bestTime = userScores.length > 0 ? Math.min(...userScores.map(s => s.time)) : null;
    const averageTime = userScores.length > 0
        ? userScores.reduce((sum, s) => sum + s.time, 0) / userScores.length
        : null;

    const formatTime = (secs) => {
        if (secs === null) return 'N/A';
        return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    };

    const statsBlock = (
        <>
            <Text style={styles.subtitle}>Games Played: {userScores.length}</Text>
            <Text style={styles.subtitle}>Best Time: {formatTime(bestTime)}</Text>
            <Text style={styles.subtitle}>
                Most Recent: {userScores.length > 0 ? formatTime(userScores[userScores.length - 1].time) : 'N/A'}
            </Text>
            <Text style={styles.subtitle}>
                Average Time: {averageTime !== null ? formatTime(Math.round(averageTime)) : 'N/A'}
            </Text>
        </>
    );

    return (
        <ScrollView contentContainerStyle={[styles.container, isLandscape && styles.containerLandscape]}>
            <Text style={[styles.title, isLandscape && styles.titleLandscape]}>Stats</Text>

            {isLandscape ? (
                <View style={styles.landscapeRow}>
                    <View style={styles.landscapeCol}>{statsBlock}</View>
                </View>
            ) : (
                statsBlock
            )}

            <Button title="Back to Home" onPress={() => router.push('/(tabs)/home?username=' + encodeURIComponent(username))} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222a4',
        paddingVertical: 20,
    },
    containerLandscape: {
        paddingVertical: 10,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#0f5ed5',
    },
    titleLandscape: {
        fontSize: 26,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
        color: '#0f5ed5',
        textAlign: 'center',
    },
    landscapeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    landscapeCol: {
        alignItems: 'center',
        flex: 1,
    },
});
