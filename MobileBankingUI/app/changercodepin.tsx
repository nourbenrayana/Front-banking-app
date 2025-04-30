import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function ChangePinScreen() {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [reEnterPin, setReEnterPin] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showReEnter, setShowReEnter] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));
   const { t } = useTranslation('changePin');

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleSubmit = () => {
    // Validation logic here
    if (newPin !== reEnterPin) {
      alert(t('errors.mismatch'));
      return;
    }
    if (newPin.length < 4) {
      alert(t('errors.length'));
      return;
    }
    // Submit logic
    alert(t('success'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('title')}</Text>
          <Text style={styles.subtitle}>S{t('subtitle')}</Text>
        </View>

        {/* Old Pin */}
        <View style={styles.card}>
          <Text style={styles.label}>{t('currentPin')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={oldPin}
              onChangeText={setOldPin}
              secureTextEntry={!showOld}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="••••••"
              placeholderTextColor="#95a5a6"
            />
            <TouchableOpacity 
              onPress={() => setShowOld(!showOld)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showOld ? "eye-off" : "eye"}
                size={22}
                color="#3498db"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Pin */}
        <View style={styles.card}>
          <Text style={styles.label}>{t('newPin')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={newPin}
              onChangeText={setNewPin}
              secureTextEntry={!showNew}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="••••••"
              placeholderTextColor="#95a5a6"
            />
            <TouchableOpacity 
              onPress={() => setShowNew(!showNew)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showNew ? "eye-off" : "eye"}
                size={22}
                color="#3498db"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Re-enter New Pin */}
        <View style={styles.card}>
          <Text style={styles.label}>{t('confirmPin')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={reEnterPin}
              onChangeText={setReEnterPin}
              secureTextEntry={!showReEnter}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="••••••"
              placeholderTextColor="#95a5a6"
            />
            <TouchableOpacity 
              onPress={() => setShowReEnter(!showReEnter)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showReEnter ? "eye-off" : "eye"}
                size={22}
                color="#3498db"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Done Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={[
              styles.button,
              (!oldPin || !newPin || !reEnterPin) && styles.buttonDisabled
            ]}
            onPress={handleSubmit}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!oldPin || !newPin || !reEnterPin}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t('update')}</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* PIN Requirements */}
        <View style={styles.requirements}>
          <Text style={styles.requirementText}>{t('items')}
          
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoid: {
    flex: 1,
    padding: 25,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: '#3498db',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: "#2c3e50",
    letterSpacing: 2,
    paddingVertical: 5,
  },
  eyeButton: {
    padding: 5,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowColor: '#bdc3c7',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  requirements: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
  },
  requirementText: {
    color: '#7f8c8d',
    fontSize: 14,
    lineHeight: 22,
  },
});