import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext'; // adapte ce chemin
import config from '../../utils/config';

export default function CinBackCapture() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [backPhoto, setBackPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();
  const { t } = useTranslation('camera1');
  const { width } = Dimensions.get('window');
  const frameSize = width * 0.85;
  const { userData } = useUser();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-enhance" size={48} color="#2D5DB2" />
        <Text style={styles.permissionTitle}>{t('permission.title')}</Text>
        <Text style={styles.permissionText}>{t('permission.message')}</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>{t('permission.button')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true, skipProcessing: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      setBackPhoto(photo);
    }
  };

  const handleRetake = () => {
    setBackPhoto(null);
  };

  const handlePickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [85, 54],
      quality: 1,
    });

    if (!result.canceled) {
      setBackPhoto(result.assets[0]);
    }
  };

  const handleProcess = async () => {
    const formData = new FormData();
    formData.append("image", {
      uri: backPhoto.uri,
      type: "image/jpeg",
      name: "cin.jpg"
    } as any);

    try {
      const res = await fetch(`${config.URL}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: formData
      });
      const data = await res.json();
      console.log("/process:", data);
    } catch (err) {
      console.error("Erreur /process:", err);
    }
  };

  const handleVerifyDocument = async () => {
    const formData = new FormData();
    formData.append("image", {
      uri: backPhoto.uri,
      type: "image/jpeg",
      name: "cin.jpg"
    } as any);

    formData.append("form_data", JSON.stringify({
      name: userData.fullName,
      id: userData.idNumber,
      date: userData.birthDate
    }));

    try {
      const res = await fetch(`${config.URL}/api/verify_document`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: formData
      });
      const data = await res.json();
      console.log("/verify_document:", data);
    } catch (err) {
      console.error("Erreur /verify_document:", err);
    }
  };

  const handleNext = async () => {
    if (!backPhoto) return;
    await handleProcess();
    await handleVerifyDocument();
    router.push("/(auth)/verification");
  };
return (
    <View style={styles.container}>
      {!backPhoto ? (
        <View style={styles.captureContainer}>
          <Text style={styles.title}>{t('back.title')}</Text>
          <Text style={styles.subtitle}>{t('back.subtitle')}</Text>
          
          <View style={styles.cameraWrapper}>
            <CameraView 
              ref={cameraRef} 
              facing={facing} 
              style={styles.camera} 
            />
            
            <View style={[styles.overlayFrame, { width: frameSize, height: frameSize * 0.63 }]}>
              <View style={styles.frameCorners}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
              </View>
              <View style={styles.frameContent}>
                <Text style={styles.frameText}>{t('back.frameInstruction')}</Text>
                <View style={styles.mrzIndicator}>
                  <View style={styles.mrzVisual}>
                    <View style={styles.mrzLine} />
                    <View style={styles.mrzLine} />
                    <View style={styles.mrzLine} />
                  </View>
                
                </View>
              </View>
            </View>
          </View>

          <View style={styles.hintBox}>
            <FontAwesome name="lightbulb-o" size={20} color="#FFD700" />
            <Text style={styles.hintText}>{t('back.hint')}</Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handlePickFromGallery}
            >
              <Ionicons name="folder-open" size={20} color="#2D5DB2" />
              <Text style={styles.secondaryButtonText}>{t('back.importButton')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.captureButton}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Text style={styles.title}>{t('back.previewTitle')}</Text>
          
          <View style={[styles.previewFrame, { width: frameSize, height: frameSize * 0.63 }]}>
            <Image 
              source={{ uri: backPhoto?.uri }} 
              style={styles.previewImage} 
            />
            <View style={styles.previewLabel}>
              <MaterialIcons name="flip-to-back" size={20} color="#2D5DB2" />
              <Text style={styles.previewLabelText}>{t('back.sideLabel')}</Text>
            </View>
            <View style={styles.mrzPreviewIndicator}>
              <MaterialIcons name="verified" size={24} color="#4CAF50" />
              <Text style={styles.mrzPreviewText}>{t('back.mrzCaptured')}</Text>
            </View>
          </View>

          <View style={styles.previewButtons}>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={handleRetake}
            >
              <Ionicons name="refresh" size={20} color="#2D5DB2" />
              <Text style={styles.retryButtonText}>{t('back.retryButton')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleNext}
            >
              <Text style={styles.confirmButtonText}>{t('back.confirmButton')}</Text>
              <MaterialIcons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F8F9FA',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E90FF',
    marginVertical: 15,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#1E90FF',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#1E90FF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  captureContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 30,
  },
  cameraWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  camera: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlayFrame: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameCorners: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#2D5DB2',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  frameContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  frameText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  mrzIndicator: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mrzVisual: {
    width: '80%',
    marginBottom: 10,
  },
  mrzLine: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginVertical: 3,
    borderRadius: 2,
  },
  mrzText: {
    color: 'white',
    marginTop: 10,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  hintText: {
    marginLeft: 10,
    color: '#5F4B1B',
    fontSize: 14,
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E90FF',
    flex: 1,
    marginRight: 15,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    marginLeft: 8,
    color: '#1E90FF',
    fontWeight: '600',
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  previewContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
  },
  previewFrame: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#1E90FF',
    borderRadius: 8,
    marginVertical: 30,
    backgroundColor: 'white',
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  previewLabelText: {
    marginLeft: 5,
    color: '#2D5DB2',
    fontWeight: '600',
  },
  mrzPreviewIndicator: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 5,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  mrzPreviewText: {
    marginLeft: 5,
    color: '#1E90FF',
    fontWeight: '600',
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E90FF',
    flex: 1,
    marginRight: 15,
    justifyContent: 'center',
  },
  retryButtonText: {
    marginLeft: 8,
    color: '#4A5568',
    fontWeight: '600',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#1E90FF',
    flex: 1,
    justifyContent: 'center',
    elevation: 2,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    marginRight: 8,
  },
  loadingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#2D5DB2',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '600',
  },
});

