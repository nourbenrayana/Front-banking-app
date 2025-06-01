import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Modal, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import config from '@/utils/config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Camera, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useUser } from '@/context/UserContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

// Configurez les notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Fonction pour demander les permissions
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.warn('Must use physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return;
  }
}

const PaimentParQR = () => {
  const [qrCode, setQrCode] = useState('');
  const [otp, setOtp] = useState('');
  const [amount, setAmount] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { userData, accountData, setAccountData } = useUser();

  // Demander les permissions pour la caméra et les notifications
  useEffect(() => {
    (async () => {
      // Permission pour la caméra
      if (Platform.OS === 'android') {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        setHasPermission(status === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      }

      // Permission pour les notifications
      await registerForPushNotificationsAsync();
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const qrData = JSON.parse(data);
      setScanned(true);
      setQrCode(qrData.id || data);
      setCompanyName(qrData.company || 'Fournisseur par QR');
      setShowScanner(false);
      Alert.alert('QR Code scanné', `Société: ${qrData.company || 'Non spécifié'}`);
    } catch (e) {
      // Si le QR code n'est pas un JSON, traitez-le comme avant
      setScanned(true);
      setQrCode(data);
      setCompanyName('Fournisseur par QR');
      setShowScanner(false);
      Alert.alert('QR Code scanné', `Code: ${data}`);
    }
  };

  const handlePaymentRequest = async () => {
    if (!qrCode) {
      Alert.alert('Erreur', 'Veuillez scanner ou entrer un QR code');
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    setLoading(true);
    try {
      const otpResponse = await axios.post(`${config.BASE_URL}/api/factures/qr/otp`, {
        qrCode,
        userId: userData.userId,
        amount: parseFloat(amount),
        company: companyName
      });

      const otpCode = otpResponse.data.otp;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Code OTP pour paiement",
          body: `Votre code OTP est: ${otpCode}`,
          data: { otp: otpCode },
        },
        trigger: null,
      });

      setShowOtpModal(true);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 404) {
        Alert.alert('Erreur', 'Facture non trouvée');
      } else {
        const message = error.response?.data?.message || 'Une erreur est survenue lors de la demande de paiement';
        Alert.alert('Erreur', message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!qrCode || !otp) {
      Alert.alert('Erreur', 'Veuillez entrer le code OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${config.BASE_URL}/api/factures/payer/qr`, {
        qrCode,
        otp,
      });

      setReceiptData({
        amount: response.data.facture.montant,
        date: new Date(response.data.facture.datePaiement).toLocaleDateString(),
        time: new Date(response.data.facture.datePaiement).toLocaleTimeString(),
        transactionId: response.data.facture.id.split('/')[1] || Math.random().toString(36).substring(2, 10).toUpperCase(),
        companyName: response.data.facture.societe || companyName || 'Fournisseur par QR',
        newBalance: response.data.compteMisAJour?.soldeActuel ?? null,
      });

      if (response.data.compteMisAJour) {
        setAccountData({
          ...accountData, 
          balance: response.data.compteMisAJour.soldeActuel,
        });
      }

      setPaymentSuccess(true);
      setShowOtpModal(false);
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Une erreur est survenue lors du paiement';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQrCode('');
    setOtp('');
    setAmount('');
    setCompanyName('');
    setPaymentSuccess(false);
    setReceiptData(null);
  };

  const generateReceiptHTML = () => {
    return `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 100%;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #2E86DE;
              padding-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              color: #2E86DE;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
            }
            .receipt-details {
              margin-top: 30px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
            .value {
              color: #333;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-style: italic;
              color: #777;
            }
            .divider {
              border-top: 1px dashed #999;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Reçu de Paiement</div>
            <div class="subtitle">${receiptData.companyName}</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="receipt-details">
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">${receiptData.date} à ${receiptData.time}</span>
            </div>
            <div class="detail-row">
              <span class="label">Transaction ID:</span>
              <span class="value">${receiptData.transactionId}</span>
            </div>
            <div class="detail-row">
              <span class="label">Montant:</span>
              <span class="value">R$ ${receiptData.amount}</span>
            </div>
            ${receiptData.newBalance ? `
            <div class="detail-row">
              <span class="label">Nouveau solde:</span>
              <span class="value">R$ ${receiptData.newBalance}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="divider"></div>
          
          <div class="footer">
            Merci pour votre paiement!<br>
            ${new Date().getFullYear()} © MonApp
          </div>
        </body>
      </html>
    `;
  };

  const generateAndSharePDF = async () => {
    if (!receiptData) return;
    
    setPdfLoading(true);
    try {
      const html = generateReceiptHTML();
      
      // Option 1: Generate PDF and share it
      const { uri } = await Print.printToFileAsync({
        html,
        width: 612,
        height: 792,
      });
      
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Partager le reçu',
        UTI: 'com.adobe.pdf',
      });

      // Option 2: Save to downloads folder (Android only)
      if (Platform.OS === 'android') {
        const downloadsDir = FileSystem.documentDirectory + 'Download/';
        const fileName = `Reçu_${receiptData.transactionId}.pdf`;
        const fileUri = downloadsDir + fileName;
        
        // Ensure Download directory exists
        await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
        
        // Copy the file to downloads
        await FileSystem.copyAsync({
          from: uri,
          to: fileUri,
        });
        
        Alert.alert('Succès', 'Reçu téléchargé dans le dossier Downloads');
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      Alert.alert('Erreur', 'Impossible de générer le reçu PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const printReceipt = () => {
    const receiptText = `
      Reçu de paiement
      -------------------------
      Fournisseur: ${receiptData.companyName}
      Montant: R$ ${receiptData.amount}
      Date: ${receiptData.date} à ${receiptData.time}
      Transaction: ${receiptData.transactionId}
      ${receiptData.newBalance ? `Nouveau solde: R$ ${receiptData.newBalance}` : ''}
      
      Merci pour votre paiement!
    `;
    
    Alert.alert('Reçu', receiptText);
  };

  const openScanner = () => {
    if (hasPermission === false) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la caméra pour scanner un QR code');
      return;
    }
    setScanned(false);
    setShowScanner(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paiement par QR Code</Text>
      </View>

      {paymentSuccess ? (
        <View style={styles.successContainer}>
          <LottieView
            source={require('../assets/animations/verification.json')}
            autoPlay
            loop={true}
            style={styles.successAnimation}
          />
          <Text style={styles.successTitle}>Paiement Réussi!</Text>
          
          <View style={styles.receiptContainer}>
            <Text style={styles.receiptTitle}>Reçu de Paiement</Text>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Fournisseur:</Text>
              <Text style={styles.receiptValue}>{receiptData.companyName}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Montant:</Text>
              <Text style={styles.receiptValue}>R$ {receiptData.amount}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Date:</Text>
              <Text style={styles.receiptValue}>{receiptData.date} à {receiptData.time}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction:</Text>
              <Text style={styles.receiptValue}>{receiptData.transactionId}</Text>
            </View>
            {receiptData.newBalance && (
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Nouveau solde:</Text>
                <Text style={styles.receiptValue}>R$ {receiptData.newBalance}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.printButton}
            onPress={generateAndSharePDF}
            disabled={pdfLoading}
          >
            {pdfLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="file-pdf-box" size={24} color="#FFF" />
                <Text style={styles.printButtonText}>Télécharger le reçu PDF</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.newPaymentButton}
            onPress={resetForm}
          >
            <Text style={styles.newPaymentButtonText}>Nouveau paiement</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* QR Code Input */}
          <Text style={styles.sectionTitle}>QR Code de la facture</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="qrcode" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Coller le QR code ici"
              value={qrCode}
              onChangeText={setQrCode}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={openScanner}
            >
              <MaterialCommunityIcons name="line-scan" size={20} color="#2E86DE" />
            </TouchableOpacity>
          </View>

          {/* Company Name Display */}
          {companyName && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Société:</Text>
              <Text style={styles.infoValue}>{companyName}</Text>
            </View>
          )}
          
          {/* Amount Input */}
          <Text style={styles.sectionTitle}>Montant à payer</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="currency-usd" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Entrez le montant"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Payment Button */}
          <TouchableOpacity 
            style={styles.paymentButton}
            onPress={handlePaymentRequest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.paymentButtonText}>Demander le paiement</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {/* QR Scanner Modal */}
      <Modal
        visible={showScanner}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.scannerContainer}>
          {hasPermission === null ? (
            <Text>Demande d'autorisation de la caméra</Text>
          ) : hasPermission === false ? (
            <Text style={styles.permissionText}>Accès à la caméra refusé</Text>
          ) : (
            <>
              <CameraView
                ref={cameraRef}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.scannerOverlay}>
                <MaterialCommunityIcons name="qrcode-scan" size={100} color="#FFF" />
                <Text style={styles.scannerText}>Scannez le QR code de la facture</Text>
              </View>
              <TouchableOpacity
                style={styles.closeScannerButton}
                onPress={() => setShowScanner(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal
        visible={showOtpModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Vérification OTP</Text>
            <Text style={styles.modalSubtitle}>Entrez le code OTP envoyé pour confirmer le paiement.</Text>
            
            <TextInput
              style={styles.otpInput}
              placeholder="Code OTP"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />

            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.verifyButtonText}>Vérifier et Payer</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowOtpModal(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F9FF",
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86DE',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E86DE',
    marginBottom: 15,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginHorizontal: 10,
  },
  scanButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E86DE',
  },
  paymentButton: {
    backgroundColor: '#2E86DE',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#1A4B8C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  paymentButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successAnimation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86DE',
    marginBottom: 30,
  },
  receiptContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86DE',
    marginBottom: 15,
    textAlign: 'center',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  receiptLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  receiptValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  printButton: {
    flexDirection: 'row',
    backgroundColor: '#2E86DE',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 15,
  },
  printButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  newPaymentButton: {
    borderWidth: 2,
    borderColor: '#2E86DE',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  newPaymentButtonText: {
    color: '#2E86DE',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scannerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  scannerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
  },
  scannerText: {
    color: '#FFF',
    fontSize: 18,
    marginTop: 20,
  },
  permissionText: {
    color: '#FFF',
    fontSize: 18,
  },
  closeScannerButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86DE',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  verifyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default PaimentParQR;