import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="Payment" options={{ headerShown: true }} />
      <Stack.Screen name="send-money" options={{ headerShown: true }} />
    </Stack>
  );
}
