import { Fontisto } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraCapturedPicture } from 'expo-camera';
import React, { useState } from 'react';
import {
    TouchableOpacity,
    SafeAreaView,
    Image,
    StyleSheet,
    View,
    Alert,
    ActivityIndicator,
    Platform,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext'; 

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
    });
};


const PhotoPreviewSection = ({
    photo,
    handleRetakePhoto,
}: {
    
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
}) => {
    const { userData } = useUser(); // accès à userId
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const sendImageToBackend = async () => {
        try {
            setLoading(true);

            console.log('Preparing image for upload:', photo.uri);

            if (!photo.uri) {
                throw new Error('Invalid photo URI');
            }

            const cleanUri = Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', '');

            const formData = new FormData();
            formData.append('userId', userData.userId);
            formData.append('image', {
                uri: cleanUri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            } as any);

            const backendResponse = await axios.post('http://192.168.1.29:5000/api/detect_face', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },

            });

            const base64Image = await blobToBase64(backendResponse.data);
            console.log('Face received from backend!');

            Alert.alert('Succès', 'Image reçue et convertie !');
        } catch (error: any) {
            console.error("Erreur lors de l'envoi :", error.response?.data || error.message || error);
            Alert.alert('Erreur', "Échec de l'envoi de l'image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.box}>
                <Image style={styles.previewContainer} source={{ uri: photo.uri }} />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
                    <Ionicons name="reload-circle" size={36} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={sendImageToBackend}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="black" />
                    ) : (
                        <Fontisto name="cloud-up" size={36} color="black" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/(auth)/verification')}
                >
                    <Ionicons name="checkmark-circle-outline" size={36} color="black" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        borderRadius: 15,
        padding: 1,
        width: '95%',
        backgroundColor: 'darkgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContainer: {
        width: '95%',
        height: '85%',
        borderRadius: 15,
    },
    buttonContainer: {
        marginTop: '4%',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        backgroundColor: 'gray',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
});

export default PhotoPreviewSection;
