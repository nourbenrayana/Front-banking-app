// SignUpScreen.tsx
import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, Alert, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useRouter } from "expo-router";
import { useUser } from '../../context/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SignUpScreen() {
  const router = useRouter();
  const { setUserData , userData } = useUser();

  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    idNumber: ''
  });

  const [errors, setErrors] = React.useState({
    fullName: '',
    email: '',
    birthDate: '',
    phone: '',
    idNumber: ''
  });

  const [date, setDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const handleNumberInput = (name: string, value: string) => {
    if (/^\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      setFormData(prev => ({ ...prev, birthDate: formattedDate }));
      setErrors(prev => ({ ...prev, birthDate: '' }));
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    setErrors(prev => ({
      ...prev,
      email: value && !validateEmail(value) ? 'Email must contain @ and a valid domain' : ''
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      email: '',
      birthDate: '',
      phone: '',
      idNumber: ''
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name required';
      isValid = false;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email';
      isValid = false;
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Date of birth required';
      isValid = false;
    }

    if (!/^\d{8,15}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro invalide : 8 à 15 chiffres requis';
      isValid = false;
    }

    if (!/^\d{5,11}$/.test(formData.idNumber)) {
      newErrors.idNumber = 'Numéro invalide (min. 5 chiffres)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all fields correctly.');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.1.29:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        Alert.alert('Error', data.error || 'Error during registration');
        return;
      }
  
      const newUserData = {
        ...formData,
        userId: data.userId,
      };
  
      setUserData(newUserData);
      
      // Log the data you're setting, not the state which might not be updated yet
      console.log("userData envoyé :", newUserData);
  
      Alert.alert('Success', 'Registration successful!');
      router.push("/(auth)/get-started");
  
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Error', 'Unable to contact the server.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          source={require('../../assets/animations/signup-animation.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>SIGN UP</Text>
        <Text style={styles.subtitle}>FOR YOUR ACCOUNT</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#2E86DE" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
          />
        </View>
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#2E86DE" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={handleEmailChange}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#2E86DE" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => handleNumberInput('phone', text)}
            maxLength={15}
          />
        </View>
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <TouchableOpacity 
          style={styles.inputContainer}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#2E86DE" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Date of Birth (DD/MM/YYYY)"
            value={formData.birthDate}
            editable={false}
          />
        </TouchableOpacity>
        {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="card-outline" size={20} color="#2E86DE" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="ID Number (CPF/RG)"
            keyboardType="numeric"
            value={formData.idNumber}
            onChangeText={(text) => handleNumberInput('idNumber', text)}
            maxLength={11}
          />
        </View>
        {errors.idNumber && <Text style={styles.errorText}>{errors.idNumber}</Text>}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleSignUp}>
        <Text style={styles.nextButtonText}>Next</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 25,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    marginBottom: 10,
  },
  animation: {
    width: '80%',
    height: '100%',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E86DE',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#2E86DE',
    fontWeight: '500',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2E86DE',
    marginBottom: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  icon: {
    width: 24,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#2E86DE',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 30,
  },
});