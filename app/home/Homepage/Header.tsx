import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Header = ({  notificationCount = 3, messageCount = 2 }) => {
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
    const [user,setUser] = useState(null)

 

  useEffect(()=> {
     const getUser = async () => {
          const userData = await AsyncStorage.getItem('authUser')
          const user = userData ? JSON.parse(userData) : null
          setUser(user)
         
        }
        getUser()
  },[])

  const handleLogout = async() => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('authUser');
    router.replace('/');
    setShowLogoutModal(false)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };



  return (
    <View style={styles.container}>
      {/* Search Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSearch}
        onRequestClose={() => setShowSearch(false)}
      >
        <View style={styles.searchModalOverlay}>
          <View style={styles.searchModalContainer}>
            <View style={styles.searchHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setShowSearch(false)}
              >
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#999" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search people, posts, hashtags..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                  onSubmitEditing={handleSearch}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ScrollView style={styles.searchResults}>
              {/* Recent Searches */}
              <Text style={styles.searchSectionTitle}>Recent Searches</Text>
              {/* Add recent search items here */}
            </ScrollView>
          </View>
        </View>
      </Modal>

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

      {/* Main Header */}
      <View style={styles.header}>
        {/* Left Section - Logo/Brand */}


        {/* Center Section - Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => setShowSearch(true)}
        >
          <Ionicons name="search" size={18} color="#999" />
          <Text style={styles.searchPlaceholder}>Search...</Text>
        </TouchableOpacity>

        {/* Right Section - Icons */}
        <View style={styles.rightSection}>
          {/* Create Post Button */}


          {/* Notifications */}
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/socialmedia/_components/notification')}
          >
            <Ionicons name="notifications-outline" size={24} color="#333" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Messages */}
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/socialmedia/_components/chat')}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#333" />
            {messageCount > 0 && (
              <View style={[styles.badge, styles.messageBadge]}>
                <Text style={styles.badgeText}>
                  {messageCount > 9 ? '9+' : messageCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Profile Menu */}
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/home/Homepage/UserData')}
          >
            <Image 
              style={styles.profileImage} 
              source={user?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=464'} 
              contentFit="cover"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View>
          <Text style={styles.welcomeText}>
            Welcome back, <Text style={styles.username}>{user?.name || 'Sahareior'}</Text> 👋
          </Text>
          <Text style={styles.subtitle}>What's happening today?</Text>
        </View>
        <TouchableOpacity 
          style={styles.storyButton}
          onPress={()=> router.push('/home/ProfilePage/activity')}
        >
          <Ionicons name="camera" size={20} color="#FFF" />
          {/* <Text style={styles.storyButtonText}>Add Story</Text> */}
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      {/* <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.quickActions}
      >
        <TouchableOpacity style={[styles.actionButton, styles.activeAction]}>
          <Ionicons name="home" size={20} color="#004CFF" />
          <Text style={[styles.actionText, styles.activeActionText]}>Feed</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/home/marketplace')}
        >
          <FontAwesome name="shopping-bag" size={18} color="#666" />
          <Text style={styles.actionText}>Shop</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/home/reels')}
        >
          <Ionicons name="play-circle" size={20} color="#666" />
          <Text style={styles.actionText}>Reels</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/home/events')}
        >
          <MaterialIcons name="event" size={20} color="#666" />
          <Text style={styles.actionText}>Events</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/home/groups')}
        >
          <MaterialIcons name="groups" size={20} color="#666" />
          <Text style={styles.actionText}>Groups</Text>
        </TouchableOpacity>
      </ScrollView> */}
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logoContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  logoHighlight: {
    color: '#004CFF',
  },
  searchBar: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 10,
    marginHorizontal: 1,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: '#999',
    fontSize: 14,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileButton: {
    marginLeft: 4,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#004CFF',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  messageBadge: {
    backgroundColor: '#004CFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:8,
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  username: {
    color: '#004CFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  storyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004CFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  storyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  activeAction: {
    backgroundColor: '#E8F0FE',
    borderWidth: 1,
    borderColor: '#004CFF',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeActionText: {
    color: '#004CFF',
    fontWeight: '600',
  },
  // Search Modal Styles
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  searchModalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    color: '#333',
  },
  searchResults: {
    flex: 1,
    padding: 16,
  },
  searchSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  // Logout Modal Styles (keep from original)
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