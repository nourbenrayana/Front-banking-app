import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CreatePinScreen = () => {
  const [pin, setPin] = useState<string[]>([]);

  const handleNumberPress = (num: string) => {
    if (pin.length < 6) {
      setPin([...pin, num]);
    }
  };

  const handleContinue = () => {
    if (pin.length === 6) {
      // Logique pour traiter le PIN
      console.log('PIN saisi:', pin.join(''));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create PIN</Text>
      <Text style={styles.subtitle}>to gain access to the app after inactivity</Text>
      
      <View style={styles.pinDotsContainer}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View 
            key={i} 
            style={[
              styles.pinDot, 
              i < pin.length ? styles.pinDotFilled : null
            ]} 
          />
        ))}
      </View>

      <View style={styles.numbersContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.numberButton}
            onPress={() => handleNumberPress(num.toString())}
          >
            <Text style={styles.numberText}>{num}</Text>
          </TouchableOpacity>
        ))}
        {/* Bouton 0 */}
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleNumberPress('0')}
        >
          <Text style={styles.numberText}>0</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          pin.length === 6 ? styles.continueButtonActive : null
        ]}
        onPress={handleContinue}
        disabled={pin.length !== 6}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3498db',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  pinDotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498db',
    marginHorizontal: 5,
  },
  pinDotFilled: {
    backgroundColor: '#3498db',
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 30,
  },
  numberButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
  },
  numberText: {
    fontSize: 24,
    color: '#333',
  },
  continueButton: {
    width: '80%',
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#cccccc',
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#3498db',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreatePinScreen;
