import { Stack } from "expo-router";
import { useState } from "react";

export default function RootLayout() {
  // Later you’ll replace this with your AuthContext or async storage
  
  

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="flashSellsDetails" />
      <Stack.Screen name="searchComponent" />
      <Stack.Screen name="details" />
    </Stack>
  );
}
