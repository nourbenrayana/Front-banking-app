import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useUser } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import config from '@/utils/config';
import { Picker } from '@react-native-picker/picker';

export default function ContactUsScreen() {
  const { userData } = useUser();
  const [message, setMessage] = useState('');
  const [reclamationType, setReclamationType] = useState('general');
  const { t } = useTranslation('contact');

  const reclamationTypes = [
    { value: 'General', label: t('General') },
    { value: 'Payment', label: t('Payment') },
    { value: 'Transfer', label: t('Transfer') },
    { value: 'Registration', label: t('Registration') },
    { value: 'Account', label: t('Account') },
    { value: 'Other', label: t('Other') },
  ];

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/api/reclamations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message, 
          userId: userData.userId,
          type: reclamationType 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(t('sendButton'), t('success'));
        setMessage('');
        setReclamationType('general');
      } else {
        Alert.alert(t('error'), data.message || t('errorSending'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('errorSending'));
      console.error('Error submitting reclamation:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={32} color="#2E86DE" />
        <Text style={styles.title}>{t('title')}</Text>
        <Text style={styles.subtitle}>{t('subtitle')}</Text>
      </View>

      {/* Contact Form */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('sendMessage')}</Text>
        
        {/* Champ Nom */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('labels.fullName')}</Text>
          <View style={[styles.input, styles.disabledInput]}>
            <Text style={styles.disabledText}>{userData.fullName}</Text>
          </View>
        </View>
        
        {/* Champ Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('labels.email')}</Text>
          <View style={[styles.input, styles.disabledInput]}>
            <Text style={styles.disabledText}>{userData.email}</Text>
          </View>
        </View>

        {/* Champ Type de réclamation */}
<View style={styles.inputContainer}>
  <Text style={styles.label}>{t('Reclamation Type')}</Text>
  <View style={styles.pickerWrapper}>
    <Ionicons name="list-circle-outline" size={20} color="#2E86DE" style={styles.pickerIcon} />
    <Picker
      selectedValue={reclamationType}
      onValueChange={(itemValue) => setReclamationType(itemValue)}
      style={styles.pickerModern}
      dropdownIconColor="#2E86DE"
    >
      {reclamationTypes.map((type) => (
        <Picker.Item key={type.value} label={type.label} value={type.value} />
      ))}
    </Picker>
  </View>
</View>

        
        {/* Champ Message */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('labels.message')}</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            placeholder={t('messagePlaceholder')}
            placeholderTextColor="#95a5a6"
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, (!message || !reclamationType) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!message || !reclamationType}
        >
          <Text style={styles.submitButtonText}>{t('sendButton')}</Text>
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Direct Contact */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('directContact')}</Text>
        
        <TouchableOpacity 
          style={styles.contactMethod}
          onPress={() => Linking.openURL('tel:+ +34 938 87 25 25')}
        >
          <View style={styles.contactIcon}>
            <Ionicons name="call" size={20} color="#2E86DE" />
          </View>
          <View>
            <Text style={styles.contactType}>{t('contactMethods.phone')}</Text>
            <Text style={styles.contactValue}>+34 938 87 25 25</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactMethod}
          onPress={() => Linking.openURL('mailto:www.CaixaBank.com ')}
        >
          <View style={styles.contactIcon}>
            <Ionicons name="mail" size={20} color="#2E86DE" />
          </View>
          <View>
            <Text style={styles.contactType}>{t('contactMethods.email')}</Text>
            <Text style={styles.contactValue}>www.CaixaBank.com </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactMethod}
          onPress={() => Linking.openURL('https://wa.me/33123456789')}
        >
          <View style={styles.contactIcon}>
            <Ionicons name="logo-whatsapp" size={20} color="#2E86DE" />
          </View>
          <View>
            <Text style={styles.contactType}>{t('contactMethods.whatsapp')}</Text>
            <Text style={styles.contactValue}>+34 938 87 25 25</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Address */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('agency')}</Text>
        
        <View style={styles.contactMethod}>
          <View style={styles.contactIcon}>
            <Ionicons name="location" size={20} color="#2E86DE" />
          </View>
          <View>
            <Text style={styles.contactType}>{t('contactMethods.address')}</Text>
            <Text style={styles.contactValue}>
              São Paulo RO{"\n"}
              Av. Presidente Juscelino {"\n"}Kubitschek 1327 18thFloor, {"\n"}
              São Paulo,  Brazil.
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => Linking.openURL('https://maps.app.goo.gl/...')}
        >
          <Ionicons name="map" size={20} color="#2E86DE" />
          <Text style={styles.mapButtonText}>{t('viewMap')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86DE',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A7EBC',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E86DE',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#5A7EBC',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E1ECFF',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#2C3E50',
  },
  disabledInput: {
    backgroundColor: '#F0F4F9',
    borderColor: '#E1ECFF',
  },
  disabledText: {
    color: '#2C3E50',
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2E86DE',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 10,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1ECFF',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactType: {
    fontSize: 14,
    color: '#5A7EBC',
    marginBottom: 3,
  },
  contactValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    color: '#2E86DE',
    fontWeight: '500',
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
 pickerContainer: {
  backgroundColor: '#F8FAFF',
  borderWidth: 1,
  borderColor: '#E1ECFF',
  borderRadius: 8,
  paddingHorizontal: 12,
  justifyContent: 'center',
  height: 60,
},

pickerContainerFocused: { // À appliquer lorsque le picker est actif
  borderColor: '#2E86DE',
  shadowColor: '#2E86DE66',
},
picker: {
  color: '#1E293B',
  fontSize: 16,
  fontWeight: '500',
  width: '100%',
  height: '100%',
},
// Style pour les items du Picker (Android/iOS)
pickerItem: {
  fontSize: 16,
  color: '#1E293B',
},
pickerItemAndroid: {
  fontSize: 16,
  color: '#1E293B',
  paddingVertical: 12,
},

pickerWrapper: {
  position: 'relative',
  backgroundColor: '#F8FAFF',
  borderWidth: 1,
  borderColor: '#E1ECFF',
  borderRadius: 8,
  paddingLeft: 36, // pour l'icône
  justifyContent: 'center',
  height: 60,
},

pickerModern: {
  color: '#1E293B',
  fontSize: 16,
  fontWeight: '500',
  width: '100%',
  height: '100%',
},

pickerIcon: {
  position: 'absolute',
  left: 12,
  top: '50%',
  marginTop: -10, // pour centrer verticalement
  zIndex: 1,
},

});