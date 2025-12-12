import React, { useState, useRef, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Animated,
  Switch
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { 
  Ionicons, 
  MaterialIcons, 
  FontAwesome, 
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
  Entypo
} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { usePostSocialPostMutation } from '@/app/redux/slices/jsonApiSlice';

const { width } = Dimensions.get('window');
const MAX_MEDIA = 10;

const PostCreationComponent = ({ onPostCreated, onClose }) => {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Post content states
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [audience, setAudience] = useState('public');
  const [hashtags, setHashtags] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [taggedProducts, setTaggedProducts] = useState([]);
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  
  // Post type states
  const [postType, setPostType] = useState('text'); // 'text', 'image', 'poll', 'event', 'link', 'product'
  const [poll, setPoll] = useState({ question: '', options: ['', ''] });
  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: '10:00 AM',
    isVirtual: false,
    location: '',
    registrationLink: '',
    maxAttendees: ''
  });
  const [linkPreview, setLinkPreview] = useState({ url: '', title: '', description: '', image: '' });
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [showFeelingModal, setShowFeelingModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [tempHashtag, setTempHashtag] = useState('');
  const [showHashtagInput, setShowHashtagInput] = useState(false);
  const [postSocialPost] = usePostSocialPostMutation()
  
  // Animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const feelings = [
    'happy', 'loved', 'excited', 'thankful', 'blessed', 'cool',
    'sad', 'angry', 'tired', 'crazy', 'confused', 'shocked'
  ];

  const handleSelectMedia = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: MAX_MEDIA - media.length,
      });

      if (!result.canceled) {
        const newMedia = await Promise.all(result.assets.map(async (asset, index) => {
          // Compress image if it's too large
          let processedUri = asset.uri;
          let processedWidth = asset.width;
          let processedHeight = asset.height;
          
          if (asset.type === 'image') {
            const manipResult = await ImageManipulator.manipulateAsync(
              asset.uri,
              [{ resize: { width: 1080 } }], // Resize to max 1080px width
              { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            
            processedUri = manipResult.uri;
            processedWidth = manipResult.width;
            processedHeight = manipResult.height;
          }
          
          return {
            uri: processedUri,
            mediaType: asset.type === 'video' ? 'video' : 'image',
            width: processedWidth,
            height: processedHeight,
            duration: asset.duration || 0,
            order: media.length + index
          };
        }));
        
        setMedia([...media, ...newMedia]);
        setPostType('image');
      }
    } catch (error) {
      console.error('Error selecting media:', error);
      Alert.alert('Error', 'Failed to select media');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow camera access');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newMedia = [{
          uri: result.assets[0].uri,
          mediaType: 'image',
          width: result.assets[0].width,
          height: result.assets[0].height,
          order: media.length
        }];
        setMedia([...media, ...newMedia]);
        setPostType('image');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const removeMedia = (index) => {
    const newMedia = media.filter((_, i) => i !== index);
    setMedia(newMedia);
    if (newMedia.length === 0) {
      setPostType('text');
    }
  };

  const addHashtag = () => {
    if (tempHashtag.trim()) {
      const tag = tempHashtag.startsWith('#') ? tempHashtag.substring(1) : tempHashtag;
      if (!hashtags.includes(tag.toLowerCase())) {
        setHashtags([...hashtags, tag.toLowerCase()]);
      }
      setTempHashtag('');
      setShowHashtagInput(false);
    }
  };

  const removeHashtag = (index) => {
    setHashtags(hashtags.filter((_, i) => i !== index));
  };

  const addPollOption = () => {
    if (poll.options.length < 6) {
      setPoll({ ...poll, options: [...poll.options, ''] });
    }
  };

  const removePollOption = (index) => {
    if (poll.options.length > 2) {
      const newOptions = poll.options.filter((_, i) => i !== index);
      setPoll({ ...poll, options: newOptions });
    }
  };

  const updatePollOption = (index, value) => {
    const newOptions = [...poll.options];
    newOptions[index] = value;
    setPoll({ ...poll, options: newOptions });
  };

  const validatePoll = () => {
    if (!poll.question.trim()) {
      Alert.alert('Error', 'Please enter a poll question');
      return false;
    }
    const validOptions = poll.options.filter(opt => opt.trim().length > 0);
    if (validOptions.length < 2) {
      Alert.alert('Error', 'Please add at least 2 poll options');
      return false;
    }
    return true;
  };

  const validateEvent = () => {
    if (!event.title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return false;
    }
    if (!event.date) {
      Alert.alert('Error', 'Please select an event date');
      return false;
    }
    return true;
  };

  const validateLink = () => {
    if (!linkPreview.url.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return false;
    }
    try {
      new URL(linkPreview.url);
      return true;
    } catch {
      Alert.alert('Error', 'Please enter a valid URL');
      return false;
    }
  };

  const convertImageToBase64 = async (uri) => {
    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Get file info to determine MIME type
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const extension = fileInfo.uri.split('.').pop().toLowerCase();
      
      let mimeType = 'image/jpeg'; // default
      switch (extension) {
        case 'png':
          mimeType = 'image/png';
          break;
        case 'gif':
          mimeType = 'image/gif';
          break;
        case 'webp':
          mimeType = 'image/webp';
          break;
        case 'jpg':
        case 'jpeg':
        default:
          mimeType = 'image/jpeg';
      }
      
      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to convert image');
    }
  };

  const handleCreatePost = async () => {
    // Validation based on post type
    let isValid = true;
    let errorMessage = '';

    switch (postType) {
      case 'text':
        if (!content.trim() && media.length === 0) {
          isValid = false;
          errorMessage = 'Please add some content or media';
        }
        break;
      case 'image':
        if (media.length === 0) {
          isValid = false;
          errorMessage = 'Please add at least one image';
        }
        break;
      case 'poll':
        isValid = validatePoll();
        break;
      case 'event':
        isValid = validateEvent();
        break;
      case 'link':
        isValid = validateLink();
        break;
    }

    if (!isValid) {
      Alert.alert('Error', errorMessage);
      return;
    }

    setIsLoading(true);

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        router.replace('/login');
        return;
      }

      // Prepare media with base64 conversion
      let processedMedia = [];
      if (media.length > 0) {
        processedMedia = await Promise.all(media.map(async (item, index) => {
          try {
            // Convert image to base64 for images only (not videos)
            if (item.mediaType === 'image') {
              const base64Data = await convertImageToBase64(item.uri);
              
              return {
                base64: base64Data,
                width: item.width,
                height: item.height,
                mediaType: item.mediaType,
                caption: '',
                order: item.order || index
              };
            } else {
              // For videos, we should handle differently
              // For now, just send the URI and handle on backend
              return {
                uri: item.uri,
                width: item.width,
                height: item.height,
                mediaType: item.mediaType,
                duration: item.duration || 0,
                caption: '',
                order: item.order || index
              };
            }
          } catch (error) {
            console.error(`Error processing media ${index}:`, error);
            throw new Error(`Failed to process image ${index + 1}`);
          }
        }));
      }

      const postData = {
        content: content.trim(),
        audience,
        hashtags,
        taggedUsers,
        taggedProducts,
        feeling,
        location: location ? { name: location } : undefined,
        isScheduled,
        scheduledFor: isScheduled ? scheduledDate.toISOString() : undefined,
        media: processedMedia
      };

      // Add post type specific data
      switch (postType) {
        case 'poll':
          postData.poll = {
            question: poll.question,
            options: poll.options.filter(opt => opt.trim()).map(opt => ({ text: opt }))
          };
          break;
        case 'event':
          postData.event = {
            ...event,
            date: event.date.toISOString(),
            isActive: true
          };
          break;
        case 'link':
          postData.linkPreview = {
            ...linkPreview,
            domain: new URL(linkPreview.url).hostname
          };
          break;
      }

      // Use the mutation hook
      const response = await postSocialPost({
        postData,
      }).unwrap();

      if (response.success) {
        Alert.alert(
          'Success!',
          isScheduled ? 'Post scheduled successfully' : 'Post created successfully',
          [
            {
              text: 'View Post',
              onPress: () => {
                if (onPostCreated) onPostCreated(response.data);
                if (onClose) onClose();
              },
            },
            {
              text: 'OK',
              onPress: () => {
                if (onPostCreated) onPostCreated(response.data);
                if (onClose) onClose();
              },
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMediaPreview = () => {
    if (media.length === 0) return null;

    return (
      <View style={styles.mediaPreviewContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.mediaScroll}
        >
          {media.map((item, index) => (
            <View key={index} style={styles.mediaItem}>
              <ExpoImage 
                style={styles.mediaImage}
                source={{ uri: item.uri }}
                contentFit="cover"
              />
              {item.mediaType === 'video' && (
                <View style={styles.videoOverlay}>
                  <MaterialIcons name="play-arrow" size={24} color="#FFF" />
                </View>
              )}
              <TouchableOpacity 
                style={styles.removeMediaButton}
                onPress={() => removeMedia(index)}
              >
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <Text style={styles.mediaCount}>
          {media.length} of {MAX_MEDIA} photos/videos
        </Text>
      </View>
    );
  };

  const renderPollForm = () => (
    <View style={styles.pollForm}>
      <TextInput
        style={styles.pollQuestionInput}
        placeholder="Ask a question..."
        value={poll.question}
        onChangeText={(text) => setPoll({ ...poll, question: text })}
        multiline
      />
      <Text style={styles.pollOptionsLabel}>Options:</Text>
      {poll.options.map((option, index) => (
        <View key={index} style={styles.pollOptionRow}>
          <TextInput
            style={styles.pollOptionInput}
            placeholder={`Option ${index + 1}`}
            value={option}
            onChangeText={(text) => updatePollOption(index, text)}
          />
          {poll.options.length > 2 && (
            <TouchableOpacity 
              style={styles.removeOptionButton}
              onPress={() => removePollOption(index)}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      ))}
      {poll.options.length < 6 && (
        <TouchableOpacity 
          style={styles.addOptionButton}
          onPress={addPollOption}
        >
          <Ionicons name="add" size={20} color="#004CFF" />
          <Text style={styles.addOptionText}>Add Option</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEventForm = () => (
    <View style={styles.eventForm}>
      <TextInput
        style={styles.eventTitleInput}
        placeholder="Event title"
        value={event.title}
        onChangeText={(text) => setEvent({ ...event, title: text })}
      />
      <TextInput
        style={styles.eventDescriptionInput}
        placeholder="Description (optional)"
        value={event.description}
        onChangeText={(text) => setEvent({ ...event, description: text })}
        multiline
        numberOfLines={3}
      />
      <TouchableOpacity 
        style={styles.datePickerButton}
        onPress={() => setShowDateTimePicker(true)}
      >
        <Feather name="calendar" size={20} color="#666" />
        <Text style={styles.dateText}>
          {event.date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </TouchableOpacity>
      <View style={styles.timeLocationRow}>
        <TextInput
          style={[styles.timeInput, { flex: 1 }]}
          placeholder="Time (e.g., 10:00 AM)"
          value={event.time}
          onChangeText={(text) => setEvent({ ...event, time: text })}
        />
        <TextInput
          style={[styles.locationInput, { flex: 2 }]}
          placeholder={event.isVirtual ? 'Online event' : 'Location'}
          value={event.location}
          onChangeText={(text) => setEvent({ ...event, location: text })}
        />
      </View>
      <View style={styles.virtualSwitch}>
        <Text style={styles.virtualLabel}>Virtual Event</Text>
        <Switch
          value={event.isVirtual}
          onValueChange={(value) => setEvent({ ...event, isVirtual: value })}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={event.isVirtual ? '#004CFF' : '#f4f3f4'}
        />
      </View>
      {event.isVirtual && (
        <TextInput
          style={styles.linkInput}
          placeholder="Registration link (optional)"
          value={event.registrationLink}
          onChangeText={(text) => setEvent({ ...event, registrationLink: text })}
          keyboardType="url"
        />
      )}
    </View>
  );

  const renderLinkForm = () => (
    <View style={styles.linkForm}>
      <TextInput
        style={styles.linkUrlInput}
        placeholder="Paste URL here"
        value={linkPreview.url}
        onChangeText={(text) => setLinkPreview({ ...linkPreview, url: text })}
        keyboardType="url"
        autoCapitalize="none"
      />
      {linkPreview.url && (
        <>
          <TextInput
            style={styles.linkTitleInput}
            placeholder="Title (auto-detected)"
            value={linkPreview.title}
            onChangeText={(text) => setLinkPreview({ ...linkPreview, title: text })}
          />
          <TextInput
            style={styles.linkDescriptionInput}
            placeholder="Description (auto-detected)"
            value={linkPreview.description}
            onChangeText={(text) => setLinkPreview({ ...linkPreview, description: text })}
            multiline
            numberOfLines={2}
          />
          <TextInput
            style={styles.linkImageInput}
            placeholder="Image URL (optional)"
            value={linkPreview.image}
            onChangeText={(text) => setLinkPreview({ ...linkPreview, image: text })}
            keyboardType="url"
            autoCapitalize="none"
          />
        </>
      )}
    </View>
  );

  const renderPostTypeSelector = () => (
    <View style={styles.postTypeSelector}>
      <Text style={styles.sectionTitle}>Create a</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.typeScroll}
      >
        <TouchableOpacity 
          style={[styles.typeButton, postType === 'text' && styles.activeTypeButton]}
          onPress={() => setPostType('text')}
        >
          <Ionicons name="text" size={24} color={postType === 'text' ? '#004CFF' : '#666'} />
          <Text style={[styles.typeText, postType === 'text' && styles.activeTypeText]}>Text</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeButton, postType === 'image' && styles.activeTypeButton]}
          onPress={() => setPostType('image')}
        >
          <Ionicons name="image" size={24} color={postType === 'image' ? '#004CFF' : '#666'} />
          <Text style={[styles.typeText, postType === 'image' && styles.activeTypeText]}>Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeButton, postType === 'poll' && styles.activeTypeButton]}
          onPress={() => {
            setPostType('poll');
            setShowPollModal(true);
          }}
        >
          <FontAwesome5 name="poll" size={22} color={postType === 'poll' ? '#004CFF' : '#666'} />
          <Text style={[styles.typeText, postType === 'poll' && styles.activeTypeText]}>Poll</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeButton, postType === 'event' && styles.activeTypeButton]}
          onPress={() => {
            setPostType('event');
            setShowEventModal(true);
          }}
        >
          <MaterialIcons name="event" size={24} color={postType === 'event' ? '#004CFF' : '#666'} />
          <Text style={[styles.typeText, postType === 'event' && styles.activeTypeText]}>Event</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeButton, postType === 'link' && styles.activeTypeButton]}
          onPress={() => {
            setPostType('link');
            setShowLinkModal(true);
          }}
        >
          <Entypo name="link" size={24} color={postType === 'link' ? '#004CFF' : '#666'} />
          <Text style={[styles.typeText, postType === 'link' && styles.activeTypeText]}>Link</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeButton, postType === 'product' && styles.activeTypeButton]}
          onPress={() => setPostType('product')}
        >
          <MaterialIcons name="shopping-bag" size={24} color={postType === 'product' ? '#004CFF' : '#666'} />
          <Text style={[styles.typeText, postType === 'product' && styles.activeTypeText]}>Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderAdditionalOptions = () => (
    <View style={styles.additionalOptions}>
      <Text style={styles.sectionTitle}>Add to your post</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.optionsScroll}
      >
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={handleSelectMedia}
        >
          <Ionicons name="images" size={24} color="#2E8B57" />
          <Text style={styles.optionText}>Photo/Video</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={handleTakePhoto}
        >
          <Ionicons name="camera" size={24} color="#4169E1" />
          <Text style={styles.optionText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => setShowFeelingModal(true)}
        >
          <MaterialIcons name="emoji-emotions" size={24} color="#FFD700" />
          <Text style={styles.optionText}>Feeling</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => setShowLocationModal(true)}
        >
          <Ionicons name="location" size={24} color="#FF4500" />
          <Text style={styles.optionText}>Location</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => setShowHashtagInput(true)}
        >
          <FontAwesome name="hashtag" size={22} color="#1E90FF" />
          <Text style={styles.optionText}>Hashtag</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => setShowScheduleModal(true)}
        >
          <Ionicons name="time" size={24} color="#8A2BE2" />
          <Text style={styles.optionText}>Schedule</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderHashtags = () => {
    if (hashtags.length === 0) return null;

    return (
      <View style={styles.hashtagsContainer}>
        <Text style={styles.hashtagsLabel}>Hashtags:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.hashtagsScroll}
        >
          {hashtags.map((tag, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.hashtagChip}
              onPress={() => removeHashtag(index)}
            >
              <Text style={styles.hashtagText}>#{tag}</Text>
              <Ionicons name="close" size={16} color="#666" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose || (() => router.back())}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Post</Text>
            <TouchableOpacity 
              style={[styles.postButton, (!content.trim() && media.length === 0 && postType === 'text') && styles.postButtonDisabled]}
              onPress={handleCreatePost}
              disabled={isLoading || (!content.trim() && media.length === 0 && postType === 'text')}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.postButtonText}>
                  {isScheduled ? 'Schedule' : 'Post'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Audience Selector */}
          <TouchableOpacity 
            style={styles.audienceSelector}
            onPress={() => setShowAudienceModal(true)}
          >
            <MaterialIcons 
              name={audience === 'public' ? 'public' : audience === 'followers' ? 'people' : 'lock'} 
              size={20} 
              color="#666" 
            />
            <Text style={styles.audienceText}>
              {audience === 'public' ? 'Public' : 
               audience === 'followers' ? 'Followers' : 'Only Me'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>

          {/* Post Type Selector */}
          {renderPostTypeSelector()}

          {/* Content Input */}
          <View style={styles.contentContainer}>
            <TextInput
              style={styles.contentInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#999"
              multiline
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
              maxLength={5000}
            />
            {content.length > 0 && (
              <Text style={styles.charCount}>
                {content.length}/5000
              </Text>
            )}
          </View>

          {/* Media Preview */}
          {renderMediaPreview()}

          {/* Poll Form Modal */}
          {showPollModal && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={showPollModal}
              onRequestClose={() => setShowPollModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Create Poll</Text>
                    <TouchableOpacity onPress={() => setShowPollModal(false)}>
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  {renderPollForm()}
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={() => {
                      if (validatePoll()) {
                        setShowPollModal(false);
                      }
                    }}
                  >
                    <Text style={styles.modalActionText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {/* Event Form Modal */}
          {showEventModal && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={showEventModal}
              onRequestClose={() => setShowEventModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Create Event</Text>
                    <TouchableOpacity onPress={() => setShowEventModal(false)}>
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  {renderEventForm()}
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={() => {
                      if (validateEvent()) {
                        setShowEventModal(false);
                      }
                    }}
                  >
                    <Text style={styles.modalActionText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {/* Link Form Modal */}
          {showLinkModal && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={showLinkModal}
              onRequestClose={() => setShowLinkModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Share Link</Text>
                    <TouchableOpacity onPress={() => setShowLinkModal(false)}>
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  {renderLinkForm()}
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={() => {
                      if (validateLink()) {
                        setShowLinkModal(false);
                      }
                    }}
                  >
                    <Text style={styles.modalActionText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {/* Feeling Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showFeelingModal}
            onRequestClose={() => setShowFeelingModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>How are you feeling?</Text>
                  <TouchableOpacity onPress={() => setShowFeelingModal(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <View style={styles.feelingGrid}>
                  {feelings.map((feelingOption) => (
                    <TouchableOpacity
                      key={feelingOption}
                      style={[styles.feelingOption, feeling === feelingOption && styles.feelingOptionSelected]}
                      onPress={() => {
                        setFeeling(feelingOption);
                        setShowFeelingModal(false);
                      }}
                    >
                      <Text style={styles.feelingEmoji}>
                        {feelingOption === 'happy' ? '😊' :
                         feelingOption === 'loved' ? '❤️' :
                         feelingOption === 'excited' ? '🎉' :
                         feelingOption === 'thankful' ? '🙏' :
                         feelingOption === 'blessed' ? '✨' :
                         feelingOption === 'cool' ? '😎' :
                         feelingOption === 'sad' ? '😢' :
                         feelingOption === 'angry' ? '😠' :
                         feelingOption === 'tired' ? '😴' :
                         feelingOption === 'crazy' ? '🤪' :
                         feelingOption === 'confused' ? '😕' : '😲'}
                      </Text>
                      <Text style={styles.feelingText}>{feelingOption}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Modal>

          {/* Hashtag Input Modal */}
          {showHashtagInput && (
            <Modal
              animationType="fade"
              transparent={true}
              visible={showHashtagInput}
              onRequestClose={() => setShowHashtagInput(false)}
            >
              <View style={styles.inputModalOverlay}>
                <View style={styles.inputModal}>
                  <Text style={styles.inputModalTitle}>Add Hashtag</Text>
                  <View style={styles.hashtagInputContainer}>
                    <Text style={styles.hashtagSymbol}>#</Text>
                    <TextInput
                      style={styles.hashtagInput}
                      placeholder="hashtag"
                      placeholderTextColor="#999"
                      value={tempHashtag}
                      onChangeText={setTempHashtag}
                      autoFocus
                      onSubmitEditing={addHashtag}
                    />
                  </View>
                  <View style={styles.inputModalButtons}>
                    <TouchableOpacity 
                      style={[styles.inputModalButton, styles.cancelButton]}
                      onPress={() => setShowHashtagInput(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.inputModalButton, styles.addButton]}
                      onPress={addHashtag}
                    >
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}

          {/* Location Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showLocationModal}
            onRequestClose={() => setShowLocationModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add Location</Text>
                  <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.locationInputModal}
                  placeholder="Where are you?"
                  value={location}
                  onChangeText={setLocation}
                  onSubmitEditing={() => setShowLocationModal(false)}
                />
                <TouchableOpacity 
                  style={styles.modalActionButton}
                  onPress={() => setShowLocationModal(false)}
                >
                  <Text style={styles.modalActionText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Schedule Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showScheduleModal}
            onRequestClose={() => setShowScheduleModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Schedule Post</Text>
                  <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <View style={styles.scheduleOptions}>
                  <View style={styles.scheduleSwitch}>
                    <Text style={styles.scheduleLabel}>Schedule Post</Text>
                    <Switch
                      value={isScheduled}
                      onValueChange={setIsScheduled}
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={isScheduled ? '#004CFF' : '#f4f3f4'}
                    />
                  </View>
                  {isScheduled && (
                    <>
                      <TouchableOpacity 
                        style={styles.dateTimeButton}
                        onPress={() => setShowDateTimePicker(true)}
                      >
                        <Feather name="calendar" size={20} color="#666" />
                        <Text style={styles.dateTimeText}>
                          {scheduledDate.toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.scheduleNote}>
                        Your post will be published automatically at the scheduled time.
                      </Text>
                    </>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.modalActionButton}
                  onPress={() => setShowScheduleModal(false)}
                >
                  <Text style={styles.modalActionText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* DateTime Picker */}
          {showDateTimePicker && (
            <DateTimePicker
              value={event.date}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDateTimePicker(false);
                if (selectedDate) {
                  if (isScheduled) {
                    setScheduledDate(selectedDate);
                  } else {
                    setEvent({ ...event, date: selectedDate });
                  }
                }
              }}
              minimumDate={new Date()}
            />
          )}

          {/* Audience Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showAudienceModal}
            onRequestClose={() => setShowAudienceModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Who can see your post?</Text>
                  <TouchableOpacity onPress={() => setShowAudienceModal(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                {['public', 'followers', 'private'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.audienceOption}
                    onPress={() => {
                      setAudience(option);
                      setShowAudienceModal(false);
                    }}
                  >
                    <View style={styles.audienceOptionContent}>
                      {option === 'public' && <MaterialIcons name="public" size={24} color="#666" />}
                      {option === 'followers' && <MaterialIcons name="people" size={24} color="#666" />}
                      {option === 'private' && <MaterialIcons name="lock" size={24} color="#666" />}
                      <View style={styles.audienceTextContainer}>
                        <Text style={styles.audienceOptionTitle}>
                          {option === 'public' ? 'Public' : 
                           option === 'followers' ? 'Followers' : 'Only Me'}
                        </Text>
                        <Text style={styles.audienceOptionDescription}>
                          {option === 'public' ? 'Anyone on or off SocialCommerce' :
                           option === 'followers' ? 'Your followers on SocialCommerce' :
                           'Only you can see this post'}
                        </Text>
                      </View>
                    </View>
                    {audience === option && (
                      <Ionicons name="checkmark" size={24} color="#004CFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>

          {/* Feeling & Hashtags Display */}
          {(feeling || hashtags.length > 0) && (
            <View style={styles.tagsDisplay}>
              {feeling && (
                <View style={styles.feelingDisplay}>
                  <MaterialIcons name="emoji-emotions" size={20} color="#FFD700" />
                  <Text style={styles.feelingDisplayText}>Feeling {feeling}</Text>
                  <TouchableOpacity onPress={() => setFeeling('')}>
                    <Ionicons name="close" size={18} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
              {renderHashtags()}
            </View>
          )}

          {/* Additional Options */}
          {renderAdditionalOptions()}

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  postButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  audienceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  audienceText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 6,
  },
  postTypeSelector: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeScroll: {
    flexDirection: 'row',
  },
  typeButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  activeTypeButton: {
    backgroundColor: '#E8F0FE',
    borderColor: '#004CFF',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTypeText: {
    color: '#004CFF',
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    minHeight: 100,
    maxHeight: 200,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  mediaPreviewContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  mediaScroll: {
    flexDirection: 'row',
  },
  mediaItem: {
    width: 120,
    height: 120,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
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
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  mediaCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  pollForm: {
    padding: 16,
  },
  pollQuestionInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  pollOptionsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  pollOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollOptionInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginRight: 8,
  },
  removeOptionButton: {
    padding: 8,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginTop: 8,
  },
  addOptionText: {
    fontSize: 14,
    color: '#004CFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  eventForm: {
    padding: 16,
  },
  eventTitleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  eventDescriptionInput: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  timeLocationRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  timeInput: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  locationInput: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  virtualSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 12,
  },
  virtualLabel: {
    fontSize: 14,
    color: '#333',
  },
  linkInput: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  linkForm: {
    padding: 16,
  },
  linkUrlInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 12,
  },
  linkTitleInput: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  linkDescriptionInput: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  linkImageInput: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  additionalOptions: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  optionsScroll: {
    flexDirection: 'row',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
    fontWeight: '500',
  },
  tagsDisplay: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  feelingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  feelingDisplayText: {
    fontSize: 14,
    color: '#FF8F00',
    marginHorizontal: 6,
  },
  hashtagsContainer: {
    marginTop: 8,
  },
  hashtagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  hashtagsScroll: {
    flexDirection: 'row',
  },
  hashtagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  hashtagText: {
    fontSize: 14,
    color: '#004CFF',
    marginRight: 6,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  modalActionButton: {
    backgroundColor: '#004CFF',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  feelingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  feelingOption: {
    alignItems: 'center',
    padding: 12,
    margin: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    width: (width - 80) / 3,
  },
  feelingOptionSelected: {
    backgroundColor: '#E8F0FE',
    borderWidth: 1,
    borderColor: '#004CFF',
  },
  feelingEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  feelingText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  inputModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: width * 0.85,
  },
  inputModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  hashtagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  hashtagSymbol: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  hashtagInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#333',
  },
  inputModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  inputModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    backgroundColor: '#004CFF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  locationInputModal: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 16,
  },
  scheduleOptions: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scheduleSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  scheduleLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  scheduleNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    lineHeight: 16,
  },
  audienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  audienceOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  audienceTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  audienceOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  audienceOptionDescription: {
    fontSize: 14,
    color: '#666',
  },
  bottomSpacer: {
    height: 50,
  },
});

export default PostCreationComponent;