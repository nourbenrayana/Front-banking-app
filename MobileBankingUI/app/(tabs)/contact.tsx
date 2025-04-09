import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

export default function ContactUsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Here you would add your form submission logic
    Alert.alert('Message sent', 'We will contact you soon!');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={32} color="#2E86DE" />
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.subtitle}>We are here to help</Text>
      </View>

      {/* Contact Form */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Send us a message</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#95a5a6"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="your@email.com"
            placeholderTextColor="#95a5a6"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            placeholder="Describe your request..."
            placeholderTextColor="#95a5a6"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!name || !email || !message}
        >
          <Text style={styles.submitButtonText}>Send Message</Text>
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Direct Contact */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Direct Contact</Text>
        
        <TouchableOpacity 
          style={styles.contactMethod}
          onPress={() => Linking.openURL('tel:+33123456789')}
        >
          <View style={styles.contactIcon}>
            <Ionicons name="call" size={20} color="#2E86DE" />
          </View>
          <View>
            <Text style={styles.contactType}>Phone</Text>
            <Text style={styles.contactValue}>+33 1 23 45 67 89</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactMethod}
          onPress={() => Linking.openURL('mailto:support@votrebank.com')}
        >
          <View style={styles.contactIcon}>
            <Ionicons name="mail" size={20} color="#2E86DE" />
          </View>
          <View>
            <Text style={styles.contactType}>Email</Text>
            <Text style={styles.contactValue}>support@votrebank.com</Text>
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
            <Text style={styles.contactType}>WhatsApp</Text>
            <Text style={styles.contactValue}>+33 1 23 45 67 89</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Address */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Our Agency</Text>
        
        <View style={styles.contactMethod}>
          <View style={styles.contactIcon}>
            <Ionicons name="location" size={20} color="#2E86DE" />
          </View>
          <View>
            <Text style={styles.contactType}>Address</Text>
            <Text style={styles.contactValue}>
              123 Avenue des Champs-Élysées{"\n"}
              75008 Paris, France
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => Linking.openURL('https://maps.app.goo.gl/...')}
        >
          <Ionicons name="map" size={20} color="#2E86DE" />
          <Text style={styles.mapButtonText}>View on Map</Text>
        </TouchableOpacity>
      </View>

      {/* Opening Hours */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Opening Hours</Text>
        
        <View style={styles.scheduleItem}>
          <Text style={styles.day}>Monday - Friday</Text>
          <Text style={styles.hours}>9:00 AM - 6:00 PM</Text>
        </View>
        
        <View style={styles.scheduleItem}>
          <Text style={styles.day}>Saturday</Text>
          <Text style={styles.hours}>9:00 AM - 1:00 PM</Text>
        </View>
        
        <View style={styles.scheduleItem}>
          <Text style={styles.day}>Sunday</Text>
          <Text style={styles.hours}>Closed</Text>
        </View>
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
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1ECFF',
  },
  day: {
    fontSize: 16,
    color: '#2C3E50',
  },
  hours: {
    fontSize: 16,
    color: '#2E86DE',
    fontWeight: '500',
  },
});
