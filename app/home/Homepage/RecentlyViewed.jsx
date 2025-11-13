import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'

import { useRouter } from 'expo-router'

const RecentlyViewed = ({from}) => {
  const [activeStatus, setActiveStatus] = useState('To Pay')
  const [storyModalVisible, setStoryModalVisible] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [currentUserIndex, setCurrentUserIndex] = useState(0)

  const router = useRouter()
console.log(from)
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

  return (
    <View style={styles.container}>
  

      {/* Navigation Tabs */}
{
  from !=='home' && (
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
      router.push('/home/Homepage/_routeCompo/Toreceive');
    } else {
      setActiveStatus(item);
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
</TouchableOpacity>

        ))}
      </View>
  )
}

      {/* Recently Viewed Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
         {
          from === 'home'?  <Text style={styles.title}>Top Products</Text>:  <Text style={styles.title}>Recently Viewed</Text>
         }
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {recentlyViewed.map((user, index) => (
            <TouchableOpacity 
              key={user.id} 
              style={styles.userItem}
              onPress={() => openStory(index, 0)}
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={user.image} 
                  style={styles.userImage}
                  contentFit="cover"
                />
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{user.time}</Text>
                </View>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Story Modal */}
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
            source={currentStory} 
            style={styles.storyImage}
            contentFit="cover"
          />

          {/* Header with user info */}
          <View style={styles.storyHeader}>
            <Image 
              source={currentUser?.image} 
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
    </View>
  )
}

export default RecentlyViewed

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  navigationTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 25,
    marginTop: 10,
    gap: 18
  },
  tab: {
    alignItems: 'center',
    position: 'relative',
    borderRadius: 8,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    paddingVertical: 7,
    paddingHorizontal: 9,
    fontWeight: '600',
    color: '#004CFF',
    backgroundColor: '#E5EBFC'
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