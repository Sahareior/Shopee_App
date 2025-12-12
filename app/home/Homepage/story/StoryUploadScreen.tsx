// StoryUploadScreen.js
import React, { useState, useEffect, use } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useCreateStoryMutation } from '@/app/redux/slices/jsonApiSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// -------------------- Media Preview Component --------------------
const MediaPreview = ({ mediaUri, mediaType, onRemove, imageDimensions }) => {
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH - 64); // padding 32 each side
  

  const getMediaStyle = () => {
    if (!imageDimensions || mediaType === 'video') {
      return {
        width: '100%',
        height: 500,
        maxHeight: 600,
      };
    }

    const { width, height } = imageDimensions;
    const aspectRatio = width / height;
    const targetWidth = containerWidth;
    const calculatedHeight = targetWidth / aspectRatio;

    return {
      width: targetWidth,
      height: Math.min(calculatedHeight, 650),
    };
  };

  return (
    <View
      style={styles.previewWrapper}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.previewContainer}>
        {mediaType === 'video' ? (
          <Video
            source={{ uri: mediaUri }}
            style={[styles.previewMedia, getMediaStyle()]}
            resizeMode="contain"
            shouldPlay
            isLooping
            useNativeControls={false}
          />
        ) : (
          <Image
            source={{ uri: mediaUri }}
            style={[styles.previewMedia, getMediaStyle()]}
            resizeMode="contain"
          />
        )}

        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Ionicons name="close-circle" size={32} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// -------------------- Main Component --------------------
