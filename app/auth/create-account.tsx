import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import bubble from '../../assets/images/bubble.png'
import camera from '../../assets/images/camere.png'
import { Image } from 'expo-image'
import { useSignUpMutation } from '../redux/slices/jsonApiSlice'
// import { setCredentials } from '../redux/slices/authSlice'
import {setCredentials} from '../redux/slices/authSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CreateAccount = () => {
  const [signUp] = useSignUpMutation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const dispatch = useDispatch()

  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  const showSuccessAlert = () => {
    Alert.alert(
      "Account Created!",
      "Your account has been created successfully.",
    )
  }

  const handleSubmit = async () => {
    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters")
      return
    }

    const data = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim()
    }

    setLoading(true)
    
    try {
      const res = await signUp(data).unwrap()
      console.log("Signup response:", res)
      await AsyncStorage.setItem('authToken', res.token);
      await AsyncStorage.setItem('authUser', JSON.stringify(res.user));
      
         if(res?.user?.firstLogin === true){
    router.push('/home/home-slider');
   }else{
    router.push('/(tabs)/home');
   }
      // Store user data in Redux (assuming response has user and token)
      dispatch(setCredentials({
        user: res.user || { name: data.name, email: data.email },
        token: res.token || 'dummy-token' // Replace with actual token from API
      }))

      // Clear form
      setName("")
      setEmail("")
      setPassword("")
      
      // Show success alert
      showSuccessAlert()
      
    } catch (err) {
      console.log("Signup error:", err)
      Alert.alert(
        "Signup Failed",
        err?.data?.message || err?.error || "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Create</Text>
                <Text style={styles.headerText}>Account</Text>
              </View>

              <Image
                source={bubble}
                style={styles.headerImage}
              />
            </View>

            {/* Camera Icon */}
            <View style={styles.imageContainer}>
              <Image 
                source={camera} 
                style={styles.cameraImage}
              />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <TextInput 
                placeholder="Name"
                style={styles.input}
                placeholderTextColor="#777"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
              <TextInput 
                placeholder="Email"
                style={styles.input}
                placeholderTextColor="#777"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
              <TextInput 
                placeholder="Password"
                style={styles.input}
                placeholderTextColor="#777"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[
                  styles.primaryButton,
                  loading && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Creating..." : "Done"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.secondaryButton,
                  loading && styles.disabledButton
                ]}
                onPress={() => router.back()}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CreateAccount

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 42,
    fontWeight: '700',
    color: '#000',
    marginLeft:6,
    lineHeight: 48,
  },
  headerImage: {
    width: 90,
    height: 250,
    opacity: 0.8,
  },
  imageContainer: {
    alignItems: 'stretch',
    marginTop: 10,
    marginBottom: 30,
  },
  cameraImage: {
    width: 70,
    height: 70,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  formContainer: {
    marginBottom: 20,
    paddingHorizontal:10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  buttonsContainer: {
    gap: 15,
    marginBottom: 20,
    paddingHorizontal:10
  },
  primaryButton: {
    backgroundColor: '#004CFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  disabledButton: {
    opacity: 0.6,
  },
})