import { View, Text, Image, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textPosition = useRef(new Animated.Value(20)).current;
  const router = useRouter();

  useEffect(() => {
    // Lancer les animations
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(textPosition, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Redirection automatique après 5 secondes
    const timeout = setTimeout(() => {
      router.push('/started1');
    }, 5000);

    return () => clearTimeout(timeout); // Nettoyage
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ transform: [{ scale: logoScale }] }}>
        <Image 
          source={require('@/assets/images/pngegg.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={{ 
        opacity: textOpacity,
        transform: [{ translateY: textPosition }],
      }}>
        <Text style={styles.welcomeText}>
          Welcome to <Text style={styles.bankName}>CaixaBank</Text>
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 30,
    color: '#333',
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  bankName: {
    color: 'black',
    fontWeight: '700',
    fontSize: 34,
    letterSpacing: 1,
  },
});
