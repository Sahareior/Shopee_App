import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Header = () => {
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = async() => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('authUser');
    router.replace('/');
    setShowLogoutModal(false)
  }

  const showLogoutConfirmation = () => {
    setShowLogoutModal(true)
  }

  return (
    <View style={styles.container}>
      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="log-out-outline" size={32} color="#FF3B30" />
              <Text style={styles.modalTitle}>Confirm Logout</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              Are you sure you want to logout from your account?
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Image 
            style={styles.profileImage} 
            source='https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=464' 
            contentFit="cover"
          />
          <TouchableOpacity onPress={()=> router.push('/home/ProfilePage/activity')} style={styles.activityButton}>
            <Text style={styles.activityText}>Upload A Story!</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.rightSection}>
          {/* Chat Icon */}
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#333" />
          </TouchableOpacity>
          
          {/* Statistics Icon */}
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="stats-chart-outline" size={24} color="#333" />
          </TouchableOpacity>
          
          {/* Settings Icon - Now opens confirmation modal */}
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={showLogoutConfirmation}
          >
            <Ionicons name="exit" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.text1}>Hello Sahareior</Text>
      <View style={styles.announcementContainer}>
        <Text style={styles.announcementText}>Announcement</Text>
        <Text style={styles.text2}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae officia aliquid ab natus qui quis mollitia nihil veritatis beatae error!</Text>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    backgroundColor: 'white',
    paddingBottom: 42,
  },
  text1: {
    fontSize: 25,
    fontWeight: '600'
  },
  announcementText: {
    fontWeight: '700',
    paddingVertical: 7
  },
  announcementContainer: {
    marginTop: 16,
    padding: 9,
    backgroundColor: '#F8F8F8',
    paddingBottom: 2
  },
  text2: {
    fontSize: 13,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#004CFF',
  },
  activityButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})