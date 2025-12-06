import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'

const { width: screenWidth } = Dimensions.get('window')

const Stories = () => {
  // Sample stories data with video thumbnails
  const stories = [
    {
      id: 1,
      user: {
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      },
      thumbnail: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      duration: '0:15',
      views: '2.1K',
      timestamp: '5 hours ago',
      isLive: false
    },
    {
      id: 2,
      user: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      },
      thumbnail: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      duration: '0:45',
      views: '5.3K',
      timestamp: '2 hours ago',
      isLive: true
    },
    {
      id: 3,
      user: {
        name: 'Emma Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      },
      thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      duration: '1:20',
      views: '8.7K',
      timestamp: '1 day ago',
      isLive: false
    },
    {
      id: 4,
      user: {
        name: 'John Smith',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      },
      thumbnail: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      duration: '0:30',
      views: '3.2K',
      timestamp: '3 hours ago',
      isLive: true
    }
  ]

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {stories.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyCard}>
            {/* Story Thumbnail */}
            <View style={styles.thumbnailContainer}>
              <Image 
                source={story.thumbnail} 
                style={styles.thumbnail}
                contentFit="cover"
              />
              
              {/* Gradient Overlay */}
              <View style={styles.gradientOverlay} />
              
              {/* User Info */}
              <View style={styles.userInfo}>
                <Image 
                  source={story.user.avatar} 
                  style={styles.avatar}
                  contentFit="cover"
                />
                <View style={styles.userText}>
                  <Text style={styles.userName}>{story.user.name}</Text>
                  <Text style={styles.timestamp}>{story.timestamp}</Text>
                </View>
              </View>
              
              {/* Live Badge or Duration */}
              {story.isLive ? (
                <View style={styles.liveBadge}>
                  <View style={styles.liveIndicator} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              ) : (
                <View style={styles.durationBadge}>
                  <Ionicons name="play" size={12} color="white" />
                  <Text style={styles.durationText}>{story.duration}</Text>
                </View>
              )}
              
              {/* Views Count */}
              <View style={styles.viewsContainer}>
                <Ionicons name="eye" size={14} color="white" />
                <Text style={styles.viewsText}>{story.views}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* Create Story Card */}
        <TouchableOpacity style={styles.createStoryCard}>
          <View style={styles.createStoryContent}>
            <View style={styles.plusIconContainer}>
              <Ionicons name="add" size={28} color="#004CFF" />
            </View>
            <Text style={styles.createStoryText}>Create Story</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default Stories

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 1,
  },
  scrollContainer: {
    paddingHorizontal: 12,
    gap: 12,
  },
  storyCard: {
    width: screenWidth * 0.7,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  thumbnailContainer: {
    flex: 1,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundGradient: 'vertical',
    backgroundGradientTop: 'transparent',
    backgroundGradientBottom: 'rgba(0,0,0,0.6)',
  },
  userInfo: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#004CFF',
  },
  userText: {
    marginLeft: 8,
  },
  userName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timestamp: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF375B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: 4,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  durationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  viewsContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewsText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  createStoryCard: {
    width: screenWidth * 0.7,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createStoryContent: {
    alignItems: 'center',
  },
  plusIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#004CFF',
    marginBottom: 12,
  },
  createStoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004CFF',
  },
})