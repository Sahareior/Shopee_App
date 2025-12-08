// StoryUploadScreen.js
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
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useCreateStoryMutation } from '@/app/redux/slices/jsonApiSlice';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// -------------------- SimpleMedia --------------------
// Important fixes:
// 1) children moved INSIDE the same Animated.View as the media so transforms affect overlays.
// 2) onLayout measures displayed container and reports it via onSizeChange prop.
const SimpleMedia = ({ mediaUri, mediaType, transform, onTransformChange, children, onSizeChange }) => {
  const translateX = useRef(new Animated.Value(transform.translateX || 0)).current;
  const translateY = useRef(new Animated.Value(transform.translateY || 0)).current;
  const lastTranslate = useRef({ x: transform.translateX || 0, y: transform.translateY || 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateX.stopAnimation();
        translateY.stopAnimation();
      },
      onPanResponderMove: (evt, gestureState) => {
        // Move based on gesture (we're applying absolute offsets)
        const newX = lastTranslate.current.x + gestureState.dx;
        const newY = lastTranslate.current.y + gestureState.dy;
        translateX.setValue(newX);
        translateY.setValue(newY);
        if (onTransformChange) {
          onTransformChange({ scale: 1, translateX: newX, translateY: newY });
        }
      },
      onPanResponderRelease: () => {
        translateX.stopAnimation((value) => {
          lastTranslate.current.x = value;
        });
        translateY.stopAnimation((value) => {
          lastTranslate.current.y = value;
        });
        if (onTransformChange) {
          onTransformChange({
            scale: 1,
            translateX: lastTranslate.current.x,
            translateY: lastTranslate.current.y,
          });
        }
      },
    })
  ).current;

  const onLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    setDisplaySize({ width, height });
    if (typeof onSizeChange === 'function') onSizeChange({ width, height });
  };

  const resetTransform = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start();
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start(() => {
      lastTranslate.current = { x: 0, y: 0 };
      if (onTransformChange) onTransformChange({ scale: 1, translateX: 0, translateY: 0 });
    });
  };

  return (
    <View style={styles.mediaContainer}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [{ translateX }, { translateY }],
          },
        ]}
        {...panResponder.panHandlers}
        onLayout={onLayout} // measures displayed media container
      >
        {mediaType === 'video' ? (
          <Video
            source={{ uri: mediaUri }}
            style={styles.previewMedia}
            resizeMode="cover"
            shouldPlay
            isLooping
            useNativeControls={false}
          />
        ) : (
          <Image source={{ uri: mediaUri }} style={styles.previewMedia} resizeMode="cover" />
        )}

        {/* CHILDREN moved inside the transformed Animated.View so they share transforms */}
        {children}
      </Animated.View>

      <TouchableOpacity style={styles.resetPositionButton} onPress={resetTransform}>
        <Ionicons name="refresh" size={20} color="#FFF" />
        <Text style={styles.resetPositionText}>Reset Position</Text>
      </TouchableOpacity>
    </View>
  );
};

