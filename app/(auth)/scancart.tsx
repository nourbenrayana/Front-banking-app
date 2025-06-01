import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next'; // ➔ i18n import
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

const PassportScanScreen = () => {
  const { t } = useTranslation('scanCard'); // ➔ i18n hook
  const router = useRouter(); // ➔ router hook

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('passportScan.title')}</Text>
        <Text style={styles.instructions}>
          {t('passportScan.instructions')}
        </Text>
      </View>

      {/* Animation */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require('../../assets/animations/Main Scene.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      {/* Scan Button */}
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={() => router.push("/(auth)/cincamera")}
      >
        <Text style={styles.scanButtonText}>{t('passportScan.scanButton')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  animation: {
    width: width * 0.9,
    height: height * 0.6,
  },
  scanButton: {
    backgroundColor: '#1E90FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PassportScanScreen;
