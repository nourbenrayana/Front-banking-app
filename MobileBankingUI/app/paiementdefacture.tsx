import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

type BillId = 'electricity' | 'water' | 'gas';
type BillIcon = 'flash' | 'water' | 'fire';

type Company = {
  id: string;
  name: string;
  logo: any; // Vous pouvez remplacer par le type approprié pour vos images
};

type Bill = {
  id: BillId;
  name: string;
  icon: BillIcon;
  color: string;
  companies: Company[];
};

const BillPaymentScreen = () => {
  const [selectedBill, setSelectedBill] = useState<BillId | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [billNumber, setBillNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const bills: Bill[] = [
    { 
      id: 'electricity', 
      name: 'Électricité', 
      icon: 'flash', 
      color: '#FFD700',
      companies: [
        { id: '1', name: 'Light S.A.', logo: require('../../assets/images/light-logo.png') },
        { id: '2', name: 'Enel Distribuição', logo: require('../../assets/images/enel-logo.png') },
        { id: '3', name: 'Cemig', logo: require('../../assets/images/cemig-logo.png') },
      ]
    },
    { 
      id: 'water', 
      name: 'Eau', 
      icon: 'water', 
      color: '#1E90FF',
      companies: [
        { id: '4', name: 'CEDAE', logo: require('../../assets/images/cedae-logo.png') },
        { id: '5', name: 'Sabesp', logo: require('../../assets/images/sabesp-logo.png') },
        { id: '6', name: 'Copasa', logo: require('../../assets/images/copasa-logo.png') },
      ]
    },
    { 
      id: 'gas', 
      name: 'Gaz', 
      icon: 'fire', 
      color: '#FF6347',
      companies: [
        { id: '7', name: 'Comgás', logo: require('../../assets/images/comgas-logo.png') },
        { id: '8', name: 'Bahiagás', logo: require('../../assets/images/bahiagas-logo.png') },
        { id: '9', name: 'SCGás', logo: require('../../assets/images/scgas-logo.png') },
      ]
    },
  ];

  const handlePayment = () => {
    if (!selectedBill || !selectedCompany || !billNumber || !amount) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    if (billNumber.length < 6 || billNumber.length > 15) {
      alert('Le numéro de facture doit contenir entre 6 et 15 chiffres');
      return;
    }

    // Simuler un paiement réussi
    const bill = bills.find(b => b.id === selectedBill);
    const company = bill?.companies.find(c => c.id === selectedCompany);
    
    setReceiptData({
      companyName: company?.name,
      billType: bill?.name,
      billNumber,
      amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      transactionId: Math.random().toString(36).substring(2, 10).toUpperCase()
    });
    
    setPaymentSuccess(true);
  };

  const printReceipt = () => {
    // Ici vous pourriez implémenter l'impression réelle
    // Pour l'exemple, nous allons simplement ouvrir une fenêtre de partage
    const receiptText = `
      Reçu de paiement
      -------------------------
      Société: ${receiptData.companyName}
      Type: ${receiptData.billType}
      Numéro: ${receiptData.billNumber}
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
    setAmount('');
    setPaymentSuccess(false);
    setReceiptData(null);
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
            source={require('../../assets/animations/validation.json')}
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
              <Text style={styles.receiptLabel}>Numéro:</Text>
              <Text style={styles.receiptValue}>{receiptData.billNumber}</Text>
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
                {bills.find(b => b.id === selectedBill)?.companies.map((company) => (
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
          >
            <Text style={styles.paymentButtonText}>Payer maintenant</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor:"#F5F9FF", // Thème bleu clair
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  flagIcon: {
    width: 30,
    height: 20,
    marginRight: 10,
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86DE', // Bleu foncé
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E86DE', // Bleu foncé
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
    marginBottom: 20,
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectedCompanyCard: {
    borderColor: '#1A4B8C',
    backgroundColor: '#E6F2FF',
  },
  companyLogo: {
    width: 40,
    height: 40,
    marginRight: 15,
    resizeMode: 'contain',
  },
  companyName: {
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#2E86DE', // Bleu foncé
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
  recentPayments: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  paymentDate: {
    fontSize: 14,
    color: '#666',
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
});

export default BillPaymentScreen;