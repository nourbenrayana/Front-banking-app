import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';

const router = useRouter();


const VerificationSuccessScreen = () => {
    const { t } = useTranslation('verification');
  return (
    <View style={styles.container}>
      {/* Section haute avec checkmark et texte principal */}
      <View style={styles.topSection}>
        <View style={styles.circleIcon}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <Text style={styles.successTitle}>{t('verificationSuccess')}</Text>
        <Text style={styles.successMessage}>{t('congratsMessage')}</Text>
      </View>

      {/* Section médiane avec l'image de vérification */}
      <View style={styles.middleSection}>
        <Image 
          source={require('../../assets/images/verification.png')}
          style={styles.verificationImage}
          resizeMode="contain"
        />
      </View>

      {/* Bouton en bas */}
      <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push("/(auth)/BankInfoScreen")}
        >
          <Text style={styles.continueButtonText}>{t('continue')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'space-between'
  },
  topSection: {
    alignItems: 'center',
    marginTop: 40
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  checkmark: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold'
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 10,
    textAlign: 'center'
  },
  successMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
    marginBottom: 20
  },
  verificationImage: {
    width: 300,
    height: 200,
    marginBottom: 20
  },
  continueButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  }
});

export default VerificationSuccessScreen;