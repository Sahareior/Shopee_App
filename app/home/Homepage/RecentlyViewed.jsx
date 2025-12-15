// RecentlyViewed.js
import { useGetStoryQuery, useLazyGetMediaByIdQuery } from '@/app/redux/slices/jsonApiSlice';
import { Ionicons } from '@expo/vector-icons'; // Import icons for add story
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    Image as RNImage,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RecentlyViewed = ({ from, data }) => {
 
  const [storyModalVisible, setStoryModalVisible] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const { data: feedResponse, isLoading, error } = useGetStoryQuery();
  const [triggerGetMedia, { data: mediaData, isLoading: isMediaLoading }] = useLazyGetMediaByIdQuery();

  const [storiesData, setStoriesData] = useState([]);
  const [loadedMedia, setLoadedMedia] = useState({});
  const [currentMediaUrl, setCurrentMediaUrl] = useState(null);
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });

  const router = useRouter();

  useEffect(() => {
    if (feedResponse?.success && feedResponse?.feed?.length > 0) {
      const transformedData = feedResponse.feed.map((feedItem, index) => {
        const user = feedItem.user;
        let defaultImage = 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        if (user.isCurrentUser) defaultImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60';
        return {
          id: user._id || index,
          storyId: feedItem.stories?.[0]?.id,
          name: user.name || user.username || 'User',
          image: defaultImage,
          time: feedItem.stories?.length > 0 ? getTimeAgo(feedItem.stories[0].createdAt) : 'Just now',
          stories: feedItem.stories || [],
          canAddStory: feedItem.canAddStory || false,
          storyCount: feedItem.storyCount || 0,
          isCurrentUser: user.isCurrentUser || false,
        };
      });
      setStoriesData(transformedData);
    }
  }, [feedResponse]);

  // Get image dimensions when media URL changes
  useEffect(() => {
    if (currentMediaUrl) {
      RNImage.getSize(
        currentMediaUrl,
        (width, height) => {
          setImageAspectRatio(width / height);
        },
        (error) => {
          console.error('Error getting image size:', error);
          setImageAspectRatio(16/9); // Default aspect ratio
        }
      );
    }
  }, [currentMediaUrl]);

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const now = new Date();
    const storyDate = new Date(dateString);
    const diffMs = now - storyDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1d ago';
    return `${diffDays}d ago`;
  };

