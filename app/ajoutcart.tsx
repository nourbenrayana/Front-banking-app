// app/(tabs)/ajoutduncarte.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useUser } from '@/context/UserContext'; 
import config from '@/utils/config';
import { useRouter } from "expo-router";
import { useWebSocket } from '@/hooks/useWebSocket';

type FormData = {
  cardType: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  reasonForCard: string;
};

type CardOption = {
  label: string;
  value: string;
};

const CardApplication = () => {
  const { userData } = useUser();
  const router = useRouter();
  const { notification } = useWebSocket();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    cardType: 'ELO_CREDIT',
    firstName: '',
    lastName: '',
    birthDate: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    email: '',
    reasonForCard: ''
  });
  // Gérer les notifications reçues
  useEffect(() => {
    if (notification) {
      // Une notification peut être affichée ici si nécessaire
      console.log('Notification reçue:', notification);
    }
  }, [notification]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      firstName: userData.fullName,
      birthDate: userData.birthDate,
      phone: userData.phone,
      email: userData.email,
    }));
  }, [userData]);

  // Caixa Bank Brazil card types
  const cardOptions: CardOption[] = [
    { label: 'ELO Credit Card', value: 'ELO_CREDIT' },
    { label: 'ELO Debit Card', value: 'ELO_DEBIT' },
    { label: 'Visa Infinite', value: 'VISA_INFINITE' },
    { label: 'Visa Platinum', value: 'VISA_PLATINUM' },
    { label: 'Visa Gold', value: 'VISA_GOLD' },
    { label: 'Mastercard Black', value: 'MASTERCARD_BLACK' },
    { label: 'Caixa Fácil Card', value: 'CAIXA_FACIL' }
  ];

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const validateForm = (): boolean => {
  if (!formData.firstName.trim()) {
    Alert.alert('Error', 'Full name is required');
    return false;
  }
  return true;
};

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`${config.BASE_URL}/api/submit_card_request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: `users/${userData.userId}` 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success', 
          'Card application submitted successfully',
          [{ text: 'OK', onPress: resetForm }]
        );
        router.push("/(tabs)");
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      let errorMessage = 'Failed to submit application';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Submission error:', error);
      Alert.alert('Error', errorMessage);
    }
  };
const confirmSubmit = () => {
  setShowModal(true);
};



  const resetForm = () => {
    setFormData({
      cardType: 'ELO_CREDIT',
      firstName: '',
      lastName: '',
      birthDate: '',
      address: '',
      city: '',
      zipCode: '',
      phone: '',
      email: '',
      reasonForCard: ''
    });
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Caixa Bank Card Application</Text>
      
      <Text style={styles.sectionTitle}>Card Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.cardType}
          onValueChange={(itemValue) => handleChange('cardType', itemValue)}
          style={styles.picker}
          dropdownIconColor="#2E86DE"
        >
          {cardOptions.map((option) => (
            <Picker.Item 
              key={option.value} 
              label={option.label} 
              value={option.value} 
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.sectionTitle}>Personal Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        value={formData.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
        returnKeyType="next"
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Birth Date (DD/MM/YYYY)"
        value={formData.birthDate}
        onChangeText={(text) => handleChange('birthDate', text)}
        keyboardType="numbers-and-punctuation"
        returnKeyType="next"
        editable={false}
      />

      <Text style={styles.sectionTitle}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Street Address"
        value={formData.address}
        onChangeText={(text) => handleChange('address', text)}
        returnKeyType="next"
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={formData.city}
        onChangeText={(text) => handleChange('city', text)}
        returnKeyType="next"
      />
      <TextInput
        style={styles.input}
        placeholder="ZIP Code"
        value={formData.zipCode}
        onChangeText={(text) => handleChange('zipCode', text)}
        keyboardType="number-pad"
        returnKeyType="next"
      />

      <Text style={styles.sectionTitle}>Contact Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
        returnKeyType="next"
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        editable={false}
      />

      <Text style={styles.sectionTitle}>Reason for Additional Card</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Please explain why you need an additional card"
        value={formData.reasonForCard}
        onChangeText={(text) => handleChange('reasonForCard', text)}
        multiline={true}
        numberOfLines={4}
        returnKeyType="done"
      />
      {showModal && (
  <View style={styles.modalOverlay}>
    <View style={styles.alertContainer}>
      <Text style={styles.alertTitle}>Confirm Submission</Text>
      <Text style={styles.alertMessage}>
        Do you want to submit your card application?
      </Text>
      <View style={styles.alertButtons}>
        <TouchableOpacity
          style={[styles.alertButton, styles.cancelButton]}
          onPress={() => setShowModal(false)}
        >
          <Text style={{ color: '#64748B', textAlign: 'center' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.alertButton, { backgroundColor: '#2E86DE' }]}
          onPress={() => {
            setShowModal(false);
            handleSubmit();
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)}


      <TouchableOpacity 
      style={styles.submitButton} 
      onPress={confirmSubmit} 
      activeOpacity={0.8}
    >
      <Text style={styles.submitButtonText}>Submit Application</Text>
    </TouchableOpacity>

      <Text style={styles.note}>* Required fields</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f9ff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2E86DE',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#2E86DE',
  },
  input: {
    height: 50,
    borderColor: '#d3e3ff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderColor: '#d3e3ff',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#2E86DE',
  },
  submitButton: {
    backgroundColor: '#2E86DE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  modalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
},
    alertContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E86DE',
    marginBottom: 8,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 16,
    color: '#5A5A5A',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  alertButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F7FA',
    color: '#64748B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

});

export default CardApplication;