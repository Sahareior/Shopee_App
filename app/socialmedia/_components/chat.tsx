import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
 
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Mock data for demonstration
const MOCK_CONVERSATIONS = [
  {
    id: '1',
    user: {
      id: 'u1',
      name: 'Alex Morgan',
      username: '@alexmorgan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786',
      isOnline: true,
      isVerified: true,
    },
    lastMessage: 'Hey! Are we still on for tonight? 😊',
    timestamp: '2 min ago',
    unreadCount: 3,
    isTyping: false,
  },
  {
    id: '2',
    user: {
      id: 'u2',
      name: 'Sarah Chen',
      username: '@sarahdesign',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      isOnline: true,
      isVerified: false,
    },
    lastMessage: 'Just sent you the design files!',
    timestamp: '30 min ago',
    unreadCount: 0,
    isTyping: true,
  },
  {
    id: '3',
    user: {
      id: 'u3',
      name: 'Marcus Lee',
      username: '@marcus_tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      isOnline: false,
      isVerified: true,
    },
    lastMessage: 'Thanks for the help yesterday! 🙏',
    timestamp: '2h ago',
    unreadCount: 0,
    isTyping: false,
  },
  {
    id: '4',
    user: {
      id: 'u4',
      name: 'Emma Watson',
      username: '@emmaw',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      isOnline: true,
      isVerified: true,
    },
    lastMessage: '📸 Check out my new photos!',
    timestamp: '4h ago',
    unreadCount: 5,
    isTyping: false,
  },
  {
    id: '5',
    user: {
      id: 'u5',
      name: 'David Park',
      username: '@davidpark',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      isOnline: false,
      isVerified: false,
    },
    lastMessage: 'Meeting rescheduled to 3 PM',
    timestamp: '1d ago',
    unreadCount: 0,
    isTyping: false,
  },
];

const MOCK_MESSAGES = [
  {
    id: '1',
    text: 'Hey there! 👋 How are you doing today?',
    senderId: 'u1',
    timestamp: '10:30 AM',
    isRead: true,
    reactions: { like: 1, love: 1 },
  },
  {
    id: '2',
    text: 'I\'m doing great! Just finished my morning workout 💪',
    senderId: 'currentUser',
    timestamp: '10:31 AM',
    isRead: true,
    reactions: {},
  },
  {
    id: '3',
    text: 'That\'s awesome! Want to grab coffee later?',
    senderId: 'u1',
    timestamp: '10:32 AM',
    isRead: true,
    reactions: {},
  },
  {
    id: '4',
    text: 'Sure! How about 3 PM at the usual spot?',
    senderId: 'currentUser',
    timestamp: '10:33 AM',
    isRead: true,
    reactions: { like: 1 },
  },
  {
    id: '5',
    text: 'Perfect! See you then ☕',
    senderId: 'u1',
    timestamp: '10:34 AM',
    isRead: false,
    isTyping: false,
    reactions: { love: 1 },
  },
];

