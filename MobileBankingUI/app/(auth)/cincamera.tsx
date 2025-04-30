import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';

export default function CameraCard() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<'front' | 'back' | 'done'>('front');
  const [frontPhoto, setFrontPhoto] = useState<any>(null);
  const [cameraMode, setCameraMode] = useState<'normal' | 'selfie'>('normal'); 
  const [backPhoto, setBackPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();
  const { t } = useTranslation('camera1');

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>{t('cameraCard.permission.message')}</Text>
        <Button onPress={requestPermission} title={t('cameraCard.permission.button')} />
      </View>
    );
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      if (step === 'front') {
        setFrontPhoto(photo);
        setStep('back');
      } else if (step === 'back') {
        setBackPhoto(photo);
        setStep('done');
      }
    }
  };

  const handleRetake = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontPhoto(null);
      setStep('front');
    } else {
      setBackPhoto(null);
      setStep('back');
    }
  };

  const handlePickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (step === 'front') {
        setFrontPhoto(result.assets[0]);
        setStep('back');
      } else {
        setBackPhoto(result.assets[0]);
        setStep('done');
      }
    }
  };

  const switchCameraMode = (mode: 'normal' | 'selfie') => {
    setCameraMode(mode);
    setFacing(mode === 'selfie' ? 'front' : 'back');
  };

  const handleNext = () => {
    router.push("/(auth)/detectface");
  };

  return (
    <View style={styles.container}>
      {step !== 'done' && (
        <View style={styles.cameraContainer}>
          <Text style={styles.instructionText}>
            {step === 'front' 
              ? t('cameraCard.instructions.front') 
              : t('cameraCard.instructions.back')}
          </Text>
          <CameraView ref={cameraRef} facing={facing} style={styles.camera} />

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() =>
              switchCameraMode(cameraMode === 'normal' ? 'selfie' : 'normal')
            }
          >
            <Text style={styles.switchButtonText}>
              {t('cameraCard.buttons.switchCamera', { 
                mode: cameraMode === 'normal' 
                  ? t('cameraCard.labels.selfie') 
                  : t('cameraCard.labels.normal') 
              })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Text style={styles.buttonText}>{t('cameraCard.buttons.takePhoto')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handlePickFromGallery}>
            <Text style={styles.secondaryButtonText}>{t('cameraCard.buttons.importGallery')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'done' && (
        <View style={styles.previewContainer}>
          <Text style={styles.instructionText}>{t('cameraCard.instructions.preview')}</Text>
          <View style={styles.imageRow}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: frontPhoto?.uri }} style={styles.previewImage} />
              <Text style={styles.imageLabel}>{t('cameraCard.labels.front')}</Text>
              <TouchableOpacity onPress={() => handleRetake('front')}>
                <Text style={styles.retakeText}>{t('cameraCard.buttons.retake')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: backPhoto?.uri }} style={styles.previewImage} />
              <Text style={styles.imageLabel}>{t('cameraCard.labels.back')}</Text>
              <TouchableOpacity onPress={() => handleRetake('back')}>
                <Text style={styles.retakeText}>{t('cameraCard.buttons.retake')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={[styles.button, { marginTop: 30 }]} onPress={handleNext}>
            <Text style={styles.buttonText}>{t('cameraCard.buttons.next')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  instructionText: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 15,
    color: '#007AFF',
    textAlign: 'center',
  },
  camera: {
    width: '90%',
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  switchButton: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 15,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  previewContainer: {
    alignItems: 'center',
    padding: 20,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  previewImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  imageLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  retakeText: {
    marginTop: 5,
    color: '#ff3b30',
    fontSize: 14,
  },
});