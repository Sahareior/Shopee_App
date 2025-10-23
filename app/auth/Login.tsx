import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import bub1 from '../../assets/images/b1.png'
import bub2 from '../../assets/images/b2.png'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const LoginScreen = () => {
  const router = useRouter()
  return (
    <View style={styles.container}>
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
          />
          <TextInput 
            placeholder='Password' 
            style={styles.input}
            placeholderTextColor="#999"
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity onPress={()=> router.push('/home/home-slider')} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 1,
    },
    imageContainer: {
        position: 'relative',
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image1: {
        width: '60%',
        height: 300,
        zIndex:10,
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
        marginTop: 40,
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
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#004CFF',
        textDecorationLine: 'underline',
    },
})