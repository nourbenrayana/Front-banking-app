import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ChangePinScreen = () => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChangePin = () => {
    if (!currentPin || !newPin || !confirmPin) {
      Alert.alert('Missing fields', 'Please fill in all fields');
      return;
    }

    if (newPin !== confirmPin) {
      Alert.alert('Error', 'PIN codes do not match');
      return;
    }

    if (newPin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert('Success', 'Your PIN has been changed successfully');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Change PIN</Text>
        <Text style={styles.subtitle}>For your security, choose a PIN that's hard to guess</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Current PIN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current PIN</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={24} color="#1E90FF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="••••"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              keyboardType="number-pad"
              maxLength={4}
              value={currentPin}
              onChangeText={setCurrentPin}
            />
          </View>
        </View>

        {/* New PIN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New PIN</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="#1E90FF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="••••"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              keyboardType="number-pad"
              maxLength={4}
              value={newPin}
              onChangeText={setNewPin}
            />
          </View>
        </View>

        {/* Confirm PIN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New PIN</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="#1E90FF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="••••"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              keyboardType="number-pad"
              maxLength={4}
              value={confirmPin}
              onChangeText={setConfirmPin}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, isProcessing && styles.buttonDisabled]}
          onPress={handleChangePin}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>
            {isProcessing ? 'Processing...' : 'Save New PIN'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E90FF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  formContainer: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#1A202C',
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#1E90FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePinScreen;