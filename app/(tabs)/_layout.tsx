import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Ionicons } from '@expo/vector-icons'
import { useGetCartsQuery } from '../redux/slices/jsonApiSlice';
import { View } from 'react-native';
import { Badge } from '@react-navigation/elements';

export default function TabLayout() {
  
  const {data:cartData} = useGetCartsQuery();

  console.log('Cart data in TabLayout:', cartData?.data.length);
  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        tabBarActiveTintColor: '#f56363ff',
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
        
          tabBarIcon: ({ color }) => <Ionicons name="heart-half" size={28} color={color} />,
        }}
      />
<Tabs.Screen
  name="cart"
  options={{
    tabBarIcon: ({ color }) => {
      const cartCount = cartData?.data?.length ?? 0;

      return (
        <View style={{ position: 'relative' }}>
          {/* Only show badge if > 0 */}
          {cartCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -6,
                right: -10,
                backgroundColor: 'red',
                paddingHorizontal: 1,
                paddingVertical: 1,
                borderRadius: 10,
                minWidth: 14,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <Badge 
                style={{ color: 'white', fontSize: 12 }}
              >
                {cartCount}
              </Badge>
            </View>
          )}

          <Ionicons name="cart" size={28} color={color} />
        </View>
      );
    },
  }}
/>

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}