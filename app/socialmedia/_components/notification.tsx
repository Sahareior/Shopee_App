import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,

  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
  Dimensions,
  Switch,
  RefreshControl,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock notification data
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'like',
    user: {
      id: 'u1',
      name: 'Alex Morgan',
      username: '@alexmorgan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786',
      isVerified: true,
    },
    post: {
      id: 'p1',
      preview: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    },
    message: 'liked your photo',
    timestamp: '2 min ago',
    isRead: false,
    isFollowing: true,
  },
  {
    id: '2',
    type: 'comment',
    user: {
      id: 'u2',
      name: 'Sarah Chen',
      username: '@sarahdesign',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      isVerified: false,
    },
    post: {
      id: 'p2',
      preview: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    },
    message: 'commented: "Amazing shot! 😍"',
    timestamp: '30 min ago',
    isRead: false,
    isFollowing: false,
  },
  {
    id: '3',
    type: 'follow',
    user: {
      id: 'u3',
      name: 'Marcus Lee',
      username: '@marcus_tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      isVerified: true,
    },
    message: 'started following you',
    timestamp: '1 hour ago',
    isRead: true,
    isFollowing: false,
  },
  {
    id: '4',
    type: 'mention',
    user: {
      id: 'u4',
      name: 'Emma Watson',
      username: '@emmaw',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      isVerified: true,
    },
    post: {
      id: 'p3',
      preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0',
    },
    message: 'mentioned you in a post',
    timestamp: '3 hours ago',
    isRead: true,
    isFollowing: true,
  },
  {
    id: '5',
    type: 'tag',
    user: {
      id: 'u5',
      name: 'David Park',
      username: '@davidpark',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      isVerified: false,
    },
    post: {
      id: 'p4',
      preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0',
    },
    message: 'tagged you in a photo',
    timestamp: '5 hours ago',
    isRead: true,
    isFollowing: true,
  },
  {
    id: '6',
    type: 'live',
    user: {
      id: 'u6',
      name: 'Tech Updates',
      username: '@techupdates',
      avatar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
      isVerified: true,
    },
    message: 'is going live in 15 minutes',
    timestamp: '1 day ago',
    isRead: true,
    isFollowing: true,
  },
  {
    id: '7',
    type: 'recommendation',
    user: {
      id: 'u7',
      name: 'Travel Diaries',
      username: '@traveldiaries',
      avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      isVerified: true,
    },
    message: 'posted for the first time in a while',
    timestamp: '2 days ago',
    isRead: true,
    isFollowing: false,
  },
  {
    id: '8',
    type: 'birthday',
    user: {
      id: 'u8',
      name: 'Jessica Kim',
      username: '@jessicakim',
      avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
      isVerified: false,
    },
    message: 'has a birthday today',
    timestamp: '2 days ago',
    isRead: true,
    isFollowing: true,
  },
];

const NOTIFICATION_TYPES = {
  like: { icon: 'heart', color: '#FF3B30', bgColor: '#FFEBEE' },
  comment: { icon: 'chatbubble', color: '#007AFF', bgColor: '#E8F0FE' },
  follow: { icon: 'person-add', color: '#34C759', bgColor: '#E8F7EE' },
  mention: { icon: 'at', color: '#5856D6', bgColor: '#F0EFFF' },
  tag: { icon: 'pricetag', color: '#FF9500', bgColor: '#FFF4E6' },
  live: { icon: 'radio', color: '#FF2D55', bgColor: '#FFEBF0' },
  recommendation: { icon: 'star', color: '#FFCC00', bgColor: '#FFF9E6' },
  birthday: { icon: 'gift', color: '#AF52DE', bgColor: '#F5E6FF' },
};

