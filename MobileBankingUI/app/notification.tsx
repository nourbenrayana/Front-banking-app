import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Déclaration des types
type NotificationItem = {
  id: string;
  type: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  content: string;
  time: string[] | null;
  color: string;
};

export default function NotificationsScreen() {
  // Déclaration des données de notification avant leur utilisation
  const notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'price-alert',
      title: 'Price Alert',
      icon: 'alert-circle',
      content: 'Bitcoin (BTC) is down 5.98% to $24,433.58 in the last 24 hours.',
      time: null,
      color: '#FFA726'
    },
    {
      id: '2',
      type: 'sent',
      title: 'Transaction Sent',
      icon: 'arrow-up',
      content: '1.30 ETH sent to 0x36246976',
      time: ['10 min ago', '2 min ago'],
      color: '#2E86DE'
    },
    // Ajoutez d'autres notifications ici...
  ];

  // Initialisation des valeurs d'animation
  const animatedValues = notifications.map(() => new Animated.Value(0));

  const handleNotificationPress = (type: string, index: number) => {
    Animated.sequence([
      Animated.timing(animatedValues[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(animatedValues[index], {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      })
    ]).start(() => {
      console.log('Notification clicked:', type);
      // Navigation ou action supplémentaire
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainHeader}>Notifications</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="filter" size={22} color="#2E86DE" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="search" size={22} color="#2E86DE" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.notificationsContainer}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((item, index) => (
          <Animated.View
            key={item.id}
            style={[
              styles.notificationCard,
              {
                transform: [
                  {
                    scale: animatedValues[index].interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 0.95, 1]
                    })
                  }
                ],
                opacity: animatedValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.8]
                })
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => handleNotificationPress(item.type, index)}
              activeOpacity={0.9}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={20} color="white" />
                </View>
                <View style={styles.textContainer}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.sectionHeader}>{item.title}</Text>
                    {item.type === 'error' && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>!</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.sectionContent}>{item.content}</Text>
                  {item.time && (
                    <View style={styles.timeContainer}>
                      {item.time.map((time, i) => (
                        <View key={i} style={styles.timeTag}>
                          <Text style={styles.timeText}>{time}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.bottomTab}>
        <Text style={styles.bottomText}>Swipe down to refresh</Text>
      </View>
    </View>
  );
}

// Les styles restent identiques à la version précédente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  mainHeader: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2E86DE', 
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsContainer: {
    paddingHorizontal: 16,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 8,
  },
  sectionContent: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 22,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  timeTag: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timeText: {
    fontSize: 13,
    color: '#7A8BA9',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#EF5350',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bottomTab: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
  },
  bottomText: {
    fontSize: 13,
    color: '#7A8BA9',
    fontWeight: '500',
  },
});