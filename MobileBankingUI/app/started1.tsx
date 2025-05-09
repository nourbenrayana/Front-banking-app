import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const OnboardingSwipeScreen = () => {
  const { t } = useTranslation("onboarding");
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const imageAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  const onboardingSlides = [
    {
      id: '1',
      image: require('../assets/images/started1.png'),
      title: t('slides.0.title'),
      description: t('slides.0.description'),
    },
    {
      id: '2',
      image: require('../assets/images/started2.png'),
      title: t('slides.1.title'),
      subtitle: t('slides.1.subtitle'),
      description: t('slides.1.description'),
    },
    {
      id: '3',
      image: require('../assets/images/started3.jpg'),
      title: t('slides.2.title'),
      description: t('slides.2.description'),
    },
    {
      id: '4',
      image: require('../assets/images/started4.png'),
      title: t('slides.3.title'),
      subtitle: t('slides.3.subtitle'),
      description: t('slides.3.description'),
    },
  ];

  const handleScrollEnd = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
    
    Animated.sequence([
      Animated.delay(100),
      Animated.spring(imageAnimations[newIndex], {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();
    
    imageAnimations.forEach((anim, index) => {
      if (index !== newIndex) anim.setValue(0);
    });
  };

  const renderItem = ({ item, index }: any) => {
    const scale = imageAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });
    
    const opacity = imageAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });
    
    const translateY = imageAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    return (
      <View style={styles.slide}>
        <Animated.Image 
          source={item.image} 
          style={[
            styles.slideImage, 
            { transform: [{ scale }, { translateY }], opacity }
          ]} 
          resizeMode="contain" 
        />
        <View style={styles.textContainer}>
          <Text style={styles.slideTitle}>{item.title}</Text>
          {item.subtitle && <Text style={styles.slideSubtitle}>{item.subtitle}</Text>}
          <Text style={styles.slideDescription}>{item.description}</Text>
        </View>
        {index === onboardingSlides.length - 1 && (
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={() => router.push('/(auth)/loginorsignup')}
            accessibilityLabel={t('continue')}
          >
            <Text style={styles.continueButtonText}>{t('continue')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingSlides.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 16, 8],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { width: dotWidth, opacity },
              i === currentIndex && styles.activeDot,
            ]}
          />
        );
      })}
    </View>
  );

  useEffect(() => {
    Animated.spring(imageAnimations[0], {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentIndex < onboardingSlides.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/(auth)/loginorsignup')}
          accessibilityLabel={t('skip')}
        >
          <Text style={styles.skipText}>{t('skip')}</Text>
        </TouchableOpacity>
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={onboardingSlides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleScrollEnd}
        keyExtractor={(item) => item.id}
      />

      {currentIndex < onboardingSlides.length - 1 && renderPagination()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 24,
    zIndex: 1,
    padding: 8,
  },
  skipText: {
    color: '#2E86DE',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  slideImage: {
    width: width * 0.8,
    height: width * 0.6,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2E86DE',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter-ExtraBold',
  },
  slideSubtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2E86DE',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  slideDescription: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  pagination: {
    position: 'absolute',
    bottom: height * 0.15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2E86DE',
  },
  continueButton: {
    backgroundColor: '#2E86DE',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 40,
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});

export default OnboardingSwipeScreen;