import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Easing, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';

type RootStackParamList = {
  Started2: undefined;
  NextScreen: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Started2'>;

const Started2Screen = ({ navigation }: Props) => {
  // Animations
  const fadeAnim = new Animated.Value(0);
  const imageScale = new Animated.Value(0.8);
  const contentSlide = new Animated.Value(30);
  
  // Expo Router
  const router = useRouter(); 

  useEffect(() => {
    // Animation séquence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(imageScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleContinue = () => {
    // Animation de sortie
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: -30,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start(() => {
      router.push('/started3'); // Redirection après animation
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Image avec animation */}
        <Animated.View style={[
          styles.imageContainer,
          { 
            opacity: fadeAnim,
            transform: [{ scale: imageScale }]
          }
        ]}>
          <Image
            source={require('../assets/images/started2.png')}
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
          <Text style={styles.title}>Bills Payment</Text>
          <Text style={styles.subtitle}>Made Easy</Text>
          <Text style={styles.description}>
            Pay monthly or daily bills at home
            {'\n'}in a site of TransferMe.
          </Text>
        </Animated.View>

        {/* Bouton avec animation */}
        <Animated.View style={{ opacity: fadeAnim }}>
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
    alignItems: 'center',
    padding: 24,
  },
  imageContainer: {
    marginBottom: 40,
  },
  image: {
    width: 300,
    height: 250,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#4A42E8',
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 48,
    paddingHorizontal: 20,
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
  },
});

export default Started2Screen;