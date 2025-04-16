import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  // Animation du logo
  const logoScale = useSharedValue(0);
  const logoTranslateY = useSharedValue(-30);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    logoTranslateY.value = withTiming(0, { duration: 1000 });
    logoOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { translateY: logoTranslateY.value }],
    opacity: logoOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Logo et titre */}
      <View style={styles.header}>
        <Animated.Image
          source={require('../../assets/images/logo.png')}
          style={[styles.logo, animatedLogoStyle]}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          <Text style={styles.TitleText}>Caixa</Text>
          <Text style={styles.TitleText}>Bank</Text>
        </Text>
      </View>

      {/* Message de bienvenue */}
      <View style={styles.card}>
        <Text style={styles.welcomeText}>
          Welcome To <Text style={styles.TitleText}>Caixa</Text>
          <Text style={styles.TitleText}>Bank</Text>
        </Text>
        <Text style={styles.subtitle}>
          Carry out all your transactions easily from the CaixaBank App.
        </Text>
      </View>

      {/* Conteneur des boutons */}
      <View style={styles.actionsContainer}>
      <TouchableOpacity
          style={styles.Button}
        >
          <Text style={styles.faceIDText}>Login with Face ID</Text>
          <MaterialCommunityIcons name="face-recognition" size={24} color="white" />
      </TouchableOpacity>


        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity
          style={styles.Button}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.faceIDText}>Signup</Text>
          <MaterialCommunityIcons name="account-plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5efec',
    paddingHorizontal: 16,
    paddingTop: 64,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 8,
  },
  TitleText: {
    color: '#000000',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
  actionsContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  Button: {
    backgroundColor: '#2E86DE',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginVertical: 10,
    marginHorizontal: 8,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  faceIDText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  orText: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
});