// -------------------- DraggableText --------------------
// Uses relativePosition for persistence. Computes absolute left/top using displaySize prop.
// On release we compute new relative coords and call onDrag(id, relativePosition).
const DraggableText = ({ textData, displaySize, onDrag, onPress, isSelected, onDelete }) => {
  // default relative position if none
  const rel = textData.relativePosition || { x: 0.1, y: 0.3 };
  // compute initial absolute position
  const initialLeft = (displaySize?.width || SCREEN_WIDTH) * rel.x;
  const initialTop = (displaySize?.height || SCREEN_HEIGHT) * rel.y;

  const pan = useRef(new Animated.ValueXY({ x: initialLeft, y: initialTop })).current;
  // Keep in sync if displaySize or relativePosition changes (e.g., modal resize)
  useEffect(() => {
    const left = (displaySize?.width || SCREEN_WIDTH) * rel.x;
    const top = (displaySize?.height || SCREEN_HEIGHT) * rel.y;
    pan.setValue({ x: left, y: top });
  }, [displaySize, rel.x, rel.y]);

  // PanResponder that uses offsets so Animated.ValueXY reflects absolute position after flattenOffset
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
        if (onPress) onPress(textData.id);
        evt.stopPropagation && evt.stopPropagation();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gestureState) => {
        pan.flattenOffset();
        // absolute values:
        const absX = pan.x._value;
        const absY = pan.y._value;
        // compute relative and clamp between 0..1
        const relX = Math.max(0, Math.min(1, absX / (displaySize?.width || SCREEN_WIDTH)));
        const relY = Math.max(0, Math.min(1, absY / (displaySize?.height || SCREEN_HEIGHT)));
        if (onDrag) onDrag(textData.id, { x: relX, y: relY });
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.draggableTextContainer,
        {
          position: 'absolute',
          left: pan.x,
          top: pan.y,
          transform: [{ scale: 1 }],
          borderWidth: isSelected ? 2 : 0,
          borderColor: isSelected ? '#FFD700' : 'transparent',
          borderRadius: isSelected ? 8 : 0,
          padding: isSelected ? 4 : 0,
          zIndex: isSelected ? 1000 : 10,
        },
      ]}
    >
      <Text
        style={{
          color: textData.color || '#FFFFFF',
          fontSize: textData.fontSize || 24,
          fontFamily: textData.fontFamily || 'System',
          textAlign: textData.align || 'center',
          fontWeight: textData.bold ? 'bold' : 'normal',
          fontStyle: textData.italic ? 'italic' : 'normal',
          textDecorationLine: textData.underline ? 'underline' : 'none',
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
        }}
      >
        {textData.text}
      </Text>

      {isSelected && (
        <TouchableOpacity style={styles.deleteTextButton} onPress={() => onDelete(textData.id)}>
          <Ionicons name="close-circle" size={20} color="#FF4444" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// -------------------- TextEditingToolbar (unchanged except small tweaks) --------------------
const TextEditingToolbar = ({ visible, textData, onUpdate, onClose, onAddNewText, previewSize }) => {
  const [localText, setLocalText] = useState(textData?.text || '');
  const [selectedColor, setSelectedColor] = useState(textData?.color || '#FFFFFF');
  const [fontSize, setFontSize] = useState(textData?.fontSize || 24);
  const [isBold, setIsBold] = useState(textData?.bold || false);
  const [isItalic, setIsItalic] = useState(textData?.italic || false);
  const [isUnderline, setIsUnderline] = useState(textData?.underline || false);
  const [textAlign, setTextAlign] = useState(textData?.align || 'center');

  useEffect(() => {
    if (textData) {
      setLocalText(textData.text);
      setSelectedColor(textData.color || '#FFFFFF');
      setFontSize(textData.fontSize || 24);
      setIsBold(textData.bold || false);
      setIsItalic(textData.italic || false);
      setIsUnderline(textData.underline || false);
      setTextAlign(textData.align || 'center');
    } else {
      setLocalText('');
    }
  }, [textData]);

  const colors = ['#FFFFFF', '#FF3B30', '#4CD964', '#007AFF', '#5856D6', '#FF2D55', '#FF9500', '#FFCC00', '#8E8E93', '#000000'];

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
      onClose && onClose();
    }
  };

  const handleAddNew = () => {
    if (!localText.trim()) return;
    // Create relative default position using previewSize if available
    const relX = previewSize?.width ? 0.1 : 0.1;
    const relY = previewSize?.height ? 0.3 : 0.3;
    onAddNewText({
      text: localText.trim(),
      color: selectedColor,
      fontSize,
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
      align: textAlign,
      relativePosition: { x: relX, y: relY },
    });
    setLocalText('');
    onClose && onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.toolbarContainer}>
      <View style={styles.toolbarHeader}>
        <Text style={styles.toolbarTitle}>{textData ? 'Edit Text' : 'Add Text'}</Text>
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

      <TextInput
        style={styles.textInput}
        placeholder="Type your text here..."
        placeholderTextColor="#999"
        value={localText}
        onChangeText={setLocalText}
        multiline
        autoFocus
      />

      <Text style={styles.toolbarSectionTitle}>Color</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.colorPicker}>
          {colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.colorOption, { backgroundColor: color }, selectedColor === color && styles.selectedColorOption]}
              onPress={() => setSelectedColor(color)}
            >
              {selectedColor === color && <Ionicons name="checkmark" size={16} color={color === '#000000' ? '#FFF' : '#000'} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.toolbarSectionTitle}>Font Size: {fontSize}</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>S</Text>
        <Slider style={styles.slider} minimumValue={12} maximumValue={72} step={2} value={fontSize} onValueChange={setFontSize} />
        <Text style={styles.sliderLabel}>L</Text>
      </View>

      <Text style={styles.toolbarSectionTitle}>Style</Text>
      <View style={styles.styleButtons}>
        <TouchableOpacity style={[styles.styleButton, isBold && styles.styleButtonActive]} onPress={() => setIsBold(!isBold)}>
          <Text style={[styles.styleButtonText, isBold && styles.styleButtonTextActive]}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.styleButton, isItalic && styles.styleButtonActive]} onPress={() => setIsItalic(!isItalic)}>
          <Text style={[styles.styleButtonText, isItalic && styles.styleButtonTextActive, { fontStyle: 'italic' }]}>I</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.styleButton, isUnderline && styles.styleButtonActive]} onPress={() => setIsUnderline(!isUnderline)}>
          <Text style={[styles.styleButtonText, isUnderline && styles.styleButtonTextActive, { textDecorationLine: 'underline' }]}>U</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.toolbarSectionTitle}>Alignment</Text>
      <View style={styles.alignmentButtons}>
        <TouchableOpacity style={[styles.alignmentButton, textAlign === 'left' && styles.alignmentButtonActive]} onPress={() => setTextAlign('left')}>
          <Ionicons name="align-left" size={20} color={textAlign === 'left' ? '#0095F6' : '#FFF'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.alignmentButton, textAlign === 'center' && styles.alignmentButtonActive]} onPress={() => setTextAlign('center')}>
          <Ionicons name="align-center" size={20} color={textAlign === 'center' ? '#0095F6' : '#FFF'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.alignmentButton, textAlign === 'right' && styles.alignmentButtonActive]} onPress={() => setTextAlign('right')}>
          <Ionicons name="align-right" size={20} color={textAlign === 'right' ? '#0095F6' : '#FFF'} />
        </TouchableOpacity>
      </View>

      <View style={styles.previewContainer}>
        <Text style={styles.toolbarSectionTitle}>Preview</Text>
        <View style={styles.previewBox}>
          <Text style={[styles.previewText, { color: selectedColor, fontSize, fontWeight: isBold ? 'bold' : 'normal', fontStyle: isItalic ? 'italic' : 'normal', textDecorationLine: isUnderline ? 'underline' : 'none', textAlign }]}>
            {localText || 'Sample Text'}
          </Text>
        </View>
      </View>
    </View>
  );
};

