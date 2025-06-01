import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import Colors from "../../constants/Colors";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useWebSocket } from "../../hooks/useWebSocket";
import * as Notifications from 'expo-notifications';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { userData } = useUser();
  const { notification } = useWebSocket();

  useEffect(() => {
    // Demander la permission pour les notifications
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Les notifications sont désactivées!');
      }
    };
    requestPermissions();

    // Configurer le gestionnaire de notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue:', notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabBarActiveTint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabBarInactiveTint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].tabBarBackground,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="exchange"
        options={{
          title: "Exchange",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="currency-exchange" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: "Cards",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="credit-card-alt" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
