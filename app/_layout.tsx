import { router, Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Provider, useSelector } from 'react-redux';
import { StatusBar } from "expo-status-bar";
import { Platform, View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from "./redux/store";
import { ToastProvider } from 'react-native-toast-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'; // IMPORTANT: Use AsyncStorage instead of localStorage

function RootLayoutNav() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null to indicate loading
  const [isLoading, setIsLoading] = useState(true);
  const [userId,setUserId]=useState({});

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // Use AsyncStorage instead of localStorage for React Native
        const token = await AsyncStorage.getItem('authToken');
        const userData = await AsyncStorage.getItem('authUser');
        const user = userData ? JSON.parse(userData) : null;
        setUserId(user);

        console.log('Token from storage:', token);
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error reading auth token:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Listen for auth state changes from Redux
  useEffect(() => {
    if (authState?.token) {
      setIsAuthenticated(true);
    } else if (authState?.token === null || authState?.token === undefined) {
      setIsAuthenticated(false);
    }
  }, [authState]);


  useEffect(() => {
    if (isLoading) return; // Don't navigate while still loading





    if (isAuthenticated ) {

  
      // Use setTimeout to ensure navigation happens after mount
      const timer = setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        // Only navigate to index if we're not already there
        if (router.canGoBack()) {
          router.replace('/');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, router]);

  // Add this useEffect for Platform-specific imports
  useEffect(() => {
    if (Platform.OS === 'android') {
      require('react-native-gesture-handler');
    }
  }, []);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
        {/* ALWAYS render both stacks, let Expo Router handle which one to show based on navigation state */}
        <Stack.Screen 
          name="index" 
          options={{
            animation: 'fade',
            animationDuration: 300,
          }}
        />
        
        <Stack.Screen 
          name="(tabs)" 
          options={{
            animation: 'fade',
          }}
        />
        
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