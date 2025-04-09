import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useRouter } from "expo-router";
const router = useRouter();

export default function SignUpScreen() {
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    idNumber: ''
  });

  const [errors, setErrors] = React.useState({
    email: '',
    birthDate: '',
    phone: '',
    idNumber: ''
  });

  const handleNumberInput = (name: string, value: string) => {
    if (/^\d*$/.test(value)) {
      setFormData(prev => ({...prev, [name]: value}));
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const handleDateInput = (value: string) => {
    // Formatage automatique DD/MM/YYYY
    let formatted = value.replace(/[^0-9]/g, '');
    
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
    }
    if (formatted.length > 5) {
      formatted = formatted.slice(0, 5) + '/' + formatted.slice(5, 9);
    }
    
    setFormData(prev => ({...prev, birthDate: formatted}));
    
    // Validation du format complet
    if (formatted.length === 10) {
      const [day, month, year] = formatted.split('/');
      const isValidDate = !isNaN(new Date(`${year}-${month}-${day}`).getTime());
      setErrors(prev => ({
        ...prev,
        birthDate: isValidDate ? '' : 'Date invalide'
      }));
    } else {
      setErrors(prev => ({...prev, birthDate: ''}));
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({...prev, email: value}));
    setErrors(prev => ({
      ...prev,
      email: value && !validateEmail(value) ? 'Email doit contenir @ et un domaine valide' : ''
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      birthDate: '',
      phone: '',
      idNumber: ''
    };

    // Validation email
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email invalide';
      isValid = false;
    }

    // Validation date de naissance
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.birthDate)) {
      newErrors.birthDate = 'Format DD/MM/YYYY requis';
      isValid = false;
    }

    // Validation téléphone
    if (!formData.phone || formData.phone.length < 8) {
      newErrors.phone = 'Numéro invalide (min 8 chiffres)';
      isValid = false;
    }

    // Validation carte d'identité
    if (!formData.idNumber || formData.idNumber.length < 5) {
      newErrors.idNumber = 'Numéro invalide (min 5 chiffres)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form data submitted:', formData);
      Alert.alert('Succès', 'Inscription réussie!');
      // Soumission au backend ici
    } else {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animation Lottie */}
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
        {/* Champ Nom complet */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#2E86DE" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={formData.fullName}
            onChangeText={(text) => setFormData(prev => ({...prev, fullName: text}))}
          />
        </View>

        {/* Champ Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#2E86DE" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder="Email (ex: user@example.com)"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={handleEmailChange}
          />
        </View>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        {/* Champ Téléphone */}
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#2E86DE" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder="Phone Number "
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => handleNumberInput('phone', text)}
            maxLength={15}
          />
        </View>
        {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

        {/* Champ Date de naissance */}
        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={20} color="#2E86DE" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder="Date of Birth (DD/MM/YYYY)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={formData.birthDate}
            onChangeText={handleDateInput}
            maxLength={10}
          />
        </View>
        {errors.birthDate ? <Text style={styles.errorText}>{errors.birthDate}</Text> : null}

        {/* Champ Carte d'identité */}
        <View style={styles.inputContainer}>
          <Ionicons name="card-outline" size={20} color="#2E86DE" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder="ID Card Number"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={formData.idNumber}
            onChangeText={(text) => handleNumberInput('idNumber', text)}
            maxLength={20}
          />
        </View>
        {errors.idNumber ? <Text style={styles.errorText}>{errors.idNumber}</Text> : null}
      </View>

      {/* Bouton Next */}
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => router.push("/(tabs)/Get Started")}
      >
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