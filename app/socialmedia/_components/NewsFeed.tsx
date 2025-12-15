import { useDeletePostsMutation, useGetNewsFeedQuery, useLazyReactPostQuery } from '@/app/redux/slices/jsonApiSlice'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useToast } from "react-native-toast-notifications";
import React, { useEffect, useState, useRef } from 'react'
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import ImageModal from './ImageModal'

const { width, height } = Dimensions.get('window')
const REFRESH_THRESHOLD = 100;
const REFRESH_HEIGHT = 60;

const formatDate = (iso) => {
  try {
    const date = new Date(iso)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return iso
  }
}

const getReactionIcon = (type) => {
  switch(type) {
    case 'like': return '👍';
    case 'love': return '❤️';
    case 'haha': return '😄';
    case 'wow': return '😮';
    case 'sad': return '😢';
    case 'angry': return '😠';
    default: return '👍';
  }
}

const getFeelingIcon = (feeling) => {
  switch(feeling?.toLowerCase()) {
    case 'happy': return '😊';
    case 'sad': return '😢';
    case 'angry': return '😠';
    case 'excited': return '🤩';
    case 'cool': return '😎';
    case 'love': return '❤️';
    case 'sick': return '🤒';
    case 'thinking': return '🤔';
    case 'blessed': return '🙏';
    case 'grateful': return '🙌';
    case 'tired': return '😴';
    case 'confused': return '😕';
    case 'nervous': return '😰';
    case 'proud': return '😊';
    default: return '😊';
  }
}

const getFeelingLabel = (feeling) => {
  return feeling ? feeling.charAt(0).toUpperCase() + feeling.slice(1) : '';
}

