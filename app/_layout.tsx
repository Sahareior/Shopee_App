import { Stack } from "expo-router";
import { useState } from "react";

export default function RootLayout() {
  // Later you’ll replace this with your AuthContext or async storage
  const [user, setUser] = useState(true);
  

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        // Not logged in → Welcome + Auth screens
        <Stack.Screen name="index" />
      ) : (
        // Logged in → home
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}
