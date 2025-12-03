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
import bub1 from '../../assets/images/b1.png'
import bub2 from '../../assets/images/b2.png'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useSignInMutation } from '../redux/slices/jsonApiSlice'

const LoginScreen = () => {
  const router = useRouter()
  const [signIn] = useSignInMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  const handleLogin = async () => {
    // Dismiss keyboard first
    Keyboard.dismiss()
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password')
      return
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

const data ={
      email: email.trim(),
      password: password.trim(),
      timestamp: new Date().toISOString()
    }

    try{
      const res = await signIn(data).unwrap()
      console.log(res)
    } catch(err){
      console.log(err)
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      
      // For demo purposes, we'll just navigate
      // In real app, you would make API call here
      Alert.alert(
        'Login Successful',
        `Logged in as: ${email}`,
        [
          {
            text: 'Continue',
            onPress: () => {
              router.push('/home/home-slider')
            }
          }
        ]
      )
    }, 1500)
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.imageContainer}>
              <Image style={styles.image1} source={bub1} contentFit="contain" />
              <Image style={styles.image2} source={bub2} contentFit="contain" />
            </View>
            
            <View style={styles.contentContainer}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Good to see you back!</Text>
              
              <View style={styles.formContainer}>
                <TextInput 
                  placeholder='Email' 
                  style={styles.input}
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    // Focus next input
                  }}
                />
                <TextInput 
                  placeholder='Password' 
                  style={styles.input}
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
              </View>
              
              <TouchableOpacity 
                onPress={handleLogin} 
                style={[styles.loginButton, loading && styles.disabledButton]}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.forgotPassword, loading && styles.disabledButton]}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Demo Data Display (optional - for debugging) */}
            
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen

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
        paddingBottom: 30,
    },
    imageContainer: {
        position: 'relative',
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    image1: {
        width: '60%',
        height: 300,
        zIndex: 10,
        position: 'absolute',
        left: -20,
    },
    image2: {
        width: '76%',
        height: 720,
        position: 'absolute',
        left: 0,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    formContainer: {
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    loginButton: {
        backgroundColor: '#004CFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '600',
    },
    forgotPassword: {
        alignItems: 'center',
        marginBottom: 30,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#004CFF',
        textDecorationLine: 'underline',
    },
    disabledButton: {
        opacity: 0.6,
    },
    debugContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    debugTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    debugText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
})