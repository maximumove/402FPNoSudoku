import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveProfilePicture, resolveParam } from '../assets/LoadNSave.js';

// ── Web camera using browser getUserMedia API ────────────────────────────────
function WebCamera({ username, onCancel }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const router = useRouter();
    const [error, setError] = useState(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
            .then(stream => {
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => {
                console.error('Camera error:', err);
                setError('Camera permission denied or unavailable.');
            });

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    const snap = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.5);

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
        }

        saveProfilePicture(username, imageData).then(() => {
            router.replace({ pathname: '/(tabs)/userProfileScreen', params: { username } });
        }).catch(e => console.error('Failed to save photo:', e));
    };

    if (error) {
        return (
            <div style={web.container}>
                <p style={{ color: '#fff', margin: 20 }}>{error}</p>
                <button onClick={onCancel} style={web.btn}>Cancel</button>
            </div>
        );
    }

    return (
        <div style={web.container}>
            <video ref={videoRef} autoPlay playsInline style={web.video} />
            <div style={web.bar}>
                <button onClick={onCancel} style={web.btn}>Cancel</button>
                <button onClick={snap}     style={web.btn}>Snap</button>
            </div>
        </div>
    );
}

const web = {
    container: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
    },
    video: {
        position: 'absolute',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    bar: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#ab7190',
        zIndex: 10,
    },
    btn: {
        padding: 10,
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: 18,
        cursor: 'pointer',
    },
};

// ── Native camera using expo-camera ──────────────────────────────────────────
function NativeCamera({ username, onCancel }) {
    const { CameraView, Camera } = require('expo-camera');
    const [type, setType] = useState('front');
    const [hasPermission, setHasPermission] = useState(null);
    const cameraRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const snap = async () => {
        if (!cameraRef.current) return;
        try {
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: true });
            const imageData = photo.base64
                ? `data:image/jpeg;base64,${photo.base64}`
                : photo.uri;
            await saveProfilePicture(username, imageData);
            router.replace({ pathname: '/(tabs)/userProfileScreen', params: { username } });
        } catch (e) {
            console.error('Failed to take/save picture:', e);
        }
    };

    if (hasPermission === null) return <Text style={styles.buttonText}>Requesting permission...</Text>;
    if (hasPermission === false) return <Text style={styles.buttonText}>Camera permission denied</Text>;

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} facing={type} style={styles.camera} />
            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={onCancel} style={styles.button}>
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
        </View>
    );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function CameraScreen() {
    const params = useLocalSearchParams();
    const username = resolveParam(params.username);
    const router = useRouter();

    const handleCancel = () => router.back();

    if (Platform.OS === 'web') {
        return <WebCamera username={username} onCancel={handleCancel} />;
    }
    return <NativeCamera username={username} onCancel={handleCancel} />;
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