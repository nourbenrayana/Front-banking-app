import React, { useState , useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Modal, ActivityIndicator, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import config from '@/utils/config';
import { useUser } from '@/context/UserContext'; 
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

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
  
  const formatAccountNumber = (account: string) => {
    if (!account || account.length < 6) return account;
    const start = account.slice(0, 2);
    const end = account.slice(-3);
    return `${start}.....${end}`;
  };
  

  const bills: Bill[] = [
    { 
      id: 'electricity', 
      name: 'Électricité', 
      icon: 'flash', 
      color: '#FFD700',
      companies: [
        { id: 'e1', name: 'Enel Brasil', logo: require('../assets/images/enel-logo.png') },
        { id: 'e2', name: 'Neoenergia', logo: require('../assets/images/enel-logo.png') },
        { id: 'e3', name: 'CPFL Energia', logo: require('../assets/images/enel-logo.png') },
        { id: 'e4', name: 'Copel', logo: require('../assets/images/enel-logo.png') },
        { id: 'e5', name: 'CEMIG', logo: require('../assets/images/enel-logo.png') },
        { id: 'e6', name: 'AES Eletropaulo', logo: require('../assets/images/enel-logo.png') },
        { id: 'e7', name: 'COELBA', logo: require('../assets/images/enel-logo.png') },
        { id: 'e8', name: 'LIGHT', logo: require('../assets/images/enel-logo.png') },
        { id: 'e9', name: 'ENGIE Brasil', logo: require('../assets/images/enel-logo.png') },
        { id: 'e10', name: 'Omega Energia', logo: require('../assets/images/enel-logo.png') },
      ]
    },
    { 
      id: 'water', 
      name: 'Eau', 
      icon: 'water', 
      color: '#1E90FF',
      companies: [
        { id: 'w1', name: 'SABESP', logo: require('../assets/images/enel-logo.png') },
        { id: 'w2', name: 'DESAL', logo: require('../assets/images/enel-logo.png') },
        { id: 'w3', name: 'CAGECE', logo: require('../assets/images/enel-logo.png') },
        { id: 'w4', name: 'COMPESA', logo: require('../assets/images/enel-logo.png') },
        { id: 'w5', name: 'Águas do Brasil', logo: require('../assets/images/enel-logo.png') },
        { id: 'w6', name: 'COPASA', logo: require('../assets/images/enel-logo.png') },
        { id: 'w7', name: 'SANEPAR', logo: require('../assets/images/enel-logo.png') },
        { id: 'w8', name: 'CEDAE', logo: require('../assets/images/enel-logo.png') },
      ]
    },
    { 
      id: 'gas', 
      name: 'Gaz', 
      icon: 'fire', 
      color: '#FF6347',
      companies: [
        { id: 'g1', name: 'Petrobras', logo: require('../assets/images/enel-logo.png') },
        { id: 'g2', name: 'COMGÁS', logo: require('../assets/images/enel-logo.png') },
        { id: 'g3', name: 'CEG', logo: require('../assets/images/enel-logo.png') },
        { id: 'g4', name: 'Gás Natural Fenosa', logo: require('../assets/images/enel-logo.png') },
        { id: 'g5', name: 'Compagas', logo: require('../assets/images/enel-logo.png') },
        { id: 'g6', name: 'Gaspetro', logo: require('../assets/images/enel-logo.png') },
        { id: 'g7', name: 'ENGIE Brasil', logo: require('../assets/images/enel-logo.png') },
        { id: 'g8', name: 'Bahiagás', logo: require('../assets/images/enel-logo.png') },
        { id: 'g9', name: 'Cegás', logo: require('../assets/images/enel-logo.png') },
        { id: 'g10', name: 'Sulgás', logo: require('../assets/images/enel-logo.png') },
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

// Modifiez la fonction handlePayment comme suit :
const handlePayment = async () => {
  if (!selectedBill || !selectedCompany || !billNumber || !accountNumber || !amount) {
    alert('Veuillez remplir tous les champs');
    return;
  }
  if (billNumber.length < 6 || billNumber.length > 15) {
    alert('Le numéro de facture doit contenir entre 6 et 15 chiffres');
    return;
  }
  if (accountNumber.length < 5) {
    alert('Le numéro de compte doit contenir entre 5 et 20 caractères');
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
        utilisateurId: "user123", // Remplacer dynamiquement plus tard
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
            title: "Code OTP pour paiement",
            body: `Votre code OTP est: ${otpCode}`,
            data: { otp: otpCode },
          },
          trigger: null, // Envoi immédiat
        });

        setShowOtpModal(true);
      } else {
        const errorData = await otpResponse.json();
        alert(errorData.message || "Erreur lors de la demande d'OTP");
      }
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Erreur lors de la création de la facture");
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert("Une erreur s'est produite");
  } finally {
    setIsLoading(false);
  }
};
  const handleOtpVerification = async () => {
    if (!otp) {
      alert('Veuillez entrer le code OTP');
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
  
        setReceiptData({
          companyName: company?.name || '',
          billType: bill?.name || '',
          billNumber,
          accountNumber,
          amount,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          transactionId: Math.random().toString(36).substring(2, 10).toUpperCase()
        });
  
        setPaymentSuccess(true);
        setShowOtpModal(false);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "OTP invalide ou expiré");
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert("Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const printReceipt = () => {
    const receiptText = `
      Reçu de paiement
      -------------------------
      Société: ${receiptData.companyName}
      Type: ${receiptData.billType}
      Numéro de facture: ${receiptData.billNumber}
      Numéro de compte: ${receiptData.accountNumber}
      Montant: R$ ${receiptData.amount}
      Date: ${receiptData.date} à ${receiptData.time}
      Transaction: ${receiptData.transactionId}
      
      Merci pour votre paiement!
    `;
    
    alert("Fonction d'impression:\n" + receiptText);
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
        <Text style={styles.headerTitle}>Paiement de Factures</Text>
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
              <Text style={styles.receiptLabel}>Société:</Text>
              <Text style={styles.receiptValue}>{receiptData.companyName}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Type:</Text>
              <Text style={styles.receiptValue}>{receiptData.billType}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Numéro de facture:</Text>
              <Text style={styles.receiptValue}>{receiptData.billNumber}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Numéro de compte:</Text>
              <Text style={styles.receiptValue}>{formatAccountNumber(receiptData.accountNumber)}</Text>

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
          </View>
          
          <TouchableOpacity 
            style={styles.printButton}
            onPress={printReceipt}
          >
            <MaterialCommunityIcons name="printer" size={24} color="#FFF" />
            <Text style={styles.printButtonText}>Imprimer le reçu</Text>
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
          {/* Bill Selection */}
          <Text style={styles.sectionTitle}>Sélectionnez le type de facture</Text>
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
              <Text style={styles.sectionTitle}>Sélectionnez la société</Text>
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
                    Voir plus ({(bills.find(b => b.id === selectedBill)?.companies.length || 0) - 3})
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Bill Number Input */}
          <Text style={styles.sectionTitle}>Numéro de facture (6-15 chiffres)</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="barcode" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Entrez le numéro de facture"
              keyboardType="numeric"
              maxLength={15}
              value={billNumber}
              onChangeText={setBillNumber}
            />
          </View>

          {/* Account Number Input */}
          <Text style={styles.sectionTitle}>Numéro de compte</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="credit-card" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Entrez le numéro de compte"
              keyboardType="default"
              maxLength={20}
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
          </View>

          {/* Amount Input */}
          <Text style={styles.sectionTitle}>Montant à payer (R$)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>R$</Text>
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
              <Text style={styles.paymentButtonText}>Payer maintenant</Text>
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
            <Text style={styles.modalTitle}>Sélectionnez une société</Text>
            
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
              <Text style={styles.closeModalButtonText}>Fermer</Text>
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
            <Text style={styles.modalTitle}>Vérification OTP</Text>
            <Text style={styles.modalSubtitle}>Entrez le code OTP envoyé pour confirmer le paiement</Text>
            
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