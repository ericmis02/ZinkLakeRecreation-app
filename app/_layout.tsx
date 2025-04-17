import { Stack } from "expo-router";

export default function RootLayout() {
  return ( 
  <Stack screenOptions={{ headerShown: false}}>
    <Stack.Screen name="index" options={{ title: 'Zink Lake Recreation' }} />
    <Stack.Screen name="booking" options={{ title: 'Book a Pickup/Dropoff' }} />
    <Stack.Screen name="profile" options={{ title: 'My Profile' }} />
    <Stack.Screen name="contact" options={{ title: 'Contact Staff' }} />
    <Stack.Screen name="faq" options={{ title: 'Frequently Asked Questions' }} />
    <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    <Stack.Screen name="track" options={{ title: 'Track My Ride' }} />
  </Stack> );
}