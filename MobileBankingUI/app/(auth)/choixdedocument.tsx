import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next'; // ➔ On importe useTranslation

const { width } = Dimensions.get('window');

const ScanSelectionScreen = () => {
  const router = useRouter();
  const { t } = useTranslation('documentSelection'); // ➔ Initialisation de i18n

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('scanSelection.title')}</Text>
      <Text style={styles.subtitle}>{t('scanSelection.subtitle')}</Text>

      <View style={styles.cardsContainer}>
        {/* Passport Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push("/(auth)/scanpassport")}
        >
          <View style={styles.cardIconContainer}>
            <Ionicons name="document" size={40} color="#1E90FF" />
          </View>
          <Text style={styles.cardTitle}>{t('scanSelection.passportTitle')}</Text>
          <Text style={styles.cardDescription}>{t('scanSelection.passportDescription')}</Text>
        </TouchableOpacity>

        {/* ID Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push("/(auth)/scancart")}
        >
          <View style={styles.cardIconContainer}>
            <Ionicons name="card" size={40} color="#1E90FF" />
          </View>
          <Text style={styles.cardTitle}>{t('scanSelection.idCardTitle')}</Text>
          <Text style={styles.cardDescription}>{t('scanSelection.idCardDescription')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  cardIconContainer: {
    backgroundColor: '#E6F2FF',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E90FF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ScanSelectionScreen;
