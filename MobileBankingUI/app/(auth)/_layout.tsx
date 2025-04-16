import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack initialRouteName="welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signup" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="BankInfoScreen" />
      <Stack.Screen name="get-started" />
      <Stack.Screen name="pincode" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="facecamera" />
      <Stack.Screen name="choixdedocument" />
      <Stack.Screen name="cincamera" />
      <Stack.Screen name="detectface" />
      <Stack.Screen name="scancart" />
      <Stack.Screen name="scanpassport" />
      <Stack.Screen name="verification" />
    </Stack>
  );
}
