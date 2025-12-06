import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const RecentlyViewed = ({from, data}) => {
  const [activeStatus, setActiveStatus] = useState('To Pay')
  const [storyModalVisible, setStoryModalVisible] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [currentUserIndex, setCurrentUserIndex] = useState(0)

  const router = useRouter()

  // Sample data for recently viewed profiles with stories
  const recentlyViewed = [
    {
      id: 1,
      name: 'Sarah',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '2h ago',
      stories: [
        'https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      ]
    },
    {
      id: 2,
      name: 'Mike',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '5h ago',
      stories: [
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      ]
    },
    {
      id: 3,
      name: 'Emma',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '1d ago',
      stories: [
        'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      ]
    },
    {
      id: 4,
      name: 'John',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '2d ago',
      stories: [
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      ]
    },
    {
      id: 5,
      name: 'Lisa',
      image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '3d ago',
      stories: [
        'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      ]
    },
    {
      id: 6,
      name: 'David',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '3d ago',
      stories: [
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      ]
    }
  ]

  const statusItems = ['To Pay', 'To Receive', 'To Review']

  const openStory = (userIndex, storyIndex = 0) => {
    setCurrentUserIndex(userIndex)
    setCurrentStoryIndex(storyIndex)
    setStoryModalVisible(true)
  }

  const closeStory = () => {
    setStoryModalVisible(false)
    setCurrentStoryIndex(0)
  }

  const nextStory = () => {
    const currentUser = recentlyViewed[currentUserIndex]
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
    } else {
      // Move to next user
      if (currentUserIndex < recentlyViewed.length - 1) {
        setCurrentUserIndex(currentUserIndex + 1)
        setCurrentStoryIndex(0)
      } else {
        closeStory()
      }
    }
  }

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    } else {
      // Move to previous user
      if (currentUserIndex > 0) {
        const previousUser = recentlyViewed[currentUserIndex - 1]
        setCurrentUserIndex(currentUserIndex - 1)
        setCurrentStoryIndex(previousUser.stories.length - 1)
      }
    }
  }

  const currentUser = recentlyViewed[currentUserIndex]
  const currentStory = currentUser?.stories[currentStoryIndex]

  // Render product items when from='home'
  const renderProductItem = (product) => (
    <TouchableOpacity 
      key={product._id} 
      style={styles.productItem}
      onPress={() => {
        // Navigate to product detail page
        router.push(`/product/${product._id}`)
      }}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: product.images[0] }} 
          style={styles.productImage}
          contentFit="cover"
        />
        {/* Show discount badge if discountPrice exists */}
        {product.discountPrice && product.price > product.discountPrice && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
      <View style={styles.priceContainer}>
        {product.discountPrice ? (
          <>
            <Text style={styles.discountedPrice}>${product.discountPrice.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
          </>
        ) : (
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        )}
      </View>
      {/* Rating */}
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>⭐ {product.rating.toFixed(1)}</Text>
        <Text style={styles.reviews}>({product.reviews})</Text>
      </View>
    </TouchableOpacity>
  )

  // Render user items when from!='home'
  const renderUserItem = (user, index) => (
    <TouchableOpacity 
      key={user.id} 
      style={styles.userItem}
      onPress={() => openStory(index, 0)}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: user.image }} 
          style={styles.userImage}
          contentFit="cover"
        />
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{user.time}</Text>
        </View>
      </View>
      <Text style={styles.userName}>{user.name}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Navigation Tabs */}
      {from !== 'home' && (
        <View style={styles.navigationTabs}>
          {statusItems.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tab,
                activeStatus === item && styles.tabActive
              ]}
              onPress={() => {
                if (item === 'To Receive') {
                  router.push('/home/Homepage/_routeCompo/Toreceive')
                } else {
                  setActiveStatus(item)
                }
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeStatus === item && styles.tabTextActive
                ]}
              >
                {item}
              </Text>
              {/* Active indicator */}
              {activeStatus === item && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recently Viewed / Top Products Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          {from === 'home' ? (
            <Text style={styles.title}>Top Products</Text>
          ) : (
            <Text style={styles.title}>Recently Viewed</Text>
          )}
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {from === 'home' && data ? (
            // Render product items when from='home'
            data.map(product => renderProductItem(product))
          ) : (
            // Render user items when from!='home'
            recentlyViewed.map((user, index) => renderUserItem(user, index))
          )}
        </ScrollView>
      </View>

      {/* Story Modal - Only for non-home views */}
      {from !== 'home' && (
        <Modal
          visible={storyModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeStory}
        >
          <View style={styles.modalContainer}>
            {/* Progress Bars */}
            <View style={styles.progressBarsContainer}>
              {currentUser?.stories.map((_, index) => (
                <View key={index} style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBar,
                      { 
                        width: `${((index + 1) / currentUser.stories.length) * 100}%`,
                        opacity: index <= currentStoryIndex ? 1 : 0.3
                      }
                    ]} 
                  />
                </View>
              ))}
            </View>

            {/* Story Image */}
            <Image 
              source={{ uri: currentStory }} 
              style={styles.storyImage}
              contentFit="cover"
            />

            {/* Header with user info */}
            <View style={styles.storyHeader}>
              <Image 
                source={{ uri: currentUser?.image }} 
                style={styles.storyUserImage}
                contentFit="cover"
              />
              <Text style={styles.storyUserName}>{currentUser?.name}</Text>
              <Text style={styles.storyTime}>{currentUser?.time}</Text>
            </View>

            {/* Navigation Buttons */}
            <TouchableOpacity 
              style={[styles.navButton, styles.leftButton]}
              onPress={previousStory}
            />
            <TouchableOpacity 
              style={[styles.navButton, styles.rightButton]}
              onPress={nextStory}
            />

            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeStory}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  )
}

export default RecentlyViewed

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
  
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  navigationTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 1,
    marginBottom: 5,
    marginTop: 2,
    gap: 8,
    backgroundColor: '#F5F5F5',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    position: 'relative',
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  tabTextActive: {
    color: '#004CFF',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 3,
    backgroundColor: '#004CFF',
    borderRadius: 2,
  },
  section: {
    marginVertical: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#004CFF',
    fontWeight: '600',
  },
  scrollContainer: {
    paddingRight: 16,
    gap: 15,
  },
  // User item styles (for recently viewed)
  userItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  imageContainer: {
    position: 'relative',
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#004CFF',
    marginBottom: 8,
  },
  timeBadge: {
    position: 'absolute',
    top: -1,
    right: -13,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  timeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  userName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  // Product item styles (for home page)
  productItem: {
    width: 140,
    marginRight: 15,
    alignItems: 'flex-start',
  },
  productImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    height: 40, // Fixed height for 2 lines
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#FFD700',
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#999',
  },
  // Story Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  progressBarsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 50,
    gap: 4,
  },
  progressBarBackground: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  storyImage: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  storyHeader: {
    position: 'absolute',
    top: 60,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storyUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#004CFF',
  },
  storyUserName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storyTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  navButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
  },
  leftButton: {
    left: 0,
  },
  rightButton: {
    right: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
})