const loadStoryMedia = async (storyId) => {
  if (loadedMedia[storyId]) return loadedMedia[storyId];
  
  try {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      console.error('No authentication token found');
      // You might want to redirect to login here or handle unauthorized state
      return null;
    }

    const response = await fetch(`https://ski-macro-carmen-actually.trycloudflare.com/story/media/${storyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 401) {
      // Token is invalid or expired
      console.error('Token verification failed - unauthorized');
      // Handle token refresh or redirect to login
      await AsyncStorage.removeItem('authToken'); // Clear invalid token
      // Optional: Trigger a token refresh or redirect to login
      return null;
    }
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const blob = await response.blob();
    const reader = new FileReader();
    const mediaUrl = await new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    
    setLoadedMedia((prev) => ({ ...prev, [storyId]: mediaUrl }));
    return mediaUrl;
    
  } catch (error) {
    console.error('Error loading media:', error);
    return null;
  }
};

  const otherUsers = [
    {
      id: 1,
      name: 'Sarah',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '2h ago',
      stories: [{ id: 'sample1', mediaUrl: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60', caption: 'Beautiful day', mediaType: 'image' }],
    },
    {
      id: 2,
      name: 'Mike',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '5h ago',
      stories: [{ id: 'sample2', mediaUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60', caption: 'Morning coffee', mediaType: 'image' }],
    },
  ];

  // Find current user and check if they have stories
  const currentUserData = storiesData.find(user => user.isCurrentUser);
  const hasCurrentUserStories = currentUserData?.stories?.length > 0;
  
  // Filter out current user from allUsers if they don't have stories
  const allUsers = storiesData.length > 0 
    ? storiesData.filter(user => user.isCurrentUser ? hasCurrentUserStories : true)
    : otherUsers;

  const openStory = async (userIndex, storyIndex = 0) => {
    const user = allUsers[userIndex];
    const story = user.stories[storyIndex];
    setCurrentUserIndex(userIndex);
    setCurrentStoryIndex(storyIndex);
    setStoryModalVisible(true);
    setCurrentMediaUrl(null);
    setImageAspectRatio(1); // Reset aspect ratio

    if (story?.id && !story.mediaUrl?.includes('unsplash')) {
      const mediaUrl = await loadStoryMedia(story.id);
      if (mediaUrl) setCurrentMediaUrl(mediaUrl);
    } else if (story?.mediaUrl) {
      setCurrentMediaUrl(story.mediaUrl);
    }
  };

  const navigateToStory = async (userIndex, storyIndex) => {
    const user = allUsers[userIndex];
    const story = user.stories[storyIndex];
    setCurrentUserIndex(userIndex);
    setCurrentStoryIndex(storyIndex);
    setCurrentMediaUrl(null);
    setImageAspectRatio(1);

    if (story?.id && !story.mediaUrl?.includes('unsplash')) {
      const mediaUrl = await loadStoryMedia(story.id);
      if (mediaUrl) setCurrentMediaUrl(mediaUrl);
    } else if (story?.mediaUrl) {
      setCurrentMediaUrl(story.mediaUrl);
    }
  };

  const nextStory = async () => {
    const currentUser = allUsers[currentUserIndex];
    if (currentStoryIndex < currentUser.stories.length - 1) {
      await navigateToStory(currentUserIndex, currentStoryIndex + 1);
    } else {
      if (currentUserIndex < allUsers.length - 1) {
        await navigateToStory(currentUserIndex + 1, 0);
      } else {
        closeStory();
      }
    }
  };

  const previousStory = async () => {
    if (currentStoryIndex > 0) {
      await navigateToStory(currentUserIndex, currentStoryIndex - 1);
    } else {
      if (currentUserIndex > 0) {
        const prevUserIndex = currentUserIndex - 1;
        const prevUser = allUsers[prevUserIndex];
        await navigateToStory(prevUserIndex, prevUser.stories.length - 1);
      }
    }
  };

  const closeStory = () => {
    setStoryModalVisible(false);
    setCurrentStoryIndex(0);
    setCurrentUserIndex(0);
    setCurrentMediaUrl(null);
    setImageAspectRatio(1);
  };

  const handleContainerLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  // Calculate image dimensions based on aspect ratio and container
  const calculateImageDimensions = () => {
    const containerWidth = containerSize.width;
    const containerHeight = containerSize.height;
    
    if (imageAspectRatio > containerWidth / containerHeight) {
      // Image is wider than container - fit to width
      return {
        width: containerWidth,
        height: containerWidth / imageAspectRatio
      };
    } else {
      // Image is taller than container - fit to height
      return {
        width: containerHeight * imageAspectRatio,
        height: containerHeight
      };
    }
  };

  const imageDimensions = calculateImageDimensions();

  // Render text overlays with proper positioning
const renderTextOverlays = (overlays, containerWidth, containerHeight, storyData) => {
  if (!overlays || overlays.length === 0) return null;

  const previewWidth = storyData?.previewWidth || containerWidth;
  const previewHeight = storyData?.previewHeight || containerHeight;

  // Calculate scaling factor
  // The text was positioned relative to the preview during upload
  // Now we need to scale it to the current display container
  const scaleX = containerWidth / previewWidth;
  const scaleY = containerHeight / previewHeight;
  
  // Use average scaling to maintain aspect ratio
  const scale = (scaleX + scaleY) / 2;

  return overlays.map((overlay, index) => {
    if (!overlay.relativePosition) return null;

    try {
      const { x: relX, y: relY } = overlay.relativePosition;
      
      // The relative position is based on the preview dimensions during upload
      const positionX = relX * containerWidth * scale;
      const positionY = relY * containerHeight * scale;
      
      // Scale font size as well
      const fontSize = overlay.fontSize ? overlay.fontSize * scale : 24 * scale;

      return (
        <Text
          key={overlay.id || index}
          style={{
            position: 'absolute',
            left: positionX,
            top: positionY,
            color: overlay.color || '#FFFFFF',
            fontSize: fontSize,
            fontWeight: overlay.bold ? 'bold' : 'normal',
            fontStyle: overlay.italic ? 'italic' : 'normal',
            textDecorationLine: overlay.underline ? 'underline' : 'none',
            textAlign: overlay.align || 'center',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
            backgroundColor: 'transparent',
            zIndex: 100,
            maxWidth: containerWidth * 0.8,
            includeFontPadding: false,
          }}
        >
          {overlay.text}
        </Text>
      );
    } catch (error) {
      console.error('Error rendering text overlay:', error);
      return null;
    }
  });
};

  const handleAddStory = () => {
    router.push('/home/ProfilePage/activity');
  };

  const currentUser = allUsers[currentUserIndex];
  const currentStory = currentUser?.stories?.[currentStoryIndex];


  if(feedResponse?.meta?.ownStoryCount === 0 && feedResponse?.meta?.randomUserCount === 0){
    return(
      <Text style={{
        paddingHorizontal:20
      }}>
        No active stories found! please upload one.
      </Text>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>{from === 'home' ? 'Top Products' : 'Stories'}</Text>
          {from === 'home' && (
            <TouchableOpacity onPress={() => router.push('/products/recently-viewed')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#004CFF" />
            <Text>Loading stories...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading stories</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            {from === 'home' && data ? (
              data.map((product) => (
                <TouchableOpacity key={product._id} style={styles.productItem} onPress={() => router.push(`/product/${product._id}`)}>
                  <View style={styles.productImageContainer}>
                    <Image source={{ uri: product.images[0] }} style={styles.productImage} contentFit="cover" />
                  </View>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              // Render Add Story button if current user has no stories
              !hasCurrentUserStories && (
                <TouchableOpacity 
                  style={styles.addStoryItem} 
                  onPress={handleAddStory}
                >
                  <View style={styles.addStoryImageContainer}>
                    <Image 
                      source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60' }} 
                      style={styles.addStoryImage} 
                      contentFit="cover" 
                    />
                    <View style={styles.addStoryPlusIcon}>
                      <Ionicons name="add-circle" size={28} color="#004CFF" />
                    </View>
                  </View>
                  <Text style={styles.addStoryText}>Add a story</Text>
                </TouchableOpacity>
              ),
              
              // Render all users (excluding current user if they have no stories)
              allUsers.map((user, index) => (
                <TouchableOpacity key={user.id} style={styles.userItem} onPress={() => openStory(index, 0)}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: user.image }} style={styles.userImage} contentFit="cover" />
                    {user.storyCount > 0 && (
                      <View style={styles.storyCountBadge}>
                        <Text style={styles.storyCountText}>{user.storyCount}</Text>
                      </View>
                    )}
                    {user.isCurrentUser && (
                      <View style={styles.currentUserBadge}>
                        <Text style={styles.currentUserText}>You</Text>
                      </View>
                    )}
                    {user.time && (
                      <View style={styles.timeBadge}>
                        <Text style={styles.timeText}>{user.time}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.userName}>{user.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* STORY MODAL */}
      {from !== 'home' && currentUser && (
        <Modal visible={storyModalVisible} transparent={true} animationType="fade" onRequestClose={closeStory}>
          <View style={styles.modalContainer}>
            {isMediaLoading ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#004CFF" />
                <Text style={styles.loadingText}>Loading story...</Text>
              </View>
            ) : null}

            {currentUser?.stories?.length > 1 && (
              <View style={styles.progressBarsContainer}>
                {currentUser.stories.map((_, index) => (
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
            )}

            <View 
              style={styles.storyContent}
              onLayout={handleContainerLayout}
            >
              {currentMediaUrl ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: currentMediaUrl }}
                    style={[
                      styles.storyImage,
                      {
                        width: imageDimensions.width,
                        height: imageDimensions.height,
                        maxWidth: '100%',
                        maxHeight: '100%',
                      }
                    ]}
                    contentFit="contain"
                    transition={200}
                  />
                  
                  {currentStory?.textOverlays && 
                    renderTextOverlays(
                      currentStory.textOverlays, 
                      containerSize.width, 
                      containerSize.height,
                      imageDimensions.width,
                      imageDimensions.height
                      
                    )
                  }
                </View>
              ) : (
                <View style={styles.mediaPlaceholder}>
                  <ActivityIndicator size="large" color="#004CFF" />
                  <Text style={styles.placeholderText}>Loading story...</Text>
                </View>
              )}
            </View>

            <View style={styles.storyHeader}>
              <Image source={{ uri: currentUser?.image }} style={styles.storyUserImage} contentFit="cover" />
              <View style={styles.storyUserInfo}>
                <Text style={styles.storyUserName}>
                  {currentUser?.name}
                  {currentUser?.isCurrentUser && ' (You)'}
                </Text>
                <Text style={styles.storyTime}>
                  {currentStory?.createdAt ? getTimeAgo(currentStory.createdAt) : currentUser?.time}
                </Text>
              </View>
            </View>

            {currentStory?.caption && (
              <View style={styles.captionContainer}>
                <Text style={styles.captionText}>{currentStory.caption}</Text>
              </View>
            )}

            {currentStory?.mediaType && (
              <View style={styles.mediaTypeBadge}>
                <Text style={styles.mediaTypeText}>
                  {currentStory.mediaType === 'image' ? '📷 Photo' : '🎥 Video'}
                </Text>
              </View>
            )}

            <TouchableOpacity style={[styles.navButton, styles.leftButton]} onPress={previousStory} />
            <TouchableOpacity style={[styles.navButton, styles.rightButton]} onPress={nextStory} />

            <TouchableOpacity style={styles.closeButton} onPress={closeStory}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <View style={styles.actionButtons}>

              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>💬</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default RecentlyViewed;

const styles = StyleSheet.create({
  container: { 
    backgroundColor: 'white', 
    paddingHorizontal: 16 
  },
  section: { 
    marginVertical: 30 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 26 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  seeAllText: { 
    fontSize: 14, 
    color: '#004CFF', 
    fontWeight: '600' 
  },
  loadingContainer: { 
    height: 100, 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row', 
    gap: 10 
  },
  errorContainer: { 
    height: 100, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  errorText: { 
    color: 'red' 
  },
  scrollContainer: { 
    paddingRight: 16, 
    gap: 15 
  },
  userItem: { 
    alignItems: 'center', 
    marginRight: 15, 
    width: 70 
  },
  // Add Story styles
  addStoryItem: { 
    alignItems: 'center', 
    marginRight: 15, 
    width: 70 
  },
  addStoryImageContainer: { 
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addStoryImage: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    borderWidth: 2, 
    borderColor: '#E0E0E0', 
    opacity: 0.9,
  },
  addStoryPlusIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#004CFF',
  },
  addStoryText: { 
    fontSize: 12, 
    fontWeight: '500', 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 4 
  },
  imageContainer: { 
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    borderWidth: 2, 
    borderColor: '#004CFF', 
    marginBottom: 8 
  },
  storyCountBadge: { 
    position: 'absolute', 
    top: -5, 
    right: -5, 
    backgroundColor: '#004CFF', 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: 'white' 
  },
  storyCountText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  currentUserBadge: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#004CFF', 
    paddingVertical: 2, 
    borderBottomLeftRadius: 35, 
    borderBottomRightRadius: 35 
  },
  currentUserText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  timeBadge: { 
    position: 'absolute', 
    top: -1, 
    right: -13, 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 10, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  timeText: { 
    fontSize: 10, 
    color: 'white', 
    fontWeight: '600' 
  },
  userName: { 
    fontSize: 12, 
    fontWeight: '500', 
    color: '#333', 
    textAlign: 'center', 
    marginBottom: 4 
  },
  productItem: { 
    width: 140, 
    marginRight: 15, 
    alignItems: 'flex-start' 
  },
  productImageContainer: { 
    width: 140, 
    height: 140, 
    borderRadius: 12, 
    overflow: 'hidden', 
    marginBottom: 8, 
    backgroundColor: '#f8f9fa', 
    position: 'relative' 
  },
  productImage: { 
    width: '100%', 
    height: '100%' 
  },
  modalContainer: { 
    flex: 1, 
    backgroundColor: 'black', 
    position: 'relative' 
  },
  loadingOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1002 
  },
  loadingText: { 
    color: 'white', 
    marginTop: 10, 
    fontSize: 16 
  },
  progressBarsContainer: { 
    flexDirection: 'row', 
    paddingHorizontal: 10, 
    paddingTop: 50, 
    gap: 4, 
    zIndex: 1000 
  },
  progressBarBackground: { 
    flex: 1, 
    height: 3, 
    backgroundColor: 'rgba(255,255,255,0.3)', 
    borderRadius: 2, 
    overflow: 'hidden' 
  },
  progressBar: { 
    height: '100%', 
    backgroundColor: 'white', 
    borderRadius: 2 
  },
  storyContent: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative' 
  },
  storyImage: {
    backgroundColor: 'transparent',
  },
  mediaPlaceholder: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#333' 
  },
  placeholderText: { 
    color: 'white', 
    fontSize: 16 
  },
  storyHeader: { 
    position: 'absolute', 
    top: 60, 
    left: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    zIndex: 1001 
  },
  storyUserImage: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: '#004CFF' 
  },
  storyUserInfo: { 
    flexDirection: 'column' 
  },
  storyUserName: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  storyTime: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: 14 
  },
  captionContainer: { 
    position: 'absolute', 
    bottom: 40, 
    left: 15, 
    right: 15, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 15, 
    borderRadius: 10, 
    zIndex: 1001 
  },
  captionText: { 
    color: 'white', 
    fontSize: 16 
  },
  mediaTypeBadge: { 
    position: 'absolute', 
    top: 110, 
    right: 15, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 15, 
    zIndex: 1001 
  },
  mediaTypeText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  navButton: { 
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    width: '50%', 
    zIndex: 1000 
  },
  leftButton: { 
    left: 0 
  },
  rightButton: { 
    right: 0 
  },
  closeButton: { 
    position: 'absolute', 
    top: 50, 
    right: 15, 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1001 
  },
  closeButtonText: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  actionButtons: { 
    position: 'absolute', 
    bottom: 40, 
    right: 15, 
    flexDirection: 'column', 
    gap: 10, 
    zIndex: 1001 
  },
  actionButton: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  actionButtonText: { 
    fontSize: 24 
  },
});