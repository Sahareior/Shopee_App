import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

const SearchBar = () => {
    const router = useRouter()
  return (
    <View>
             {/* Search Input */}
             <TouchableOpacity 
               style={styles.inputContainer}
               onPress={() => router.push('/home/Homepage/_routeCompo/searchComponent')}
             >
               <TextInput
                 style={styles.input}
                 placeholder="Search products..."
                 placeholderTextColor="#999"
               
          
               />
               <Ionicons 
                 name="search" 
                 size={20} 
                 color="#999" 
                 style={styles.searchIcon}
               />
             </TouchableOpacity>
    </View>
  )
}

export default SearchBar
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 0,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 45,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  carouselContainer: {
    marginBottom: 10,
    minHeight: 180, // Fixed height to prevent layout shift
  },
  carousel: {
    borderRadius: 16,
  },
  carouselContent: {
    alignItems: 'center',
  },
  bannerItem: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerTouchable: {
    flex: 1,
  },
  bannerFallback: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    paddingRight: 10,
  },
  bannerSubtitle: {
    fontSize: 15,
    color: 'white',
    opacity: 0.95,
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    paddingRight: 10,
  },
  bannerButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: '#004CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bannerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 8,
    paddingHorizontal: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    opacity: 0.7,
  },
  indicatorActive: {
    backgroundColor: '#004CFF',
    width: 24,
    opacity: 1,
  },
  timerContainer: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(0, 76, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 11,
    color: '#004CFF',
    fontWeight: '600',
  },
  carouselPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
})