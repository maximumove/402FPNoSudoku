import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveUsers, loadUsers } from '../assets/LoadNSave.js';


export default function CameraScreen() {
    const [type, setType] = useState('front');
    const [hasPermission, setHasPermission] = useState(null);
    const cameraRef = useRef(null);
    const { username } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        console.log('Camera route username:', username);
        (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, [username]);

const snap = async () => {
    if (!username) {
        console.warn('Camera screen has no username query param; cannot save photo.');
        return;
    }

    if (cameraRef.current) {
        const options = { quality: 0.5, base64: true };
        const photo = await cameraRef.current.takePictureAsync(options);

        // load all users and find the right one by username
        const users = await loadUsers();
        console.log('all users:', JSON.stringify(users));
        const index = users.findIndex(u => u.username === username);
        
        if (index !== -1) {
            users[index] = { ...users[index], profilePicture: photo.uri };
        } else {
            users.push({ username, profilePicture: photo.uri });
        }
        
        await saveUsers(users);
        console.log('saved photo for user:', username);
        router.replace({ pathname: '/(tabs)/userProfileScreen', params: { username } });
    }
};

    return (
        <View style={styles.container}>
            {hasPermission === null ? (
                <Text style={styles.buttonText}>Requesting permission...</Text>
            ) : hasPermission === false ? (
                <Text style={styles.buttonText}>Camera permission denied</Text>
            ) : (
                <>
                    <CameraView
                        ref={cameraRef}
                        facing={type}
                        style={styles.camera}
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={snap} style={styles.button}>
                            <Text style={styles.buttonText}>Snap</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setType(prev => prev === 'back' ? 'front' : 'back')}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Flip</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    camera: { flex: 1 },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#ab7190',
    },
    button: { padding: 10 },
    buttonText: { color: '#fff', fontSize: 18 },
});