import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'

const RecentlyViewed = () => {
  const [activeStatus, setActiveStatus] = useState('To Pay')

  // Sample data for recently viewed profiles
  const recentlyViewed = [
    {
      id: 1,
      name: 'Sarah',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '2h ago'
    },
    {
      id: 2,
      name: 'Mike',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '5h ago'
    },
    {
      id: 3,
      name: 'Emma',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '1d ago'
    },
    {
      id: 4,
      name: 'John',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '2d ago'
    },
    {
      id: 5,
      name: 'Lisa',
      image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '3d ago'
    },
    {
      id: 6,
      name: 'David',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      time: '3d ago'
    }
  ]

  const statusItems = ['To Pay', 'To Receive', 'To Review']

  return (
    <View style={styles.container}>
      {/* Navigation Tabs - Positioned at start */}


      {/* Recently Viewed Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Recently Viewed</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {recentlyViewed.map((user) => (
            <TouchableOpacity key={user.id} style={styles.userItem}>
              <View style={styles.imageContainer}>
                <Image 
                  source={user.image} 
                  style={styles.userImage}
                  contentFit="cover"
                />
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{user.time}</Text>
                </View>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

            <View style={styles.navigationTabs}>
        {statusItems.map((item) => (
          <TouchableOpacity 
            key={item}
            style={[
              styles.tab,
              activeStatus === item && styles.tabActive
            ]}
            onPress={() => setActiveStatus(item)}
          >
            <Text style={[
              styles.tabText,
              activeStatus === item && styles.tabTextActive
            ]}>
              {item}
            </Text>
          
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default RecentlyViewed

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  navigationTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
//    padding:4,
    borderRadius: 12,
    padding: 14,
    marginBottom: 25,
    marginTop: 10,
    gap:18
  },
  tab: {
    
    alignItems: 'center',
    position: 'relative',
    borderRadius: 8,
    marginRight: 8,
  },

  tabText: {
    fontSize: 14,
    paddingVertical:7,
    paddingHorizontal:9,
    fontWeight: '600',
    // paddingHorizontal: 10,
    color: '#004CFF',
    backgroundColor:'#E5EBFC'
  },

  tabIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#004CFF',
  },
  section: {
    marginVertical: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#004CFF',
    fontWeight: '600',
  },
  scrollContainer: {
    paddingRight: 16,
    gap: 15,
  },
  userItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  imageContainer: {
    position: 'relative',
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#004CFF',
    marginBottom: 8,
  },
  timeBadge: {
    position: 'absolute',
    top: -1,
    right: -13,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  timeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  userName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
})