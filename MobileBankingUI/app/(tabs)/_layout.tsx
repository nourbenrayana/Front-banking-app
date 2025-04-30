import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons,FontAwesome } from "@expo/vector-icons";

import { useColorScheme } from "react-native";
import Colors from "../../constants/Colors";


export default function TabLayout() {

 
  const colorScheme = useColorScheme();

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
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="exchange"
        options={{
          title: "Exchange",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="currency-exchange" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: "Cards",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome name="credit-card-alt" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
   
  );
}