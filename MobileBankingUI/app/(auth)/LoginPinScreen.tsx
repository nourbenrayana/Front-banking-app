import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import config from '@/utils/config';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';

const LoginPinScreen = () => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState<string[]>([]);
  const router = useRouter();
  const { setUserData, setAccountData } = useUser();


  const handleNumberPress = (num: string) => {
    if (pin.length < 6) {
      setPin([...pin, num]);
    }
  };

  const handleLogin = async () => {
    if (email.trim() === '' || pin.length !== 6) {
      Alert.alert('Missing Info', 'Please enter your email and 6-digit PIN.');
      return;
    }

    try {
      const response = await fetch(`${config.BASE_URL}/api/users/login-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          pin: pin.join('')
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful', data);
        setUserData(data.user);
        setAccountData(data.account);
      
        setTimeout(() => router.push('/(tabs)'), 50);
      }
      else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
        setPin([]);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Unable to connect to server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Email & PIN</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.pinDotsContainer}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={[styles.pinDot, i < pin.length ? styles.pinDotFilled : null]}
          />
        ))}
      </View>

      <View style={styles.numbersContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.numberButton}
            onPress={() => handleNumberPress(num.toString())}
          >
            <Text style={styles.numberText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleNumberPress('0')}
        >
          <Text style={styles.numberText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.numberButton}
            onPress={() => setPin(pin.slice(0, -1))}
            >
            <Text style={styles.numberText}>⌫</Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={[styles.continueButton, pin.length === 6 ? styles.continueButtonActive : null]}
        onPress={handleLogin}
        disabled={pin.length !== 6}
      >
        <Text style={styles.continueButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 10,
    padding: 12,
    marginBottom: 30,
    fontSize: 16,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498db',
    marginHorizontal: 5,
  },
  pinDotFilled: {
    backgroundColor: '#3498db',
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 30,
  },
  numberButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
  },
  numberText: {
    fontSize: 24,
    color: '#333',
  },
  continueButton: {
    width: '80%',
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#cccccc',
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#3498db',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginPinScreen;
