import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';

import { useRouter } from "expo-router";
const router = useRouter();

const { width, height } = Dimensions.get('window');

const PassportScanScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Scan cart</Text>
        <Text style={styles.instructions}>
          Now place your phone directly on top of your passport
          {'\n'}so we can connect securely
        </Text>
      </View>

      {/* Conteneur de l'animation Lottie */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require('../../assets/animations/Main Scene.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      {/* Bouton de scan */}
      <TouchableOpacity style={styles.scanButton}
      onPress={() => router.push("/(tabs)/cincamera")}>
        <Text style={styles.scanButtonText}>Scan Now</Text>
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