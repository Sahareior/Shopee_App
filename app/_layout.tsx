import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Provider, useSelector } from 'react-redux';
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from "./redux/store";
import { ToastProvider } from 'react-native-toast-notifications'



function RootLayoutNav() {
  const authState = useSelector((state) => state.auth);
  const isAuthenticated = authState.isAuthenticated;

  console.log(authState,isAuthenticated)

  useEffect(() => {
    if (Platform.OS === 'android') {
      require('react-native-gesture-handler');
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="#ffffff" />

      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_bottom',
          animationDuration: 350,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          presentation: 'card',
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        {!isAuthenticated ? (
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
        
        {/* Auth screens */}
        <Stack.Screen 
          name="createAccount" 
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            animationDuration: 400,
          }}
        />
        
        <Stack.Screen 
          name="details" 
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            animationDuration: 400,
          }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
        <ToastProvider>

      <RootLayoutNav />
        </ToastProvider>
    </Provider>
  );
}