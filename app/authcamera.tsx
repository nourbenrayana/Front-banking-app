import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  Button, 
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import config from '@/utils/config';


export default function AuthCamera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();
  const { setUserData, setAccountData } = useUser();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Nous avons besoin de votre permission pour accéder à la caméra
        </Text>
        <Button 
          onPress={requestPermission} 
          title="Accorder la permission" 
          color="#4a90e2"
        />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 0.8,
        base64: true,
        exif: false,
      };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takenPhoto);
      setVerificationResult(null);
    }
  };

  const handleRetakePhoto = () => {
    setPhoto(null);
    setVerificationResult(null);
  };

  const handleVerifyPhoto = async () => {
    if (!photo?.base64) return;
    
    setIsVerifying(true);
    try {
      // Étape 1: Vérification faciale
      const faceResponse = await fetch(`${config.URL}/api/compare_with_database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_base64: photo.base64
        }),
      });

      if (!faceResponse.ok) {
        throw new Error(`Erreur de vérification faciale: ${faceResponse.status}`);
      }

      const faceResult = await faceResponse.json();
      
      if (!faceResult.success || !faceResult.match_found) {
        throw new Error(faceResult.error || 'Aucune correspondance faciale trouvée');
      }

      setVerificationResult(faceResult);

      if (!faceResult.best_match.user_id) {
        throw new Error('User ID not found in face verification result');
      }
      
      // Extraction de l'ID sans préfixe (si présent)
      const rawUserId = faceResult.best_match.user_id.replace(/^users\//, '');
      
      // Étape 2: Envoi de l'ID brut sans préfixe
      const userAccountResponse = await fetch(`${config.BASE_URL}/api/comptes/user-info/${rawUserId}`);
      
      if (!userAccountResponse.ok) {
        const errorData = await userAccountResponse.json().catch(() => ({}));
        throw new Error(
            errorData.error || 
            errorData.message || 
            `Erreur lors de la récupération des données: ${userAccountResponse.status}`
        );
      }
      const userAccountData = await userAccountResponse.json();

      // Mise à jour des contextes
      setUserData({
        fullName: userAccountData.user.fullName,
        email: userAccountData.user.email,
        phone: userAccountData.user.phone,
        birthDate: userAccountData.user.birthDate,
        idNumber: userAccountData.user.idNumber,
        userId: userAccountData.user.userId,
      });

      // Prend le premier compte par défaut (peut être amélioré pour gérer plusieurs comptes)
      if (userAccountData.accounts && userAccountData.accounts.length > 0) {
        setAccountData({
          accountId: userAccountData.accounts[0].accountId,
          accountNumber: userAccountData.accounts[0].accountNumber,
          accountType: userAccountData.accounts[0].accountType,
          currency: userAccountData.accounts[0].currency,
          balance: userAccountData.accounts[0].balance,
          status: userAccountData.accounts[0].status,
          cardNumber: userAccountData.accounts[0].cardNumber || '',
          expiryDate: userAccountData.accounts[0].expiryDate || '',
          cardType: userAccountData.accounts[0].cardType || 'VISA',
          creditLimit: userAccountData.accounts[0].creditLimit || 0,
        });
      }

      // Redirection vers le dashboard
      router.replace("/(tabs)");
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Une erreur est survenue lors de la vérification';
      
      console.error('Erreur:', error);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.previewImage} />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.retakeButton]} 
            onPress={handleRetakePhoto}
            disabled={isVerifying}
          >
            <MaterialIcons name="replay" size={24} color="white" />
            <Text style={styles.buttonText}>Reprendre</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.verifyButton]} 
            onPress={handleVerifyPhoto}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialIcons name="verified" size={24} color="white" />
                <Text style={styles.buttonText}>Vérifier</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {verificationResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {verificationResult.match_found 
                ? `Correspondance trouvée: ${verificationResult.best_match.name}`
                : 'Aucune correspondance trouvée'}
            </Text>
            {verificationResult.match_found && (
              <Text style={styles.confidenceText}>
                Confiance: {((1 - verificationResult.best_match.distance) * 100).toFixed(1)}%
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.topOverlay}>
          <Text style={styles.instructionText}>Prenez une photo claire de votre visage</Text>
        </View>
        <View style={styles.bottomOverlay}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <AntDesign name="retweet" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
      </CameraView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  camera: {
    flex: 1,
  },
  topOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  placeholder: {
    width: 50,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retakeButton: {
    backgroundColor: '#333',
  },
  verifyButton: {
    backgroundColor: '#4a90e2',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  resultContainer: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  confidenceText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
});