// -------------------- Main Component (StoryUploadScreen) --------------------
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
  const [transform, setTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });
  const [createStory] = useCreateStoryMutation();
  const [previewDisplaySize, setPreviewDisplaySize] = useState({ width: SCREEN_WIDTH, height: 400 }); // default preview size

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
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setMedia(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'image');
        setTextOverlays([]);
        setTransform({ scale: 1, translateX: 0, translateY: 0 });
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
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setMedia(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'image');
        setTextOverlays([]);
        setTransform({ scale: 1, translateX: 0, translateY: 0 });
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
      // ensure relativePosition exists (textData likely provides it via toolbar)
      relativePosition: textData.relativePosition || { x: 0.1, y: 0.3 },
    };
    setTextOverlays((prev) => [...prev, newText]);
    setSelectedTextId(newText.id);
    setShowTextToolbar(false);
    setIsEditingText(false);
  };

  const handleUpdateText = (updatedText) => {
    setTextOverlays((prev) => prev.map((t) => (t.id === updatedText.id ? updatedText : t)));
  };

  const handleDeleteText = (id) => {
    setTextOverlays((prev) => prev.filter((t) => t.id !== id));
    setSelectedTextId(null);
    if (textOverlays.length === 1) {
      setShowTextToolbar(false);
    }
  };

  // onDrag receives relative coords and updates overlay
  const handleTextDrag = (id, relativePos) => {
    setTextOverlays((prev) => prev.map((t) => (t.id === id ? { ...t, relativePosition: relativePos } : t)));
  };

  const handleTextPress = (id) => {
    setSelectedTextId(id);
    setShowTextToolbar(true);
    setIsEditingText(true);
  };

  const renderTextOverlays = (displaySize) => {
    return textOverlays.map((textData) => (
      <DraggableText
        key={textData.id}
        textData={textData}
        displaySize={displaySize || previewDisplaySize}
        onDrag={handleTextDrag}
        onPress={handleTextPress}
        isSelected={selectedTextId === textData.id}
        onDelete={handleDeleteText}
      />
    ));
  };

  const uploadStory = async () => {
    if (!media) {
      Alert.alert('Error', 'Please select a photo or video');
      return;
    }
    try {
      setIsUploading(true);
      const response = await fetch(media);
      const blob = await response.blob();
      const reader = new FileReader();
      const mediaData = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const textOverlaysWithRelative = textOverlays.map((overlay) => ({
        ...overlay,
        relativePosition: overlay.relativePosition || { x: 0.1, y: 0.3 },
      }));

      const storyData = {
        mediaData,
        mediaType,
        caption,
        textOverlays: textOverlaysWithRelative,
        transform: JSON.stringify(transform),
        duration: 24,
        mimeType: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
        fileName: media.split('/').pop(),
        screenWidth: previewDisplaySize.width,
        screenHeight: previewDisplaySize.height,
      };

      const res = await createStory(storyData);
      if (res.data?.success) {
        Alert.alert('Success', 'Your story has been uploaded!', [{ text: 'OK', onPress: resetForm }]);
      } else {
        Alert.alert('Error', res.data?.message || 'Failed to upload story');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload story');
    } finally {
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
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  const selectedText = textOverlays.find((t) => t.id === selectedTextId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={resetForm}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Story</Text>
        <TouchableOpacity style={[styles.shareButton, (!media || isUploading) && styles.shareButtonDisabled]} onPress={uploadStory} disabled={!media || isUploading}>
          {isUploading ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.shareButtonText}>Share</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {media ? (
          <View style={styles.mainPreviewContainer}>
            <View style={styles.previewWrapper}>
              <SimpleMedia
                mediaUri={media}
                mediaType={mediaType}
                transform={transform}
                onTransformChange={setTransform}
                onSizeChange={(size) => setPreviewDisplaySize(size)} // get measured preview size
              >
                {/* Pass measured size to the overlays through renderTextOverlays */}
                {renderTextOverlays(previewDisplaySize)}
              </SimpleMedia>

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

            <TextEditingToolbar visible={showTextToolbar} textData={isEditingText ? selectedText : null} onUpdate={handleUpdateText} onClose={() => setShowTextToolbar(false)} onAddNewText={(text) => handleAddText(text)} previewSize={previewDisplaySize} />

            <View style={styles.captionContainer}>
              <Text style={styles.captionLabel}>Add a caption</Text>
              <TextInput style={styles.captionInput} placeholder="Write a caption..." placeholderTextColor="#999" value={caption} onChangeText={setCaption} multiline maxLength={2200} />
              <Text style={styles.captionCounter}>{caption.length}/2200</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.fullPreviewButton} onPress={() => setShowFullPreview(true)}>
                <Ionicons name="expand" size={20} color="#FFF" />
                <Text style={styles.fullPreviewButtonText}>Full Preview</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
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

            <Text style={styles.sectionTitle}>Recent Photos & Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentMediaScroll}>
              {recentMedia.map((asset) => (
                <TouchableOpacity key={asset.id} style={styles.recentMediaItem} onPress={() => { setMedia(asset.uri); setMediaType(asset.mediaType === 'video' ? 'video' : 'image'); }}>
                  <Image source={{ uri: asset.uri }} style={styles.recentMediaImage} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <Modal visible={showFullPreview} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={styles.fullModalContainer}>
          <View style={styles.fullModalHeader}>
            <TouchableOpacity onPress={() => setShowFullPreview(false)}>
              <Ionicons name="arrow-back" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.fullModalTitle}>Preview</Text>
            <TouchableOpacity style={styles.fullModalShareButton} onPress={uploadStory} disabled={isUploading}>
              {isUploading ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.fullModalShareButtonText}>Share</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.fullPreviewContent}>
            <SimpleMedia mediaUri={media} mediaType={mediaType} transform={transform} onTransformChange={setTransform} onSizeChange={(size) => setPreviewDisplaySize(size)}>
              {renderTextOverlays(previewDisplaySize)}
            </SimpleMedia>
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
  // (styles are mostly same as your original, trimmed/kept)
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  shareButton: { backgroundColor: '#0095F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  shareButtonDisabled: { backgroundColor: '#B2DFFC' },
  shareButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  content: { flex: 1 },
  mediaContainer: { width: '100%', height: '100%', position: 'relative', overflow: 'hidden' },
  animatedContainer: { width: '100%', height: 400, backgroundColor: '#000' },
  previewMedia: { width: '100%', height: '100%' },
  mainPreviewContainer: { padding: 16 },
  previewWrapper: { height: 400, borderRadius: 12, overflow: 'hidden', marginBottom: 16, position: 'relative', backgroundColor: '#000' },
  resetPositionButton: { position: 'absolute', bottom: 16, left: 16, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8 },
  resetPositionText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  addTextButton: { position: 'absolute', bottom: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 100 },
  addTextLabel: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  draggableTextContainer: { position: 'absolute', zIndex: 10 },
  draggableText: { padding: 4 },
  deleteTextButton: { position: 'absolute', top: -10, right: -10, backgroundColor: '#FFF', borderRadius: 12, zIndex: 11 },
  toolbarContainer: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 16, marginBottom: 16 },
  toolbarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  toolbarTitle: { fontSize: 18, fontWeight: '600', color: '#FFF' },
  toolbarActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  saveButton: { color: '#0095F6', fontSize: 16, fontWeight: '600' },
  textInput: { backgroundColor: '#2C2C2E', borderRadius: 8, padding: 12, color: '#FFF', fontSize: 16, marginBottom: 16 },
  toolbarSectionTitle: { fontSize: 14, fontWeight: '600', color: '#8E8E93', marginBottom: 8, marginTop: 12 },
  colorPicker: { flexDirection: 'row', marginBottom: 12 },
  colorOption: { width: 32, height: 32, borderRadius: 16, marginRight: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  selectedColorOption: { borderColor: '#0095F6' },
  sliderContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  slider: { flex: 1, height: 40, marginHorizontal: 12 },
  sliderLabel: { color: '#FFF', fontSize: 12 },
  styleButtons: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  styleButton: { backgroundColor: '#2C2C2E', width: 44, height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  styleButtonActive: { backgroundColor: '#0095F6' },
  styleButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  styleButtonTextActive: { color: '#FFF' },
  alignmentButtons: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  alignmentButton: { backgroundColor: '#2C2C2E', width: 44, height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  alignmentButtonActive: { backgroundColor: '#3A3A3C' },
  previewContainer: { marginTop: 16 },
  previewBox: { backgroundColor: '#2C2C2E', borderRadius: 8, padding: 16, alignItems: 'center', justifyContent: 'center', minHeight: 80 },
  previewText: { textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  captionContainer: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16, marginBottom: 16 },
  captionLabel: { fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 8 },
  captionInput: { fontSize: 16, color: '#000', minHeight: 60, textAlignVertical: 'top' },
  captionCounter: { fontSize: 12, color: '#999', textAlign: 'right', marginTop: 4 },
  actionButtons: { marginBottom: 16 },
  fullPreviewButton: { backgroundColor: '#0095F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 8 },
  fullPreviewButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  selectionScreen: { padding: 16 },
  uploadOptions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 32 },
  uploadOption: { alignItems: 'center' },
  optionIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  optionText: { fontSize: 14, color: '#000', fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 12 },
  recentMediaScroll: { marginHorizontal: -16 },
  recentMediaItem: { width: 100, height: 100, borderRadius: 8, overflow: 'hidden', marginLeft: 16, position: 'relative' },
  recentMediaImage: { width: '100%', height: '100%' },
  fullModalContainer: { flex: 1, backgroundColor: '#000' },
  fullModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  fullModalTitle: { fontSize: 18, fontWeight: '600', color: '#FFF' },
  fullModalShareButton: { backgroundColor: '#0095F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  fullModalShareButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  fullPreviewContent: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  fullModalCaption: { padding: 16, backgroundColor: 'rgba(0,0,0,0.8)' },
  fullModalCaptionText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
});

export default StoryUploadScreen;
