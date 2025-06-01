import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';

// Primary color
const PRIMARY_COLOR = '#1E90FF';
const PRIMARY_DARK = '#0066CC';
const PRIMARY_LIGHT = '#B3E0FF';

// Types definitions
type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];
type CardStatus = 'active' | 'blocked' | 'expired';

// Default values
const DEFAULT_CARD_DATA = {
  fullName: 'John Doe',
  cardNumber: '978894430',
  expiryDate: '05/32',
  cardType: 'VISA',
  status: 'active' as CardStatus
};

interface DetailRowProps {
  icon: MaterialIconName;
  title: string;
  value?: string;
  isEditable?: boolean;
  isLast?: boolean;
  action?: () => void;
  children?: React.ReactNode;
}

const ModernCardUI = () => {
  const router = useRouter();
  const { userData, accountData, setAccountData } = useUser();
  const [activeTab, setActiveTab] = useState<'details' | 'management'>('details');
  const cardTilt = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const { t } = useTranslation('card');

  // Merge context data with defaults
  const mergedUserData = {
    fullName: userData.fullName || DEFAULT_CARD_DATA.fullName,
  };

  const mergedAccountData = {
    cardNumber: accountData.cardNumber || DEFAULT_CARD_DATA.cardNumber,
    expiryDate: accountData.expiryDate || DEFAULT_CARD_DATA.expiryDate,
    cardType: accountData.cardType || DEFAULT_CARD_DATA.cardType,
    status: accountData.status || DEFAULT_CARD_DATA.status,
  };

  // Animation handlers
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

  // Helper functions
  const maskedCardNumber = `•••• •••• •••• ${mergedAccountData.cardNumber.slice(-4)}`;

  const getStatusLabel = (status: CardStatus): string => {
    switch(status) {
      case 'active': return 'Active';
      case 'blocked': return 'Blocked';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const toggleCardStatus = () => {
    setAccountData({
      ...accountData,
      status: mergedAccountData.status === 'active' ? 'blocked' : 'active'
    });
  };

  const handleDeleteCard = () => {
    console.log('Card deletion');
  };

  const DetailRow: React.FC<DetailRowProps> = ({ 
    icon, 
    title, 
    value, 
    isEditable = false, 
    isLast = false,
    action,
    children
  }) => (
    <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
      <View style={styles.detailIcon}>
        <MaterialIcons name={icon} size={20} color={PRIMARY_COLOR} />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.detailTitle}>{title}</Text>
        {value && <Text style={styles.detailValue}>{value}</Text>}
        {children}
      </View>
      {isEditable && action && (
        <TouchableOpacity onPress={action}>
          <MaterialIcons name="edit" size={20} color="#64748B" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('title')}</Text>
        </View>

        {/* Interactive Card */}
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
          onTouchStart={handleCardPressIn}
          onTouchEnd={handleCardPressOut}
        >
          <LinearGradient
            colors={[PRIMARY_COLOR, PRIMARY_DARK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardBank}>{getStatusLabel(mergedAccountData.status)}</Text>
              <MaterialIcons name="contactless" size={24} color="white" />
            </View>

            <View style={styles.cardChip}>
              <MaterialIcons name="sim-card" size={32} color="rgba(255,255,255,0.8)" />
            </View>

            <Text style={styles.cardNumber}>{maskedCardNumber}</Text>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>{t('details.cardholder')}</Text>
                <Text style={styles.cardValue}>{mergedUserData.fullName}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>EXPIRATION</Text>
                <Text style={styles.cardValue}>{mergedAccountData.expiryDate}</Text>
              </View>
              <Text style={styles.cardType}>{mergedAccountData.cardType}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'details' && styles.activeTab]}
            onPress={() => setActiveTab('details')}
          >
            <MaterialIcons 
              name="info" 
              size={24} 
              color={activeTab === 'details' ? PRIMARY_COLOR : '#64748B'} 
            />
            <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
             {t('tabs.details')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'management' && styles.activeTab]}
            onPress={() => setActiveTab('management')}
          >
            <MaterialIcons 
              name="settings" 
              size={24} 
              color={activeTab === 'management' ? PRIMARY_COLOR : '#64748B'} 
            />
            <Text style={[styles.tabText, activeTab === 'management' && styles.activeTabText]}>
             {t('tabs.management')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          {activeTab === 'details' ? (
            <View style={styles.detailsContainer}>
              <DetailRow 
                icon="person"
                title={t('details.cardholder')}
                value={mergedUserData.fullName}
              />
              <DetailRow 
                icon="credit-card"
                title={t('details.cardNumber')}
                value={maskedCardNumber}
              />
              <DetailRow 
                icon="calendar-today"
                title={t('details.expiration')}
                value={mergedAccountData.expiryDate}
              />
              <DetailRow 
                icon="payment"
                title={t('details.cardType')}
                value={mergedAccountData.cardType}
              />
              <DetailRow 
                icon="lock"
                title={t('details.status')}
                value={getStatusLabel(mergedAccountData.status)}
                isLast
              />
            </View>
          ) : (
            <View style={styles.managementContainer}>
              <DetailRow 
                icon="power-settings-new"
                title={t('management.enableDisable')}
                isLast={false}
              >
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>
                    {mergedAccountData.status === 'active' ? 'Enabled' : 'Disabled'}
                  </Text>
                  <Switch
                    value={mergedAccountData.status === 'active'}
                    onValueChange={toggleCardStatus}
                    trackColor={{ false: '#E5E7EB', true: PRIMARY_LIGHT }}
                    thumbColor={mergedAccountData.status === 'active' ? PRIMARY_COLOR : '#9CA3AF'}
                  />
                </View>
              </DetailRow>

           

              <DetailRow 
                icon="delete"
                title={t('management.delete')}
                isLast={true}
                action={handleDeleteCard}
              >
                <Text style={styles.dangerText}>Irreversible action</Text>
              </DetailRow>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Button */}
      <TouchableOpacity style={styles.addButton}
      onPress={() => router.push("/ajoutcart")}>
        <MaterialIcons name="add" size={28} color="white" />
        <Text style={styles.addButtonText}>{t('management.addCard')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
  },
  activeTab: {
    backgroundColor: '#E0E7FF',
  },
  tabText: {
    marginLeft: 8,
    color: '#64748B',
    fontWeight: '600',
  },
  activeTabText: {
    color: PRIMARY_COLOR,
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  managementContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  dangerText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ModernCardUI;