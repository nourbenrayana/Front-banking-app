import React, { useEffect ,useRef,} from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Dimensions, Animated, Easing } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Started1: undefined;
  NextScreen: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Started1'>;

const { width } = Dimensions.get('window');
const router = useRouter(); // Expo Router


const Started1Screen = ({ navigation }: Props) => {
  // Animations
  const fadeAnim = new Animated.Value(0);
  const slideUpAnim = new Animated.Value(30);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Animation en séquence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleContinue = () => {
    // Animation de sortie avant la navigation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: -30,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      router.push('/started2'); // Redirection après animation
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Illustration avec animation */}
        <Animated.View style={[
          styles.illustrationContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }]
          }
        ]}>
          <Image
            source={require('../assets/images/started1.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Contenu avec animation décalée */}
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}>
          <Text style={styles.title}>Free Transactions</Text>
          <Text style={styles.description}>
            Provides the quality of the financial system with free money
            transactions without any fees.
          </Text>
        </Animated.View>

        {/* Bouton avec animation */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }}>
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
    backgroundColor: 'white',
  },
  illustrationContainer: {
    marginBottom: 40,
  },
  illustration: {
    width: width * 0.8,
    height: width * 0.6,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontFamily: 'Inter-Regular',
  },
  button: {
    backgroundColor: '#4361ee',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#4361ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
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

export default Started1Screen;