import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
  Platform,
  SafeAreaView
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const ImageModal = ({
  visible,
  media,
  initialIndex = 0,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [showControls, setShowControls] = useState(true)
  const flatListRef = useRef(null)
  const controlsOpacity = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const doubleTapTimeout = useRef(null)

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex)
      StatusBar.setHidden(true, 'fade')
      
      // Auto-hide controls after 3 seconds
      const timer = setTimeout(() => {
        hideControls()
      }, 3000)
      
      return () => {
        clearTimeout(timer)
        StatusBar.setHidden(false, 'fade')
      }
    }
  }, [visible])

  if (!media || media.length === 0) return null

  const hideControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setShowControls(false))
  }

  const showControlsWithTimeout = () => {
    setShowControls(true)
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start()
    
    // Auto-hide again after 3 seconds
    clearTimeout(doubleTapTimeout.current)
    doubleTapTimeout.current = setTimeout(() => {
      hideControls()
    }, 3000)
  }

  const handleSwipe = (direction) => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex >= 0 && newIndex < media.length) {
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
        viewPosition: 0.5
      })
      setCurrentIndex(newIndex)
      showControlsWithTimeout()
    }
  }

  const handleDoubleTap = () => {
    // Reset any existing timeout
    clearTimeout(doubleTapTimeout.current)
    
    // Toggle zoom animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start()
    
    showControlsWithTimeout()
  }

  const handleSingleTap = () => {
    if (showControls) {
      hideControls()
    } else {
      showControlsWithTimeout()
    }
  }

  const handleFlatListScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
      showControlsWithTimeout()
    }
  }

  const renderImageItem = ({ item, index }) => {
    // Handle different media formats
    let source
    if (item.base64) {
      source = { uri: item.base64.startsWith('data:') ? item.base64 : `data:image/jpeg;base64,${item.base64}` }
    } else if (item.uri) {
      source = { uri: item.uri }
    } else if (item.url) {
      source = { uri: item.url }
    } else {
      return null
    }

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.imageContainer}
        onPress={handleSingleTap}
        onLongPress={showControlsWithTimeout}
        delayLongPress={500}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.imageWrapper}
          onPress={() => {
            clearTimeout(doubleTapTimeout.current)
            doubleTapTimeout.current = setTimeout(() => {
              handleSingleTap()
            }, 300)
          }}
          onPressIn={() => {
            clearTimeout(doubleTapTimeout.current)
          }}
          onPressOut={() => {
            clearTimeout(doubleTapTimeout.current)
            doubleTapTimeout.current = setTimeout(() => {
              handleSingleTap()
            }, 300)
          }}
          onLongPress={showControlsWithTimeout}
          delayLongPress={500}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.doubleTapArea}
            onPress={() => {
              // Handle double tap
              clearTimeout(doubleTapTimeout.current)
              handleDoubleTap()
            }}
            delayPressIn={0}
          >
            <Animated.Image
              source={source}
              style={[
                styles.image,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  const renderDotIndicator = () => {
    if (media.length <= 1) return null

    return (
      <View style={styles.dotContainer}>
        {media.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    )
  }

  const renderThumbnails = () => {
    if (media.length <= 1) return null

    return (
      <View style={styles.thumbnailContainer}>
        <FlatList
          data={media}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailList}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            let source
            if (item.base64) {
              source = { uri: item.base64.startsWith('data:') ? item.base64 : `data:image/jpeg;base64,${item.base64}` }
            } else if (item.uri) {
              source = { uri: item.uri }
            } else if (item.url) {
              source = { uri: item.url }
            } else {
              return null
            }

            return (
              <TouchableOpacity
                onPress={() => {
                  flatListRef.current?.scrollToIndex({
                    index: index,
                    animated: true
                  })
                  setCurrentIndex(index)
                  showControlsWithTimeout()
                }}
                style={[
                  styles.thumbnailWrapper,
                  currentIndex === index && styles.activeThumbnail
                ]}
              >
                <Image
                  source={source}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )
          }}
        />
      </View>
    )
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          {/* Main Image Gallery */}
          <FlatList
            ref={flatListRef}
            data={media}
            renderItem={renderImageItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleFlatListScroll}
            scrollEventThrottle={16}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise(resolve => setTimeout(resolve, 500))
              wait.then(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                })
              })
            }}
          />

          {/* Controls Overlay */}
          <Animated.View 
            style={[
              styles.controlsOverlay,
              { opacity: controlsOpacity }
            ]}
            pointerEvents={showControls ? 'auto' : 'none'}
          >
            {/* Top Bar */}
            <View style={styles.topBar}>
              <View style={styles.topBarLeft}>
                <Text style={styles.imageCounter}>
                  {currentIndex + 1} of {media.length}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Dot Indicators */}
            {renderDotIndicator()}

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
              {/* Thumbnails */}
              {renderThumbnails()}
              
              {/* Navigation Buttons */}
              {media.length > 1 && (
                <View style={styles.navigationButtons}>
                  <TouchableOpacity
                    style={[
                      styles.navButton,
                      currentIndex === 0 && styles.navButtonDisabled
                    ]}
                    onPress={() => handleSwipe('prev')}
                    disabled={currentIndex === 0}
                  >
                    <Text style={styles.navButtonIcon}>‹</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.navButton,
                      currentIndex === media.length - 1 && styles.navButtonDisabled
                    ]}
                    onPress={() => handleSwipe('next')}
                    disabled={currentIndex === media.length - 1}
                  >
                    <Text style={styles.navButtonIcon}>›</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Swipe Hint */}
          {media.length > 1 && showControls && (
            <View style={styles.swipeHint}>
              <Text style={styles.swipeHintText}>Swipe to navigate</Text>
            </View>
          )}

          {/* Zoom Hint */}
          {showControls && (
            <View style={styles.zoomHint}>
              <Text style={styles.zoomHintText}>Double tap to zoom • Tap to show/hide controls</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doubleTapArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
    maxHeight: '90%',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topBarLeft: {
    flex: 1,
  },
  imageCounter: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 24,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 12,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  bottomBar: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  thumbnailContainer: {
    marginBottom: 20,
  },
  thumbnailList: {
    paddingHorizontal: 10,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: '#fff',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonIcon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 30,
  },
  swipeHint: {
    position: 'absolute',
    top: '20%',
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  swipeHintText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  zoomHint: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  zoomHintText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
})

export default ImageModal