const Notification = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    showPreviews: true,
  });

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

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const handleFollowToggle = (userId) => {
    setNotifications(notifications.map(notification =>
      notification.user.id === userId
        ? { ...notification, isFollowing: !notification.isFollowing }
        : notification
    ));
  };

  const handleNotificationTypePress = (type) => {
    console.log(`Navigate to ${type} notifications`);
  };

  const handleSettingsToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'following') return notification.isFollowing;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationItem = ({ item }) => {
    const typeConfig = NOTIFICATION_TYPES[item.type] || NOTIFICATION_TYPES.like;
    
    return (
      <Animated.View
        style={[
          styles.notificationItem,
          !item.isRead && styles.unreadNotification,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.notificationContent}>
          {/* Type Icon */}
          <View style={[styles.typeIconContainer, { backgroundColor: typeConfig.bgColor }]}>
            <Ionicons name={typeConfig.icon} size={20} color={typeConfig.color} />
          </View>

          {/* User Avatar */}
          <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
          
          {/* Notification Text */}
          <View style={styles.notificationText}>
            <Text style={styles.notificationMessage}>
              <Text style={styles.userName}>{item.user.name} </Text>
              {item.message}
              <Text style={styles.timestamp}> · {item.timestamp}</Text>
            </Text>
            
            {item.user.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#007AFF" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          {/* Post Preview or Action Button */}
          {item.post ? (
            <TouchableOpacity
              style={styles.postPreview}
              onPress={() => console.log('View post:', item.post.id)}
            >
              <Image source={{ uri: item.post.preview }} style={styles.postImage} />
            </TouchableOpacity>
          ) : item.type === 'follow' ? (
            <TouchableOpacity
              style={[
                styles.followButton,
                item.isFollowing && styles.followingButton,
              ]}
              onPress={() => handleFollowToggle(item.user.id)}
            >
              <Text style={[
                styles.followButtonText,
                item.isFollowing && styles.followingButtonText,
              ]}>
                {item.isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!item.isRead && (
            <TouchableOpacity
              style={styles.markReadButton}
              onPress={() => handleMarkAsRead(item.id)}
            >
              <Feather name="check" size={16} color="#666" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
            >
              <Text style={styles.markAllText}>Mark all as read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Filters */}
      <View style={styles.quickFilters}>
        <TouchableOpacity
          style={[styles.filterButton, activeTab === 'all' && styles.activeFilterButton]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.filterText, activeTab === 'all' && styles.activeFilterText]}>
            All
          </Text>
          {unreadCount > 0 && activeTab === 'all' && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, activeTab === 'unread' && styles.activeFilterButton]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.filterText, activeTab === 'unread' && styles.activeFilterText]}>
            Unread
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, activeTab === 'following' && styles.activeFilterButton]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.filterText, activeTab === 'following' && styles.activeFilterText]}>
            Following
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notification Types */}
      <View style={styles.notificationTypes}>
        {Object.entries(NOTIFICATION_TYPES).map(([type, config]) => (
          <TouchableOpacity
            key={type}
            style={styles.notificationTypeButton}
            onPress={() => handleNotificationTypePress(type)}
          >
            <View style={[styles.typeButtonIcon, { backgroundColor: config.bgColor }]}>
              <Ionicons name={config.icon} size={20} color={config.color} />
            </View>
            <Text style={styles.typeButtonText}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderSettingsSection = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.settingsTitle}>Notification Settings</Text>
      
      {Object.entries(settings).map(([key, value]) => (
        <View key={key} style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>
              {key.split(/(?=[A-Z])/).map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Text>
            <Text style={styles.settingDescription}>
              {getSettingDescription(key)}
            </Text>
          </View>
          <Switch
            value={value}
            onValueChange={() => handleSettingsToggle(key)}
            trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E5EA"
          />
        </View>
      ))}
    </View>
  );

  const getSettingDescription = (key) => {
    const descriptions = {
      pushNotifications: 'Receive push notifications on your device',
      emailNotifications: 'Get notifications via email',
      soundEnabled: 'Play sound for new notifications',
      vibrationEnabled: 'Vibrate for new notifications',
      showPreviews: 'Show preview of notification content',
    };
    return descriptions[key] || '';
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name="notifications-off-outline" size={60} color="#D1D1D6" />
      </View>
      <Text style={styles.emptyStateTitle}>No notifications</Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'unread'
          ? 'You\'re all caught up!'
          : 'When you get notifications, they\'ll appear here.'}
      </Text>
      <TouchableOpacity style={styles.emptyStateButton}>
        <Text style={styles.emptyStateButtonText}>Explore trending</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
  <Text style={{
    fontSize:28,
    fontWeight: 700,
    paddingBottom:16
  }}> Notifications </Text>
      
  
      
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredNotifications.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderSettingsSection}
        ListFooterComponentStyle={styles.settingsFooter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {

    paddingHorizontal: 16,
    paddingBottom: 16,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButton: {
    marginRight: 16,
  },
  markAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickFilters: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  filterBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 5,
  },
  notificationTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  notificationTypeButton: {
    alignItems: 'center',
    width: (width - 32) / 4,
    marginBottom: 12,
  },
  typeButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  notificationItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#F8F9FF',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  typeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 15,
    lineHeight: 20,
    color: '#333',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '700',
    color: '#000',
  },
  timestamp: {
    color: '#999',
    fontSize: 13,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  postPreview: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 12,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    marginLeft: 12,
  },
  followingButton: {
    backgroundColor: '#f5f5f5',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  followingButtonText: {
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  markReadButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#007AFF',
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  settingsFooter: {
    marginTop: 24,
  },
  settingsSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default Notification;