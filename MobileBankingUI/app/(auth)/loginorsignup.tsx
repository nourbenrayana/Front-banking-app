import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated, 
  Easing,
  I18nManager 
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const SignupLogin = () => {
  const router = useRouter();
  const [scaleValue] = useState(new Animated.Value(1));
  const [logoAnim] = useState(new Animated.Value(0));
  const { t, i18n } = useTranslation('login');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  useEffect(() => {
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    I18nManager.forceRTL(lng === 'ar');
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
      {/* Language selector button */}
      <TouchableOpacity 
        style={styles.languageButton}
        onPress={() => setShowLanguagePicker(!showLanguagePicker)}
      >
        <MaterialIcons name="language" size={24} color="#2E86DE" />
      </TouchableOpacity>

      {showLanguagePicker && (
        <View style={styles.languagePicker}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.languageOption}
              onPress={() => {
                changeLanguage(lang.code);
                setShowLanguagePicker(false);
              }}
            >
              <Text style={styles.languageText}>{lang.flag} {lang.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
      
      <Text style={styles.title}>{t('signupLogin.title')}</Text>
      <Text style={styles.subtitle}>{t('signupLogin.subtitle')}</Text>
      
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>{t('signupLogin.instruction')}</Text>
      </View>

      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity 
          style={[styles.loginButton, styles.faceIdButton]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="face-recognition" size={24} color="white" />
          <Text style={styles.buttonText}>{t('signupLogin.loginFaceId')}</Text>
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
          <Text style={styles.buttonText}>{t('signupLogin.loginPasscode')}</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity 
        onPress={() => router.push('/(auth)/signup')}
        style={styles.signupContainer}
      >
        <Text style={styles.signupText}>
          {t('signupLogin.noAccount')} <Text style={styles.signupLink}>{t('signupLogin.signup')}</Text>
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
  languageButton: {
    position: 'absolute',
    top: 40,
    right: 30,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
  },
  languagePicker: {
    position: 'absolute',
    top: 80,
    right: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  languageOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  languageText: {
    fontSize: 16,
  },
});

export default SignupLogin;