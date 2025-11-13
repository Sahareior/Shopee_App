import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import shoppingBag from '../assets/images/shoppingBag.png';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={shoppingBag}
        style={styles.image}
      />
      <Text style={styles.title}>Shopee</Text>
      <Text style={styles.subtitle}>Beautiful eCommerce UI Kit for your online store</Text>
      <TouchableOpacity
        style={styles.primaryButton}
       
      >
        <Text onPress={()=> router.push('/auth/create-account')} style={styles.primaryButtonText}>Let's Go</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => router.push("/auth/Login")} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>I already have an account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666666',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#FFD700', // yellow-500 equivalent
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    minWidth: 150,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#666666',
    textDecorationLine: 'underline',
  },
});