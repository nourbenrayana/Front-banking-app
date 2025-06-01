import React, { useRef } from 'react';
import { 
  Animated, 
  Easing, 
  StyleSheet, 
  TouchableWithoutFeedback,
  View,
  Text 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext'; 

// Primary color
const PRIMARY_COLOR = '#1E90FF';
const PRIMARY_DARK = '#0066CC';

interface AnimatedCardProps {
  holderName: string;
  cardNumber: string;
  expiryDate: string;
  cardType: string;
  status: 'active' | 'blocked' | 'expired';
  onTransfer: () => void;
}

const getStatusLabel = (status: string): string => {
  switch(status) {
    case 'active': return 'Active';
    case 'blocked': return 'Blocked';
    case 'expired': return 'Expired';
    default: return 'Unknown';
  }
};


const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  holderName, 
  cardNumber, 
  expiryDate, 
  cardType, 
  status 
}) => {
  const { accountData } = useUser();
  const cardTilt = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  const maskedCardNumber = `•••• •••• •••• ${cardNumber.slice(-4)}`;

  const handleCardPressIn = () => {
    Animated.parallel([
      Animated.timing(cardTilt, {
        toValue: 1,
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      Animated.spring(cardScale, {
        toValue: 0.98,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleCardPressOut = () => {
    Animated.parallel([
      Animated.timing(cardTilt, {
        toValue: 0,
        duration: 250,
        easing: Easing.elastic(1.5),
        useNativeDriver: true
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true
      })
    ]).start();
  };

  const tiltInterpolate = cardTilt.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg']
  });

  return (
    <TouchableWithoutFeedback
      onPressIn={handleCardPressIn}
      onPressOut={handleCardPressOut}
    >
      <Animated.View 
        style={[
          styles.cardContainer,
          { 
            transform: [
              { rotateY: tiltInterpolate },
              { scale: cardScale }
            ] 
          }
        ]}
      >
        <LinearGradient
          colors={[PRIMARY_COLOR, PRIMARY_DARK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardBank}>{getStatusLabel(status)}</Text>
            <MaterialIcons name="contactless" size={24} color="white" />
          </View>

          <View style={styles.cardTopRow}>
            <View style={styles.cardChip}>
                <MaterialIcons name="sim-card" size={32} color="rgba(255,255,255,0.8)" />
            </View>
            <Text style={styles.balanceText}>
            ${accountData.balance.toFixed(2)}
            </Text>
        </View>

          <Text style={styles.cardNumber}>{maskedCardNumber}</Text>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>CARDHOLDER</Text>
              <Text style={styles.cardValue}>{holderName}</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>EXPIRATION</Text>
              <Text style={styles.cardValue}>{expiryDate}</Text>
            </View>
            <Text style={styles.cardType}>{cardType}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 220,
    borderRadius: 24,
    marginVertical: 20,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBank: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  cardChip: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  cardNumber: {
    color: 'white',
    fontSize: 22,
    letterSpacing: 3,
    fontWeight: '500',
    marginVertical: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginBottom: 4,
  },
  cardValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cardType: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  balanceText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },  
});

export default AnimatedCard;