const StoryUploadScreen = ({ navigation }) => {
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [recentMedia, setRecentMedia] = useState([]);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [createStory] = useCreateStoryMutation();
  const router = useRouter();

useEffect(() => {
  let isMounted = true;

  const requestPermissionAndLoad = async () => {
    try {
      // Step 1: Request permission (this will prompt only once)
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (!isMounted) return;

      // Step 2: Only load media if permission is granted
      if (status === 'granted') {
        await loadRecentMedia();
      } else {
        // Optional: Show a friendly message
        console.log('Media library access denied - recent photos hidden');
        // You can show an Alert here if you want
        // Alert.alert('Access Denied', 'Recent photos require media library permission');
      }
    } catch (error) {
      if (!isMounted) return;
      console.log('Permission request cancelled or failed:', error);
    }
  };

  requestPermissionAndLoad();

  return () => {
    isMounted = false;
  };
}, []);

// Keep your loadRecentMedia exactly like this (no changes needed)
const loadRecentMedia = async () => {
  try {
    const { assets } = await MediaLibrary.getAssetsAsync({
      first: 30,
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
      sortBy: ['creationTime'],
    });
    setRecentMedia(assets);
  } catch (error) {
    console.log('Failed to load recent media (permission denied or other issue):', error);
    // Don't crash — just show empty recent section
    setRecentMedia([]);
  }
};

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setMedia(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'image');

        if (asset.type !== 'video') {
          Image.getSize(asset.uri, (w, h) => setImageDimensions({ width: w, height: h }));
        } else {
          setImageDimensions(null);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setMedia(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'image');

        if (asset.type !== 'video') {
          Image.getSize(asset.uri, (w, h) => setImageDimensions({ width: w, height: h }));
        } else {
          setImageDimensions(null);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture media');
    }
  };

  const uploadStory = async () => {
    if (!media) return Alert.alert('Error', 'Please select a photo or video');

    setIsUploading(true);
    try {
      const response = await fetch(media);
      const blob = await response.blob();
      const mediaData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      const storyData = {
        mediaData,
        mediaType,
        caption,
        duration: 24,
        mimeType: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
        fileName: media.split('/').pop(),
        originalDimensions: imageDimensions,
        isOriginal: true,
      };

      const res = await createStory(storyData);
      if (res.data?.success) {
        Alert.alert('Success!', 'Story uploaded successfully!', [
          { text: 'Done', onPress: () => { resetForm(); router.back(); } }
        ]);
      } else {
        Alert.alert('Error', res.data?.message || 'Upload failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setMedia(null);
    setMediaType(null);
    setCaption('');
    setImageDimensions(null);
    setShowFullPreview(false);
  };

  const handleRecentMediaSelect = (asset) => {
    setMedia(asset.uri);
    setMediaType(asset.mediaType === 'video' ? 'video' : 'image');
    if (asset.mediaType !== 'video') {
      Image.getSize(asset.uri, (w, h) => setImageDimensions({ width: w, height: h }));
    } else {
      setImageDimensions(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Story</Text>
        <TouchableOpacity
          style={[styles.shareButton, (!media || isUploading) && styles.shareButtonDisabled]}
          onPress={uploadStory}
          disabled={!media || isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.shareButtonText}>Share</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {media ? (
          <View style={styles.editMode}>
            {/* Fixed & Beautiful Preview */}
            <MediaPreview
              mediaUri={media}
              mediaType={mediaType}
              onRemove={() => {
                setMedia(null);
                setMediaType(null);
                setImageDimensions(null);
              }}
              imageDimensions={imageDimensions}
            />

            <View style={styles.infoBanner}>
              <Ionicons name="sparkles" size={18} color="#0095F6" />
              <Text style={styles.infoText}>
                {mediaType === 'video' ? 'Full video • No cropping' : 'Full photo • Original quality'}
              </Text>
            </View>

            {/* Caption */}
            <View style={styles.captionSection}>
              <Text style={styles.captionLabel}>Add a caption</Text>
              <TextInput
                style={styles.captionInput}
                placeholder="What's on your mind?"
                placeholderTextColor="#aaa"
                value={caption}
                onChangeText={setCaption}
                multiline
                maxLength={2200}
              />
              <Text style={styles.counter}>{caption.length}/2200</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.previewBtn} onPress={() => setShowFullPreview(true)}>
                <Ionicons name="eye" size={22} color="#fff" />
                <Text style={styles.btnText}>Preview</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.changeBtn} onPress={pickMedia}>
                <Ionicons name="camera-reverse" size={22} color="#fff" />
                <Text style={styles.btnText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Selection Mode */
          <View style={styles.selectionMode}>
            <Ionicons name="camera-outline" size={80} color="#0095F6" />
            <Text style={styles.welcomeTitle}>Create a Story</Text>
            <Text style={styles.welcomeSubtitle}>Share a photo or video that disappears in 24 hours</Text>

            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.uploadBtn} onPress={takePhoto}>
                <Ionicons name="camera" size={32} color="#fff" />
                <Text style={styles.uploadBtnTitle}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadBtn} onPress={pickMedia}>
                <Ionicons name="images" size={32} color="#fff" />
                <Text style={styles.uploadBtnTitle}>Gallery</Text>
              </TouchableOpacity>
            </View>

            {recentMedia.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.recentTitle}>Recent</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
                  {recentMedia.map((asset) => (
                    <TouchableOpacity
                      key={asset.id}
                      style={styles.recentItem}
                      onPress={() => handleRecentMediaSelect(asset)}
                    >
                      <Image source={{ uri: asset.uri }} style={styles.recentThumb} resizeMode="cover" />
                      {asset.mediaType === 'video' && (
                        <View style={styles.playIcon}>
                          <Ionicons name="play" size={20} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Full Preview Modal */}
      <Modal visible={showFullPreview} animationType="slide" statusBarTranslucent>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFullPreview(false)}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Preview</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.modalMediaContainer}>
            {mediaType === 'video' ? (
              <Video
                source={{ uri: media }}
                style={styles.modalMedia}
                resizeMode="contain"
                useNativeControls
                shouldPlay
                isLooping
              />
            ) : (
              <Image source={{ uri: media }} style={styles.modalMedia} resizeMode="contain" />
            )}
          </View>

          {caption ? (
            <View style={styles.modalCaption}>
              <Text style={styles.modalCaptionText}>{caption}</Text>
            </View>
          ) : null}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  shareButton: {
    backgroundColor: '#0095F6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  shareButtonDisabled: { backgroundColor: '#A0D8F9' },
  shareButtonText: { color: '#fff', fontWeight: '600' },
  scrollContent: { paddingBottom: 40 },

  // Edit Mode
  editMode: { padding: 20 },
  previewWrapper: { alignItems: 'center', marginBottom: 20 },
  previewContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewMedia: {
    borderRadius: 20,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 4,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5FF',
    padding: 14,
    borderRadius: 14,
    gap: 10,
    marginBottom: 20,
  },
  infoText: { fontSize: 14, color: '#0066CC', fontWeight: '500' },
  captionSection: { marginBottom: 30 },
  captionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },
  captionInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  counter: { alignSelf: 'flex-end', marginTop: 8, color: '#888', fontSize: 13 },
  actionRow: { flexDirection: 'row', gap: 12 },
  previewBtn: { flex: 1, backgroundColor: '#5856D6', padding: 16, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  changeBtn: { flex: 1, backgroundColor: '#32D74B', padding: 16, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  // Selection Mode
  selectionMode: { flex: 1, alignItems: 'center', paddingTop: 60, paddingHorizontal: 30 },
  welcomeTitle: { fontSize: 28, fontWeight: 'bold', marginTop: 20, color: '#000' },
  welcomeSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 10, lineHeight: 24 },
  uploadButtons: { flexDirection: 'row', gap: 20, marginTop: 50 },
  uploadBtn: {
    backgroundColor: '#0095F6',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0095F6',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  uploadBtnTitle: { color: '#fff', marginTop: 10, fontWeight: '600' },
  recentSection: { marginTop: 60, width: '100%' },
  recentTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  recentScroll: { paddingLeft: 4 },
  recentItem: { width: 100, height: 100, borderRadius: 16, overflow: 'hidden', marginRight: 12 },
  recentThumb: { width: '100%', height: '100%' },
  playIcon: { position: 'absolute', top: '50%', left: '50%', marginLeft: -15, marginTop: -15, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 25, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },

  // Modal
  modalContainer: { flex: 1, backgroundColor: '#000' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalMediaContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalMedia: { width: '100%', height: '100%' },
  modalCaption: {
    padding: 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalCaptionText: { fontSize: 18, textAlign: 'center', color: '#333' },
});

export default StoryUploadScreen;