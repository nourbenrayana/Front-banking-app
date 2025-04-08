import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';

const Payment = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>('TN');
  const [country, setCountry] = useState<Country | null>(null);

  const handleAdd = () => {
    if (!bankAccount) {
      Alert.alert('Error', 'Bank account (RIB) is required.');
      return;
    }

    router.push({
      pathname: "/send-money",
      params: {
        nomComplet: fullName,
        rib: bankAccount,
        telephone: phoneNumber,
        countryCode
      },
    } as any);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Recipient</Text>
      </View>

      {/* Full Name */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <FontAwesome name="user" size={18} color="#6B7280" style={styles.icon} />
          <Text style={styles.sectionTitle}>Full Name</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Account holder's full name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* Bank Account */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="bank" size={18} color="#6B7280" style={styles.icon} />
          <Text style={styles.sectionTitle}>Bank Account (RIB) *</Text>
        </View>
        <TextInput
          style={styles.input}
          value={bankAccount}
          onChangeText={setBankAccount}
          keyboardType="numeric"
          placeholder="Enter RIB number"
        />
      </View>

      {/* Phone Number */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="call-outline" size={18} color="#6B7280" style={styles.icon} />
          <Text style={styles.sectionTitle}>Phone Number (Optional)</Text>
        </View>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholder="Enter phone number"
        />
      </View>

      {/* Country Picker */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="globe-outline" size={18} color="#6B7280" style={styles.icon} />
          <Text style={styles.sectionTitle}>Country</Text>
        </View>
        <View style={styles.countryPicker}>
          <CountryPicker
            withFilter
            withFlag
            withCountryNameButton
            withAlphaFilter
            withCallingCode
            countryCode={countryCode}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCountry(country);
            }}
          />
          <Text style={styles.countryText}>
            {typeof country?.name === 'object' ? country.name.common : 'Select a country'}
          </Text>
        </View>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={[styles.confirmButton, !bankAccount && styles.disabledButton]}
        onPress={handleAdd}
        disabled={!bankAccount}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmButtonText}>Add</Text>
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
    marginBottom: 12,
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
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    color: "#111827",
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  countryText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
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

export default Payment;
