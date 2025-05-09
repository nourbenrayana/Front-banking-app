import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next'; // Ajouté

const { width } = Dimensions.get('window');

const passportImage = require('../../assets/images/passport.png');
const selfieImage = require('../../assets/images/selfie.png');

const OnboardingScreen = () => {
  const { t } = useTranslation('getStarted'); // Ajouté

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Titre et sous-titre en haut */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('onboarding.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
      </View>

      {/* Rectangle des étapes centré */}
      <View style={styles.stepsCard}>
        {/* Colonne des icônes */}
        <View style={styles.iconsColumn}>
          <Image source={passportImage} style={styles.stepImage} />
          <View style={styles.verticalDottedLine} />
          <Image source={selfieImage} style={styles.stepImage} />
        </View>

        {/* Colonne des textes */}
        <View style={styles.textsColumn}>
          <Text style={styles.stepText}>{t('onboarding.step1')}</Text>
          <View style={styles.textSpacer} />
          <Text style={styles.stepText}>{t('onboarding.step2')}</Text>
          <View style={styles.textSpacer} />
        </View>
      </View>

      {/* Conteneur flexible pour centrer le bouton */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => router.push("/(auth)/choixdedocument")}
        >
          <Text style={styles.nextButtonText}>{t('onboarding.button')}</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 25,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  stepsCard: {
    backgroundColor: 'white',
    width: width * 0.85,
    borderRadius: 12,
    padding: 30,
    flexDirection: 'row',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 100,
    marginBottom: 20,
  },
  iconsColumn: {
    alignItems: 'center',
    marginRight: 25,
  },
  stepImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  verticalDottedLine: {
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
    borderStyle: 'dashed',
    height: 50,
    marginVertical: 8,
  },
  textsColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  stepText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 15,
    lineHeight: 32,
  },
  textSpacer: {
    height: 50,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
    width: '100%',
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
    width: width * 0.85,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default OnboardingScreen;
