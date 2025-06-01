import React, { useState , useEffect ,useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Modal, ActivityIndicator, FlatList } from 'react-native';
import { MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import config from '@/utils/config';
import { useUser } from '@/context/UserContext'; 
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useWebSocket } from '@/hooks/useWebSocket';

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



type BillId = 'electricity' | 'water' | 'gas';
type BillIcon = 'flash' | 'water' | 'fire';

type Company = {
  id: string;
  name: string;
  logo: any;
};

type Bill = {
  id: BillId;
  name: string;
  icon: BillIcon;
  color: string;
  companies: Company[];
};

const BillPaymentScreen = () => {
  const { accountData } = useUser();
  const [selectedBill, setSelectedBill] = useState<BillId | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [billNumber, setBillNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState(accountData.accountNumber || '');
  const [amount, setAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [currentCompanies, setCurrentCompanies] = useState<Company[]>([]);
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
   const receiptRef = useRef<View>(null);
  const {  setAccountData ,userData} = useUser();
  const { notification } = useWebSocket();


  
  const formatAccountNumber = (account: string) => {
    if (!account || account.length < 6) return account;
    const start = account.slice(0, 2);
    const end = account.slice(-3);
    return `${start}.....${end}`;
  };
  

  const bills: Bill[] = [
    { 
      id: 'electricity', 
      name: 'Electricity', 
      icon: 'flash', 
      color: '#FFD700',
      companies: [
        { id: 'e1', name: 'Enel Brasil', logo: require('../assets/images/enel-logo.png') },
        { id: 'e2', name: 'Neoenergia', logo: require('../assets/images/Neoenergia.png') },
        { id: 'e3', name: 'CPFL Energia', logo: require('../assets/images/CPFL Energia.png') },
        { id: 'e4', name: 'Copel', logo: require('../assets/images/copel.png') },
        { id: 'e5', name: 'CEMIG', logo: require('../assets/images/CEMIG.png') },
        { id: 'e6', name: 'AES Eletropaulo', logo: require('../assets/images/AES Eletropaulo.png') },
        { id: 'e7', name: 'COELBA', logo: require('../assets/images/COELBA.png') },
        { id: 'e8', name: 'LIGHT', logo: require('../assets/images/light.png') },
        { id: 'e9', name: 'ENGIE Brasil', logo: require('../assets/images/ENGIE Brasil.png') },
        { id: 'e10', name: 'Omega Energia', logo: require('../assets/images/Omega Energia.png') },
      ]
    },
    { 
      id: 'water', 
      name: 'Water', 
      icon: 'water', 
      color: '#1E90FF',
      companies: [
        { id: 'w1', name: 'SABESP', logo: require('../assets/images/SABESP.png') },
        { id: 'w2', name: 'CAGECE', logo: require('../assets/images/CAGECE.png') },
        { id: 'w3', name: 'COMPESA', logo: require('../assets/images/COMPESA.png') },
        { id: 'w4', name: 'Águas do Brasil', logo: require('../assets/images/Águas do Brasil.png') },
        { id: 'w5', name: 'COPASA', logo: require('../assets/images/COPASA.png') },
        { id: 'w6', name: 'SANEPAR', logo: require('../assets/images/SANEPAR.png') },
        { id: 'w7', name: 'CEDAE', logo: require('../assets/images/CEDAE.png') },
      ]
    },
    { 
      id: 'gas', 
      name: 'Gas', 
      icon: 'fire', 
      color: '#FF6347',
      companies: [
        { id: 'g1', name: 'Petrobras', logo: require('../assets/images/Petrobras.png') },
        { id: 'g2', name: 'COMGÁS', logo: require('../assets/images/COMGÁS.png') },
        { id: 'g3', name: 'CEG', logo: require('../assets/images/CEG.png') },
        { id: 'g4', name: 'Gás Natural Fenosa', logo: require('../assets/images/Gás Natural Fenosa.png') },
        { id: 'g5', name: 'Compagas', logo: require('../assets/images/Compagas.png') },
        { id: 'g8', name: 'Bahiagás', logo: require('../assets/images/Bahiagás.png') },
        { id: 'g9', name: 'Cegás', logo: require('../assets/images/Cegás.png') },
        { id: 'g10', name: 'Sulgás', logo: require('../assets/images/Sulgás.png') },
      ]
    },
  ];

  const handleShowAllCompanies = (companies: Company[]) => {
    setCurrentCompanies(companies);
    setShowAllCompanies(true);
  };

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompany(companyId);
    setShowAllCompanies(false);
  };

 // Ajoutez ce useEffect au début du composant pour demander les permissions
useEffect(() => {
  registerForPushNotificationsAsync();
}, []);
useEffect(() => {
  if (notification) {
    console.log('Notification reçue:', notification);
    if (notification.title === "Paiement confirmé" && paymentSuccess) {
    }
  }
}, [notification]);
// Modifiez la fonction handlePayment comme suit :
const handlePayment = async () => {
  if (!selectedBill || !selectedCompany || !billNumber || !accountNumber || !amount) {
    alert('Please fill in all fields');
    return;
  }
  if (billNumber.length < 6 || billNumber.length > 15) {
    alert('The Bill number must contain between 6 and 15 characters');
    return;
  }
  if (accountNumber.length < 5) {
    alert('The account number must contain between 5 and 20 characters');
    return;
  }

  setIsLoading(true);

  try {
    // Créer la facture
    const response = await fetch(`${config.BASE_URL}/api/factures/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numeroFacture: billNumber,
        montant: amount,
        dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        utilisateurId: userData.userId,
        typeFacture: selectedBill,
        societe: selectedCompany,
        compteClient: accountNumber,
      }),
    });

    if (response.ok) {
      const otpResponse = await fetch(`${config.BASE_URL}/api/factures/factures/${billNumber}/otp`, {
        method: 'POST',
      });

      if (otpResponse.ok) {
        const otpData = await otpResponse.json();
        const otpCode = otpData.otp;

        // Envoyer la notification avec l'OTP
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "OTP code for payment",
            body: `Your OTP code is: ${otpCode}`,
            data: { otp: otpCode },
          },
          trigger: null, // Envoi immédiat
        });

        setShowOtpModal(true);
      } else {
        const errorData = await otpResponse.json();
        alert(errorData.message || "Error requesting OTP");
      }
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Error creating Bill");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("An error has occurred");
  } finally {
    setIsLoading(false);
  }
};
const handleOtpVerification = async () => {
  if (!otp) {
    alert('Please enter the OTP code');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(`${config.BASE_URL}/api/factures/factures/${billNumber}/payer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp }),
    });

    if (response.ok) {
      const data = await response.json();
      const bill = bills.find(b => b.id === selectedBill);
      const company = bill?.companies.find(c => c.id === selectedCompany);

      // ✅ Mettre à jour les données du reçu
      setReceiptData({
        companyName: company?.name || '',
        billType: bill?.name || '',
        billNumber,
        accountNumber,
        amount,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        transactionId: Math.random().toString(36).substring(2, 10).toUpperCase(),
        newBalance: data.compteMisAJour?.soldeActuel ?? null,
      });

      if (data.compteMisAJour) {
        setAccountData({
          ...accountData, 
          balance: data.compteMisAJour.soldeActuel,
        });
      }
      

      setPaymentSuccess(true);
      setShowOtpModal(false);
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Invalid or expired OTP");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("An error has occurred");
  } finally {
    setIsLoading(false);
  }
};

  const generateReceiptPDF = async () => {
    if (!receiptData) return null;

    try {
      const html = `
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial; padding: 20px; max-width: 100%; }
              .header { text-align: center; margin-bottom: 20px; }
              .title { font-size: 20px; font-weight: bold; color: #2E86DE; }
              .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
              .divider { border-top: 1px dashed #000; margin: 15px 0; }
              .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
              .label { font-weight: bold; color: #666; width: 40%; }
              .value { color: #333; width: 60%; text-align: right; }
              .footer { margin-top: 30px; text-align: center; font-style: italic; }
              .logo { text-align: center; margin-bottom: 15px; }
              .receipt-container { border: 1px solid #ddd; border-radius: 10px; padding: 20px; max-width: 100%; }
              .thank-you { font-size: 16px; color: #2E86DE; text-align: center; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <div class="logo">
                <!-- Add your logo here if you have one -->
              </div>
              <div class="header">
                <div class="title">Payment Receipt</div>
                <div class="subtitle">Transaction #${receiptData.transactionId}</div>
              </div>
              <div class="divider"></div>
              
              <div class="row">
                <span class="label">Company:</span>
                <span class="value">${receiptData.companyName}</span>
              </div>
              <div class="row">
                <span class="label">Service Type:</span>
                <span class="value">${receiptData.billType}</span>
              </div>
              <div class="row">
                <span class="label">Bill Number:</span>
                <span class="value">${receiptData.billNumber}</span>
              </div>
              <div class="row">
                <span class="label">Account Number:</span>
                <span class="value">${formatAccountNumber(receiptData.accountNumber)}</span>
              </div>
              <div class="row">
                <span class="label">Amount Paid:</span>
                <span class="value">R$ ${receiptData.amount}</span>
              </div>
              <div class="row">
                <span class="label">Payment Date:</span>
                <span class="value">${receiptData.date}</span>
              </div>
              <div class="row">
                <span class="label">Payment Time:</span>
                <span class="value">${receiptData.time}</span>
              </div>
              
              <div class="divider"></div>
              
              <div class="row">
                <span class="label">New Balance:</span>
                <span class="value">R$ ${receiptData.newBalance || 'N/A'}</span>
              </div>
              
              <div class="thank-you">
                Thank you for your payment!
              </div>
              <div class="footer">
                This is your official receipt.
              </div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html,
        width: 595,
        height: 842,
        base64: false
      });

      return uri;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const saveReceiptPDF = async () => {
    try {
      setIsLoading(true);
      
      const pdfUri = await generateReceiptPDF();
      
      if (!pdfUri) {
        throw new Error('Could not generate PDF');
      }

      // Create receipts directory if it doesn't exist
      const receiptsDir = `${FileSystem.documentDirectory}receipts/`;
      const dirInfo = await FileSystem.getInfoAsync(receiptsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(receiptsDir, { intermediates: true });
      }

      // Generate filename
      const fileName = `receipt_${receiptData.transactionId}.pdf`;
      const newPath = `${receiptsDir}${fileName}`;

      // Copy the file to permanent storage
      await FileSystem.copyAsync({
        from: pdfUri,
        to: newPath
      });

      // Share the file (optional)
      await Sharing.shareAsync(newPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Save Payment Receipt',
        UTI: 'com.adobe.pdf',
      });

      alert('Receipt saved successfully!');
    } catch (error) {
      console.error('Error saving receipt:', error);
      alert('Could not save receipt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setSelectedBill(null);
    setSelectedCompany(null);
    setBillNumber('');
    setAccountNumber('');
    setAmount('');
    setPaymentSuccess(false);
    setReceiptData(null);
    setOtp('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bill Payment</Text>
      </View>

{paymentSuccess ? (
        <View style={styles.successContainer}>
          <LottieView
            source={require('../assets/animations/verification.json')}
            autoPlay
            loop={true}
            style={styles.successAnimation}
          />
          <Text style={styles.successTitle}>Payment Successful!</Text>
          
          <View style={styles.receiptContainer} ref={receiptRef}>
            <Text style={styles.receiptTitle}>Payment Receipt</Text>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Company:</Text>
              <Text style={styles.receiptValue}>{receiptData.companyName}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Type:</Text>
              <Text style={styles.receiptValue}>{receiptData.billType}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Bill number:</Text>
              <Text style={styles.receiptValue}>{receiptData.billNumber}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Account number:</Text>
              <Text style={styles.receiptValue}>{formatAccountNumber(receiptData.accountNumber)}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Amount:</Text>
              <Text style={styles.receiptValue}>R$ {receiptData.amount}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Date:</Text>
              <Text style={styles.receiptValue}>{receiptData.date} at {receiptData.time}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction:</Text>
              <Text style={styles.receiptValue}>{receiptData.transactionId}</Text>
            </View>
            {receiptData.newBalance && (
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>New Balance:</Text>
                <Text style={styles.receiptValue}>R$ {receiptData.newBalance}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.printButton}
            onPress={saveReceiptPDF}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="file-pdf-box" size={24} color="#FFF" />
                <Text style={styles.printButtonText}>Save as PDF</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.newPaymentButton}
            onPress={resetForm}
          >
            <Text style={styles.newPaymentButtonText}>New payment</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Bill Selection */}
          <Text style={styles.sectionTitle}>Select the Bill type</Text>
          <View style={styles.billTypes}>
            {bills.map((bill) => (
              <TouchableOpacity
                key={bill.id}
                style={[
                  styles.billCard,
                  selectedBill === bill.id && styles.selectedBillCard,
                  { borderColor: bill.color }
                ]}
                onPress={() => {
                  setSelectedBill(bill.id);
                  setSelectedCompany(null);
                }}
              >
                <MaterialCommunityIcons 
                  name={bill.icon} 
                  size={32} 
                  color={bill.color} 
                />
                <Text style={styles.billName}>{bill.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Company Selection */}
          {selectedBill && (
            <>
              <Text style={styles.sectionTitle}>Select the company</Text>
              <View style={styles.companyContainer}>
                {bills.find(b => b.id === selectedBill)?.companies.slice(0, 3).map((company) => (
                  <TouchableOpacity
                    key={company.id}
                    style={[
                      styles.companyCard,
                      selectedCompany === company.id && styles.selectedCompanyCard,
                    ]}
                    onPress={() => setSelectedCompany(company.id)}
                  >
                    <Image source={company.logo} style={styles.companyLogo} />
                    <Text style={styles.companyName}>{company.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {(bills.find(b => b.id === selectedBill)?.companies.length || 0) > 3 && (
                <TouchableOpacity
                  style={styles.moreCompaniesButton}
                  onPress={() => handleShowAllCompanies(bills.find(b => b.id === selectedBill)?.companies || [])}
                >
                  <Text style={styles.moreCompaniesText}>
                    View more ({(bills.find(b => b.id === selectedBill)?.companies.length || 0) - 3})
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Bill Number Input */}
          <Text style={styles.sectionTitle}>Bill number (11 digits)</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="barcode" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Enter the Bill number"
              keyboardType="numeric"
              maxLength={15}
              value={billNumber}
              onChangeText={setBillNumber}
            />
          </View>

          {/* Account Number Input */}
          <Text style={styles.sectionTitle}>Account number</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="credit-card" size={24} color="#666" />
            <TextInput
              style={styles.input}
              keyboardType="default"
              maxLength={20}
              value={accountNumber}
              onChangeText={setAccountNumber}
              editable={false}
            />
          </View>

          {/* Amount Input */}
          <Text style={styles.sectionTitle}>Amount to pay </Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="attach-money"size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="0,00"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Payment Button */}
          <TouchableOpacity 
            style={styles.paymentButton}
            onPress={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.paymentButtonText}>Pay now</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {/* Modal for all companies */}
      <Modal
        visible={showAllCompanies}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAllCompanies(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a company</Text>
            
            <FlatList
              data={currentCompanies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.modalCompanyCard,
                    selectedCompany === item.id && styles.selectedModalCompanyCard,
                  ]}
                  onPress={() => handleCompanySelect(item.id)}
                >
                  <Image source={item.logo} style={styles.modalCompanyLogo} />
                  <Text style={styles.modalCompanyName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.modalListContainer}
            />

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowAllCompanies(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for OTP verification */}
      <Modal
        visible={showOtpModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>OTP Verification</Text>
            <Text style={styles.modalSubtitle}>Enter the OTP code sent to confirm the payment.</Text>
            
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
              onPress={handleOtpVerification}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.verifyButtonText}>Check and Pay</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowOtpModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E86DE',
    marginBottom: 15,
    marginTop: 20,
  },
  billTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  billCard: {
    width: '30%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  selectedBillCard: {
    borderStyle: 'solid',
    backgroundColor: '#F0F8FF',
  },
  billName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  companyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  companyCard: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    marginHorizontal: 5,
  },
  selectedCompanyCard: {
    borderColor: '#1A4B8C',
    backgroundColor: '#E6F2FF',
  },
  companyLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  companyName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  moreCompaniesButton: {
    width: '100%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E86DE',
    marginTop: 10,
  },
  moreCompaniesText: {
    color: '#2E86DE',
    fontWeight: '600',
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
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A4B8C',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
    textAlign: 'left',
    flexWrap: 'wrap', // ✅ Ajoute cette ligne
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
  modalListContainer: {
    paddingBottom: 20,
  },
  modalCompanyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  selectedModalCompanyCard: {
    backgroundColor: '#E6F2FF',
  },
  modalCompanyLogo: {
    width: 40,
    height: 40,
    marginRight: 15,
    resizeMode: 'contain',
  },
  modalCompanyName: {
    fontSize: 16,
    color: '#333',
  },
  closeModalButton: {
    backgroundColor: '#2E86DE',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default BillPaymentScreen;