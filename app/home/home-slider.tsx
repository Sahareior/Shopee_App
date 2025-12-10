import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import bub1 from '../../assets/images/b1.png'
import slider1 from '../../assets/images/slider/slider1.png'
import slider2 from '../../assets/images/slider/slider2.png'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLazyUpdateloginStatusQuery } from '../redux/slices/jsonApiSlice'

const { width: screenWidth } = Dimensions.get('window')

const HomeSlider = () => {
  const router = useRouter()
  const [activeSlide, setActiveSlide] = useState(0)
  const scrollRef = useRef(null)
  const [userId, setUserId] = useState(null)
  const [triggerLoginStatusUpdate] = useLazyUpdateloginStatusQuery()

  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem('authUser')
      const user = userData ? JSON.parse(userData) : null
      setUserId(user?.id)
      console.log('User data in HomeSlider:', user)
    }
    getUser()
  }, [])

  const sliderData = [
    {
      id: 1,
      image: slider1,
      title: 'Summer Collection',
      description: 'Discover the latest trends in summer fashion',
    },
    {
      id: 2,
      image: slider2,
      title: 'Winter Special',
      description: 'Stay warm and stylish with our winter collection',
    },
    {
      id: 3,
      image: slider1,
      title: 'New Arrivals',
      description: 'Fresh styles just arrived in store',
    },
  ]

  const isLastSlide = (index) => index === sliderData.length - 1

  // manual navigation
  const goToSlide = (index) => {
    const safeIndex = Math.max(0, Math.min(index, sliderData.length - 1))
    setActiveSlide(safeIndex)
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: safeIndex * (screenWidth - 32), // Changed to match slideWrapper width
        animated: true,
      })
    }
  }

  const nextSlide = () => goToSlide(activeSlide + 1)
  const prevSlide = () => goToSlide(activeSlide - 1)

  // More reliable slide change detection after swipe
  const handleMomentumScrollEnd = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / (screenWidth - 32)) // Changed to match slideWrapper width
    setActiveSlide(slide)
  }

  const updateLoginStatus = async () => {
    if (userId) {
      try {
        const result = await triggerLoginStatusUpdate(userId).unwrap()
        if (result.message === 'First login status updated successfully') {
          await AsyncStorage.setItem('authUser', JSON.stringify(result.user))
          router.push('/(tabs)/home')
        }
        console.log('Login status updated successfully:', result)
      } catch (error) {
        console.error('Error updating login status:', error)
      }
    }
  }

  return (
    <View style={styles.container}>
      <Image source={bub1} style={styles.image1} contentFit="contain" />

      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          decelerationRate={Platform.OS === 'ios' ? 0.98 : 0.98}
        >
          {sliderData.map((item, index) => (
            <View key={item.id} style={styles.slideWrapper}>
              <View style={styles.card}>
                {/* image - Fixed to be centered */}
                <View style={styles.imageWrap}>
                  <Image source={item.image} style={styles.sliderImage} contentFit="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.18)']}
                    style={styles.imageGradient}
                  />
                </View>

                {/* text */}
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>

                  {/* Explore Button - Only show on last slide */}
                  {isLastSlide(index) && (
                    <TouchableOpacity onPress={() => updateLoginStatus()} style={styles.exploreButton}>
                      <Text style={styles.exploreButtonText}>Explore</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Pagination and arrows - Centered below the card */}
              <View style={styles.controlsRow}>
                <TouchableOpacity onPress={prevSlide} style={styles.arrowButton} accessibilityLabel="Previous slide">
                  <Text style={styles.arrowText}>{'‹'}</Text>
                </TouchableOpacity>

                <View style={styles.pagination}>
                  {sliderData.map((_, dotIndex) => (
                    <TouchableOpacity
                      key={dotIndex}
                      onPress={() => goToSlide(dotIndex)}
                      style={[
                        styles.dot,
                        activeSlide === dotIndex ? styles.activeDot : styles.inactiveDot,
                      ]}
                      accessibilityLabel={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </View>

                <TouchableOpacity onPress={nextSlide} style={styles.arrowButton} accessibilityLabel="Next slide">
                  <Text style={styles.arrowText}>{'›'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default HomeSlider

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center', // Center vertically
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  image1: {
    width: '70%',
    height: '35%',
    zIndex: 1,
    position: 'absolute',
    top: -20,
    left: 0,
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollContent: {
    // Remove alignItems: 'center' as it conflicts with pagingEnabled
    // alignItems: 'center', // This was causing the issue
  },
  slideWrapper: {
    width: screenWidth - 32, // CHANGED: Subtract horizontal padding (16+16=32)
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 0, // Ensure no extra margin
  },
  card: {
    width: '100%', // CHANGED: Use 100% of slideWrapper
    height: 520,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f4f6fb',
  },
  imageWrap: {
    width: '100%',
    height: 300,
    backgroundColor: '#eee',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },
  textContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#07143B',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#566374',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  exploreButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 6,
    shadowColor: '#004CFF',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  controlsRow: {
    width: '100%', // CHANGED: Match slideWrapper width
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  arrowText: {
    fontSize: 26,
    color: '#1E293B',
    lineHeight: 26,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#004CFF',
    width: 22,
    borderRadius: 11,
  },
  inactiveDot: {
    backgroundColor: '#E6EEF9',
  },
})