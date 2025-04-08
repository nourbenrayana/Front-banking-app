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
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";

const currencyList = ["TND","BRL", "EUR", "USD", "GBP", "CHF", "SAR", "CAD", "AED", "SEK"];

const SendMoney = () => {
  const { nomComplet, rib } = useLocalSearchParams();
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("TND");
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = () => {
    if (!amount) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }
    Alert.alert(
      "Transfer Confirmed",
      `You've sent ${amount} ${selectedCurrency} to ${nomComplet}`,
      [{ text: "OK", onPress: () => setAmount("") }]
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Send Money</Text>
      </View>

      {/* Recipient Card */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <FontAwesome name="user" size={18} color="#6B7280" style={styles.icon} />
          <Text style={styles.sectionTitle}>Recipient</Text>
        </View>
        <View style={styles.recipientInfo}>
          <Text style={styles.recipientName}>{nomComplet}</Text>
          <View style={styles.ribContainer}>
            <MaterialCommunityIcons name="credit-card" size={16} color="#9CA3AF" />
            <Text style={styles.ribText}>RIB ending with ••••{rib?.slice(-4)}</Text>
          </View>
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="cash" size={18} color="#6B7280" style={styles.icon} />
          <Text style={styles.sectionTitle}>Amount</Text>
        </View>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>{selectedCurrency}</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            autoFocus={true}
          />
        </View>
      </View>

      {/* Currency Selector */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="earth" size={18} color="#6B7280" style={styles.icon} />
          <Text style={styles.sectionTitle}>Currency</Text>
        </View>
        <TouchableOpacity 
          style={styles.currencySelector} 
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.currencyText}>{selectedCurrency}</Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Currency Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <ScrollView style={styles.currencyList}>
              {currencyList.map((currency) => (
                <TouchableOpacity
                  key={currency}
                  style={[
                    styles.currencyItem,
                    selectedCurrency === currency && styles.selectedCurrencyItem
                  ]}
                  onPress={() => {
                    setSelectedCurrency(currency);
                    setModalVisible(false);
                  }}
                  activeOpacity={0.6}
                >
                  <Text style={[
                    styles.currencyItemText,
                    selectedCurrency === currency && styles.selectedCurrencyText
                  ]}>
                    {currency}
                  </Text>
                  {selectedCurrency === currency && (
                    <MaterialCommunityIcons name="check" size={20} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirm Button */}
      <TouchableOpacity 
        style={[
          styles.confirmButton,
          !amount && styles.disabledButton
        ]} 
        onPress={handleConfirm}
        disabled={!amount}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmButtonText}>Confirm Transfer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  icon: {
    marginRight: 8,
  },
  recipientInfo: {
    paddingLeft: 6,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  ribContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ribText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginLeft: 6,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 8,
    marginLeft: 6,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    paddingVertical: 8,
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginLeft: 6,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
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
  currencyList: {
    marginBottom: 16,
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedCurrencyItem: {
    backgroundColor: "#F5F3FF",
  },
  currencyItemText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedCurrencyText: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  modalCloseButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginVertical: 24,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#E5E7EB",
    shadowColor: "transparent",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SendMoney;