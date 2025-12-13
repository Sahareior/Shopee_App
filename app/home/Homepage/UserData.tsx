import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons, Feather, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

const UserData = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: '@johndoe',
    bio: 'Digital creator | Photography enthusiast | Love traveling around the world 🌍',
    posts: 156,
    followers: '12.5K',
    following: 234,
    isVerified: true,
    joinDate: 'January 2023',
    location: 'New York, USA'
  })

  const [activeTab, setActiveTab] = useState('posts')
  const router = useRouter()

  const menuItems = [
    { icon: 'person-outline', name: 'Edit Profile', type: 'ionicons', color: '#4CAF50' },
    { icon: 'shield-outline', name: 'Privacy & Security', type: 'ionicons', color: '#2196F3' },
    { icon: 'bell-outline', name: 'Notifications', type: 'ionicons', color: '#FF9800' },
    { icon: 'palette-outline', name: 'Appearance', type: 'ionicons', color: '#9C27B0' },
    { icon: 'language', name: 'Language', type: 'material', color: '#009688' },
    { icon: 'help-circle-outline', name: 'Help & Support', type: 'ionicons', color: '#795548' },
    { icon: 'information-circle-outline', name: 'About', type: 'ionicons', color: '#607D8B' },
  ]

  const statsItems = [
    { icon: 'grid', label: 'Posts', value: user.posts, type: 'feather' },
    { icon: 'users', label: 'Followers', value: user.followers, type: 'feather' },
    { icon: 'user-plus', label: 'Following', value: user.following, type: 'feather' },
  ]



    const handleLogout = async() => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('authUser');
    router.replace('/');
  
  }

  const renderIcon = (icon, type, color = '#666', size = 24) => {
    const props = { name: icon, size, color }
    
    switch(type) {
      case 'ionicons':
        return <Ionicons {...props} />
      case 'material':
        return <MaterialIcons {...props} />
      case 'feather':
        return <Feather {...props} />
      case 'fontawesome':
        return <FontAwesome {...props} />
      case 'fontawesome5':
        return <FontAwesome5 {...props} />
      case 'materialcommunity':
        return <MaterialCommunityIcons {...props} />
      default:
        return <Ionicons {...props} />
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editPhotoButton}>
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{user.name}</Text>
                {user.isVerified && (
                  <Ionicons name="checkmark-circle" size={20} color="#004CFF" style={styles.verifiedBadge} />
                )}
              </View>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.bio}>{user.bio}</Text>
              
              <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>{user.location}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>Joined {user.joinDate}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {statsItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.statItem,
                  index === 1 && styles.statItemCenter
                ]}
                onPress={() => setActiveTab(item.label.toLowerCase())}
              >
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#004CFF" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Ionicons 
              name="grid" 
              size={24} 
              color={activeTab === 'posts' ? '#004CFF' : '#999'} 
            />
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              Posts
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'stories' && styles.activeTab]}
            onPress={() => setActiveTab('stories')}
          >
            <Ionicons 
              name="play-circle" 
              size={24} 
              color={activeTab === 'stories' ? '#004CFF' : '#999'} 
            />
            <Text style={[styles.tabText, activeTab === 'stories' && styles.activeTabText]}>
              Stories
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <Ionicons 
              name="bookmark-outline" 
              size={24} 
              color={activeTab === 'saved' ? '#004CFF' : '#999'} 
            />
            <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
              Saved
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Grid */}
        <View style={styles.contentGrid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <TouchableOpacity key={item} style={styles.gridItem}>
              <Image
                source={{ uri: `https://images.unsplash.com/photo-1682686580391-615b1f28e5ee?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60&${item}` }}
                style={styles.gridImage}
              />
              {item % 3 === 0 && (
                <View style={styles.multiIcon}>
                  <Ionicons name="layers" size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                {renderIcon(item.icon, item.type, item.color)}
              </View>
              <Text style={styles.menuText}>{item.name}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={[styles.menuIcon, { backgroundColor: '#FF3B3015' }]}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>© 2024 YourApp. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default UserData

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileHeader: {
    flexDirection: 'row',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#f0f0f0',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#004CFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 6,
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaInfo: {
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statItemCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#f0f0f0',
    borderRightColor: '#f0f0f0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004CFF15',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#004CFF30',
  },
  editButtonText: {
    color: '#004CFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#004CFF10',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#004CFF',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 2,
  },
  gridItem: {
    width: '32.8%',
    aspectRatio: 1,
    marginBottom: 2,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  multiIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 24,
    paddingVertical: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
})