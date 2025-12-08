import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const { width: screenWidth } = Dimensions.get('window')

const ProfileHeader = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeBanner, setActiveBanner] = useState(0)
  const scrollViewRef = useRef(null)
  const route = useRouter()
  const intervalRef = useRef(null)

  // Banner width calculation
  const bannerWidth = screenWidth - 32 // 16px padding on each side

  // New Unsplash images - fashion/e-commerce themed
  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      title: 'Winter Collection',
      subtitle: 'Cozy Styles Up to 60% Off'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      title: 'Smart Devices',
      subtitle: 'Latest Tech Gadgets'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      title: 'Fashion Sale',
      subtitle: 'Designer Brands 50% Off'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      title: 'Audio Gear',
      subtitle: 'Premium Sound Experience'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      title: 'Fitness Gear',
      subtitle: 'Stay Active & Healthy'
    }
  ]

  // Auto scroll function
  const scrollToNextBanner = () => {
    const nextIndex = (activeBanner + 1) % banners.length
    scrollToBanner(nextIndex)
  }

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const currentIndex = Math.round(contentOffsetX / bannerWidth)
    setActiveBanner(currentIndex)
  }

  const scrollToBanner = (index) => {
    setActiveBanner(index)
    scrollViewRef.current?.scrollTo({
      x: index * bannerWidth,
      animated: true
    })
  }

  // Setup auto-scroll interval
  useEffect(() => {
    // Start auto-scroll
    intervalRef.current = setInterval(scrollToNextBanner, 5000) // 5 seconds
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [activeBanner]) // Re-run when activeBanner changes

  // Reset timer when user manually interacts
  const handleManualScroll = (index) => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    // Scroll to selected banner
    scrollToBanner(index)
    
    // Restart auto-scroll after manual interaction
    intervalRef.current = setInterval(scrollToNextBanner, 5000)
  }

  // Calculate time until next auto-scroll
  const [timeLeft, setTimeLeft] = useState(5)

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 5
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [activeBanner])

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

        <Text style={styles.subtitle}>Find Your desired product!</Text>

        {/* Search Input */}
        <TouchableOpacity 
          style={styles.inputContainer}
          onPress={() => route.push('/home/Homepage/_routeCompo/searchComponent')}
        >
          <TextInput
            style={styles.input}
            placeholder="Search products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable={false} // Make it non-editable since it's just a button
          />
          <Ionicons 
            name="search" 
            size={20} 
            color="#999" 
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Banner Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={(e) => {
            const contentOffsetX = e.nativeEvent.contentOffset.x
            const index = Math.round(contentOffsetX / bannerWidth)
            setActiveBanner(index)
          }}
          scrollEventThrottle={16}
          style={styles.carousel}
        >
          {banners.map((banner) => (
            <View key={banner.id} style={[styles.bannerItem, { width: bannerWidth }]}>
              <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => console.log(`Banner ${banner.id} clicked`)}
              >
                <Image
                  source={banner.image}
                  style={styles.bannerImage}
                  contentFit="cover"
                  transition={300}
                  priority="high"
                />
                <View style={styles.bannerOverlay} />
                <View style={styles.bannerContent}>
                  <Text 
                    style={styles.bannerTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {banner.title}
                  </Text>
                  <Text 
                    style={styles.bannerSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {banner.subtitle}
                  </Text>
                  <TouchableOpacity style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>Shop Now</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Banner Indicators with Timer Dots */}
        <View style={styles.indicatorsContainer}>
          {banners.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                activeBanner === index && styles.indicatorActive
              ]}
              onPress={() => handleManualScroll(index)}
            />
          ))}
          
          {/* Timer indicator */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Next in {timeLeft}s
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ProfileHeader

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
  },
  carousel: {
    borderRadius: 16,
  },
  bannerItem: {
    height: 180, // Slightly taller for better visual
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
})