const ReactionPicker = ({ visible, position, onSelect, onClose }) => {
  if (!visible) return null

  const reactions = [
    { type: 'like', icon: '👍', label: 'Like' },
    { type: 'love', icon: '❤️', label: 'Love' },
    { type: 'haha', icon: '😄', label: 'Haha' },
    { type: 'wow', icon: '😮', label: 'Wow' },
    { type: 'sad', icon: '😢', label: 'Sad' },
    { type: 'angry', icon: '😠', label: 'Angry' },
  ]

  return (
    <View style={[styles.reactionPicker, { left: position.x - 100, bottom: position.y + 50 }]}>
      <View style={styles.reactionPickerContent}>
        {reactions.map((reaction) => (
          <TouchableOpacity
            key={reaction.type}
            style={styles.reactionOption}
            onPress={() => onSelect(reaction.type)}
          >
            <Text style={styles.reactionEmoji}>{reaction.icon}</Text>
            <Text style={styles.reactionLabel}>{reaction.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

// Refresh Header Component
const RefreshHeader = ({ pullAnim, isRefreshing, refreshTriggered, opacity }) => {
  const rotate = pullAnim.interpolate({
    inputRange: [0, REFRESH_THRESHOLD],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'clamp',
  });

  const scale = pullAnim.interpolate({
    inputRange: [0, REFRESH_THRESHOLD],
    outputRange: [0.5, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[
        styles.refreshHeader,
        { 
          height: Animated.add(pullAnim, new Animated.Value(0)),
          opacity: opacity,
        }
      ]}
    >
      <View style={styles.refreshContent}>
        {isRefreshing ? (
          <View style={styles.loadingContainer}>
            <Animated.View 
              style={[
                styles.loadingCircle,
                { 
                  transform: [{ rotate }],
                }
              ]}
            >
              <View style={styles.loadingSpinner} />
            </Animated.View>
            <Text style={styles.refreshText}>Refreshing...</Text>
          </View>
        ) : (
          <View style={styles.pullContainer}>
            <Animated.View 
              style={[
                styles.arrowContainer,
                { 
                  transform: [{ scale }],
                }
              ]}
            >
              <View style={[
                styles.arrow,
                { transform: [{ rotate: refreshTriggered ? '180deg' : '0deg' }] }
              ]} />
            </Animated.View>
            <Text style={styles.refreshText}>
              {refreshTriggered ? 'Release to refresh' : 'Pull to refresh'}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// Custom Popover Component
const CustomPopover = ({
  visible,
  anchorPosition,
  onClose,
  onEdit,
  onDelete,
  postId,
  isDeleting
}) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.7,
          duration: 120,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible animationType="none">
      <TouchableOpacity
        style={styles.popoverOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Popover Card */}
        <Animated.View
          style={[
            styles.popoverCard,
            {
              top: anchorPosition.y + 10,
              left: anchorPosition.x - 120,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Arrow */}
          <View style={styles.popoverArrow} />

          {/* Edit */}
          <TouchableOpacity
            style={styles.popoverRow}
            onPress={() => {
              onClose();
              onEdit?.();
            }}
          >
            <Ionicons name="create-outline" size={18} color="#2C7BE5" />
            <Text style={styles.popoverRowText}>Edit Post</Text>
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity
            style={styles.popoverRow}
            onPress={() => {
              onClose();
              onDelete?.();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size={16} color="red" />
            ) : (
              <Ionicons name="trash-outline" size={18} color="#E74C3C" />
            )}
            <Text style={[styles.popoverRowText, { color: '#E74C3C' }]}>
              Delete Post
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};


export default function NewsFeed() {
  const [commentInputs, setCommentInputs] = useState({})
  const [showReactionPicker, setShowReactionPicker] = useState(null)
  const [reactionPickerPosition, setReactionPickerPosition] = useState({ x: 0, y: 0 })
  const [showModal, setShowModal] = useState(false)
  const [imageData,setImageData] = useState(null)
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(null); // Changed to store postId
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });
  
  const { data: demoData, refetch: postRefetch } = useGetNewsFeedQuery()
  const [trigger, {data,isLoading}] = useLazyReactPostQuery()
  const [posts, setPosts] = useState([])
  const [deletePosts] = useDeletePostsMutation()
  const toast = useToast();
  
  // Pull-to-refresh state
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshTriggered, setRefreshTriggered] = useState(false)
  const pullAnim = useRef(new Animated.Value(0)).current
  const scrollOffset = useRef(0)
  const isDragging = useRef(false)
  const opacity = pullAnim.interpolate({
    inputRange: [0, 50, REFRESH_THRESHOLD],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (demoData?.data?.posts) {
      console.log('Fetched posts:', demoData.data.posts.length);
      const processedPosts = demoData.data.posts.map(post => {
        if (post.media && post.media.length > 0) {
          const processedMedia = post.media.map(mediaItem => ({
            ...mediaItem,
            uri: mediaItem.base64,
            mediaType: mediaItem.mediaType || 'image'
          }));
          return { ...post, media: processedMedia };
        }
        return post;
      });
      setPosts(processedPosts);
    }
  }, [demoData]);

  const handelDelete = async (id) => {
    try {
      setDeletingPostId(id);
      setShowOptionsModal(null); // Close modal immediately
      
      const response = await deletePosts(id);
      
      if (response?.error?.status === 403) {
        toast.show("You can only delete your own posts!", {
          type: "danger",
          placement: "top",
          duration: 2000,
        });
      } else if (response?.error) {
        toast.show("Failed to delete post!", {
          type: "danger",
          placement: "top",
          duration: 2000,
        });
      } else {
        toast.show("Your post has been deleted!", {
          type: "success",
          placement: "top",
          duration: 2000,
        });
        
        // Remove from local state
        setPosts(prev => prev.filter(post => post._id !== id));
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.show("An error occurred!", {
        type: "danger",
        placement: "top",
        duration: 2000,
      });
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setRefreshTriggered(true);
    
    try {
      await postRefetch();
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Refresh failed:', error);
      Alert.alert('Refresh Error', 'Failed to refresh feed. Please try again.');
    } finally {
      setIsRefreshing(false);
      setRefreshTriggered(false);
      Animated.spring(pullAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 100,
        friction: 10,
      }).start();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    scrollOffset.current = yOffset;
    
    if (yOffset <= 0 && isDragging.current) {
      const pullDownDistance = Math.abs(yOffset);
      setPullDistance(pullDownDistance);
      
      const rubberBandDistance = pullDownDistance > REFRESH_THRESHOLD 
        ? REFRESH_THRESHOLD + (pullDownDistance - REFRESH_THRESHOLD) * 0.3
        : pullDownDistance;
      
      pullAnim.setValue(Math.min(rubberBandDistance, REFRESH_THRESHOLD * 1.5));
      
      if (pullDownDistance >= REFRESH_THRESHOLD && !refreshTriggered) {
        setRefreshTriggered(true);
      }
    }
  };

  const handleScrollBeginDrag = () => {
    isDragging.current = true;
  };

  const handleScrollEndDrag = () => {
    isDragging.current = false;
    
    if (pullDistance >= REFRESH_THRESHOLD && !isRefreshing) {
      handleRefresh();
    } else {
      Animated.spring(pullAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 100,
        friction: 10,
      }).start();
      setPullDistance(0);
      setRefreshTriggered(false);
    }
  };

  const handleLike = async (postId) => {
    console.log(postId,'postId')
    const res = await trigger(postId)
   
    setPosts(posts.map(post => {
      if (post._id === postId) {
        const alreadyLiked = post.userLiked
        const newLikeCount = alreadyLiked ? post.likeCount - 1 : post.likeCount + 1
        
        const newReactionCounts = { ...post.reactionCounts }
        if (alreadyLiked) {
          newReactionCounts.like = Math.max(0, newReactionCounts.like - 1)
        } else {
          newReactionCounts.like += 1
        }
        
        const totalReactions = Object.values(newReactionCounts).reduce((a, b) => a + b, 0)
        
        return {
          ...post,
          userLiked: !alreadyLiked,
          likeCount: newLikeCount,
          reactionCounts: newReactionCounts,
          totalReactions: totalReactions,
          likes: alreadyLiked 
            ? post.likes.filter(id => id !== 'currentUser')
            : [...post.likes, 'currentUser']
        }
      }
      return post
    }))
  }

  const handleReaction = (postId, reactionType) => {
    setPosts(posts.map(post => {
      if (post._id === postId) {
        const updatedReactions = { ...post.reactions }
        const updatedCounts = { ...post.reactionCounts }
        
        Object.keys(updatedReactions).forEach(type => {
          const index = updatedReactions[type].indexOf('currentUser')
          if (index > -1) {
            updatedReactions[type].splice(index, 1)
            updatedCounts[type] = Math.max(0, updatedCounts[type] - 1)
          }
        })
        
        if (!updatedReactions[reactionType].includes('currentUser')) {
          updatedReactions[reactionType].push('currentUser')
          updatedCounts[reactionType] += 1
        }
        
        const totalReactions = Object.values(updatedCounts).reduce((a, b) => a + b, 0)
        
        return {
          ...post,
          reactions: updatedReactions,
          reactionCounts: updatedCounts,
          totalReactions,
          userLiked: reactionType === 'like' && updatedReactions.like.includes('currentUser'),
          likeCount: updatedCounts.like
        }
      }
      return post
    }))
    
    setShowReactionPicker(null)
  }

  const handleComment = (postId) => {
    const comment = commentInputs[postId]
    if (comment && comment.trim()) {
      Alert.alert('Comment posted!', 'Your comment has been added.')
      setCommentInputs({ ...commentInputs, [postId]: '' })
    }
  }

  const handleShare = (post) => {
    Alert.alert(
      'Share Post',
      `Share "${post.content?.substring(0, 50)}..."?`,
      [
        { text: 'Copy Link', onPress: () => console.log('Link copied') },
        { text: 'Share via...', onPress: () => console.log('Share via') },
        { text: 'Cancel', style: 'cancel' }
      ]
    )
  }

  const openReactionPicker = (event, postId) => {
    const { pageX, pageY } = event.nativeEvent
    setReactionPickerPosition({ x: pageX, y: pageY })
    setShowReactionPicker(postId)
  }

  const showPostOptions = (event, postId) => {
    const { pageX, pageY } = event.nativeEvent;
    setAnchorPosition({ x: pageX, y: pageY });
    setShowOptionsModal(postId);
  };

  const renderReactionSummary = (post) => {
    if (!post.reactionCounts) return null
    
    const activeReactions = Object.entries(post.reactionCounts)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

    if (activeReactions.length === 0) return null

    const totalReactions = post.totalReactions || post.likeCount || 0
    const commentCount = post.commentCount || 0
    const shareCount = post.shareCount || 0

    return (
      <View style={styles.reactionSummary}>
        <View style={styles.reactionIcons}>
          {activeReactions.slice(0, 3).map((reaction, index) => (
            <View key={reaction.type} style={[styles.reactionIcon, { zIndex: 10 - index }]}>
              <Text style={styles.reactionIconText}>{getReactionIcon(reaction.type)}</Text>
            </View>
          ))}
        </View>
        {totalReactions > 0 && (
          <Text style={styles.reactionCountText}>
            {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
          </Text>
        )}
        {commentCount > 0 && (
          <Text style={styles.commentCountText}>
            {totalReactions > 0 ? ' • ' : ''}{commentCount} comment{commentCount !== 1 ? 's' : ''}
          </Text>
        )}
        {shareCount > 0 && (
          <Text style={styles.shareCountText}>
            {(totalReactions > 0 || commentCount > 0) ? ' • ' : ''}{shareCount} share{shareCount !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
    )
  }

const renderMedia = (media) => {
  if (!media || media.length === 0) return null
  
  if (media.length === 1) {
    return (
      <TouchableOpacity 
        style={styles.singleMediaContainer}
        activeOpacity={0.9}
        onPress={() => {
          setShowModal(true)
          setImageData(media)
        }}
      >
        <Image 
          source={{ uri: media[0].base64 || media[0].uri }} 
          style={[
            styles.mediaImage,
            { 
              aspectRatio: media[0].width && media[0].height 
                ? media[0].width / media[0].height 
                : 1 
            }
          ]} 
          resizeMode="cover" 
        />
        {media[0].caption && (
          <Text style={styles.mediaCaption}>{media[0].caption}</Text>
        )}
      </TouchableOpacity>
    )
  }
  
  return (
    <FlatList
      data={media}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => item._id || index.toString()}
      renderItem={({ item, index }) => (
        <TouchableOpacity 
          style={styles.mediaItem}
          activeOpacity={0.9}
          onPress={() => {
            setShowModal(true)
            setImageData(media)
          }}
        >
          <Image 
            source={{ uri: item.base64 || item.uri }} 
            style={styles.mediaThumbnail}
            resizeMode="cover"
          />
          {index < media.length - 1 && (
            <Text style={styles.mediaCountOverlay}>+{media.length - index - 1}</Text>
          )}
        </TouchableOpacity>
      )}
      style={styles.multipleMediaContainer}
    />
  )
}

  const renderPoll = (poll) => {
    if (!poll || !poll.options || poll.options.length === 0) return null
    
    const totalVotes = poll.totalVotes || poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0)
    
    return (
      <View style={styles.pollContainer}>
        <Text style={styles.pollQuestion}>Poll</Text>
        {poll.options.map((option, index) => (
          <TouchableOpacity 
            key={option._id || index}
            style={styles.pollOption}
            onPress={() => console.log('Vote for:', option.text)}
          >
            <View style={styles.pollOptionContent}>
              <Text style={styles.pollOptionText}>{option.text || `Option ${index + 1}`}</Text>
              <Text style={styles.pollOptionVotes}>{option.votes || 0} votes</Text>
            </View>
            <View style={styles.pollBar}>
              <View style={[
                styles.pollFill,
                { width: `${totalVotes > 0 ? ((option.votes || 0) / totalVotes) * 100 : 0}%` }
              ]} />
            </View>
          </TouchableOpacity>
        ))}
        <Text style={styles.pollTotalVotes}>{totalVotes} total votes • {poll.isActive ? 'Active' : 'Ended'}</Text>
      </View>
    )
  }

  const renderEvent = (event) => {
    if (!event || typeof event !== 'object') return null
    
    const isActualEvent = event.title || event.description || event.date || event.location || event.registrationLink
    
    if (!isActualEvent) return null
    
    return (
      <View style={styles.eventContainer}>
        <View style={styles.eventHeader}>
          <MaterialIcons name="event" size={24} color="#004CFF" />
          <Text style={styles.eventTitle}>{event.title || 'Event'}</Text>
        </View>
        <View style={styles.eventDetails}>
          {event.date && (
            <View style={styles.eventDetail}>
              <Feather name="calendar" size={16} color="#666" />
              <Text style={styles.eventDetailText}>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </View>
          )}
          <View style={styles.eventDetail}>
            <Feather name={event.isVirtual ? "globe" : "map-pin"} size={16} color="#666" />
            <Text style={styles.eventDetailText}>
              {event.isVirtual ? 'Virtual Event' : event.location || 'In-person Event'}
            </Text>
          </View>
          {(event.attendees && event.attendees.length > 0) && (
            <View style={styles.eventDetail}>
              <Feather name="users" size={16} color="#666" />
              <Text style={styles.eventDetailText}>
                {event.attendees.length} attending
              </Text>
            </View>
          )}
        </View>
        {(event.registrationLink || event.isActive) && (
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>
              {event.attendees?.some(attendee => attendee._id === 'currentUser') ? 'Registered ✓' : 'View Details'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  const renderItem = ({ item }) => {
    const username = item.author?.name?.toLowerCase().replace(/\s+/g, '') || 'user'

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{item.author?.name || 'User'}</Text>
              {item.author?.isSeller && (
                <View style={styles.sellerBadge}>
                  <MaterialIcons name="store" size={12} color="#FFF" />
                </View>
              )}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.username}>@{username}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.postTime}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
          
          {/* Options Button */}
          <TouchableOpacity 
            onPress={(e) => {
              e.persist?.();
              const target = e.target || e.currentTarget;
              if (target && target.measure) {
                target.measure((fx, fy, width, height, px, py) => {
                  showPostOptions({ 
                    nativeEvent: { 
                      pageX: px + width / 2, 
                      pageY: py + height / 2 
                    } 
                  }, item._id);
                });
              } else {
                // Fallback
                showPostOptions(e, item._id);
              }
            }}
            disabled={deletingPostId === item._id}
          >
            {deletingPostId === item._id ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
            )}
          </TouchableOpacity>
        </View>

        {/* Feeling Badge */}
        {item.feeling && (
          <View style={styles.feelingBadge}>
            <Text style={styles.feelingEmoji}>{getFeelingIcon(item.feeling)}</Text>
            <Text style={styles.feelingText}>feeling {getFeelingLabel(item.feeling)}</Text>
          </View>
        )}

        {/* Audience Badge */}
        {item.audience && item.audience !== 'public' && (
          <View style={styles.audienceBadge}>
            <MaterialIcons 
              name={item.audience === 'private' ? 'lock' : 'people'} 
              size={14} 
              color="#666" 
            />
            <Text style={styles.audienceText}>
              {item.audience === 'private' ? 'Only Me' : 
               item.audience === 'followers' ? 'Followers' : item.audience}
            </Text>
          </View>
        )}

        {/* Content */}
        {item.content && (
          <Text style={styles.content}>
            {item.content}
          </Text>
        )}

        {/* Media */}
        {renderMedia(item.media)}

        {/* Poll */}
        {item.poll && Object.keys(item.poll).length > 0 && renderPoll(item.poll)}

        {/* Event */}
        {item.event && (item.event.title || item.event.description || item.event.date || item.event.location || item.event.registrationLink) && renderEvent(item.event)}

        {/* Hashtags */}
        {item.hashtags && item.hashtags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.hashtags.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tagged Users */}
        {item.taggedUsers && item.taggedUsers.length > 0 && (
          <View style={styles.taggedContainer}>
            <Ionicons name="person" size={14} color="#666" />
            <Text style={styles.taggedText}>
              with {item.taggedUsers.map(user => user.name).join(', ')}
            </Text>
          </View>
        )}

        {/* Reaction Summary */}
        {renderReactionSummary(item)}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onLongPress={(e) => openReactionPicker(e, item._id)}
            onPress={() => handleLike(item._id)}
          >
            <Ionicons 
              name={item.userLiked ? "heart" : "heart-outline"} 
              size={22} 
              color={item.userLiked ? "#FF3B30" : "#666"} 
            />
            <Text style={[
              styles.actionText,
              item.userLiked && styles.actionTextActive
            ]}>Like</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => console.log('Comment on', item._id)}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#666" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleShare(item)}
          >
            <Ionicons name="share-social-outline" size={20} color="#666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
            style={styles.commentAvatar}
          />
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor="#999"
            value={commentInputs[item._id] || ''}
            onChangeText={(text) => setCommentInputs({ ...commentInputs, [item._id]: text })}
            onSubmitEditing={() => handleComment(item._id)}
          />
          <TouchableOpacity 
            style={styles.commentButton}
            onPress={() => handleComment(item._id)}
          >
            <Ionicons name="send" size={18} color="#004CFF" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ReactionPicker
        visible={showReactionPicker}
        position={reactionPickerPosition}
        onSelect={(reaction) => handleReaction(showReactionPicker, reaction)}
        onClose={() => setShowReactionPicker(null)}
      />
      
      {/* Custom Options Modal */}
      <CustomPopover
        visible={!!showOptionsModal}
        anchorPosition={anchorPosition}
        onClose={() => setShowOptionsModal(null)}
        onEdit={() => {
          console.log('Edit post:', showOptionsModal);
        }}
        onDelete={() => {
          if (showOptionsModal) {
            handelDelete(showOptionsModal);
          }
        }}
        postId={showOptionsModal}
        isDeleting={deletingPostId === showOptionsModal}
      />
      
      {/* Custom Refresh Header */}
      <RefreshHeader 
        pullAnim={pullAnim} 
        isRefreshing={isRefreshing} 
        refreshTriggered={refreshTriggered}
        opacity={opacity}
      />
      
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>News Feed</Text>
            <Text style={styles.listHeaderSubtitle}>Latest updates from your network</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        bounces={true}
        bouncesZoom={false}
        alwaysBounceVertical={true}
        overScrollMode="always"
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="newspaper-outline" size={60} color="#ccc" />
            <Text style={styles.emptyStateText}>No posts yet</Text>
            <Text style={styles.emptyStateSubtext}>Be the first to post something!</Text>
          </View>
        )}
      />
      <ImageModal
        visible={showModal}
        media={imageData}
        onClose={() => setShowModal(false)}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  
  // Refresh Header Styles
  refreshHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    overflow: 'hidden',
  },
  
  refreshContent: {
    height: REFRESH_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  pullContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#004CFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFF',
  },
  
  loadingCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#004CFF',
    borderTopColor: 'transparent',
    marginRight: 12,
  },
  
  loadingSpinner: {
    flex: 1,
  },
  
  refreshText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  
  // Updated list styles
  listContent: {
    paddingTop: REFRESH_HEIGHT,
    paddingBottom: 40,
  },
  
  listHeader: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  listHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  
  listHeaderSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  
  separator: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },
  
  card: {
    backgroundColor: '#fff',
    padding: 16,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  
  headerInfo: {
    flex: 1,
  },
  
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  authorName: {
    fontWeight: '700',
    fontSize: 15,
    color: '#333',
    marginRight: 6,
  },
  
  sellerBadge: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  username: {
    fontSize: 13,
    color: '#666',
  },
  
  dot: {
    fontSize: 13,
    color: '#666',
    marginHorizontal: 4,
  },
  
  postTime: {
    fontSize: 13,
    color: '#666',
  },
  
  moreButton: {
    padding: 4,
  },
  
  audienceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  
  audienceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  
  feelingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFE4B5',
  },
  
  feelingEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  
  feelingText: {
    fontSize: 12,
    color: '#B8860B',
    fontWeight: '500',
  },
  
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
  
  singleMediaContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  
  mediaImage: {
    width: '100%',
    maxHeight: 400,
  },
  
  mediaCaption: {
    padding: 8,
    fontSize: 14,
    color: '#666',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  
  multipleMediaContainer: {
    marginBottom: 12,
  },
  
  mediaItem: {
    width: 120,
    height: 120,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  
  mediaThumbnail: {
    width: '100%',
    height: '100%',
  },
  
  mediaCountOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 120,
  },
  
  pollContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  
  pollQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  
  pollOption: {
    marginBottom: 8,
  },

  popoverOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.15)',
},

popoverCard: {
  position: 'absolute',
  width: 170,
  backgroundColor: 'white',
  borderRadius: 12,
  paddingVertical: 8,
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
  zIndex: 999,
},

popoverArrow: {
  position: 'absolute',
  top: -8,
  left: 20,
  width: 0,
  height: 0,
  borderLeftWidth: 8,
  borderRightWidth: 8,
  borderBottomWidth: 8,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderBottomColor: 'white',
  elevation: 3
},

popoverRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 14,
},

popoverRowText: {
  marginLeft: 10,
  fontSize: 14,
  color: '#333',
  fontWeight: '500',
},

  
  pollOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  
  pollOptionText: {
    fontSize: 14,
    color: '#333',
  },
  
  pollOptionVotes: {
    fontSize: 12,
    color: '#666',
  },
  
  pollBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  pollFill: {
    height: '100%',
    backgroundColor: '#004CFF',
    borderRadius: 3,
  },
  
  pollTotalVotes: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  
  eventContainer: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8F0FE',
  },
  
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  
  eventDetails: {
    marginBottom: 12,
  },
  
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  eventDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  
  registerButton: {
    backgroundColor: '#004CFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  registerButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  
  tag: {
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  
  tagText: {
    fontSize: 13,
    color: '#004CFF',
    fontWeight: '500',
  },
  
  taggedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  taggedText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  
  reactionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
  },
  
  reactionIcons: {
    flexDirection: 'row',
    marginRight: 8,
  },
  
  reactionIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    marginLeft: -4,
  },
  
  reactionIconText: {
    fontSize: 12,
  },
  
  reactionCountText: {
    fontSize: 13,
    color: '#666',
  },
  
  commentCountText: {
    fontSize: 13,
    color: '#666',
  },
  
  shareCountText: {
    fontSize: 13,
    color: '#666',
  },
  
  actionButtons: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  
  actionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  
  actionTextActive: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
  },
  
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  
  commentInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
    color: '#333',
  },
  
  commentButton: {
    padding: 8,
    marginLeft: 8,
  },
  
  reactionPicker: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  
  reactionPickerContent: {
    flexDirection: 'row',
    padding: 8,
  },
  
  reactionOption: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  
  reactionEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  
  reactionLabel: {
    fontSize: 10,
    color: '#666',
  },
})