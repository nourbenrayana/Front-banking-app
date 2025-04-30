import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function SignupSuccessScreen() {
  const router = useRouter();
  const { t } = useTranslation("signupSuccess");

  const handleGoToDashboard = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/lotties/success.json')}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{t('accountCreated')}</Text>
          <Text style={styles.subtitle}>
            {t('successMessage')}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleGoToDashboard}
          activeOpacity={0.8}
          accessibilityLabel={t('goToDashboard')}
        >
          <Text style={styles.buttonText}>{t('goToDashboard')}</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  animationContainer: {
    width: 250,
    height: 250,
    marginBottom: 24,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#2E86DE',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    minWidth: 220,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
    fontFamily: 'Inter_600SemiBold',
  },
});