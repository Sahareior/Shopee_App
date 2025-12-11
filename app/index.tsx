import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
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
<MaskedView
  style={{ height: 80, justifyContent: "center" }} 
  maskElement={
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text
        style={[
          styles.title,
          { color: "black", backgroundColor: "transparent" },
        ]}
      >
        AUREON
      </Text>
    </View>
  }
>
  <LinearGradient
    colors={["#00FFA3", "#00D1FF", "#7A5CFF", "#FF4F9A"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      width: 300,   // 👈 Gradient must fully cover the text width
      height: 80,   // 👈 Same as mask height
    }}
  />
</MaskedView>

      <Text style={styles.subtitle}>Guided by Innovation, Inspired by the Aurora</Text>
      <TouchableOpacity
       onPress={()=> router.push('/auth/create-account')}
        style={styles.primaryButton}
       
      >
        <Text style={styles.primaryButtonText}>Let's Go</Text>
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
  gradientBox: {
  padding: 16,
  borderRadius: 12,
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
    backgroundColor: '#e78397', // yellow-500 equivalent
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