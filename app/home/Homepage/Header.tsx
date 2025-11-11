import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const Header = () => {
  const router = useRouter()
  return (
<View style={styles.container}>
        <View style={styles.header}>
      <View style={styles.leftSection}>
        <Image 
          style={styles.profileImage} 
          source='https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=464' 
          contentFit="cover"
        />
        <TouchableOpacity onPress={()=> router.push('/home/ProfilePage/activity')} style={styles.activityButton}>
          <Text style={styles.activityText}>My Activity</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.rightSection}>
        {/* Chat Icon */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#333" />
        </TouchableOpacity>
        
        {/* Statistics Icon */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="stats-chart-outline" size={24} color="#333" />
        </TouchableOpacity>
        
        {/* Settings Icon */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
      <Text style={styles.text1}>Hello Sahareior</Text>
      <View style={styles.cnnouncementContainer}>
        <Text style={styles.announcementText}>Announcement</Text>
        <Text style={styles.text2}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae officia aliquid ab natus qui quis mollitia nihil veritatis beatae error!</Text>
      </View>
</View>
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
        flex:1,
 paddingHorizontal: 12,
   backgroundColor: 'white',
    },

    text1:{
        fontSize: 25,
        fontWeight: 600
    },
    announcementText:{
        fontWeight: 700,
        paddingVertical:7
    },
    cnnouncementContainer:{
     marginTop:16,
        padding:9,
        backgroundColor: '#F8F8F8',
        paddingBottom:19
    },
    text2:{
        fontSize:13,
   
    },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  
   
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#004CFF',
  },
  activityButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
})