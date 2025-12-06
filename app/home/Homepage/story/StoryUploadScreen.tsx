import React, { useState, useEffect, useRef } from 'react';
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
  PanResponder,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

// Draggable and Editable Text Component
const DraggableText = ({ 
  textData, 
  onDrag, 
  onPress, 
  isSelected,
  onUpdateText,
  onUpdateColor,
  onUpdateFontSize,
  onUpdateFontFamily,
  onDelete 
}) => {
  const pan = useRef(new Animated.ValueXY({
    x: textData.position?.x || width * 0.1,
    y: textData.position?.y || height * 0.3
  })).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(scale, {
          toValue: 1.1,
          useNativeDriver: true,
          friction: 3,
        }).start();
        onPress(textData.id);
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 3,
        }).start();
        
        if (onDrag) {
          onDrag(textData.id, {
            x: pan.x._value + gestureState.dx,
            y: pan.y._value + gestureState.dy,
          });
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.draggableTextContainer,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale },
          ],
          borderWidth: isSelected ? 2 : 0,
          borderColor: isSelected ? '#FFD700' : 'transparent',
          borderRadius: isSelected ? 8 : 0,
          padding: isSelected ? 4 : 0,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Text 
        style={[
          styles.draggableText,
          { 
            color: textData.color,
            fontSize: textData.fontSize || 24,
            fontFamily: textData.fontFamily || 'System',
            textAlign: textData.align || 'center',
            fontWeight: textData.bold ? 'bold' : 'normal',
            fontStyle: textData.italic ? 'italic' : 'normal',
            textDecorationLine: textData.underline ? 'underline' : 'none',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
          }
        ]}
      >
        {textData.text}
      </Text>
      {isSelected && (
        <TouchableOpacity 
          style={styles.deleteTextButton}
          onPress={() => onDelete(textData.id)}
        >
          <Ionicons name="close-circle" size={20} color="#FF4444" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// Text Editing Toolbar
const TextEditingToolbar = ({ 
  visible, 
  textData, 
  onUpdate, 
  onClose,
  onAddNewText 
}) => {
  const [localText, setLocalText] = useState(textData?.text || '');
  const [selectedColor, setSelectedColor] = useState(textData?.color || '#FFFFFF');
  const [fontSize, setFontSize] = useState(textData?.fontSize || 24);
  const [isBold, setIsBold] = useState(textData?.bold || false);
  const [isItalic, setIsItalic] = useState(textData?.italic || false);
  const [isUnderline, setIsUnderline] = useState(textData?.underline || false);
  const [textAlign, setTextAlign] = useState(textData?.align || 'center');

  const colors = [
    '#FFFFFF', '#FF3B30', '#4CD964', '#007AFF', '#5856D6',
    '#FF2D55', '#FF9500', '#FFCC00', '#8E8E93', '#000000'
  ];

  const fontFamilies = [
    { label: 'Default', value: 'System' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Helvetica', value: 'Helvetica' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier', value: 'Courier' },
  ];

  useEffect(() => {
    if (textData) {
      setLocalText(textData.text);
      setSelectedColor(textData.color || '#FFFFFF');
      setFontSize(textData.fontSize || 24);
      setIsBold(textData.bold || false);
      setIsItalic(textData.italic || false);
      setIsUnderline(textData.underline || false);
      setTextAlign(textData.align || 'center');
    }
  }, [textData]);

  const handleSave = () => {
    if (textData && localText.trim()) {
      onUpdate({
        ...textData,
        text: localText.trim(),
        color: selectedColor,
        fontSize,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        align: textAlign,
      });
    }
  };

  const handleAddNew = () => {
    if (localText.trim()) {
      onAddNewText({
        text: localText.trim(),
        color: selectedColor,
        fontSize,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        align: textAlign,
        position: { x: width * 0.1, y: height * 0.3 }
      });
      setLocalText('');
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.toolbarContainer}>
      <View style={styles.toolbarHeader}>
        <Text style={styles.toolbarTitle}>
          {textData ? 'Edit Text' : 'Add Text'}
        </Text>
        <View style={styles.toolbarActions}>
          {textData ? (
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleAddNew}>
              <Text style={styles.saveButton}>Add</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Text Input */}
      <TextInput
        style={styles.textInput}
        placeholder="Type your text here..."
        placeholderTextColor="#999"
        value={localText}
        onChangeText={setLocalText}
        multiline
        autoFocus
      />

      {/* Color Picker */}
      <Text style={styles.toolbarSectionTitle}>Color</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.colorPicker}>
          {colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColorOption,
              ]}
              onPress={() => setSelectedColor(color)}
            >
              {selectedColor === color && (
                <Ionicons 
                  name="checkmark" 
                  size={16} 
                  color={color === '#000000' ? '#FFF' : '#000'} 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Font Size */}
      <Text style={styles.toolbarSectionTitle}>Font Size: {fontSize}</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>S</Text>
        <Slider
          style={styles.slider}
          minimumValue={12}
          maximumValue={72}
          step={2}
          value={fontSize}
          onValueChange={setFontSize}
          minimumTrackTintColor="#0095F6"
          maximumTrackTintColor="#8E8E93"
          thumbTintColor="#0095F6"
        />
        <Text style={styles.sliderLabel}>L</Text>
      </View>

      {/* Font Style Buttons */}
      <Text style={styles.toolbarSectionTitle}>Style</Text>
      <View style={styles.styleButtons}>
        <TouchableOpacity
          style={[styles.styleButton, isBold && styles.styleButtonActive]}
          onPress={() => setIsBold(!isBold)}
        >
          <Text style={[styles.styleButtonText, isBold && styles.styleButtonTextActive]}>
            B
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.styleButton, isItalic && styles.styleButtonActive]}
          onPress={() => setIsItalic(!isItalic)}
        >
          <Text style={[styles.styleButtonText, isItalic && styles.styleButtonTextActive, { fontStyle: 'italic' }]}>
            I
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.styleButton, isUnderline && styles.styleButtonActive]}
          onPress={() => setIsUnderline(!isUnderline)}
        >
          <Text style={[styles.styleButtonText, isUnderline && styles.styleButtonTextActive, { textDecorationLine: 'underline' }]}>
            U
          </Text>
        </TouchableOpacity>
      </View>

      {/* Text Alignment */}
      <Text style={styles.toolbarSectionTitle}>Alignment</Text>
      <View style={styles.alignmentButtons}>
        <TouchableOpacity
          style={[styles.alignmentButton, textAlign === 'left' && styles.alignmentButtonActive]}
          onPress={() => setTextAlign('left')}
        >
          <Ionicons name="align-left" size={20} color={textAlign === 'left' ? '#0095F6' : '#FFF'} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.alignmentButton, textAlign === 'center' && styles.alignmentButtonActive]}
          onPress={() => setTextAlign('center')}
        >
          <Ionicons name="align-center" size={20} color={textAlign === 'center' ? '#0095F6' : '#FFF'} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.alignmentButton, textAlign === 'right' && styles.alignmentButtonActive]}
          onPress={() => setTextAlign('right')}
        >
          <Ionicons name="align-right" size={20} color={textAlign === 'right' ? '#0095F6' : '#FFF'} />
        </TouchableOpacity>
      </View>

      {/* Preview */}
      <View style={styles.previewContainer}>
        <Text style={styles.toolbarSectionTitle}>Preview</Text>
        <View style={styles.previewBox}>
          <Text
            style={[
              styles.previewText,
              {
                color: selectedColor,
                fontSize,
                fontWeight: isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal',
                textDecorationLine: isUnderline ? 'underline' : 'none',
                textAlign,
              }
            ]}
          >
            {localText || 'Sample Text'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const StoryUploadScreen = () => {
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [recentMedia, setRecentMedia] = useState([]);
  const [textOverlays, setTextOverlays] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [showTextToolbar, setShowTextToolbar] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant media library access to select photos/videos');
      }
    })();
    loadRecentMedia();
  }, []);

  const loadRecentMedia = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 30,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        sortBy: ['creationTime'],
      });
      setRecentMedia(assets);
    } catch (error) {
      console.error('Error loading media:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setMedia(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'image');
        setTextOverlays([]); // Reset text overlays when new image is selected
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error(error);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setMedia(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'image');
        setTextOverlays([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
      console.error(error);
    }
  };

  const handleAddText = (textData) => {
    const newText = {
      ...textData,
      id: Date.now().toString(),
    };
    setTextOverlays([...textOverlays, newText]);
    setSelectedTextId(newText.id);
    setShowTextToolbar(true);
    setIsEditingText(true);
  };

  const handleUpdateText = (updatedText) => {
    setTextOverlays(textOverlays.map(text => 
      text.id === updatedText.id ? updatedText : text
    ));
  };

  const handleDeleteText = (id) => {
    setTextOverlays(textOverlays.filter(text => text.id !== id));
    setSelectedTextId(null);
    if (textOverlays.length === 1) {
      setShowTextToolbar(false);
    }
  };

  const handleTextDrag = (id, position) => {
    setTextOverlays(textOverlays.map(text => 
      text.id === id ? { ...text, position } : text
    ));
  };

  const handleTextPress = (id) => {
    setSelectedTextId(id);
    setShowTextToolbar(true);
    setIsEditingText(true);
  };

  const renderMediaPreview = () => {
    if (!media) return null;

    if (mediaType === 'video') {
      return (
        <Video
          ref={videoRef}
          source={{ uri: media }}
          style={styles.previewMedia}
          resizeMode="cover"
          shouldPlay
          isLooping
        />
      );
    }

    return (
      <Image
        source={{ uri: media }}
        style={styles.previewMedia}
        resizeMode="cover"
      />
    );
  };

  const renderTextOverlays = () => {
    return textOverlays.map((textData) => (
      <DraggableText
        key={textData.id}
        textData={textData}
        onDrag={handleTextDrag}
        onPress={handleTextPress}
        isSelected={selectedTextId === textData.id}
        onUpdateText={handleUpdateText}
        onUpdateColor={(id, color) => handleUpdateText({...textData, color})}
        onDelete={handleDeleteText}
      />
    ));
  };

const uploadStory = async () => {
  console.log('=== UPLOAD STORY FUNCTION CALLED ==='); // First log
  
  if (!media) {
    console.log('❌ NO MEDIA SELECTED - Stopping upload'); // Log if no media
    Alert.alert('Error', 'Please select a photo or video');
    return;
  }

  console.log('✅ Media exists:', media);
  console.log('📝 Caption:', caption);
  console.log('🎞️ Media Type:', mediaType);
  console.log('📝 Text Overlays:', textOverlays);
  console.log('🔢 Text Overlays count:', textOverlays.length);
  
  // Log each text overlay individually
  textOverlays.forEach((text, index) => {
    console.log(`   Text ${index + 1}:`, {
      id: text.id,
      text: text.text,
      color: text.color,
      fontSize: text.fontSize,
      position: text.position
    });
  });

  setIsUploading(true);
  try {
    console.log('🚀 Starting simulated upload...');
    
    // Simulate API call
    console.log('📤 FormData that would be sent:', {
      mediaUri: media,
      mediaType: mediaType,
      caption: caption,
      textOverlays: JSON.stringify(textOverlays),
      textOverlaysParsed: textOverlays, // Raw array
      duration: 24
    });

    // Wait 2 seconds to simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('✅ Upload simulation complete!');
    
    Alert.alert(
      'Success',
      'Your story has been uploaded! (Simulated)',
      [
        {
          text: 'OK',
          onPress: resetForm,
        },
      ]
    );
  } catch (error) {
    console.error('❌ Upload error:', error);
    Alert.alert('Error', 'Failed to upload story');
  } finally {
    console.log('🏁 Upload process finished');
    setIsUploading(false);
  }
};

  const resetForm = () => {
    setMedia(null);
    setMediaType(null);
    setCaption('');
    setShowFullPreview(false);
    setTextOverlays([]);
    setSelectedTextId(null);
    setShowTextToolbar(false);
    setIsEditingText(false);
  };

  const selectedText = textOverlays.find(text => text.id === selectedTextId);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={resetForm}>
          <Ionicons name="close" size={28} color="#000" />
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

      <ScrollView style={styles.content}>
        {/* Main Preview Area */}
        {media ? (
          <View style={styles.mainPreviewContainer}>
            <View style={styles.previewWrapper}>
              {renderMediaPreview()}
              {renderTextOverlays()}
              
              {/* Add Text Button */}
              <TouchableOpacity
                style={styles.addTextButton}
                onPress={() => {
                  setShowTextToolbar(true);
                  setIsEditingText(false);
                  setSelectedTextId(null);
                }}
              >
                <Ionicons name="add-circle" size={30} color="#0095F6" />
                <Text style={styles.addTextLabel}>Add Text</Text>
              </TouchableOpacity>
            </View>

            {/* Text Editing Toolbar */}
            <TextEditingToolbar
              visible={showTextToolbar}
              textData={isEditingText ? selectedText : null}
              onUpdate={handleUpdateText}
              onClose={() => {
                setShowTextToolbar(false);
                setIsEditingText(false);
                setSelectedTextId(null);
              }}
              onAddNewText={handleAddText}
            />

   

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.fullPreviewButton} onPress={() => setShowFullPreview(true)}>
                <Ionicons name="expand" size={20} color="#FFF" />
                <Text style={styles.fullPreviewButtonText}>Full Preview</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Selection Screen when no media is selected */
          <View style={styles.selectionScreen}>
            <View style={styles.uploadOptions}>
              <TouchableOpacity style={styles.uploadOption} onPress={takePhoto}>
                <View style={[styles.optionIcon, { backgroundColor: '#4CAF50' }]}>
                  <Ionicons name="camera" size={40} color="#FFF" />
                </View>
                <Text style={styles.optionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadOption} onPress={pickImage}>
                <View style={[styles.optionIcon, { backgroundColor: '#2196F3' }]}>
                  <Ionicons name="images" size={40} color="#FFF" />
                </View>
                <Text style={styles.optionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Media */}
            <Text style={styles.sectionTitle}>Recent Photos & Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentMediaScroll}>
              {recentMedia.map((asset) => (
                <TouchableOpacity
                  key={asset.id}
                  style={styles.recentMediaItem}
                  onPress={() => {
                    setMedia(asset.uri);
                    setMediaType(asset.mediaType === 'video' ? 'video' : 'image');
                  }}
                >
                  <Image
                    source={{ uri: asset.uri }}
                    style={styles.recentMediaImage}
                    resizeMode="cover"
                  />
                  {asset.mediaType === 'video' && (
                    <View style={styles.videoIndicatorSmall}>
                      <Ionicons name="videocam" size={12} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Full Screen Preview Modal */}
      <Modal
        visible={showFullPreview}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.fullModalContainer}>
          <View style={styles.fullModalHeader}>
            <TouchableOpacity onPress={() => setShowFullPreview(false)}>
              <Ionicons name="arrow-back" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.fullModalTitle}>Preview</Text>
            <TouchableOpacity 
              style={styles.fullModalShareButton}
              onPress={uploadStory}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.fullModalShareButtonText}>Share</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.fullPreviewContent}>
            {renderMediaPreview()}
            {renderTextOverlays()}
          </View>

          <View style={styles.fullModalCaption}>
            <Text style={styles.fullModalCaptionText}>{caption || 'No caption'}</Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  shareButton: {
    backgroundColor: '#0095F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shareButtonDisabled: {
    backgroundColor: '#B2DFFC',
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  // Main Preview Styles
  mainPreviewContainer: {
    padding: 16,
  },
  previewWrapper: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    backgroundColor: '#000',
  },
  previewMedia: {
    width: '100%',
    height: '100%',
  },
  addTextButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addTextLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Text Overlay Styles
  draggableTextContainer: {
    position: 'absolute',
  },
  draggableText: {
    padding: 4,
  },
  deleteTextButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  // Toolbar Styles
  toolbarContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  toolbarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toolbarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  saveButton: {
    color: '#0095F6',
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 16,
    marginBottom: 16,
  },
  toolbarSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    marginTop: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#0095F6',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 12,
  },
  sliderLabel: {
    color: '#FFF',
    fontSize: 12,
  },
  styleButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  styleButton: {
    backgroundColor: '#2C2C2E',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleButtonActive: {
    backgroundColor: '#0095F6',
  },
  styleButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  styleButtonTextActive: {
    color: '#FFF',
  },
  alignmentButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  alignmentButton: {
    backgroundColor: '#2C2C2E',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alignmentButtonActive: {
    backgroundColor: '#3A3A3C',
  },
  previewContainer: {
    marginTop: 16,
  },
  previewBox: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  previewText: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // Caption Styles
  captionContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  captionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  captionInput: {
    fontSize: 16,
    color: '#000',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  captionCounter: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  // Action Buttons
  actionButtons: {
    marginBottom: 16,
  },
  fullPreviewButton: {
    backgroundColor: '#0095F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  fullPreviewButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Selection Screen (when no media)
  selectionScreen: {
    padding: 16,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  uploadOption: {
    alignItems: 'center',
  },
  optionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  recentMediaScroll: {
    marginHorizontal: -16,
  },
  recentMediaItem: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 16,
    position: 'relative',
  },
  recentMediaImage: {
    width: '100%',
    height: '100%',
  },
  videoIndicatorSmall: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    padding: 2,
  },
  // Full Screen Modal Styles
  fullModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fullModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  fullModalShareButton: {
    backgroundColor: '#0095F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  fullModalShareButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  fullPreviewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullModalCaption: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fullModalCaptionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default StoryUploadScreen;