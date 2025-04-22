import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const SignupLogin = () => {
  const router = useRouter();
  const [scaleValue] = useState(new Animated.Value(1));
  const [logoAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animation du logo au chargement
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.spring(logoAnim, {
        toValue: 1,
        friction: 3,
        tension: 10,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const logoScale = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1]
  });

  const logoOpacity = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, {
        transform: [{ scale: logoScale }],
        opacity: logoOpacity
      }]}>
        <Image 
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      
      <Text style={styles.title}>Welcome to Caixa Bank</Text>
      <Text style={styles.subtitle}>Your financial freedom starts here</Text>
      
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>Please use your login details to connect</Text>
      </View>

      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity 
          style={[styles.loginButton, styles.faceIdButton]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="face-recognition" size={24} color="white" />
          <Text style={styles.buttonText}>Login with Face ID</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity 
        style={[styles.loginButton, styles.passcodeButton]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => router.push('/(auth)/LoginPinScreen')} 
        activeOpacity={0.8}
      >
        <MaterialIcons name="password" size={24} color="white" />
        <Text style={styles.buttonText}>Login with PassCode</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
      </TouchableOpacity>

      </Animated.View>

      <TouchableOpacity 
        onPress={() => router.push('/(auth)/signup')}
        style={styles.signupContainer}
      >
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
  },
  logoContainer: {
    marginBottom: 20,
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    color: '#003366',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 40,
    textAlign: 'center',
  },
  instructionContainer: {
    marginBottom: 30,
    width: '100%',
  },
  instructionText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: '100%',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faceIdButton: {
    backgroundColor: '#2E86DE',
  },
  passcodeButton: {
    backgroundColor: '#003366',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 15,
  },
  signupContainer: {
    marginTop: 30,
    padding: 10,
  },
  signupText: {
    fontSize: 15,
    color: '#6c757d',
  },
  signupLink: {
    color: '#2E86DE',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default SignupLogin;