import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import bubble from '../../assets/images/bubble.png'
import camera from '../../assets/images/camere.png'
import { Image } from 'expo-image'

const CreateAccount = () => {
  return (
    <SafeAreaView style={styles.container}>
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
     
     <View >
        <Image 
          source={camera} 
          style={styles.cameraImage}
        />
     </View>

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
        <TextInput 
          placeholder='Phone Number' 
          style={styles.input}
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
     </View>
     
     <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
     </View>
    </SafeAreaView>
  )
}

export default CreateAccount

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#000',
    },
    headerImage: {
        width: 100,
        height: 300,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    cameraImage: {
        width: 90,
        height: 90,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        marginBottom:40
    },
    formContainer: {
        marginBottom: 40,
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
    buttonsContainer: {
        
        justifyContent: 'space-between',
        gap: 15,
    },
    primaryButton: {
       
        backgroundColor: '#004CFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: 16,
        color:'#FFFF',
        fontWeight: '600',
        // color: '#000',
    },
    secondaryButton: {
     
        backgroundColor: '#f0f0f0',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
})