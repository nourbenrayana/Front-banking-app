import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Easing, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';

type RootStackParamList = {
  Started3: undefined;
  NextScreen: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Started3'>;

const Started3Screen = ({ navigation }: Props) => {
  // Animations
  const fadeAnim = new Animated.Value(0);
  const imageSlide = new Animated.Value(-100);
  const contentSlide = new Animated.Value(50);
  const buttonScale = new Animated.Value(0.9);

  const router = useRouter(); // Expo Router

  useEffect(() => {
    // Lancement des animations en parallèle
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(imageSlide, {
        toValue: 0,
        speed: 2,
        bounciness: 8,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleContinue = () => {
    // Animation de sortie
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(imageSlide, {
        toValue: -100,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start(() => {
      router.push('/started4'); // Redirection après animation
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Image avec animation slide from left */}
        <Animated.View style={[
          styles.imageContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateX: imageSlide }]
          }
        ]}>
          <Image
            source={require('../assets/images/started4.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Contenu avec animation */}
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: contentSlide }]
          }
        ]}>
          <Text style={styles.title}>Easy, Fast & Trusted</Text>
          <Text style={styles.description}>
            Fast money transfer and guaranteed safe
            {'\n'}transactions with others.
          </Text>
        </Animated.View>

        {/* Bouton avec animation */}
        <Animated.View style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: buttonScale }]
          }
        ]}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: 320,
    height: 240,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Inter-ExtraBold',
  },
  description: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 48,
    paddingHorizontal: 20,
    fontFamily: 'Inter-Regular',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4A42E8',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: 250,
    shadowColor: '#4A42E8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
});

export default Started3Screen;