import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRouter } from "expo-router";
import config from '../../utils/config';
import { useTranslation } from 'react-i18next';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [isPhotoAccepted, setIsPhotoAccepted] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [cameraMode, setCameraMode] = useState<'normal' | 'selfie'>('normal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const router = useRouter();
  const { t } = useTranslation('camera');

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>{t('camera.permissionRequest.message')}</Text>
        <Button onPress={requestPermission} title={t('camera.permissionRequest.button')} />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    setCameraMode(current => current === 'normal' ? 'selfie' : 'normal');
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takenPhoto);
      setIsPhotoAccepted(null);
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
      setIsPhotoAccepted(null);
    }
  };

  const handleRetakePhoto = () => {
    setPhoto(null);
    setIsPhotoAccepted(null);
    setProcessingResult(null);
  };

  const handleAcceptPhoto = async () => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'passport.jpg',
      } as any);
      
      const result = await axios.post(`${config.URL}/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setProcessingResult(result.data);
      setIsPhotoAccepted(true);
    } catch (error) {
      console.error('Error processing image:', error);
      setProcessingResult({ error: t('camera.processing.error') });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPhoto = () => {
    setIsPhotoAccepted(false);
    setPhoto(null);
    setProcessingResult(null);
  };

  const switchCameraMode = (mode: 'normal' | 'selfie') => {
    setCameraMode(mode);
    setFacing(mode === 'selfie' ? 'front' : 'back');
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <View style={styles.passportPlaceholder}>
            <Text style={styles.placeholderText}>{t('camera.placeholder')}</Text>
            <Image
              style={styles.previewImage}
              source={{ uri: photo.uri }}
            />
          </View>
          
          {isProcessing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>{t('camera.processing.loading')}</Text>
            </View>
          ) : processingResult ? (
            <View style={styles.resultContainer}>
              {processingResult.error ? (
                <Text style={styles.errorText}>{processingResult.error}</Text>
              ) : (
                <>
                  <Text style={styles.successText}>{t('camera.processing.success')}</Text>
                  <Text style={styles.resultText}>
                    {t('camera.processing.faces')}: {processingResult.faces_saved?.length || 0}
                  </Text>
                  {processingResult.faces_saved?.map((base64Face: string, index: number) => (
                    <View key={index} style={{ marginVertical: 10, alignItems: 'center' }}>
                      <Text>Face {index + 1}</Text>
                      <Image
                        source={{ uri: `data:image/png;base64,${base64Face}` }}
                        style={{ width: 150, height: 150, borderRadius: 10 }}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </>
              )}
            </View>
          ) : null}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto}>
              <Text style={styles.buttonText}>{t('camera.actions.retake')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.acceptButton} 
              onPress={handleAcceptPhoto}
              disabled={isProcessing}
            >
              <Text style={styles.buttonText}>{t('camera.actions.process')}</Text>
            </TouchableOpacity>
          </View>
          
          {processingResult && !processingResult.error && (
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={() => router.push("/(auth)/detectface")}
            >
              <Text style={styles.nextButtonText}>{t('camera.actions.continue')}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Text style={styles.instructionText}>{t('camera.instructions.title')}</Text>
          <Text style={styles.subInstructionText}>
            {t('camera.instructions.subtitle')}
          </Text>
          
          <View style={styles.cameraModeSelector}>
            <TouchableOpacity 
              style={[styles.cameraModeButton, cameraMode === 'normal' && styles.cameraModeButtonActive]}
              onPress={() => switchCameraMode('normal')}
            >
              <Text style={[styles.cameraModeText, cameraMode === 'normal' && styles.cameraModeTextActive]}>
                {t('camera.modes.normal')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.cameraModeButton, cameraMode === 'selfie' && styles.cameraModeButtonActive]}
              onPress={() => switchCameraMode('selfie')}
            >
              <Text style={[styles.cameraModeText, cameraMode === 'selfie' && styles.cameraModeTextActive]}>
                {t('camera.modes.selfie')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.passportPlaceholder}>
            <Text style={styles.placeholderText}>{t('camera.placeholder')}</Text>
            <CameraView 
              style={styles.camera} 
              facing={facing} 
              ref={cameraRef} 
            />
          </View>
          
          <TouchableOpacity style={styles.scanButton} onPress={handleTakePhoto}>
            <Text style={styles.scanButtonText}>{t('camera.actions.scan')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
            <Text style={styles.uploadButtonText}>{t('camera.actions.upload')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  instructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subInstructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  cameraModeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    width: '90%',
  },
  cameraModeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  cameraModeButtonActive: {
    backgroundColor: '#007AFF',
  },
  cameraModeText: {
    color: '#007AFF',
    fontSize: 16,
  },
  cameraModeTextActive: {
    color: 'white',
  },
  passportPlaceholder: {
    width: '90%',
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    overflow: 'hidden',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 5,
    borderRadius: 5,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
  },
  camera: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  uploadButtonText: {
    color: '#007AFF',
    fontSize: 18,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 30,
  },
  retakeButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '45%',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#007AFF',
  },
  resultContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '90%',
  },
  successText: {
    color: '#34C759',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  resultText: {
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});