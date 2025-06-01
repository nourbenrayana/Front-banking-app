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
    Text
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext'; 
import config from '../utils/config';
import * as FileSystem from 'expo-file-system';

interface ICompareFacesResult {
    cosine_dist: any;
    similarity: any;
    comparison_result: any;
}

const PhotoPreviewSection = ({
    photo,
    handleRetakePhoto,
}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
}) => {
    const { userData } = useUser();
    const [loading, setLoading] = useState(false);
    const [comparisonResult, setComparisonResult] = useState<ICompareFacesResult | null>(null);
    const router = useRouter();

    const compareFaces = async (documentFaceData: string, liveFaceData: string) => {
        try {
            setLoading(true);
    
            const payload = {
                search_image: `data:image/jpeg;base64,${documentFaceData}`,
                candidate_image: `data:image/jpeg;base64,${liveFaceData}`,
            };
    
            const response = await axios.post<ICompareFacesResult>(
                `${config.URL}/api/compare_faces`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
    
            setComparisonResult(response.data);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la comparaison:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    
const sendImageToBackend = async () => {
    try {
        setLoading(true);

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

        const detectionResponse = await axios.post(`${config.URL}/api/detect_face`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const registeredFacesResponse = await axios.get(`${config.URL}/api/get_last_registered_face`);
        const registeredFaceData = registeredFacesResponse.data.image_base64;

        const documentFacesResponse = await axios.get(`${config.URL}/api/get_document_faces`);
        const documentFaceData = documentFacesResponse.data.image_base64;

        const result = await compareFaces(documentFaceData, registeredFaceData);

        // Vérifie si la similarité dépasse 70%
        if (result.similarity >= 70) {
            Alert.alert(
                'Succès',
                `La similarité des visages est suffisante (${result.similarity}%). Vous pouvez continuer.`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/(auth)/verification'),
                    },
                ]
            );
        } else {
            Alert.alert(
                'Erreur',
                `La similarité des visages est insuffisante (${result.similarity}%). Elle doit être d'au moins 70%.`,
                [
                    { text: 'OK' },
                ]
            );
        }
    } catch (error: any) {
        console.error("Erreur lors de l'envoi :", error.response?.data || error.message || error);
        Alert.alert('Erreur', "Échec de la comparaison des visages.");
    } finally {
        setLoading(false);
    }
};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.box}>
                <Image style={styles.previewContainer} source={{ uri: photo.uri }} />
            </View>

            {comparisonResult && (
                <View style={styles.resultContainer}>
                    <Text>Similarité: {comparisonResult.similarity}</Text>
                    <Text>Distance cosinus: {comparisonResult.cosine_dist}</Text>
                    <Text>Résultat: {comparisonResult.comparison_result}</Text>
                </View>
            )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
                        <Ionicons name="reload-circle" size={36} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={
                            comparisonResult
                                ? () => router.push('/(auth)/verification')
                                : sendImageToBackend
                        }
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="black" />
                        ) : comparisonResult ? (
                            <Ionicons name="checkmark-circle-outline" size={36} color="black" />
                        ) : (
                            <Fontisto name="cloud-up" size={36} color="black" />
                        )}
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
    resultContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
});

export default PhotoPreviewSection;