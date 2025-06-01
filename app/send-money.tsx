import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native"; 
import animationSource from "../assets/lotties/send-money.json";
import { useUser } from "../context/UserContext"; 
import config from '../utils/config';
import { useRouter } from "expo-router";
import { useWebSocket } from "@/hooks/useWebSocket";

const currencyList = ["TND", "BRL", "EUR", "USD", "GBP", "CHF", "SAR", "CAD", "AED", "SEK"];

const SendMoney = () => {
  const { nomComplet, rib } = useLocalSearchParams();
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("TND");
  const [modalVisible, setModalVisible] = useState(false);
  const { accountData, setAccountData, userData } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { isSocketReady } = useWebSocket();


  const handleConfirm = async () => {
    setIsProcessing(true);
    
    if (!isSocketReady) {
      Alert.alert(
        "Connexion en cours",
        "Veuillez patienter pendant que nous établissons la connexion sécurisée...",
        [
          {
            text: "OK",
            onPress: () => setIsProcessing(false),
          },
        ]
      );
      return;
    }
    if (!amount) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }
  
    if (isNaN(parseFloat(amount))) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
  
    try {
      const montant = parseFloat(amount);
  
      const response = await fetch(`${config.BASE_URL}/api/transactions/virement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          montant,
          compteExpediteur: accountData.accountId,
          numeroCompteDestinataire: rib,
        }),
      });
  
      const data = await response.json();
  
      console.log("Server response:", data); // Ajoutez ce log
  
      if (!response.ok) {
        Alert.alert("Error", data.message || `An error occurred (Status: ${response.status})`);
        return;
      }
  
  
  
      // ✅ Mettre à jour le solde localement
      setAccountData({
        ...accountData,
        balance: accountData.balance - montant,
      });
  
      Alert.alert("Success", "Transfer completed successfully!", [
        {
          text: "OK",
          onPress: () => {
            router.replace({
              pathname: "/(tabs)",
              params: { userId: userData.userId },
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Transfer error:", error);
      Alert.alert("Error", "Failed to complete transfer. Please try again later.");
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <LottieView
        source={animationSource}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.title}>SEND MONEY</Text>
      <Text style={styles.subtitle}>Transfer details</Text>

      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Recipient Card */}
        <View style={styles.infoContainer}>
          <FontAwesome name="user" size={20} color="#2E86DE" style={styles.icon} />
          <Text style={styles.infoText}>{nomComplet}</Text>
        </View>

        <View style={styles.infoContainer}>
          <MaterialCommunityIcons name="credit-card" size={20} color="#2E86DE" style={styles.icon} />
          <Text style={styles.infoText}>RIB ending with ••••{rib?.slice(-4)}</Text>
        </View>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="cash" size={20} color="#2E86DE" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Currency Selector */}
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name="earth" size={20} color="#2E86DE" style={styles.icon} />
          <Text style={[styles.input, { paddingTop: 2 }]}>{selectedCurrency}</Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#2E86DE" />
        </TouchableOpacity>

        {/* Modal pour sélectionner la devise */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <ScrollView>
                {currencyList.map((currency) => (
                  <TouchableOpacity
                    key={currency}
                    style={[
                      styles.currencyItem,
                      selectedCurrency === currency && styles.selectedCurrencyItem,
                    ]}
                    onPress={() => {
                      setSelectedCurrency(currency);
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.currencyText,
                        selectedCurrency === currency && styles.selectedCurrencyText,
                      ]}
                    >
                      {currency}
                    </Text>
                    {selectedCurrency === currency && (
                      <MaterialCommunityIcons name="check" size={20} color="#2E86DE" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.confirmButton, !amount && styles.disabledButton]}
          onPress={handleConfirm}
          disabled={!amount}
        >
          <Text style={styles.confirmButtonText}>Confirm Transfer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center", // Centre verticalement
  },
  
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E86DE",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#2E86DE",
    fontWeight: "500",
    marginBottom: 25,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2E86DE",
    marginBottom: 20,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  icon: {
    width: 24,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#2E86DE",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    elevation: 3,
    shadowColor: "#2E86DE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#B0C4DE",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "90%",
    maxHeight: "70%",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  selectedCurrencyItem: {
    backgroundColor: "#EAF2FB",
  },
  currencyText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedCurrencyText: {
    color: "#2E86DE",
    fontWeight: "600",
  },
  modalCloseButton: {
    backgroundColor: "#2E86DE",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },
  modalCloseText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  lottie: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: -20,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F9FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#2E86DE",
  },
  
  infoText: {
    fontSize: 16,
    color: "#2E86DE",
    fontWeight: "500",
    marginLeft: 10,
    flexShrink: 1,
  },
  
  
});

export default SendMoney;
