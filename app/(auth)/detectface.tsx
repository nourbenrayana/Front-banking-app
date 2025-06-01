import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const SelfieVerificationScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Take Selfie</Text>
        <Text style={styles.subtitle}>
          We use your selfie to compare with your passport photo
        </Text>

        {/* Animation Lottie */}
        <LottieView
          source={require('../../assets/animations/scanface.json')}
          autoPlay
          loop
          style={styles.selfieAnimation}
        />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <View style={styles.instructionItem}>
          <Text style={styles.number}>1</Text>
          <View style={styles.instructionTextContainer}>
            <Text style={styles.instructionTitle}>Good lighting</Text>
            <Text style={styles.instructionDetail}>
              Make sure you are in a well lit area and both ears are uncovered
            </Text>
          </View>
        </View>

        <View style={styles.instructionItem}>
          <Text style={styles.number}>2</Text>
          <View style={styles.instructionTextContainer}>
            <Text style={styles.instructionTitle}>Look straight</Text>
            <Text style={styles.instructionDetail}>
              Hold your phone at eye level and look straight to the camera
            </Text>
          </View>
        </View>
      </View>

      {/* Bouton déplacé au bas */}
      <View style={styles.footer}>
      <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => router.push("../(auth)/facecamera")}
        >
          <Text style={styles.cameraButtonText}>Open Camera</Text>
      </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 15,
  },
  selfieAnimation: {
    width: width * 0.7,
    height: 200,
    marginBottom: 15,
  },
  instructionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  number: {
    color: '#1E90FF',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
    minWidth: 20,
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  instructionDetail: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  footer: {
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: '#1E90FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SelfieVerificationScreen;