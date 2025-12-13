import { router, Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Provider, useSelector } from 'react-redux';
import { StatusBar } from "expo-status-bar";
import { Platform, View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from "./redux/store";
import { ToastProvider } from 'react-native-toast-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage';

function RootLayoutNav() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false); // Track if user data is loaded

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userData = await AsyncStorage.getItem('authUser');
        
        console.log('Token from storage:', token);
        console.log('User data from storage:', userData);
        
        setIsAuthenticated(!!token);
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('Parsed user:', parsedUser);
        } else {
          setUser(null);
        }
        
        setUserLoaded(true); // Mark user data as loaded
      } catch (error) {
        console.error('Error reading auth token:', error);
        setIsAuthenticated(false);
        setUser(null);
        setUserLoaded(true);
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
      // Update user data from Redux if available
      if (authState?.user) {
        setUser(authState.user);
        // Also update AsyncStorage
        AsyncStorage.setItem('authUser', JSON.stringify(authState.user));
      }
    } else if (authState?.token === null || authState?.token === undefined) {
      setIsAuthenticated(false);
      setUser(null);
      setUserLoaded(true);
    }
  }, [authState]);

  // Handle navigation based on auth and user data
  useEffect(() => {
    if (isLoading) return; // Don't navigate while still loading
    if (!userLoaded) return; // Don't navigate until user data is loaded

    console.log('Navigation check:', {
      isAuthenticated,
      user,
      firstLogin: user?.firstLogin,
      userLoaded
    });

    if (isAuthenticated) {
      if (user?.firstLogin === true) {
        console.log('Navigating to home-slider (first login)');
        router.replace('/home/home-slider');
      } else if (user?.firstLogin === false) {
        console.log('Navigating to home (not first login)');
        router.replace('/(tabs)/home');
      } else {
        // User is authenticated but firstLogin is undefined/null
        console.log('User authenticated but firstLogin missing, navigating to home');
        router.replace('/(tabs)/home');
      }
    } else {
      console.log('Not authenticated, navigating to index');
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, user, userLoaded, router]);

  // Add this useEffect for Platform-specific imports
  useEffect(() => {
    if (Platform.OS === 'android') {
      require('react-native-gesture-handler');
    }
  }, []);

  // Show loading indicator while checking auth
  if (isLoading || !userLoaded) {
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