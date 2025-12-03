import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Image } from 'expo-image'
import bub1 from '../../assets/images/b1.png'
import slider1 from '../../assets/images/slider/slider1.png'
import slider2 from '../../assets/images/slider/slider2.png'
import { useRouter } from 'expo-router'

const { width: screenWidth } = Dimensions.get('window')

const HomeSlider = () => {
  const router = useRouter()
  const [activeSlide, setActiveSlide] = useState(0)
  const scrollRef = useRef(null)

  const sliderData = [
    {
      id: 1,
      image: slider1,
      title: "Summer Collection",
      description: "Discover the latest trends in summer fashion"
    },
    {
      id: 2,
      image: slider2,
      title: "Winter Special",
      description: "Stay warm and stylish with our winter collection"
    },
    {
      id: 3,
      image: slider1,
      title: "New Arrivals",
      description: "Fresh styles just arrived in store"
    }
  ]

  const isLastSlide = (index) => index === sliderData.length - 1

  // 👇 Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (activeSlide + 1) % sliderData.length
      setActiveSlide(nextSlide)

      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: nextSlide * screenWidth,
          animated: true,
        })
      }
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [activeSlide, sliderData.length])

  return (
    <View style={styles.container}>
      <Image source={bub1} style={styles.image1} contentFit="contain" />
      
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const slide = Math.round(event.nativeEvent.contentOffset.x / screenWidth)
            setActiveSlide(slide)
          }}
          scrollEventThrottle={16}
        >
          {sliderData.map((item, index) => (
            <View key={item.id} style={styles.slide}>
              <View style={styles.card}>
                <Image 
                  source={item.image} 
                  style={styles.sliderImage}
                  contentFit="cover"
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  
                  {/* Explore Button - Only show on last slide */}
                  {isLastSlide(index) && (
                    <TouchableOpacity onPress={()=> router.push('/(tabs)/home')} style={styles.exploreButton}>
                      <Text style={styles.exploreButtonText}>Explore</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Pagination */}
              <View style={styles.pagination}>
                {sliderData.map((_, dotIndex) => (
                  <View
                    key={dotIndex}
                    style={[
                      styles.dot,
                      activeSlide === dotIndex ? styles.activeDot : styles.inactiveDot
                    ]}
                  />
                ))}
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
    backgroundColor: 'white',
    paddingHorizontal: 16,
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
  slide: {
    width: screenWidth - 32,
    height: 600, // Reduced from 900 to prevent excessive scrolling
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  card: {
    width: '100%',
    height: 570,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sliderImage: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: '#004CFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exploreButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#004CFF',
    width: 20,
  },
  inactiveDot: {
    backgroundColor: '#ddd',
  },
})