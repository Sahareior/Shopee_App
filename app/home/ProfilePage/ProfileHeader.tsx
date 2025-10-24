import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const { width: screenWidth } = Dimensions.get('window')

const ProfileHeader = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeBanner, setActiveBanner] = useState(0)
  const scrollViewRef = useRef(null)
  const route = useRouter()

  // Sample banner data
  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      title: 'Summer Collection',
      subtitle: 'Up to 50% Off'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      title: 'New Arrivals',
      subtitle: 'Fresh Styles Added'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc96?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      title: 'Flash Sale',
      subtitle: 'Limited Time Offers'
    }
  ]

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const currentIndex = Math.round(contentOffsetX / screenWidth)
    setActiveBanner(currentIndex)
  }

  const scrollToBanner = (index) => {
    setActiveBanner(index)
    scrollViewRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true
    })
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headingContainer}>
          <Text style={styles.greeting}>Hello, John! 👋</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Find Your desiered product!</Text>

        {/* Search Input */}
        <View style={styles.inputContainer}>
          <TextInput
          onPress={()=> route.push('/home/Homepage/_routeCompo/searchComponent')}
            style={styles.input}
            placeholder="Search profiles..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons 
            name="search" 
            size={20} 
            color="#999" 
            style={styles.searchIcon}
          />
        </View>
      </View>

      {/* Banner Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.carousel}
        >
          {banners.map((banner) => (
            <TouchableOpacity key={banner.id} style={styles.bannerItem} activeOpacity={0.9}>
              <Image
                source={banner.image}
                style={styles.bannerImage}
                contentFit="cover"
              />
              <View style={styles.bannerOverlay} />
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                <TouchableOpacity style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>Explore Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Banner Indicators */}
        <View style={styles.indicatorsContainer}>
          {banners.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                activeBanner === index && styles.indicatorActive
              ]}
              onPress={() => scrollToBanner(index)}
            />
          ))}
        </View>
      </View>

      {/* Quick Stats */}

    </View>
  )
}

export default ProfileHeader

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 20,
  },
  carousel: {
    borderRadius: 16,
  },
  bannerItem: {
    width: screenWidth - 32,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
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
    bottom: 40,
    left: 20,
    right: 20,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  indicatorActive: {
    backgroundColor: '#004CFF',
    width: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
})