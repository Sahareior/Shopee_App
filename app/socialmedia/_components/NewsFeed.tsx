import React, { useEffect, useState } from 'react'
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  Alert
} from 'react-native'
import { Ionicons, FontAwesome, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { useGetNewsFeedQuery } from '@/app/redux/slices/jsonApiSlice'

const { width } = Dimensions.get('window')

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

export default function NewsFeed() {
  const [commentInputs, setCommentInputs] = useState({})
  const [showReactionPicker, setShowReactionPicker] = useState(null)
  const [reactionPickerPosition, setReactionPickerPosition] = useState({ x: 0, y: 0 })
  const { data: demoData } = useGetNewsFeedQuery()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (demoData?.data?.posts) {
      setPosts(demoData.data.posts);
    }
  }, [demoData]);

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post._id === postId) {
        const alreadyLiked = post.userLiked
        return {
          ...post,
          userLiked: !alreadyLiked,
          likeCount: alreadyLiked ? post.likeCount - 1 : post.likeCount + 1,
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
          userLiked: reactionType === 'like' && updatedReactions.like.includes('currentUser')
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
      `Share "${post.content.substring(0, 50)}..."?`,
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

  const renderReactionSummary = (post) => {
    const activeReactions = Object.entries(post.reactionCounts || {})
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

    if (activeReactions.length === 0) return null

    return (
      <View style={styles.reactionSummary}>
        <View style={styles.reactionIcons}>
          {activeReactions.slice(0, 3).map((reaction, index) => (
            <View key={reaction.type} style={[styles.reactionIcon, { zIndex: 10 - index }]}>
              <Text style={styles.reactionIconText}>{getReactionIcon(reaction.type)}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.reactionCountText}>
          {post.totalReactions || 0} reaction{(post.totalReactions || 0) !== 1 ? 's' : ''}
        </Text>
        {post.commentCount > 0 && (
          <Text style={styles.commentCountText}>
            • {post.commentCount} comment{post.commentCount !== 1 ? 's' : ''}
          </Text>
        )}
        {post.shareCount > 0 && (
          <Text style={styles.shareCountText}>
            • {post.shareCount} share{post.shareCount !== 1 ? 's' : ''}
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
          onPress={() => console.log('View media')}
        >
          <Image 
            source={{ uri: media[0].url }} 
            style={[
              styles.mediaImage,
              { aspectRatio: media[0].width / media[0].height || 1 }
            ]} 
            resizeMode="cover" 
          />
          {media[0].mediaType === 'video' && (
            <View style={styles.videoOverlay}>
              <View style={styles.playButton}>
                <Ionicons name="play" size={32} color="#FFF" />
              </View>
              <Text style={styles.videoDuration}>2:30</Text>
            </View>
          )}
        </TouchableOpacity>
      )
    }
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.multipleMediaContainer}
      >
        {media.map((item, index) => (
          <TouchableOpacity 
            key={item._id || index}
            style={styles.mediaItem}
            activeOpacity={0.9}
            onPress={() => console.log('View media', index)}
          >
            <Image 
              source={{ uri: item.url }} 
              style={styles.mediaThumbnail}
              resizeMode="cover"
            />
            {index < media.length - 1 && (
              <Text style={styles.mediaCountOverlay}>+{media.length - index - 1}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }

  const renderPoll = (poll) => {
    if (!poll || !poll.question || !poll.options || poll.options.length === 0) return null
    
    const totalVotes = poll.totalVotes || poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0)
    
    return (
      <View style={styles.pollContainer}>
        <Text style={styles.pollQuestion}>{poll.question}</Text>
        {poll.options.map((option, index) => (
          <TouchableOpacity 
            key={option._id || index}
            style={styles.pollOption}
            onPress={() => console.log('Vote for:', option.text)}
          >
            <View style={styles.pollOptionContent}>
              <Text style={styles.pollOptionText}>{option.text}</Text>
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
        <Text style={styles.pollTotalVotes}>{totalVotes} total votes</Text>
      </View>
    )
  }

  const renderLinkPreview = (linkPreview) => {
    if (!linkPreview || !linkPreview.url) return null
    
    return (
      <TouchableOpacity 
        style={styles.linkPreviewContainer}
        onPress={() => console.log('Open link:', linkPreview.url)}
      >
        {linkPreview.image && (
          <Image 
            source={{ uri: linkPreview.image }}
            style={styles.linkPreviewImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.linkPreviewContent}>
          <Text style={styles.linkPreviewTitle}>{linkPreview.title || 'Shared Link'}</Text>
          {linkPreview.description && (
            <Text style={styles.linkPreviewDescription}>{linkPreview.description}</Text>
          )}
          <Text style={styles.linkPreviewUrl}>{linkPreview.url.replace('https://', '').replace('http://', '')}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEvent = (event) => {
    if (!event || !event.title) return null
    
    const eventDate = event.date ? new Date(event.date) : null
    
    return (
      <View style={styles.eventContainer}>
        <View style={styles.eventHeader}>
          <MaterialIcons name="event" size={24} color="#004CFF" />
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>
        <View style={styles.eventDetails}>
          {eventDate && (
            <View style={styles.eventDetail}>
              <Feather name="calendar" size={16} color="#666" />
              <Text style={styles.eventDetailText}>
                {eventDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
                {event.time ? ` • ${event.time}` : ''}
              </Text>
            </View>
          )}
          <View style={styles.eventDetail}>
            <Feather name={event.isVirtual ? "globe" : "map-pin"} size={16} color="#666" />
            <Text style={styles.eventDetailText}>
              {event.isVirtual ? 'Virtual Event' : event.location || 'Location'}
            </Text>
          </View>
        </View>
        {event.registrationLink && (
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>
              {event.attendees?.some(attendee => attendee._id === 'currentUser') ? 'Registered ✓' : 'Register Now'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  const renderItem = ({ item }) => {
    // Get location name safely
    const locationName = item.location 
      ? (typeof item.location === 'string' ? item.location : item.location.name)
      : null
    
    // Get username from author
    const username = item.author?.username || item.author?.name?.toLowerCase().replace(/\s+/g, '') || 'user'

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: item.author?.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
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
              {locationName && (
                <>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.location}>
                    <Ionicons name="location-outline" size={12} color="#666" /> {locationName}
                  </Text>
                </>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Audience Badge */}
        {item.audience !== 'public' && (
          <View style={styles.audienceBadge}>
            <MaterialIcons 
              name={item.audience === 'private' ? 'lock' : 'people'} 
              size={14} 
              color="#666" 
            />
            <Text style={styles.audienceText}>
              {item.audience === 'private' ? 'Only Me' : 'Followers'}
            </Text>
          </View>
        )}

        {/* Content */}
        {item.content && (
          <Text style={styles.content}>
            {item.content}
          </Text>
        )}

        {/* Feeling */}
        {item.feeling && (
          <View style={styles.feelingContainer}>
            <MaterialIcons name="emoji-emotions" size={16} color="#FFD700" />
            <Text style={styles.feelingText}>Feeling {item.feeling}</Text>
          </View>
        )}

        {/* Media */}
        {renderMedia(item.media)}

        {/* Poll */}
        {renderPoll(item.poll)}

        {/* Event */}
        {renderEvent(item.event)}

        {/* Link Preview */}
        {renderLinkPreview(item.linkPreview)}

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
        refreshing={false}
        onRefresh={() => console.log('refreshing...')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  listContent: {
    paddingBottom: 40,
  },
  listHeader: {
    padding: 16,
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
  location: {
    fontSize: 13,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
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
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
  feelingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  feelingText: {
    fontSize: 14,
    color: '#FF8F00',
    marginLeft: 6,
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
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
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
  linkPreviewContainer: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  linkPreviewImage: {
    width: '100%',
    height: 150,
  },
  linkPreviewContent: {
    padding: 12,
  },
  linkPreviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  linkPreviewDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  linkPreviewUrl: {
    fontSize: 12,
    color: '#1a73e8',
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
    marginRight: 8,
  },
  commentCountText: {
    fontSize: 13,
    color: '#666',
    marginRight: 8,
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