const Chat = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        senderId: 'currentUser',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        reactions: {},
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate reply after 1 second
      setTimeout(() => {
        const replies = [
          'Sounds good! 😊',
          'Great idea! 👍',
          'Let me check and get back to you',
          'Looking forward to it!',
          'Thanks for sharing!',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const replyMessage = {
          id: (Date.now() + 1).toString(),
          text: randomReply,
          senderId: selectedChat?.user?.id || 'u1',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
          isTyping: false,
          reactions: {},
        };
        setMessages(prev => [...prev, replyMessage]);
      }, 1000);
    }
  };

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.senderId === 'currentUser';
    
    const messageStyles = isCurrentUser ? {
      container: [styles.messageBubble, styles.currentUserBubble],
      content: [styles.messageContent, styles.currentUserContent],
      text: styles.currentUserMessageText,
      time: styles.currentUserMessageTime,
      reactionBadge: styles.currentUserReactionBadge,
      reactionCount: styles.currentUserReactionCount,
    } : {
      container: [styles.messageBubble, styles.otherUserBubble],
      content: [styles.messageContent, styles.otherUserContent],
      text: styles.otherUserMessageText,
      time: styles.otherUserMessageTime,
      reactionBadge: styles.otherUserReactionBadge,
      reactionCount: styles.otherUserReactionCount,
    };
    
    return (
      <Animated.View
        style={[
          messageStyles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={messageStyles.content}>
          <Text style={messageStyles.text}>{item.text}</Text>
          
          {/* Message reactions */}
          {Object.keys(item.reactions).length > 0 && (
            <View style={styles.reactionsContainer}>
              {Object.entries(item.reactions).map(([type, count]) => (
                <View key={type} style={messageStyles.reactionBadge}>
                  <Text style={styles.reactionEmoji}>
                    {type === 'like' ? '👍' : type === 'love' ? '❤️' : '😊'}
                  </Text>
                  {count > 1 && (
                    <Text style={messageStyles.reactionCount}>{count}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.messageFooter}>
            <Text style={messageStyles.time}>{item.timestamp}</Text>
            {isCurrentUser && (
              <Ionicons 
                name={item.isRead ? "checkmark-done" : "checkmark"} 
                size={14} 
                color={item.isRead ? "#007AFF" : "#999"} 
              />
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => setSelectedChat(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        {item.user.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.user.name}</Text>
          {item.user.isVerified && (
            <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
          )}
          <Text style={styles.conversationTime}>{item.timestamp}</Text>
        </View>
        
        <View style={styles.conversationPreview}>
          {item.isTyping ? (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>Typing...</Text>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, { opacity: 0.6 }]} />
                <View style={[styles.typingDot, { opacity: 0.6 }]} />
                <View style={[styles.typingDot, { opacity: 0.6 }]} />
              </View>
            </View>
          ) : (
            <Text style={styles.previewText} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          )}
        </View>
      </View>
      
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderChatHeader = () => (
    <View style={styles.chatHeader}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setSelectedChat(null)}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.chatHeaderInfo}>
        <Image source={{ uri: selectedChat.user.avatar }} style={styles.chatHeaderAvatar} />
        <View style={styles.chatHeaderText}>
          <Text style={styles.chatHeaderName}>{selectedChat.user.name}</Text>
          <Text style={styles.chatHeaderStatus}>
            {selectedChat.user.isOnline ? 'Online' : 'Last seen recently'}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.chatHeaderActions}>
        <TouchableOpacity style={styles.headerActionButton}>
          <Ionicons name="videocam" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerActionButton}>
          <Ionicons name="call" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerActionButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMainHeader = () => (
    <Animated.View 
      style={[
        styles.mainHeader,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Messages</Text>
       
      </View>
      

      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  if (selectedChat) {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <SafeAreaView style={styles.safeArea}>
          {renderChatHeader()}
          
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="add-circle" size={28} color="#007AFF" />
            </TouchableOpacity>
            
            <TextInput
              ref={inputRef}
              style={styles.messageInput}
              placeholder="Message..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            
            {message.trim() ? (
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.voiceButton}>
                <FontAwesome5 name="microphone" size={20} color="#007AFF" />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      
      {renderMainHeader()}
      
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.storiesContainer}>
            <View style={styles.storiesHeader}>
              <Text style={styles.storiesTitle}>Active Stories</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  mainHeader: {
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
  },
  newChatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 16,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
  },
  storiesContainer: {
    backgroundColor: '#fff',
    paddingBottom: 16,
  },
  storiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  storiesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  conversationsList: {
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: '#fff',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginRight: 6,
  },
  conversationTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 'auto',
  },
  conversationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF',
    marginHorizontal: 1,
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 6,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  chatHeaderStatus: {
    fontSize: 13,
    color: '#666',
  },
  chatHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    marginLeft: 16,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    marginVertical: 4,
  },
  currentUserBubble: {
    alignSelf: 'flex-end',
  },
  otherUserBubble: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currentUserContent: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherUserContent: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  currentUserMessageText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  otherUserMessageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  currentUserMessageTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginRight: 4,
  },
  otherUserMessageTime: {
    fontSize: 11,
    color: '#999',
    marginRight: 4,
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  currentUserReactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  otherUserReactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  reactionEmoji: {
    fontSize: 12,
    marginRight: 2,
  },
  currentUserReactionCount: {
    fontSize: 10,
    color: '#fff',
  },
  otherUserReactionCount: {
    fontSize: 10,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  attachmentButton: {
    marginRight: 12,
    marginBottom: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 8,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 8,
  },
});

export default Chat;