import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const Payment = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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
      },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>ADD RECIPIENT</Text>
          <Text style={styles.subtitle}>Enter Payment Details</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={20} color="#2E86DE" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor="#999"
            />
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Bank Account */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="bank" size={20} color="#2E86DE" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Bank Account (RIB) *"
              keyboardType="numeric"
              value={bankAccount}
              onChangeText={setBankAccount}
              placeholderTextColor="#999"
            />
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#2E86DE" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number (optional)"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.addButton, !bankAccount && styles.disabledButton]}
            onPress={handleAdd}
            disabled={!bankAccount}
          >
            <Text style={styles.addButtonText}>Add</Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
  header: {
    marginTop:50,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E86DE',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#2E86DE',
    fontWeight: '500',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderColor: '#2E86DE',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    paddingVertical: Platform.OS === 'ios' ? 2 : 0,
  },
  icon: {
    width: 24,
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#2E86DE',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#B0C4DE',
  },
});

export default Payment;