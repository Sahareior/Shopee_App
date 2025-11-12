import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const [user, setUser] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'android') {
      require('react-native-gesture-handler');
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <Stack 
        screenOptions={{ 
          headerShown: false,
          // Change to 'slide_from_bottom' for better visual continuity
          animation: 'slide_from_bottom',
          animationDuration: 350,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          // CRITICAL: This keeps the previous screen visible during transition
          presentation: 'card',
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        {!user ? (
          <Stack.Screen 
            name="index" 
            options={{
              animation: 'fade',
              animationDuration: 300,
            }}
          />
        ) : (
          <Stack.Screen 
            name="(tabs)" 
            options={{
              animation: 'fade',
            }}
          />
        )}
        
        {/* Add individual screen configurations for better control */}
        <Stack.Screen 
          name="details" 
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            animationDuration: 400, // Slightly longer for smoother effect
          }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}