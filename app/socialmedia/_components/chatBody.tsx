import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGetAllMessagesQuery } from '@/app/redux/slices/jsonApiSlice'
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'

// Assuming you have the current user ID stored somewhere
const CURRENT_USER_ID = '693103eec8c1629ff4515f09' // Replace with your actual current user ID

const ChatBody = () => {
  const { data: chatData, isLoading, error } = useGetAllMessagesQuery('69463bbade9c7c5d30c328fe')
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  
  const flatListRef = useRef(null)
  const inputRef = useRef(null)

  // Extract messages from chatData
  useEffect(() => {
    if (chatData?.success && chatData?.data) {
      setMessages(chatData.data)
    }
  }, [chatData])

  // Log for debugging
  useEffect(() => {
    console.log('Chat Data:', chatData)
    console.log('Messages:', messages)
  }, [chatData, messages])

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement send message API call
      console.log('Sending message:', message)
      
      // For now, just clear the input
      setMessage('')
      
      // Refocus the input
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.sender._id === CURRENT_USER_ID
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
      ]}>
        {/* Sender name for other users */}
        {!isCurrentUser && (
          <Text style={styles.senderName}>{item.sender.name}</Text>
        )}
        
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
        ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {item.content}
          </Text>
          
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              isCurrentUser ? styles.currentUserTime : styles.otherUserTime
            ]}>
              {formatTime(item.createdAt)}
            </Text>
            
            {/* Read status for current user's messages */}
            {isCurrentUser && (
              <Ionicons 
                name={item.readBy?.length > 0 ? "checkmark-done" : "checkmark"} 
                size={12} 
                color={item.readBy?.length > 0 ? "#007AFF" : "#999"} 
                style={styles.readStatus}
              />
            )}
          </View>
        </View>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading messages...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading messages</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Chat Room</Text>
          <Text style={styles.headerStatus}>
            {messages.length > 0 ? `${messages.length} messages` : 'No messages yet'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        inverted={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="chat" size={64} color="#e0e0e0" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachmentButton}>
          <Ionicons name="add-circle" size={28} color="#007AFF" />
        </TouchableOpacity>
        
        <TextInput
          ref={inputRef}
          style={styles.messageInput}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          onSubmitEditing={handleSendMessage}
        />
        
        {message.trim() ? (
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.voiceButton}>
            <FontAwesome5 name="microphone" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  menuButton: {
    marginLeft: 16,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  messageContainer: {
    marginVertical: 6,
  },
  currentUserContainer: {
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currentUserBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserText: {
    color: '#fff',
  },
  otherUserText: {
    color: '#000',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherUserTime: {
    color: '#999',
  },
  readStatus: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
})

export default ChatBody