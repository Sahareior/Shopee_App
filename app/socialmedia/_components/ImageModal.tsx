import React, { useState, useRef } from 'react'
import {
  View,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const ImageModal = ({ visible, media, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const flatListRef = useRef(null)

  if (!media || media.length === 0) return null

  const handleClose = () => {
    setIsZoomed(false)
    onClose()
  }

  const handleDoubleTap = () => {
    setIsZoomed(!isZoomed)
  }

  const handleSingleTap = () => {
    if (isZoomed) {
      setIsZoomed(false)
    } else {
      handleClose()
    }
  }

  const handleScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setCurrentIndex(newIndex)
    setIsZoomed(false)
  }

  const renderImageItem = ({ item, index }) => {
    const uri = item.base64 || item.uri || item.url

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.imageContainer}
        onPress={handleSingleTap}
        onLongPress={() => {}}
        delayLongPress={500}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.imageWrapper}
          onPress={() => {
            handleDoubleTap()
          }}
          delayLongPress={500}
        >
          <Image
            source={{ uri }}
            style={[
              styles.image,
              isZoomed && styles.zoomedImage
            ]}
            resizeMode={isZoomed ? 'contain' : 'contain'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        <StatusBar hidden={visible} />
        
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Image counter */}
        {media.length > 1 && (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {currentIndex + 1} / {media.length}
            </Text>
          </View>
        )}

        {/* Main Image Gallery */}
        <FlatList
          ref={flatListRef}
          data={media}
          renderItem={renderImageItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          initialScrollIndex={0}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />

        {/* Dot indicators */}
        {media.length > 1 && (
          <View style={styles.dotsContainer}>
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
        )}

        {/* Zoom hint */}
        {!isZoomed && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              Double tap to zoom • Tap anywhere to close
            </Text>
          </View>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
  },
  counterContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  image: {
    width: '100%',
    height: '80%',
    maxHeight: '90%',
  },
  zoomedImage: {
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_HEIGHT * 1.5,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
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
  hintContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 80 : 60,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    zIndex: 1000,
  },
  hintText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
})

export default ImageModal